"use client";

import { useState } from "react";
import { notifySuccess, notifyError } from "@/lib/notify";

export default function FooterNewsletter() {
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    notifySuccess("Subscribed!");
    setEmail("");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/40"
      />
      <button className="w-full rounded-lg bg-primary hover:bg-primary-dark transition-colors text-white text-sm font-medium py-2">
        Subscribe
      </button>
    </form>
  );
}
