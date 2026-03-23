import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey && process.env.NODE_ENV === 'production') {
  throw new Error('STRIPE_SECRET_KEY environment variable is required in production');
}

const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as Stripe.LatestApiVersion,
  typescript: true,
});

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export default stripe;
