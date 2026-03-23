import Link from 'next/link';
import { TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <TreePine className="size-20 text-pyra-forest opacity-60" />
      <div className="space-y-2">
        <h1 className="font-heading text-4xl font-bold text-pyra-walnut md:text-5xl">
          Lost in the Forest?
        </h1>
        <p className="mx-auto max-w-md text-muted-foreground">
          The page you are looking for seems to have wandered off the trail.
          Let us guide you back to our collection of handcrafted furniture.
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          render={<Link href="/" />}
          className="bg-pyra-forest text-white hover:bg-pyra-forest/90"
          size="lg"
        >
          Return Home
        </Button>
        <Button
          render={<Link href="/products" />}
          variant="outline"
          size="lg"
        >
          Browse Products
        </Button>
      </div>
    </div>
  );
}
