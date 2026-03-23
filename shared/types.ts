// Pyra Wood E-Commerce — Shared Type Definitions

export interface User {
  id: string; name: string; email: string; role: 'customer' | 'admin';
  avatarUrl?: string; createdAt: string; updatedAt: string;
}
export interface CreateUserRequest { name: string; email: string; password: string; }
export interface LoginRequest { email: string; password: string; }
export interface AuthResponse { user: Omit<User, 'createdAt' | 'updatedAt'>; token: string; }
export interface UpdateProfileRequest { name?: string; email?: string; password?: string; }

export interface Category {
  id: string; name: string; slug: string; description?: string;
  imageUrl?: string; parentId?: string; sortOrder: number; createdAt: string;
}

export interface Product {
  id: string; name: string; slug: string; description?: string;
  price: number; compareAtPrice?: number; categoryId?: string; category?: Category;
  isActive: boolean; stock: number; sku?: string; weight?: number;
  metadata: Record<string, unknown>; variants: ProductVariant[]; images: ProductImage[];
  reviews?: Review[]; averageRating?: number; reviewCount?: number;
  createdAt: string; updatedAt: string;
}
export interface ProductVariant {
  id: string; productId: string; name: string; sku?: string;
  price?: number; stock: number; attributes: Record<string, string>; createdAt: string;
}
export interface ProductImage {
  id: string; productId: string; url: string; altText?: string;
  sortOrder: number; isPrimary: boolean;
}
export interface ProductListParams {
  search?: string; category?: string; minPrice?: number; maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest' | 'rating';
  page?: number; limit?: number;
}
export interface CreateProductRequest {
  name: string; description?: string; price: number; compareAtPrice?: number;
  categoryId?: string; stock?: number; sku?: string; weight?: number;
  metadata?: Record<string, unknown>;
  variants?: Omit<ProductVariant, 'id' | 'productId' | 'createdAt'>[];
}
export interface UpdateProductRequest extends Partial<CreateProductRequest> { isActive?: boolean; }

export interface Cart { id: string; userId: string; items: CartItem[]; createdAt: string; updatedAt: string; }
export interface CartItem {
  id: string; cartId: string; productId: string; variantId?: string;
  quantity: number; product: Product; variant?: ProductVariant; createdAt: string;
}
export interface AddToCartRequest { productId: string; variantId?: string; quantity: number; }
export interface UpdateCartItemRequest { quantity: number; }

export interface Order {
  id: string; userId: string; user?: User; status: OrderStatus;
  subtotal: number; tax: number; shippingCost: number; total: number;
  shippingAddress: ShippingAddress; paymentIntentId?: string;
  paymentStatus: PaymentStatus; notes?: string; items: OrderItem[];
  createdAt: string; updatedAt: string;
}
export interface OrderItem {
  id: string; orderId: string; productId: string; variantId?: string;
  name: string; price: number; quantity: number; attributes: Record<string, string>;
}
export interface ShippingAddress {
  fullName: string; addressLine1: string; addressLine2?: string;
  city: string; state: string; postalCode: string; country: string; phone?: string;
}
export interface CreateOrderRequest { shippingAddress: ShippingAddress; paymentIntentId: string; notes?: string; }
export interface UpdateOrderStatusRequest { status: OrderStatus; }

export interface Review {
  id: string; productId: string; userId: string;
  user?: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  rating: number; title?: string; body?: string; createdAt: string;
}
export interface CreateReviewRequest { rating: number; title?: string; body?: string; }

export interface AdminStats {
  totalOrders: number; totalRevenue: number; totalUsers: number; totalProducts: number;
  recentOrders: Order[]; revenueByMonth: { month: string; revenue: number }[];
}

export interface ApiResponse<T> {
  success: boolean; data?: T;
  error?: { message: string; code: string; details?: unknown; };
}
export interface PaginatedResponse<T> {
  success: boolean; data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number; };
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type UserRole = 'customer' | 'admin';
