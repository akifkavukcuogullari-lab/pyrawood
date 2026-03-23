import stripe, { STRIPE_WEBHOOK_SECRET } from '../config/stripe';
import { CartModel } from '../models/cart.model';
import { OrderModel } from '../models/order.model';
import { ValidationError, AppError } from '../utils/errors';
import Stripe from 'stripe';

export const PaymentService = {
  /**
   * Create a Stripe PaymentIntent from the user's cart total.
   * Returns the client secret for the frontend to confirm payment.
   */
  async createPaymentIntent(
    userId: string
  ): Promise<{ clientSecret: string; paymentIntentId: string; amount: number }> {
    // Get user's cart
    const cart = await CartModel.findOrCreateByUserId(userId);

    if (cart.items.length === 0) {
      throw new ValidationError('Cart is empty');
    }

    // Calculate the total (subtotal + tax + shipping)
    const subtotal = await CartModel.getCartTotal(cart.id);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const shippingCost = subtotal >= 500 ? 0 : 50;
    const total = Math.round((subtotal + tax + shippingCost) * 100) / 100;

    // Stripe expects amount in cents
    const amountInCents = Math.round(total * 100);

    if (amountInCents <= 0) {
      throw new ValidationError('Cart total must be greater than zero');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata: {
        userId,
        cartId: cart.id,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
      amount: total,
    };
  },

  /**
   * Handle incoming Stripe webhooks.
   * Verifies the webhook signature and processes the event.
   */
  async handleWebhook(
    payload: Buffer,
    signature: string
  ): Promise<{ received: boolean }> {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      throw new AppError(
        `Webhook signature verification failed: ${(err as Error).message}`,
        400,
        'WEBHOOK_SIGNATURE_INVALID'
      );
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Update order payment status to paid and order status to confirmed
        const order = await OrderModel.updatePaymentStatus(
          paymentIntent.id,
          'paid'
        );
        if (order) {
          await OrderModel.updateStatus(order.id, 'confirmed');
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await OrderModel.updatePaymentStatus(paymentIntent.id, 'failed');
        break;
      }

      default:
        // Unhandled event type — log but do not fail
        if (process.env.NODE_ENV === 'development') {
          console.log(`[webhook] Unhandled event type: ${event.type}`);
        }
    }

    return { received: true };
  },
};
