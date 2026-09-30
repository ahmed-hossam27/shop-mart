"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { notifySuccess, notifyError } from "@/lib/notify";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Field } from "@/app/login/page";
import type { ApiError } from "@/lib/types";

export default function ChangePasswordPage() {
  return (
    <ProtectedRoute>
      <ChangePasswordForm />
    </ProtectedRoute>
  );
}

function ChangePasswordForm() {
  const { token } = useAuth();
  const [form, setForm] = useState({ currentPassword: "", password: "", rePassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.rePassword) {
      setError("New passwords don't match.");
      return;
    }
    if (!token) return;
    setLoading(true);
    try {
      await api.changeMyPassword(form, token);
      notifySuccess("Password updated");
      setForm({ currentPassword: "", password: "", rePassword: "" });
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-16 max-w-sm">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl mb-6">Change password</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Current password">
            <input type="password" required value={form.currentPassword} onChange={set("currentPassword")} className="input" />
          </Field>
          <Field label="New password">
            <input type="password" required value={form.password} onChange={set("password")} className="input" />
          </Field>
          <Field label="Confirm new password">
            <input type="password" required value={form.rePassword} onChange={set("rePassword")} className="input" />
          </Field>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Saving…" : "Update password"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
