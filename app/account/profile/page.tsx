"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { notifySuccess, notifyError } from "@/lib/notify";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Field } from "@/app/login/page";
import type { ApiError } from "@/lib/types";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileForm />
    </ProtectedRoute>
  );
}

function ProfileForm() {
  const { user, token, setUserOverride } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.updateMe(form, token);
      setUserOverride(res.data ?? null);
      notifySuccess("Profile updated");
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-16 max-w-sm">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl mb-1">Your profile</h1>
        <p className="text-ink-soft mb-8">Keep your details up to date.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Full name">
            <input required value={form.name} onChange={set("name")} className="input" />
          </Field>
          <Field label="Email">
            <input type="email" required value={form.email} onChange={set("email")} className="input" />
          </Field>
          <Field label="Phone">
            <input required value={form.phone} onChange={set("phone")} className="input" />
          </Field>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Saving…" : "Save changes"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
