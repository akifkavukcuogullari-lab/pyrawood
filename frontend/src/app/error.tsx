'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <AlertTriangle className="size-16 text-pyra-gold" />
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-bold text-pyra-walnut md:text-4xl">
          Something Went Wrong
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          We encountered an unexpected error. Our craftsmen are working to fix
          it. Please try again.
        </p>
      </div>
      <Button
        onClick={() => unstable_retry()}
        className="bg-pyra-forest text-white hover:bg-pyra-forest/90"
        size="lg"
      >
        Try Again
      </Button>
    </div>
  );
}
