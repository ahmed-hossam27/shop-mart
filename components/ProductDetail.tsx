"use client";

import { useState } from "react";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { notifySuccess, notifyError } from "@/lib/notify";
import { AnimatePresence, motion } from "framer-motion";
import { HiHeart, HiOutlineHeart, HiMinus, HiPlus } from "react-icons/hi";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import StarRating from "./StarRating";
import type { Product } from "@/lib/types";

export default function ProductDetail({ product }: { product: Product }) {
  const images = product.images?.length ? product.images : [product.imageCover];
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const cart = useCart();
  const wishlist = useWishlist();
  const isWished = wishlist?.ids?.has(product._id);
  const hasDiscount = product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const stock = typeof product.quantity === "number" ? product.quantity : null;

  const increaseQty = () => {
    if (stock !== null && qty >= stock) {
      notifyError(`Only ${stock} left in stock`);
      return;
    }
    setQty((q) => q + 1);
  };

  const addMany = async () => {
    for (let i = 0; i < qty; i++) {
      await cart?.addItem(product._id);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
      <div>
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="relative aspect-square rounded-2xl overflow-hidden bg-[#f1f2f5]"
        >
          <SafeImage src={images[active]} alt={product.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-8" priority />
        </motion.div>
        {images.length > 1 && (
          <div className="flex gap-3 mt-4">
            {images.map((img: string, i: number) => (
              <button
                key={img + i}
                onClick={() => setActive(i)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  active === i ? "border-primary" : "border-transparent"
                }`}
              >
                <SafeImage src={img} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
        {product.category?.name && (
          <Link href={`/categories/${product.category._id}`} className="text-sm text-primary hover:underline">
            {product.category.name}
          </Link>
        )}
        <h1 className="font-display text-3xl md:text-4xl mt-2 mb-3">{product.title}</h1>

        <div className="flex items-center gap-4 mb-6">
          {product.ratingsAverage && (
            <StarRating value={product.ratingsAverage} size={15} />
          )}
          {product.brand?.name && <span className="text-sm text-ink-soft">{product.brand.name}</span>}
        </div>

        <div className="flex items-center gap-3 mb-6">
          {hasDiscount ? (
            <>
              <span className="text-2xl font-medium text-accent-dark">{product.priceAfterDiscount} EGP</span>
              <span className="text-lg text-ink-soft line-through">{product.price} EGP</span>
            </>
          ) : (
            <span className="text-2xl font-medium">{product.price} EGP</span>
          )}
        </div>

        <p className="text-ink-soft leading-relaxed mb-8">{product.description}</p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border border-line rounded-full">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3" aria-label="Decrease quantity">
              <HiMinus size={16} />
            </button>
            <span className="w-8 text-center">{qty}</span>
            <button onClick={increaseQty} className="p-3" aria-label="Increase quantity">
              <HiPlus size={16} />
            </button>
          </div>

          <button onClick={() => wishlist?.toggle(product._id)} className="p-3 rounded-full border border-line hover:border-danger transition-colors" aria-label="Toggle wishlist">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={isWished ? "on" : "off"} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="block">
                {isWished ? <HiHeart size={20} className="text-danger" /> : <HiOutlineHeart size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {stock !== null && stock <= 5 && (
          <p className="text-sm text-accent-dark mb-4">
            {stock === 0 ? "Out of stock" : `Only ${stock} left in stock`}
          </p>
        )}

        <button onClick={addMany} disabled={stock === 0} className="btn-primary w-full sm:w-auto px-10 disabled:opacity-50 disabled:cursor-not-allowed">
          {stock === 0 ? "Out of stock" : "Add to cart"}
        </button>
      </motion.div>
    </div>
  );
}
