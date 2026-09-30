import type {
  ApiResponse,
  AuthResponse,
  Address,
  Brand,
  Cart,
  Category,
  CheckoutSessionResponse,
  Order,
  Product,
  SubCategory,
  WishlistItem,
  ApiError,
} from "./types";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1";

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
  revalidate?: number | false;
  retries?: number;
  retryDelay?: number;
}

/**
 * Thin fetch wrapper for the Route ecommerce API.
 * The API expects the auth token on a plain `token` header (not Authorization: Bearer).
 *
 * Caching: public catalogue GETs (categories, brands, products…) are cached
 * and revalidated in the background so navigating the site doesn't refetch
 * the same data on every click. Anything tied to a signed-in user (token
 * present) or any non-GET request always bypasses the cache.
 *
 * Retries: this demo API occasionally returns a transient 500 on write
 * requests (cart add/update/remove). Pass `retries` to automatically retry
 * those specific failures once or twice before giving up — 4xx errors
 * (validation, auth) are never retried since retrying won't help.
 */
async function request<T = unknown>(
  path: string,
  {
    method = "GET",
    body,
    token,
    headers = {},
    revalidate,
    retries = 0,
    retryDelay = 500,
  }: RequestOptions = {}
): Promise<T> {
  const isMutating = method !== "GET";
  const cacheOpts: RequestInit =
    token || isMutating || revalidate === false
      ? { cache: "no-store" }
      : { next: { revalidate: revalidate ?? 120 } };

  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { token } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...cacheOpts,
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      // some endpoints (delete) may return empty bodies
    }

    if (res.ok) return data as T;

    if (res.status >= 500 && attempt < retries) {
      await new Promise((r) => setTimeout(r, retryDelay));
      continue;
    }

    const message =
      data?.message || data?.errors?.msg || "Something went wrong. Please try again.";
    const err = new Error(message) as ApiError;
    err.status = res.status;
    throw err;
  }
}

export const api = {
  // ---- Auth ----
  signup: (payload: object) =>
    request<AuthResponse>("/auth/signup", { method: "POST", body: payload }),
  signin: (payload: { email: string; password: string }) =>
    request<AuthResponse>("/auth/signin", { method: "POST", body: payload }),
  forgotPassword: (email: string) =>
    request<{ statusMsg: string; message: string }>("/auth/forgotPasswords", {
      method: "POST",
      body: { email },
    }),
  verifyResetCode: (resetCode: string) =>
    request<{ status: string }>("/auth/verifyResetCode", {
      method: "POST",
      body: { resetCode },
    }),
  resetPassword: (payload: { email: string; newPassword: string }) =>
    request<AuthResponse>("/auth/resetPassword", { method: "PUT", body: payload }),

  // ---- User ----
  getMe: (token: string) => request<ApiResponse<import("./types").User>>("/users/getMe", { token }),
  changeMyPassword: (payload: object, token: string) =>
    request<AuthResponse>("/users/changeMyPassword", { method: "PUT", body: payload, token }),
  updateMe: (payload: object, token: string) =>
    request<{ message: string; user?: import("./types").User; data?: import("./types").User }>(
      "/users/updateMe",
      { method: "PUT", body: payload, token }
    ),

  // ---- Addresses ----
  getAddresses: (token: string) => request<ApiResponse<Address[]>>("/addresses", { token }),
  addAddress: (payload: Omit<Address, "_id">, token: string) =>
    request<ApiResponse<Address[]>>("/addresses", { method: "POST", body: payload, token }),
  removeAddress: (addressId: string, token: string) =>
    request<ApiResponse<Address[]>>(`/addresses/${addressId}`, { method: "DELETE", token }),

  // ---- Categories ----
  getCategories: () => request<ApiResponse<Category[]>>("/categories"),
  getCategory: (id: string) => request<ApiResponse<Category>>(`/categories/${id}`),
  getCategorySubcategories: (id: string) =>
    request<ApiResponse<SubCategory[]>>(`/categories/${id}/subcategories`),

  // ---- Brands ----
  getBrands: () => request<ApiResponse<Brand[]>>("/brands"),
  getBrand: (id: string) => request<ApiResponse<Brand>>(`/brands/${id}`),

  // ---- Products ----
  getProducts: (query = "") => request<ApiResponse<Product[]>>(`/products${query}`),
  getProduct: (id: string) => request<ApiResponse<Product>>(`/products/${id}`),

  // ---- Cart ----
  getCart: (token: string) => request<ApiResponse<Cart>>("/cart", { token }),
  addToCart: (productId: string, token: string) =>
    request<ApiResponse<Cart>>("/cart", { method: "POST", body: { productId }, token, retries: 1 }),
  // Despite the URL shape, this API expects the *product* id here, not the
  // cart line's own subdocument id.
  updateCartItem: (productId: string, count: number, token: string) =>
    request<ApiResponse<Cart>>(`/cart/${productId}`, {
      method: "PUT",
      body: { count },
      token,
      retries: 1,
    }),
  applyCoupon: (coupon: string, token: string) =>
    request<ApiResponse<Cart>>("/cart/applyCoupon", {
      method: "PUT",
      body: { coupon },
      token,
      retries: 1,
    }),
  // Same as updateCartItem — this is the product id, not the cart line id.
  removeCartItem: (productId: string, token: string) =>
    request<ApiResponse<Cart>>(`/cart/${productId}`, { method: "DELETE", token, retries: 1 }),
  clearCart: (token: string) =>
    request<ApiResponse<null>>("/cart", { method: "DELETE", token, retries: 1 }),

  // ---- Wishlist ----
  getWishlist: (token: string) => request<ApiResponse<WishlistItem[]>>("/wishlist", { token }),
  addToWishlist: (productId: string, token: string) =>
    request<ApiResponse<string[]>>("/wishlist", { method: "POST", body: { productId }, token }),
  removeFromWishlist: (productId: string, token: string) =>
    request<ApiResponse<string[]>>(`/wishlist/${productId}`, { method: "DELETE", token }),

  // ---- Orders ----
  createCashOrder: (
    cartId: string,
    shippingAddress: import("./types").ShippingAddress,
    token: string
  ) =>
    request<ApiResponse<Order>>(`/orders/${cartId}`, {
      method: "POST",
      body: { shippingAddress },
      token,
    }),
  createCheckoutSession: (
    cartId: string,
    shippingAddress: import("./types").ShippingAddress,
    returnUrl: string,
    token: string
  ) =>
    request<CheckoutSessionResponse>(
      `/orders/checkout-session/${cartId}?url=${encodeURIComponent(returnUrl)}`,
      { method: "POST", body: { shippingAddress }, token }
    ),
  getUserOrders: (userId: string) =>
    request<Order[]>(`/orders/user/${userId}`, { revalidate: false }),
};

export default api;