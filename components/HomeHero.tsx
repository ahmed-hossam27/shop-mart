"use client";

import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const COPY = [
  {
    eyebrow: "New season",
    title: "Shop the styles everyone's after",
    subtitle: "Fresh drops across fashion, tech and everyday essentials.",
    primary: { href: "/products", label: "Shop now" },
    secondary: { href: "/products?sort=-priceAfterDiscount", label: "View deals" },
  },
  {
    eyebrow: "Quality first",
    title: "Premium picks, guaranteed",
    subtitle: "Every item vetted for quality before it reaches you.",
    primary: { href: "/products", label: "Shop now" },
    secondary: { href: "/brands", label: "Learn more" },
  },
  {
    eyebrow: "Limited time",
    title: "Fast, free delivery this week",
    subtitle: "Same-day delivery available on thousands of items.",
    primary: { href: "/products", label: "Order now" },
    secondary: { href: "/contact", label: "Delivery info" },
  },
];

export default function HomeHero({ images = [] }: { images?: string[] }) {
  const [index, setIndex] = useState(0);
  const slides = COPY.map((c, i) => ({ ...c, image: images[i] }));

  const slide = slides[index];
  const go = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <section className="relative h-[420px] sm:h-[500px] overflow-hidden bg-primary-dark">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {/* Full-bleed background photo */}
          {slide.image && (
            <motion.div
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 6, ease: "linear" }}
              className="absolute inset-0"
            >
              <SafeImage
                src={slide.image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          )}

          {/* Brand-coloured translucent wash over the photo */}
          <div className="absolute inset-0 bg-primary-dark/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/70 via-primary-dark/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Text sits above the overlay */}
      <div className="relative h-full container-page flex flex-col justify-center max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-white/80 text-sm font-medium mb-3 tracking-wide uppercase">
              {slide.eyebrow}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.08] mb-4 drop-shadow-sm">
              {slide.title}
            </h1>
            <p className="text-white/85 text-lg mb-8 max-w-md">{slide.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={slide.primary.href}
                className="inline-flex items-center gap-2 bg-white text-ink font-medium rounded-full px-7 py-3 hover:bg-white/90 transition-colors"
              >
                {slide.primary.label}
              </Link>
              <Link
                href={slide.secondary.href}
                className="inline-flex items-center gap-2 border border-white/70 text-white font-medium rounded-full px-7 py-3 hover:bg-white/10 transition-colors"
              >
                {slide.secondary.label}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={() => go(index - 1)}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur items-center justify-center text-white transition-colors z-10"
      >
        <HiChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur items-center justify-center text-white transition-colors z-10"
      >
        <HiChevronRight size={20} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-7 bg-white" : "w-1.5 bg-white/50"}`}
          />
        ))}
      </div>
    </section>
  );
}
