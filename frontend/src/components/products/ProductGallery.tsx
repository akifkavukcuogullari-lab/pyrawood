'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, resolveImageUrl } from '@/lib/utils';
import type { ProductImage } from '@/lib/types';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const currentImage = sortedImages[selectedIndex] || null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  if (!currentImage) {
    return (
      <div className="aspect-square rounded-xl bg-pyra-sand flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div
        className="relative aspect-square cursor-zoom-in overflow-hidden rounded-xl bg-pyra-sand"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveImageUrl(currentImage.url)}
              alt={currentImage.altText || productName}
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-transform duration-200',
                isZoomed && 'scale-150'
              )}
              style={
                isZoomed
                  ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                  : undefined
              }
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative size-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:size-20',
                index === selectedIndex
                  ? 'border-pyra-gold ring-2 ring-pyra-gold/30'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveImageUrl(image.url)}
                alt={image.altText || `${productName} thumbnail ${index + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
