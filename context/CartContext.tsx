"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { notifySuccess, notifyError } from "@/lib/notify";
import api from "@/lib/api";
import { useAuth } from "./AuthContext";
import type { ApiError, Cart } from "@/lib/types";

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  count: number;
  bumpId: string | null;
  clearBump: () => void;
  addItem: (productId: string) => Promise<boolean>;
  // Despite the "cart item" naming, this API keys updates/removals off the
  // product id (item.product._id), not the cart line's own subdocument id
  // (item._id) — callers must pass item.product._id here.
  updateItem: (productId: string, count: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, isAuthed } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [bumpId, setBumpId] = useState<string | null>(null); // triggers the "fly to cart" animation
  const pending = useRef(new Set<string>());
  const failCounts = useRef<Record<string, number>>({});

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const res = await api.getCart(token);
      setCart(res.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthed) refreshCart();
    else setCart(null);
  }, [isAuthed, refreshCart]);

  const addItem = async (productId: string) => {
    if (!isAuthed || !token) {
      notifyError("Please sign in to add items to your cart");
      return false;
    }
    try {
      const res = await api.addToCart(productId, token);
      // setCart(res.data);
      await refreshCart();
      setBumpId(productId);
      notifySuccess("Added to cart");
      return true;
    } catch (e) {
      notifyError((e as ApiError).message);
      return false;
    }
  };

  const updateItem = async (productId: string, count: number) => {
    if (!token) return;
    if (count < 1) return removeItem(productId);
    if (pending.current.has(productId)) return;
    pending.current.add(productId);
    try {
      const res = await api.updateCartItem(productId, count, token);
      setCart(res.data);
      failCounts.current[productId] = 0;
    } catch (e) {
      const fails = (failCounts.current[productId] || 0) + 1;
      failCounts.current[productId] = fails;
      const message =
        fails >= 2
          ? "This item keeps failing to update — try removing it and adding it again."
          : (e as ApiError).message ||
            "Couldn't update that item — refreshing your cart.";
      notifyError(message, { id: `cart-${productId}` });
      refreshCart();
    } finally {
      pending.current.delete(productId);
    }
  };

  const removeItem = async (productId: string) => {
    if (!token) return;
    if (pending.current.has(productId)) return;
    pending.current.add(productId);
    try {
      const res = await api.removeCartItem(productId, token);
      setCart(res.data);
      notifySuccess("Removed from cart");
    } catch (e) {
      notifyError(
        (e as ApiError).message ||
          "Couldn't remove that item — refreshing your cart.",
        {
          id: `cart-${productId}`,
        },
      );
      refreshCart();
    } finally {
      pending.current.delete(productId);
    }
  };

  const clearCart = async () => {
    if (!token) return;
    try {
      await api.clearCart(token);
      setCart(null);
    } catch (e) {
      notifyError((e as ApiError).message);
    }
  };

  const applyCoupon = async (code: string) => {
    if (!token) return false;
    try {
      const res = await api.applyCoupon(code, token);
      setCart(res.data);
      notifySuccess("Coupon applied 🎉");
      return true;
    } catch (e) {
      notifyError((e as ApiError).message);
      return false;
    }
  };

  const count = cart?.products?.reduce((sum, p) => sum + p.count, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        count,
        bumpId,
        clearBump: () => setBumpId(null),
        addItem,
        updateItem,
        removeItem,
        clearCart,
        applyCoupon,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
