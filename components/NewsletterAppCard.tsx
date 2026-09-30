"use client";

import { useState } from "react";
import { notifySuccess, notifyError } from "@/lib/notify";
import { HiOutlineMail, HiArrowRight, HiStar, HiOutlineGift, HiOutlineTruck, HiOutlineTag } from "react-icons/hi";
import { FaApple, FaGooglePlay } from "react-icons/fa";

const PERKS = [
  { icon: <HiOutlineGift size={13} />, label: "Fresh Picks Weekly" },
  { icon: <HiOutlineTruck size={13} />, label: "Free Delivery Codes" },
  { icon: <HiOutlineTag size={13} />, label: "Members-Only Deals" },
];

export default function NewsletterAppCard() {
  const [email, setEmail] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    notifySuccess("Subscribed — thanks for joining!");
    setEmail("");
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/15 shadow-sm p-6 sm:p-8 grid lg:grid-cols-[1.3fr_1fr] gap-6">
      <div>
        <span className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center mb-4 shadow-sm shadow-primary/30">
          <HiOutlineMail size={20} />
        </span>
        <p className="text-xs font-medium text-primary tracking-wide uppercase mb-1">
          Newsletter · 50,000+ subscribers
        </p>
        <h2 className="font-display text-2xl sm:text-3xl mb-2">
          Get the freshest updates, <span className="text-primary">delivered free</span>
        </h2>
        <p className="text-ink-soft mb-5">Weekly recipes, seasonal offers &amp; exclusive member perks.</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {PERKS.map((p) => (
            <span
              key={p.label}
              className="inline-flex items-center gap-1.5 text-xs text-primary-dark bg-paper-raised border border-line rounded-full px-3 py-1.5 shadow-sm"
            >
              {p.icon} {p.label}
            </span>
          ))}
        </div>

        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 max-w-sm">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input"
          />
          <button className="btn-primary shrink-0">
            Subscribe <HiArrowRight size={16} />
          </button>
        </form>
        <p className="text-xs text-ink-soft mt-2">✨ Unsubscribe anytime. No spam, ever.</p>
      </div>

      <div className="rounded-2xl bg-ink text-white p-6 sm:p-8 flex flex-col justify-center shadow-lg">
        <span className="inline-flex w-fit items-center gap-1.5 text-primary text-xs font-medium bg-primary/15 rounded-full px-3 py-1.5 mb-4">
          Mobile app
        </span>
        <h3 className="font-display text-xl sm:text-2xl mb-2">Shop faster on our app</h3>
        <p className="text-white/70 text-sm mb-6">Get app-exclusive deals &amp; 15% off your first order.</p>

        <div className="flex flex-col sm:flex-row gap-2 mb-5">
          <a href="#" className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 transition-colors rounded-xl px-4 py-2.5">
            <FaApple size={18} />
            <span className="text-left leading-none">
              <span className="block text-[10px] text-white/60">Download on the</span>
              <span className="block text-sm font-medium">App Store</span>
            </span>
          </a>
          <a href="#" className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 transition-colors rounded-xl px-4 py-2.5">
            <FaGooglePlay size={16} />
            <span className="text-left leading-none">
              <span className="block text-[10px] text-white/60">Get it on</span>
              <span className="block text-sm font-medium">Google Play</span>
            </span>
          </a>
        </div>

        <p className="inline-flex items-center gap-1.5 text-sm text-white/70">
          <span className="inline-flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => <HiStar key={i} size={13} />)}
          </span>
          4.9 · 100K+ downloads
        </p>
      </div>
    </div>
  );
}
