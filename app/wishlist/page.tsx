"use client";

import Link from "next/link";
import { HiOutlineHeart } from "react-icons/hi";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useWishlist } from "@/context/WishlistContext";
import ProductGrid from "@/components/ProductGrid";
import { EmptyState } from "@/components/ui";

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}

function WishlistContent() {
  const { items, loading } = useWishlist();

  if (!loading && items.length === 0) {
    return (
      <div className="container-page">
        <EmptyState
          icon={<HiOutlineHeart size={40} />}
          title="Your wishlist is empty"
          subtitle="Tap the heart on any product to save it here."
          action={
            <Link href="/products" className="btn-primary">
              Discover products
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl mb-8">Your wishlist</h1>
      <ProductGrid products={items} />
    </div>
  );
}
