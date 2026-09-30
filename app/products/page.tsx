"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineSearch,
  HiOutlineShoppingBag,
  HiOutlineFilter,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineTag,
} from "react-icons/hi";
import api from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import ProductListItem from "@/components/ProductListItem";
import PageHero from "@/components/PageHero";
import { ProductGridSkeleton, ErrorNote } from "@/components/ui";
import type { ApiError, Brand, Category, Product } from "@/lib/types";

const SORTS = [
  { value: "", label: "Recommended" },
  { value: "price", label: "Price: low to high" },
  { value: "-price", label: "Price: high to low" },
  { value: "-ratingsAverage", label: "Top rated" },
];

const MAX_PRICE = 50000;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");
  const [view, setView] = useState("grid");

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);

  useEffect(() => {
    api.getCategories().then((res) => setCategories(res.data)).catch(() => {});
    api.getBrands().then((res) => setBrands(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (sort) params.set("sort", sort);
    if (categoryId) params.set("category", categoryId);
    if (brandId) params.set("brand", brandId);
    if (minPrice > 0) params.set("price[gte]", String(minPrice));
    if (maxPrice < MAX_PRICE) params.set("price[lte]", String(maxPrice));
    params.set("limit", "40");

    const timeout = setTimeout(() => {
      api
        .getProducts(`?${params.toString()}`)
        .then((res) => setProducts(res.data))
        .catch((e: ApiError) => setError(e.message))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [keyword, sort, categoryId, brandId, minPrice, maxPrice]);

  const minPct = (minPrice / MAX_PRICE) * 100;
  const maxPct = (maxPrice / MAX_PRICE) * 100;

  return (
    <div>
      <PageHero
        icon={<HiOutlineShoppingBag size={18} />}
        title="All Products"
        subtitle="Discover our complete collection"
      />

      <div className="container-page py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Filters sidebar */}
          <aside className="h-fit rounded-xl border border-line bg-paper-raised shadow-sm p-5 space-y-6">
            <div className="flex items-center gap-2 font-medium">
              <HiOutlineFilter size={18} className="text-primary" /> Filters
            </div>

            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <HiOutlineSearch size={15} className="text-ink-soft" /> Search
              </p>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search products…"
                className="input text-sm"
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Categories</p>
              <div className="space-y-1.5">
                <FilterRadio
                  label="All Categories"
                  checked={categoryId === ""}
                  onChange={() => setCategoryId("")}
                />
                {categories.map((c: Category) => (
                  <FilterRadio
                    key={c._id}
                    label={c.name}
                    checked={categoryId === c._id}
                    onChange={() => setCategoryId(c._id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <HiOutlineTag size={15} className="text-ink-soft" /> Brands
              </p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <FilterRadio label="All Brands" checked={brandId === ""} onChange={() => setBrandId("")} />
                {brands.map((b: Brand) => (
                  <FilterRadio
                    key={b._id}
                    label={b.name}
                    checked={brandId === b._id}
                    onChange={() => setBrandId(b._id)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Price Range</p>
              <div className="flex justify-between text-xs text-ink-soft mb-3">
                <span>{minPrice} EGP</span>
                <span>{maxPrice} EGP</span>
              </div>
              <div className="relative h-1 mb-1">
                <div className="absolute inset-0 rounded-full bg-line" />
                <div
                  className="absolute h-1 rounded-full bg-primary"
                  style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={MAX_PRICE}
                  step={50}
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.min(+e.target.value, maxPrice - 50))}
                  className="range-thumb absolute inset-0 w-full"
                />
                <input
                  type="range"
                  min={0}
                  max={MAX_PRICE}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.max(+e.target.value, minPrice + 50))}
                  className="range-thumb absolute inset-0 w-full"
                />
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <p className="text-sm text-ink-soft">
                {loading ? "Loading…" : `Showing ${products.length} of ${products.length} products`}
              </p>
              <div className="flex items-center gap-3">
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="input text-sm py-2 w-48">
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center border border-line rounded-lg overflow-hidden shrink-0">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={`p-2 ${view === "grid" ? "bg-primary text-white" : "text-ink-soft hover:bg-black/5"}`}
                  >
                    <HiOutlineViewGrid size={17} />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className={`p-2 ${view === "list" ? "bg-primary text-white" : "text-ink-soft hover:bg-black/5"}`}
                  >
                    <HiOutlineViewList size={17} />
                  </button>
                </div>
              </div>
            </div>

            {error && <ErrorNote message={error} />}

            {loading ? (
              <ProductGridSkeleton count={9} />
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                {view === "grid" ? (
                  <ProductGrid products={products} />
                ) : (
                  <div className="space-y-3">
                    {products.map((p: Product) => (
                      <ProductListItem key={p._id} product={p} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterRadio({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="accent-primary w-3.5 h-3.5"
      />
      <span className={checked ? "text-primary font-medium" : "text-ink-soft"}>{label}</span>
    </label>
  );
}
