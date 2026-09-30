"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { notifySuccess, notifyError } from "@/lib/notify";
import { HiOutlinePlus, HiOutlineTrash, HiOutlineLocationMarker } from "react-icons/hi";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { EmptyState } from "@/components/ui";
import type { Address, ApiError, ManualAddress } from "@/lib/types";

export default function AddressPage() {
  return (
    <ProtectedRoute>
      <AddressContent />
    </ProtectedRoute>
  );
}

function AddressContent() {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ManualAddress>({ name: "", details: "", phone: "", city: "" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api
      .getAddresses(token)
      .then((res) => setAddresses(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const set =
    (key: keyof ManualAddress) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      await api.addAddress(form, token);
      notifySuccess("Address added");
      setForm({ name: "", details: "", phone: "", city: "" });
      setShowForm(false);
      load();
    } catch (err) {
      notifyError((err as ApiError).message);
    } finally {
      setSaving(false);
    }
  };

  const onRemove = async (id: string) => {
    if (!token) return;
    try {
      await api.removeAddress(id, token);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
      notifySuccess("Address removed");
    } catch (err) {
      notifyError((err as ApiError).message);
    }
  };

  return (
    <div className="container-page py-14 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Your addresses</h1>
        <button onClick={() => setShowForm((v) => !v)} className="btn-secondary">
          <HiOutlinePlus size={16} /> Add address
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
            onSubmit={onAdd}
          >
            <div className="grid sm:grid-cols-2 gap-4 border border-line rounded-xl p-5 mb-8">
              <input required placeholder="Label (e.g. Home)" value={form.name} onChange={set("name")} className="input" />
              <input required placeholder="City" value={form.city} onChange={set("city")} className="input" />
              <input required placeholder="Phone" value={form.phone} onChange={set("phone")} className="input" />
              <input required placeholder="Details / street" value={form.details} onChange={set("details")} className="input" />
              <button disabled={saving} className="btn-primary sm:col-span-2">
                {saving ? "Saving…" : "Save address"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {!loading && addresses.length === 0 && !showForm && (
        <EmptyState
          icon={<HiOutlineLocationMarker size={40} />}
          title="No saved addresses yet"
          subtitle="Add one so checkout is faster next time."
        />
      )}

      <div className="space-y-3">
        {addresses.map((a) => (
          <div key={a._id} className="flex items-start justify-between border border-line rounded-xl p-5 bg-paper-raised shadow-sm">
            <div>
              <p className="font-medium">{a.name}</p>
              <p className="text-sm text-ink-soft mt-1">{a.details}, {a.city}</p>
              <p className="text-sm text-ink-soft">{a.phone}</p>
            </div>
            <button onClick={() => onRemove(a._id)} className="text-ink-soft hover:text-danger transition-colors" aria-label="Remove address">
              <HiOutlineTrash size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
