"use client";

import ProductCard from "./ProductCard";
import { EmptyState } from "./ui";
import { HiOutlineShoppingBag } from "react-icons/hi";
import type { Product } from "@/lib/types";

export default function ProductGrid({
  products,
  columns = 4,
}: {
  products: Product[];
  columns?: number;
}) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={<HiOutlineShoppingBag size={40} />}
        title="No products found"
        subtitle="Try a different category, brand or search term."
      />
    );
  }

  const colClass = columns === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4";

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 ${colClass} gap-4 sm:gap-5`}>
      {products.map((p, i) => (
        <ProductCard key={p._id} product={p} index={i} />
      ))}
    </div>
  );
}
