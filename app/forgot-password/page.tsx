"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { notifySuccess, notifyError } from "@/lib/notify";
import api from "@/lib/api";
import { Field } from "../login/page";
import type { ApiError } from "@/lib/types";

const STEPS = ["email", "code", "reset"];

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async (fn: () => Promise<void>) => {
    setError("");
    setLoading(true);
    try {
      await fn();
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      await api.forgotPassword(email);
      notifySuccess("Reset code sent to your email");
      setStep(1);
    });
  };

  const verifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      await api.verifyResetCode(code);
      setStep(2);
    });
  };

  const resetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      await api.resetPassword({ email, newPassword });
      notifySuccess("Password reset — please sign in");
      router.push("/login");
    });
  };

  return (
    <div className="container-page py-16 md:py-24 flex justify-center">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-line"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.form key="email" {...fadeProps} onSubmit={sendEmail} className="space-y-4">
              <h1 className="font-display text-3xl mb-1">Reset your password</h1>
              <p className="text-ink-soft mb-6">We&apos;ll email you a reset code.</p>
              <Field label="Email">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
              </Field>
              {error && <p className="text-sm text-danger">{error}</p>}
              <button disabled={loading} className="btn-primary w-full">{loading ? "Sending…" : "Send reset code"}</button>
            </motion.form>
          )}

          {step === 1 && (
            <motion.form key="code" {...fadeProps} onSubmit={verifyCode} className="space-y-4">
              <h1 className="font-display text-3xl mb-1">Check your inbox</h1>
              <p className="text-ink-soft mb-6">Enter the code we sent to {email}.</p>
              <Field label="Reset code">
                <input required value={code} onChange={(e) => setCode(e.target.value)} className="input tracking-widest" placeholder="123456" />
              </Field>
              {error && <p className="text-sm text-danger">{error}</p>}
              <button disabled={loading} className="btn-primary w-full">{loading ? "Verifying…" : "Verify code"}</button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form key="reset" {...fadeProps} onSubmit={resetPassword} className="space-y-4">
              <h1 className="font-display text-3xl mb-1">New password</h1>
              <p className="text-ink-soft mb-6">Choose something you&apos;ll remember.</p>
              <Field label="New password">
                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input" placeholder="••••••••" />
              </Field>
              {error && <p className="text-sm text-danger">{error}</p>}
              <button disabled={loading} className="btn-primary w-full">{loading ? "Saving…" : "Reset password"}</button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const fadeProps = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.25 },
};
