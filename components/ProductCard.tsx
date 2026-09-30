"use client";

import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { motion } from "framer-motion";
import { HiHeart, HiOutlineHeart, HiOutlineShoppingBag } from "react-icons/hi";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import StarRating from "./StarRating";
import type { Product } from "@/lib/types";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const wishlist = useWishlist();
  const cart = useCart();
  const isWished = wishlist?.ids?.has(product._id);
  const hasDiscount = product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const discountPct = hasDiscount
    ? Math.round(100 - (product.priceAfterDiscount! / product.price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.04 }}
      className="group relative rounded-xl border border-line bg-paper-raised overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-square bg-[#f1f2f5]">
          <SafeImage
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-[1.06]"
          />
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 bg-accent text-white text-[11px] font-semibold px-2 py-1 rounded-md">
              -{discountPct}%
            </span>
          )}
        </div>
      </Link>

      <button
        onClick={(e) => {
          e.preventDefault();
          wishlist?.toggle(product._id);
        }}
        aria-label="Toggle wishlist"
        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white border border-line flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {isWished ? (
          <HiHeart size={15} className="text-danger" />
        ) : (
          <HiOutlineHeart size={15} className="text-ink" />
        )}
      </button>

      <div className="p-3.5 text-center border-t border-line">
        <Link href={`/products/${product._id}`}>
          <h3 className="text-sm font-semibold leading-snug line-clamp-1 mb-1">{product.title}</h3>
          <p className="text-[11px] font-medium tracking-wide uppercase text-primary mb-1.5">
            {product.category?.name}
          </p>
        </Link>
        {product.ratingsAverage && (
          <p className="flex items-center justify-center mb-2.5">
            <StarRating value={product.ratingsAverage} />
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            {hasDiscount ? (
              <span className="font-semibold text-sm">{product.priceAfterDiscount} <span className="text-xs font-normal text-ink-soft">EGP</span></span>
            ) : (
              <span className="font-semibold text-sm">{product.price} <span className="text-xs font-normal text-ink-soft">EGP</span></span>
            )}
          </div>
          <button
            onClick={() => cart?.addItem(product._id)}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-white shadow-sm hover:bg-primary-dark hover:shadow transition-all"
          >
            <HiOutlineShoppingBag size={13} /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}
