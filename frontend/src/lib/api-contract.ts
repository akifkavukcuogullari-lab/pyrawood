export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
  },
  CATEGORIES: {
    LIST: '/categories',
  },
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: (id: string) => `/cart/items/${id}`,
    REMOVE_ITEM: (id: string) => `/cart/items/${id}`,
  },
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
  },
  PAYMENTS: {
    CREATE_INTENT: '/payments/create-intent',
  },
  REVIEWS: {
    LIST: (productId: string) => `/products/${productId}/reviews`,
    CREATE: (productId: string) => `/products/${productId}/reviews`,
  },
  ADMIN: {
    PRODUCTS: {
      LIST: '/admin/products',
      CREATE: '/admin/products',
      UPDATE: (id: string) => `/admin/products/${id}`,
      DELETE: (id: string) => `/admin/products/${id}`,
    },
    ORDERS: {
      LIST: '/admin/orders',
      DETAIL: (id: string) => `/admin/orders/${id}`,
      UPDATE_STATUS: (id: string) => `/admin/orders/${id}/status`,
    },
    USERS: {
      LIST: '/admin/users',
    },
    STATS: '/admin/stats',
  },
} as const;
