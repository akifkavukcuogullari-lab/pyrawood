import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + '...';
}

/**
 * Resolve an image URL — if it's a relative path (e.g. /uploads/...),
 * prepend the API base URL so next/image can load it.
 */
export function resolveImageUrl(url: string | undefined | null): string {
  if (!url) return '/images/placeholder.jpg';
  // Already a full URL
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Relative path — prepend API base (without /api)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  const baseUrl = apiUrl.replace(/\/api\/?$/, '');
  return `${baseUrl}${url}`;
}
