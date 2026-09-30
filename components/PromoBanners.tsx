"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineFire, HiOutlineSparkles, HiArrowRight } from "react-icons/hi";

const BANNERS = [
  {
    icon: <HiOutlineFire size={14} />,
    tag: "Deal of the Day",
    title: "Selected Electronics",
    subtitle: "Big savings on top picks, today only",
    discount: "40% OFF",
    code: "TECH40",
    from: "#0ea5e9",
    to: "#0284c7",
  },
  {
    icon: <HiOutlineSparkles size={14} />,
    tag: "New Arrivals",
    title: "This Week's Fashion Drop",
    subtitle: "Fresh styles just added to the catalogue",
    discount: "25% OFF",
    code: "FRESH25",
    from: "#f59e0b",
    to: "#d97706",
  },
];

export default function PromoBanners() {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {BANNERS.map((b, i) => (
        <motion.div
          key={b.title}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="relative rounded-2xl overflow-hidden p-7 shadow-md"
          style={{ background: `linear-gradient(120deg, ${b.from}, ${b.to})` }}
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute right-10 bottom-4 w-16 h-16 rounded-full bg-white/10" />

          <span className="relative inline-flex items-center gap-1.5 text-white/90 text-xs font-medium bg-white/15 rounded-full px-3 py-1 w-fit mb-4">
            {b.icon} {b.tag}
          </span>
          <h3 className="relative font-display text-white text-xl mb-1">{b.title}</h3>
          <p className="relative text-white/75 text-sm mb-5">{b.subtitle}</p>

          <div className="relative flex items-center gap-3 mb-5">
            <span className="font-display text-white text-2xl">{b.discount}</span>
            <span className="text-white/70 text-xs">
              Use code: <span className="font-semibold text-white">{b.code}</span>
            </span>
          </div>

          <Link
            href="/products"
            className="relative inline-flex items-center gap-2 text-sm font-medium bg-white text-ink rounded-full px-5 py-2 hover:bg-white/90 transition-colors"
          >
            Explore Now <HiArrowRight size={14} />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
