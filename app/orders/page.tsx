"use client";

import { useEffect, useState } from "react";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineClipboardList, HiOutlineCheckCircle, HiOutlineCash, HiOutlineCreditCard } from "react-icons/hi";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { EmptyState } from "@/components/ui";
import type { Order } from "@/lib/types";

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}

function OrdersContent() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    api
      .getUserOrders(user._id)
      .then((res: any) => setOrders(Array.isArray(res) ? res : res.data || []))
      .finally(() => setLoading(false));
  }, [user]);

  if (!loading && orders.length === 0) {
    return (
      <div className="container-page">
        <EmptyState
          icon={<HiOutlineClipboardList size={40} />}
          title="No orders yet"
          subtitle="Once you place an order, it'll show up here."
          action={
            <Link href="/products" className="btn-primary">
              Start shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl mb-8">Your orders</h1>

      <div className="space-y-6">
        {orders.map((order: Order, i: number) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i, 6) * 0.05 }}
            className="border border-line rounded-xl p-5 bg-paper-raised shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-line">
              <div>
                <p className="text-sm text-ink-soft">Order #{order.id || order._id?.slice(-6)}</p>
                <p className="text-sm text-ink-soft">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 text-sm">
                  {order.paymentMethodType === "cash" ? <HiOutlineCash /> : <HiOutlineCreditCard />}
                  {order.paymentMethodType === "cash" ? "Cash on delivery" : "Card"}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full ${
                    order.isDelivered ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent-dark"
                  }`}
                >
                  <HiOutlineCheckCircle /> {order.isDelivered ? "Delivered" : "Processing"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {order.cartItems?.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#e9ebe5] shrink-0">
                    {item.product?.imageCover && (
                      <SafeImage src={item.product.imageCover} alt={item.product.title} fill className="object-cover" sizes="48px" />
                    )}
                  </div>
                  <p className="text-sm flex-1 line-clamp-1">{item.product?.title}</p>
                  <p className="text-sm text-ink-soft">×{item.count}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 pt-4 border-t border-line font-medium">
              <span>Total</span>
              <span>{order.totalOrderPrice} EGP</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
