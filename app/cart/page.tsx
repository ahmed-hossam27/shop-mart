"use client";

import { useEffect, useRef, useState } from "react";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { notifyError } from "@/lib/notify";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiMinus,
  HiPlus,
  HiOutlineTrash,
  HiOutlineShoppingBag,
  HiOutlineTicket,
  HiChevronRight,
  HiCheckCircle,
  HiOutlineTruck,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useCart } from "@/context/CartContext";
import { EmptyState } from "@/components/ui";
import type { CartItem } from "@/lib/types";

const FREE_SHIPPING_THRESHOLD = 500;

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}

function CartContent() {
  const { cart, loading, updateItem, removeItem, clearCart, applyCoupon } =
    useCart() ?? {};
  const products = cart?.products || [];
  const [coupon, setCoupon] = useState("");
  const [applying, setApplying] = useState(false);

  // Local optimistic quantities: +/- clicks update the number on screen
  // instantly, but the actual API call is debounced so rapid clicking
  // sends one request with the final count instead of one per click.
  const [localCounts, setLocalCounts] = useState<Record<string, number>>({});
  const [busyIds, setBusyIds] = useState<Set<string>>(() => new Set());
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach(clearTimeout);
  }, []);

  // Note: the update/remove endpoints on this API key off the *product* id
  // (item.product._id), not the cart line's own subdocument id (item._id).
  // item._id is still used below purely as a local React key / map key
  // since it's unique per line item in the UI.
  const changeQty = (item: CartItem, delta: number) => {
    const productId = item.product?._id;
    const base = localCounts[item._id] ?? item.count;
    const next = base + delta;
    if (!productId) return;
    if (next < 1) {
      removeItem?.(productId);
      return;
    }
    const stock = item.product?.quantity;
    if (typeof stock === "number" && next > stock) {
      notifyError(`Only ${stock} left in stock`, { id: `stock-${item._id}` });
      return;
    }
    setLocalCounts((prev) => ({ ...prev, [item._id]: next }));
    clearTimeout(timers.current[item._id]);
    timers.current[item._id] = setTimeout(async () => {
      setBusyIds((prev) => new Set(prev).add(item._id));
      await updateItem?.(productId, next);
      setBusyIds((prev) => {
        const s = new Set(prev);
        s.delete(item._id);
        return s;
      });
      setLocalCounts((prev) => {
        const c = { ...prev };
        delete c[item._id];
        return c;
      });
    }, 450);
  };

  if (loading && !cart) {
    return (
      <div className="container-page py-24 text-center text-ink-soft">
        Loading your cart…
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="container-page">
        <EmptyState
          icon={<HiOutlineShoppingBag size={40} />}
          title="Your cart is empty"
          subtitle="Browse the catalogue and add something you like."
          action={
            <Link href="/products" className="btn-primary">
              Shop products
            </Link>
          }
        />
      </div>
    );
  }

  const total = cart?.totalCartPriceAfterDiscount || cart?.totalCartPrice || 0;
  const qualifiesForFreeShipping = total >= FREE_SHIPPING_THRESHOLD;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);

  return (
    <div className="container-page py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-ink-soft mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <HiChevronRight size={14} />
        <span>Shopping Cart</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
            <HiOutlineShoppingBag size={20} />
          </span>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl leading-tight">
              Shopping Cart
            </h1>
            <p className="text-sm text-ink-soft">
              {products.length} items in your cart
            </p>
          </div>
        </div>
        {products.length > 0 && (
          <button
            onClick={clearCart}
            className="text-sm text-danger hover:underline shrink-0"
          >
            Clear cart
          </button>
        )}
      </div>

      {products.some((item) => !item.product?.title) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-accent/40 bg-accent/10 px-5 py-4 mb-6">
          <p className="text-sm text-accent-dark">
            Some items in your cart are unavailable and can&apos;t be fixed
            automatically.
          </p>
          <button
            onClick={clearCart}
            className="btn-secondary text-sm px-4 py-2 shrink-0 self-start sm:self-auto"
          >
            Clear cart &amp; start fresh
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_340px] gap-10">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {products.map((item) => {
              const displayCount = localCounts[item._id] ?? item.count;
              const busy = busyIds.has(item._id);
              const product = item.product || ({} as CartItem["product"]);
              const hasData = !!product.title;
              const inStock =
                typeof product.quantity !== "number" || product.quantity > 0;

              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-4 p-4 rounded-xl border bg-paper-raised shadow-sm ${
                    hasData ? "border-line" : "border-accent/40 bg-accent/5"
                  }`}
                >
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-[#e9ebe5] shrink-0">
                    <SafeImage
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    {hasData ? (
                      <>
                        <p className="font-medium line-clamp-2">
                          {product.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {product.category?.name && (
                            <span className="text-[11px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                              {product.category.name}
                            </span>
                          )}
                          {product._id && (
                            <span className="text-[11px] text-ink-soft">
                              SKU: {product._id.slice(-8)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-ink-soft mt-1.5">
                          {item.price} EGP{" "}
                          <span className="text-xs">per unit</span>
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium mt-1.5 px-2 py-0.5 rounded-full ${
                            inStock
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-danger/10 text-danger"
                          }`}
                        >
                          <HiCheckCircle size={12} />{" "}
                          {inStock ? "In Stock" : "Out of stock"}
                        </span>
                      </>
                    ) : (
                      <p className="flex items-center gap-1.5 text-sm text-accent-dark font-medium">
                        <HiOutlineExclamationCircle size={16} /> This item is
                        unavailable — please remove it
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                      <div
                        className={`flex items-center border border-line rounded-full ${busy ? "opacity-50" : ""}`}
                      >
                        <button
                          onClick={() => changeQty(item, -1)}
                          disabled={busy}
                          className="p-2 disabled:cursor-not-allowed"
                          aria-label="Decrease"
                        >
                          <HiMinus size={14} />
                        </button>
                        <span className="w-7 text-center text-sm">
                          {displayCount}
                        </span>
                        <button
                          onClick={() => changeQty(item, 1)}
                          disabled={busy}
                          className="p-2 disabled:cursor-not-allowed"
                          aria-label="Increase"
                        >
                          <HiPlus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() =>
                          item.product?._id && removeItem?.(item.product._id)
                        }
                        className="text-ink-soft hover:text-danger transition-colors"
                        aria-label="Remove"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-ink-soft mb-1">Total</p>
                    <p className="font-medium">
                      {item.price * displayCount} EGP
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="h-fit rounded-xl border border-line bg-paper-raised shadow-sm sticky top-24 overflow-hidden">
          <div className="bg-primary text-white px-6 py-4">
            <h2 className="font-medium">Order Summary</h2>
            <p className="text-xs text-white/80">
              {products.length} items in your cart
            </p>
          </div>

          <div className="p-6">
            {qualifiesForFreeShipping ? (
              <div className="flex items-start gap-2.5 bg-emerald-500/10 text-emerald-700 rounded-lg px-3 py-2.5 mb-5">
                <HiOutlineTruck size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Free Shipping!</p>
                  <p className="text-xs opacity-80">
                    You qualify for free delivery
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 bg-accent/10 text-accent-dark rounded-lg px-3 py-2.5 mb-5">
                <HiOutlineTruck size={18} className="shrink-0 mt-0.5" />
                <p className="text-xs">
                  Add {remaining} EGP more for free shipping
                </p>
              </div>
            )}

            <div className="flex justify-between text-sm mb-2">
              <span className="text-ink-soft">Subtotal</span>
              <span>{cart?.totalCartPrice} EGP</span>
            </div>
            {cart?.totalCartPriceAfterDiscount && (
              <div className="flex justify-between text-sm mb-2 text-accent-dark">
                <span>After discount</span>
                <span>{cart.totalCartPriceAfterDiscount} EGP</span>
              </div>
            )}
            <div className="flex justify-between text-sm mb-2">
              <span className="text-ink-soft">Shipping</span>
              <span
                className={
                  qualifiesForFreeShipping ? "text-emerald-600 font-medium" : ""
                }
              >
                {qualifiesForFreeShipping ? "Free" : "Calculated at checkout"}
              </span>
            </div>
            <div className="h-px bg-line my-4" />
            <div className="flex justify-between font-medium mb-6">
              <span>Total</span>
              <span>{total} EGP</span>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!coupon.trim()) return;
                setApplying(true);
                await applyCoupon?.(coupon.trim());
                setApplying(false);
              }}
              className="flex gap-2 mb-6"
            >
              <div className="relative flex-1">
                <HiOutlineTicket
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
                  size={16}
                />
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Promo code"
                  className="input pl-9 text-sm py-2"
                />
              </div>
              <button
                disabled={applying}
                className="btn-secondary text-sm px-4 shrink-0"
              >
                {applying ? "…" : "Apply"}
              </button>
            </form>

            <Link href="/checkout" className="btn-primary w-full">
              Secure Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
