import { create } from 'zustand';
import { apiPost, apiGet, apiPut } from '@/lib/api';
import { getToken, setToken, removeToken } from '@/lib/auth';
import { ENDPOINTS } from '@/lib/api-contract';
import type {
  User,
  AuthResponse,
  LoginRequest,
  CreateUserRequest,
  UpdateProfileRequest,
} from '@/lib/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: CreateUserRequest) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const res = await apiPost<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
      if (res.data) {
        setToken(res.data.token);
        set({
          user: res.data.user as User,
          token: res.data.token,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true });
    try {
      const res = await apiPost<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data);
      if (res.data) {
        setToken(res.data.token);
        set({
          user: res.data.user as User,
          token: res.data.token,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    removeToken();
    set({ user: null, token: null });
  },

  loadUser: async () => {
    const token = getToken();
    if (!token) {
      set({ isInitialized: true });
      return;
    }

    set({ isLoading: true, token });
    try {
      const res = await apiGet<User>(ENDPOINTS.AUTH.ME);
      if (res.data) {
        set({ user: res.data, isLoading: false, isInitialized: true });
      }
    } catch {
      // Token is invalid — clean up
      removeToken();
      set({ user: null, token: null, isLoading: false, isInitialized: true });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const res = await apiPut<User>(ENDPOINTS.AUTH.UPDATE_PROFILE, data);
      if (res.data) {
        set({ user: res.data, isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
