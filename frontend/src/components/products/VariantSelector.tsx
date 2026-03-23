'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn, formatCurrency } from '@/lib/utils';
import type { ProductVariant } from '@/lib/types';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variant: ProductVariant) => void;
  basePrice: number;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
  basePrice,
}: VariantSelectorProps) {
  // Group variants by attribute keys
  const attributeGroups = useMemo(() => {
    const groups: Record<string, Set<string>> = {};
    for (const variant of variants) {
      for (const [key, value] of Object.entries(variant.attributes)) {
        if (!groups[key]) groups[key] = new Set();
        groups[key].add(value);
      }
    }
    return groups;
  }, [variants]);

  if (variants.length === 0) return null;

  // If variants have structured attributes, show grouped selection
  const hasAttributes = Object.keys(attributeGroups).length > 0;

  if (!hasAttributes) {
    // Flat variant list
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-pyra-charcoal">Options</h3>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => {
            const isSelected = variant.id === selectedVariantId;
            const priceDiff = variant.price ? variant.price - basePrice : 0;

            return (
              <Button
                key={variant.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSelect(variant)}
                disabled={variant.stock === 0}
                className={cn(
                  isSelected && 'bg-pyra-forest text-white hover:bg-pyra-forest/90',
                  variant.stock === 0 && 'opacity-50'
                )}
              >
                {variant.name}
                {priceDiff !== 0 && (
                  <span className="ml-1 text-xs opacity-75">
                    {priceDiff > 0 ? '+' : ''}{formatCurrency(priceDiff)}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  // Grouped attribute selection
  return (
    <div className="space-y-5">
      {Object.entries(attributeGroups).map(([attrKey, values]) => (
        <div key={attrKey} className="space-y-3">
          <h3 className="text-sm font-medium capitalize text-pyra-charcoal">{attrKey}</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(values).map((value) => {
              // Find if a variant with this attribute value is selected
              const matchingVariants = variants.filter(
                (v) => v.attributes[attrKey] === value
              );
              const isSelected = matchingVariants.some(
                (v) => v.id === selectedVariantId
              );
              const anyInStock = matchingVariants.some((v) => v.stock > 0);

              return (
                <Button
                  key={value}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    const target = matchingVariants.find((v) => v.stock > 0) || matchingVariants[0];
                    if (target) onSelect(target);
                  }}
                  disabled={!anyInStock}
                  className={cn(
                    isSelected && 'bg-pyra-forest text-white hover:bg-pyra-forest/90',
                    !anyInStock && 'opacity-50'
                  )}
                >
                  {value}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
