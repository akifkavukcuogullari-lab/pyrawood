'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, X } from 'lucide-react';

export interface VariantRow {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
  attributes: { key: string; value: string }[];
}

interface VariantBuilderProps {
  variants: VariantRow[];
  onChange: (variants: VariantRow[]) => void;
}

function generateId() {
  return `var-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function VariantBuilder({ variants, onChange }: VariantBuilderProps) {
  function addVariant() {
    onChange([
      ...variants,
      {
        id: generateId(),
        name: '',
        sku: '',
        price: '',
        stock: '0',
        attributes: [{ key: '', value: '' }],
      },
    ]);
  }

  function removeVariant(id: string) {
    onChange(variants.filter((v) => v.id !== id));
  }

  function updateVariant(id: string, field: keyof VariantRow, value: string) {
    onChange(
      variants.map((v) =>
        v.id === id ? { ...v, [field]: value } : v
      )
    );
  }

  function addAttribute(variantId: string) {
    onChange(
      variants.map((v) =>
        v.id === variantId
          ? { ...v, attributes: [...v.attributes, { key: '', value: '' }] }
          : v
      )
    );
  }

  function removeAttribute(variantId: string, attrIndex: number) {
    onChange(
      variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              attributes: v.attributes.filter((_, i) => i !== attrIndex),
            }
          : v
      )
    );
  }

  function updateAttribute(
    variantId: string,
    attrIndex: number,
    field: 'key' | 'value',
    val: string
  ) {
    onChange(
      variants.map((v) =>
        v.id === variantId
          ? {
              ...v,
              attributes: v.attributes.map((a, i) =>
                i === attrIndex ? { ...a, [field]: val } : a
              ),
            }
          : v
      )
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-playfair text-lg">Variants</CardTitle>
        <Button variant="outline" size="sm" onClick={addVariant}>
          <Plus className="size-3.5 mr-1" />
          Add Variant
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {variants.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No variants added. Click &quot;Add Variant&quot; to create size, color, or
            material options.
          </p>
        )}

        {variants.map((variant, vIndex) => (
          <div key={variant.id}>
            {vIndex > 0 && <Separator className="mb-4" />}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Variant {vIndex + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeVariant(variant.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Name *</Label>
                  <Input
                    value={variant.name}
                    onChange={(e) =>
                      updateVariant(variant.id, 'name', e.target.value)
                    }
                    placeholder="e.g. Large / Oak"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">SKU</Label>
                  <Input
                    value={variant.sku}
                    onChange={(e) =>
                      updateVariant(variant.id, 'sku', e.target.value)
                    }
                    placeholder="e.g. PWD-001-LG"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariant(variant.id, 'price', e.target.value)
                    }
                    placeholder="Leave blank to use product price"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Stock *</Label>
                  <Input
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(variant.id, 'stock', e.target.value)
                    }
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Attributes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Attributes
                  </Label>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => addAttribute(variant.id)}
                  >
                    <Plus className="size-3 mr-1" />
                    Add
                  </Button>
                </div>
                {variant.attributes.map((attr, attrIndex) => (
                  <div
                    key={attrIndex}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={attr.key}
                      onChange={(e) =>
                        updateAttribute(
                          variant.id,
                          attrIndex,
                          'key',
                          e.target.value
                        )
                      }
                      placeholder="Key (e.g. Size)"
                      className="flex-1"
                    />
                    <Input
                      value={attr.value}
                      onChange={(e) =>
                        updateAttribute(
                          variant.id,
                          attrIndex,
                          'value',
                          e.target.value
                        )
                      }
                      placeholder="Value (e.g. Large)"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeAttribute(variant.id, attrIndex)}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
