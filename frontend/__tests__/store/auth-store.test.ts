import { useAuthStore } from '@/store/auth-store';
import { act } from '@testing-library/react';

// Mock API calls
jest.mock('@/lib/api', () => ({
  apiPost: jest.fn(),
  apiGet: jest.fn(),
  apiPut: jest.fn(),
}));

jest.mock('@/lib/auth', () => ({
  getToken: jest.fn().mockReturnValue(null),
  setToken: jest.fn(),
  removeToken: jest.fn(),
}));

jest.mock('@/lib/api-contract', () => ({
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      ME: '/auth/me',
      UPDATE_PROFILE: '/auth/profile',
    },
  },
}));

import { apiPost, apiGet } from '@/lib/api';
import { setToken, removeToken } from '@/lib/auth';

const mockApiPost = apiPost as jest.Mock;
const mockApiGet = apiGet as jest.Mock;
const mockSetToken = setToken as jest.Mock;
const mockRemoveToken = removeToken as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  // Reset store to initial state
  useAuthStore.setState({
    user: null,
    token: null,
    isLoading: false,
    isInitialized: false,
  });
});

describe('AuthStore', () => {
  describe('initial state', () => {
    it('has null user and token', () => {
      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isInitialized).toBe(false);
    });
  });

  describe('login', () => {
    it('sets user and token on successful login', async () => {
      const mockUser = {
        id: '1',
        name: 'Sarah Johnson',
        email: 'customer@example.com',
        role: 'customer' as const,
      };

      mockApiPost.mockResolvedValue({
        data: { user: mockUser, token: 'jwt-token-abc' },
      });

      await act(async () => {
        await useAuthStore.getState().login({
          email: 'customer@example.com',
          password: 'customer123',
        });
      });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('jwt-token-abc');
      expect(state.isLoading).toBe(false);
      expect(mockSetToken).toHaveBeenCalledWith('jwt-token-abc');
    });

    it('resets loading state on login failure', async () => {
      mockApiPost.mockRejectedValue(new Error('Invalid credentials'));

      await expect(
        act(async () => {
          await useAuthStore.getState().login({
            email: 'wrong@example.com',
            password: 'wrongpass',
          });
        })
      ).rejects.toThrow('Invalid credentials');

      expect(useAuthStore.getState().isLoading).toBe(false);
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe('register', () => {
    it('sets user and token on successful registration', async () => {
      const mockUser = {
        id: '2',
        name: 'Michael Chen',
        email: 'michael@example.com',
        role: 'customer' as const,
      };

      mockApiPost.mockResolvedValue({
        data: { user: mockUser, token: 'jwt-token-xyz' },
      });

      await act(async () => {
        await useAuthStore.getState().register({
          name: 'Michael Chen',
          email: 'michael@example.com',
          password: 'customer123',
        });
      });

      const state = useAuthStore.getState();
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('jwt-token-xyz');
      expect(mockSetToken).toHaveBeenCalledWith('jwt-token-xyz');
    });
  });

  describe('logout', () => {
    it('clears user and token', () => {
      // Set up logged-in state first
      useAuthStore.setState({
        user: {
          id: '1',
          name: 'Sarah Johnson',
          email: 'customer@example.com',
          role: 'customer',
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01',
        },
        token: 'some-token',
      });

      act(() => {
        useAuthStore.getState().logout();
      });

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(mockRemoveToken).toHaveBeenCalled();
    });
  });
});
