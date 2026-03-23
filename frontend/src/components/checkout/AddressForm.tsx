'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ShippingAddress } from '@/lib/types';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Valid postal code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  onSubmit: (data: ShippingAddress) => void;
  defaultValues?: Partial<ShippingAddress>;
  isSubmitting?: boolean;
}

export function AddressForm({ onSubmit, defaultValues, isSubmitting }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: defaultValues?.fullName || '',
      addressLine1: defaultValues?.addressLine1 || '',
      addressLine2: defaultValues?.addressLine2 || '',
      city: defaultValues?.city || '',
      state: defaultValues?.state || '',
      postalCode: defaultValues?.postalCode || '',
      country: defaultValues?.country || 'US',
      phone: defaultValues?.phone || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-2 text-pyra-walnut">
        <MapPin className="size-5" />
        <h3 className="font-heading text-lg font-semibold">Shipping Address</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          placeholder="John Doe"
          autoComplete="name"
          {...register('fullName')}
          aria-invalid={!!errors.fullName}
          className="h-10"
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine1">Address Line 1</Label>
        <Input
          id="addressLine1"
          placeholder="123 Main Street"
          autoComplete="address-line1"
          {...register('addressLine1')}
          aria-invalid={!!errors.addressLine1}
          className="h-10"
        />
        {errors.addressLine1 && (
          <p className="text-sm text-destructive">{errors.addressLine1.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="addressLine2">Address Line 2 (optional)</Label>
        <Input
          id="addressLine2"
          placeholder="Apt, Suite, Unit, etc."
          autoComplete="address-line2"
          {...register('addressLine2')}
          className="h-10"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="New York"
            autoComplete="address-level2"
            {...register('city')}
            aria-invalid={!!errors.city}
            className="h-10"
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            placeholder="NY"
            autoComplete="address-level1"
            {...register('state')}
            aria-invalid={!!errors.state}
            className="h-10"
          />
          {errors.state && (
            <p className="text-sm text-destructive">{errors.state.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Postal Code</Label>
          <Input
            id="postalCode"
            placeholder="10001"
            autoComplete="postal-code"
            {...register('postalCode')}
            aria-invalid={!!errors.postalCode}
            className="h-10"
          />
          {errors.postalCode && (
            <p className="text-sm text-destructive">{errors.postalCode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="US"
            autoComplete="country"
            {...register('country')}
            aria-invalid={!!errors.country}
            className="h-10"
          />
          {errors.country && (
            <p className="text-sm text-destructive">{errors.country.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          autoComplete="tel"
          {...register('phone')}
          className="h-10"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-pyra-forest text-white hover:bg-pyra-forest/90"
        size="lg"
      >
        Continue to Payment
      </Button>
    </form>
  );
}
