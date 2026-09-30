"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { notifySuccess, notifyError } from "@/lib/notify";
import { useAuth } from "@/context/AuthContext";
import { Field } from "../login/page";
import type { ApiError } from "@/lib/types";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
    phone: "",
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
    if (form.password !== form.rePassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      notifySuccess("Account created — welcome!");
      router.push("/");
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-16 md:py-24 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <h1 className="font-display text-3xl mb-1">Create your account</h1>
        <p className="text-ink-soft mb-8">Takes less than a minute.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Full name">
            <input required value={form.name} onChange={set("name")} className="input" placeholder="Ahmed Hossam" />
          </Field>
          <Field label="Email">
            <input type="email" required value={form.email} onChange={set("email")} className="input" placeholder="you@example.com" />
          </Field>
          <Field label="Phone">
            <input required value={form.phone} onChange={set("phone")} className="input" placeholder="01xxxxxxxxx" />
          </Field>
          <Field label="Password">
            <input type="password" required value={form.password} onChange={set("password")} className="input" placeholder="••••••••" />
          </Field>
          <Field label="Confirm password">
            <input type="password" required value={form.rePassword} onChange={set("rePassword")} className="input" placeholder="••••••••" />
          </Field>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-ink-soft mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
