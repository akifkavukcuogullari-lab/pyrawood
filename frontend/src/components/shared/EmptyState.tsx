'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-pyra-sand">
        <Icon className="size-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 font-heading text-xl font-semibold text-pyra-charcoal">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action && (
        <Button
          className="bg-pyra-forest text-white hover:bg-pyra-forest/90"
          size="lg"
          render={<Link href={action.href} />}
        >
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
