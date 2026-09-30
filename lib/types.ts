// Shared domain types for the Route ecommerce API used by this app.

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  slug?: string;
  category?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
}

export interface Product {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  quantity?: number;
  sold?: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images?: string[];
  category?: Category;
  brand?: Brand;
  ratingsAverage?: number;
  ratingsQuantity?: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export interface ManualAddress {
  name: string;
  details: string;
  phone: string;
  city: string;
}

// Alias kept for compatibility with code that imports ShippingAddress —
// it's the same shape as ManualAddress, without the address label.
export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: Product;
}

export interface Cart {
  _id: string;
  cartOwner?: string;
  products: CartItem[];
  totalCartPrice: number;
  totalCartPriceAfterDiscount?: number;
}

export interface OrderCartItem {
  _id: string;
  count: number;
  price: number;
  product: Product;
}

export interface Order {
  _id: string;
  id?: number;
  createdAt?: string;
  paymentMethodType?: "cash" | "card";
  isDelivered?: boolean;
  cartItems: OrderCartItem[];
  totalOrderPrice: number;
}

export interface WishlistItem extends Product {}

export interface ApiResponse<T> {
  data: T;
  results?: number;
  metadata?: unknown;
  [key: string]: unknown;
}

export interface AuthResponse {
  message?: string;
  token: string;
  user: User;
}

export interface CheckoutSessionResponse {
  status?: string;
  session: { id: string; url: string };
}

export interface ApiError extends Error {
  status?: number;
}