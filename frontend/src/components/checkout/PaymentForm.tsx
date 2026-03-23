'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentFormProps {
  onSubmit: (paymentMethodId: string) => void;
  isSubmitting?: boolean;
  onBack?: () => void;
}

export function PaymentForm({ onSubmit, isSubmitting, onBack }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system is not ready. Please try again.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card input not found.');
      setIsProcessing(false);
      return;
    }

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (stripeError) {
      setError(stripeError.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
      return;
    }

    if (paymentMethod) {
      onSubmit(paymentMethod.id);
    }

    setIsProcessing(false);
  }

  const loading = isSubmitting || isProcessing;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 text-pyra-walnut">
        <CreditCard className="size-5" />
        <h3 className="font-heading text-lg font-semibold">Payment Details</h3>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Card Information</label>
        <div className="rounded-lg border border-input bg-transparent px-3 py-3 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#2D2D2D',
                  fontFamily: 'Inter, sans-serif',
                  '::placeholder': {
                    color: '#6B5E54',
                  },
                },
                invalid: {
                  color: '#dc2626',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        {onBack && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            size="lg"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </Button>
        )}
        <Button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 bg-pyra-forest text-white hover:bg-pyra-forest/90"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-1 size-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Continue to Review'
          )}
        </Button>
      </div>
    </form>
  );
}
