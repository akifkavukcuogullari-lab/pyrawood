'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { User, Loader2, Save, Package, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { PageTransition } from '@/components/shared/PageTransition';
import { useAuth } from '@/hooks/useAuth';
import { formatDate, getInitials } from '@/lib/utils';
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, isInitialized, updateProfile } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    },
  });

  // Reset form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (isInitialized && !authLoading && !isAuthenticated) {
      router.push('/login?redirect=/profile');
    }
  }, [isAuthenticated, authLoading, isInitialized, router]);

  if (!isInitialized || authLoading) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="size-8 animate-spin text-pyra-walnut" />
          </div>
        </section>
      </PageTransition>
    );
  }

  if (!isAuthenticated || !user) return null;

  async function onSubmit(data: ProfileFormValues) {
    setServerError(null);
    try {
      const updateData: { name?: string; email?: string; password?: string } = {};
      if (data.name !== user!.name) updateData.name = data.name;
      if (data.email !== user!.email) updateData.email = data.email;
      if (data.password && data.password.length > 0) updateData.password = data.password;

      if (Object.keys(updateData).length === 0) {
        toast.info('No changes to save.');
        return;
      }

      await updateProfile(updateData);
      toast.success('Profile updated successfully.');
      // Clear password field after successful update
      reset({ name: data.name, email: data.email, password: '' });
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
      );
    }
  }

  return (
    <PageTransition>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-heading text-3xl font-bold text-pyra-walnut">
          My Profile
        </h1>

        <div className="space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-pyra-sand/60 bg-pyra-cream/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="size-16 border-2 border-pyra-sand">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback className="bg-pyra-walnut text-lg text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-pyra-walnut">
                      {user.name}
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="size-3.5" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        Member since {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Edit Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-pyra-sand/60 bg-pyra-cream/30">
              <CardHeader>
                <CardTitle className="font-heading text-lg text-pyra-walnut">
                  Edit Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {serverError && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {serverError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      autoComplete="name"
                      {...register('name')}
                      aria-invalid={!!errors.name}
                      className="h-10"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...register('email')}
                      aria-invalid={!!errors.email}
                      className="h-10"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      {...register('password')}
                      aria-invalid={!!errors.password}
                      className="h-10"
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-pyra-forest text-white hover:bg-pyra-forest/90"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-1 size-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-1 size-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
