'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Upload, X, ImageIcon, Check } from 'lucide-react';

interface UploadedImage {
  id: string;
  url: string;
  file?: File;
  isPrimary: boolean;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const validFiles = Array.from(files).filter((f) =>
        ACCEPTED_TYPES.includes(f.type)
      );
      if (validFiles.length === 0) return;

      const newImages: UploadedImage[] = validFiles.map((file) => ({
        id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        url: URL.createObjectURL(file),
        file,
        isPrimary: images.length === 0 && validFiles.indexOf(file) === 0,
      }));

      onChange([...images, ...newImages]);
    },
    [images, onChange]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(e.dataTransfer.files);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function setPrimary(id: string) {
    onChange(
      images.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      }))
    );
  }

  function removeImage(id: string) {
    const updated = images.filter((img) => img.id !== id);
    // If we removed the primary, make the first one primary
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange(updated);
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="font-playfair text-lg">Product Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors',
            isDragging
              ? 'border-pyra-gold bg-pyra-gold/5'
              : 'border-border hover:border-pyra-gold/50 hover:bg-muted/50'
          )}
        >
          <Upload className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            Drag and drop images here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, WebP, GIF accepted
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>

        {/* Image previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className={cn(
                  'group relative aspect-square rounded-lg overflow-hidden border-2 transition-colors',
                  img.isPrimary
                    ? 'border-pyra-gold'
                    : 'border-transparent hover:border-border'
                )}
              >
                <Image
                  src={img.url}
                  alt="Product"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Overlay controls */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {!img.isPrimary && (
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrimary(img.id);
                      }}
                    >
                      <Check className="size-3" />
                      Primary
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="icon-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id);
                    }}
                  >
                    <X className="size-3" />
                  </Button>
                </div>

                {/* Primary badge */}
                {img.isPrimary && (
                  <div className="absolute top-1 left-1 rounded bg-pyra-gold px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ImageIcon className="size-4" />
            No images uploaded yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
