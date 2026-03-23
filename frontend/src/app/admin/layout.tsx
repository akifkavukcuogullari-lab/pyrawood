'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isAuthenticated, isInitialized, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (!isAuthenticated || !isAdmin) {
        router.replace('/');
      }
    }
  }, [isInitialized, isLoading, isAuthenticated, isAdmin, router]);

  // Loading state while auth initializes
  if (!isInitialized || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-pyra-ivory">
        <div className="space-y-4 text-center">
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="mx-auto h-4 w-32" />
        </div>
      </div>
    );
  }

  // Not admin — redirect will happen via useEffect, show nothing
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-pyra-ivory">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Admin header */}
        <header className="flex h-14 items-center border-b bg-background px-4 lg:px-6">
          {/* Spacer for mobile menu button */}
          <div className="w-10 lg:hidden" />
          <h1 className="font-playfair text-lg font-semibold text-foreground">
            Admin Panel
          </h1>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
