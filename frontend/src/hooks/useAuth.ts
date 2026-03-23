'use client';

import { useAuthStore } from '@/store/auth-store';

export function useAuth() {
  const { user, token, isLoading, isInitialized, login, register, logout, updateProfile } =
    useAuthStore();

  return {
    user,
    token,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
  };
}
