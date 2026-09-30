"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { notifySuccess, notifyError } from "@/lib/notify";
import api from "@/lib/api";
import { useAuth } from "./AuthContext";
import type { ApiError, Product } from "@/lib/types";

interface WishlistContextValue {
  items: Product[];
  ids: Set<string>;
  loading: boolean;
  toggle: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { token, isAuthed } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.getWishlist(token);
      setItems(res.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthed) refresh();
    else setItems([]);
  }, [isAuthed, refresh]);

  const ids = new Set(items.map((i) => i._id));

  const toggle = async (productId: string) => {
    if (!isAuthed || !token) {
      notifyError("Please sign in to add items to your wishlist");
      return;
    }
    try {
      if (ids.has(productId)) {
        await api.removeFromWishlist(productId, token);
        setItems((prev) => prev.filter((i) => i._id !== productId));
        notifySuccess("Removed from wishlist");
      } else {
        await api.addToWishlist(productId, token);
        await refresh();
        notifySuccess("Added to wishlist");
      }
    } catch (e) {
      notifyError((e as ApiError).message);
    }
  };

  return (
    <WishlistContext.Provider value={{ items, ids, loading, toggle, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
};
