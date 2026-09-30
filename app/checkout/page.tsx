"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { notifySuccess, notifyError } from "@/lib/notify";
import { HiOutlineCash, HiOutlineCreditCard } from "react-icons/hi";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import api from "@/lib/api";
import type { Address, ApiError, ManualAddress } from "@/lib/types";
import type { ReactNode } from "react";

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}

function CheckoutContent() {
  const { token } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [method, setMethod] = useState("cash");
  const [placing, setPlacing] = useState(false);
  const [manual, setManual] = useState<ManualAddress>({ name: "", details: "", phone: "", city: "" });
  const [useManual, setUseManual] = useState(false);

  useEffect(() => {
    if (!token) return;
    api.getAddresses(token).then((res) => {
      setAddresses(res.data);
      if (res.data.length > 0) setSelected(res.data[0]._id);
      else setUseManual(true);
    });
  }, [token]);

  const shippingAddress = useManual
    ? manual
    : (() => {
        const a = addresses.find((x) => x._id === selected);
        return a ? { details: a.details, phone: a.phone, city: a.city } : null;
      })();

  const placeOrder = async () => {
    if (!cart?._id || !token) return;
    if (!shippingAddress?.details || !shippingAddress?.phone || !shippingAddress?.city) {
      notifyError("Please provide a complete shipping address.");
      return;
    }
    setPlacing(true);
    try {
      if (method === "cash") {
        await api.createCashOrder(cart._id, shippingAddress, token);
        await clearCart();
        notifySuccess("Order placed — pay on delivery");
        router.push("/orders");
      } else {
        const returnUrl = `${window.location.origin}/orders`;
        const res = await api.createCheckoutSession(cart._id, shippingAddress, returnUrl, token);
        window.location.href = res.session.url;
      }
    } catch (err) {
      notifyError((err as ApiError).message);
    } finally {
      setPlacing(false);
    }
  };

  const set =
    (key: keyof ManualAddress) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setManual({ ...manual, [key]: e.target.value });

  return (
    <div className="container-page py-14 max-w-2xl">
      <h1 className="font-display text-3xl mb-8">Checkout</h1>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h2 className="font-medium mb-4">Shipping address</h2>

        {addresses.length > 0 && !useManual && (
          <div className="space-y-3 mb-4">
            {addresses.map((a) => (
              <label
                key={a._id}
                className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-colors ${
                  selected === a._id ? "border-primary bg-primary/5" : "border-line"
                }`}
              >
                <input type="radio" name="address" checked={selected === a._id} onChange={() => setSelected(a._id)} className="mt-1" />
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-sm text-ink-soft">{a.details}, {a.city} — {a.phone}</p>
                </div>
              </label>
            ))}
            <button onClick={() => setUseManual(true)} className="text-sm text-primary hover:underline">
              Use a different address
            </button>
          </div>
        )}

        {useManual && (
          <div className="grid sm:grid-cols-2 gap-4 border border-line rounded-xl p-5 bg-paper-raised shadow-sm">
            <input required placeholder="Label" value={manual.name} onChange={set("name")} className="input" />
            <input required placeholder="City" value={manual.city} onChange={set("city")} className="input" />
            <input required placeholder="Phone" value={manual.phone} onChange={set("phone")} className="input" />
            <input required placeholder="Details / street" value={manual.details} onChange={set("details")} className="input" />
            {addresses.length > 0 && (
              <button onClick={() => setUseManual(false)} className="text-sm text-primary hover:underline sm:col-span-2 text-left">
                Use a saved address instead
              </button>
            )}
          </div>
        )}
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-10">
        <h2 className="font-medium mb-4">Payment method</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <PaymentOption
            active={method === "cash"}
            onClick={() => setMethod("cash")}
            icon={<HiOutlineCash size={22} />}
            title="Cash on delivery"
            subtitle="Pay when your order arrives"
          />
          <PaymentOption
            active={method === "online"}
            onClick={() => setMethod("online")}
            icon={<HiOutlineCreditCard size={22} />}
            title="Pay online"
            subtitle="Secure card payment"
          />
        </div>
      </motion.section>

      <div className="flex justify-between items-center border-t border-line pt-6">
        <div>
          <p className="text-sm text-ink-soft">Total</p>
          <p className="font-display text-2xl">
            {cart?.totalCartPriceAfterDiscount || cart?.totalCartPrice} EGP
          </p>
        </div>
        <button onClick={placeOrder} disabled={placing} className="btn-primary px-10">
          {placing ? "Placing order…" : "Place order"}
        </button>
      </div>
    </div>
  );
}

function PaymentOption({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 border rounded-xl p-4 text-left transition-colors ${
        active ? "border-primary bg-primary/5" : "border-line hover:border-ink"
      }`}
    >
      <div className={active ? "text-primary" : "text-ink-soft"}>{icon}</div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-ink-soft">{subtitle}</p>
      </div>
    </button>
  );
}
