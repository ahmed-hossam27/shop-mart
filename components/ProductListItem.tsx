"use client";

import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { HiHeart, HiOutlineHeart, HiOutlineShoppingBag } from "react-icons/hi";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import StarRating from "./StarRating";
import type { Product } from "@/lib/types";

export default function ProductListItem({ product }: { product: Product }) {
  const wishlist = useWishlist();
  const cart = useCart();
  const isWished = wishlist?.ids?.has(product._id);
  const hasDiscount = product.priceAfterDiscount && product.priceAfterDiscount < product.price;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-line bg-paper-raised shadow-sm p-3">
      <Link href={`/products/${product._id}`} className="relative w-20 h-20 rounded-lg bg-[#f1f2f5] overflow-hidden shrink-0">
        <SafeImage src={product.imageCover} alt={product.title} fill className="object-contain p-2" sizes="80px" />
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-medium leading-snug line-clamp-1">{product.title}</h3>
        </Link>
        <p className="text-xs font-medium tracking-wide uppercase text-primary mt-0.5">
          {product.category?.name}
        </p>
        {product.ratingsAverage && <div className="mt-1"><StarRating value={product.ratingsAverage} size={12} /></div>}
      </div>

      <div className="flex items-baseline gap-1.5 shrink-0">
        {hasDiscount ? (
          <span className="font-semibold">{product.priceAfterDiscount} EGP</span>
        ) : (
          <span className="font-semibold">{product.price} EGP</span>
        )}
      </div>

      <button
        onClick={() => wishlist?.toggle(product._id)}
        aria-label="Toggle wishlist"
        className="w-9 h-9 rounded-full border border-line flex items-center justify-center hover:border-danger transition-colors shrink-0"
      >
        {isWished ? <HiHeart size={16} className="text-danger" /> : <HiOutlineHeart size={16} />}
      </button>

      <button
        onClick={() => cart?.addItem(product._id)}
        className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg bg-primary text-white shadow-sm hover:bg-primary-dark hover:shadow transition-all shrink-0"
      >
        <HiOutlineShoppingBag size={13} /> Add
      </button>
    </div>
  );
}
