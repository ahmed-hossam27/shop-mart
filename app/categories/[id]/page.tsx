import { HiOutlineViewGrid } from "react-icons/hi";
import api from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import PageHero from "@/components/PageHero";

const GRADIENTS = [
  ["#0ea5e9", "#0284c7"], // sky
  ["#10b981", "#059669"], // emerald
  ["#8b5cf6", "#7c3aed"], // violet
  ["#f59e0b", "#d97706"], // amber
  ["#06b6d4", "#0891b2"], // cyan
];

function pickGradient(seed?: string) {
  const sum = [...(seed || "")].reduce((a, c) => a + c.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length];
}

export default async function CategoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [catRes, subRes, productsRes] = await Promise.allSettled([
    api.getCategory(id),
    api.getCategorySubcategories(id),
    api.getProducts(`?category=${id}&limit=40`),
  ]);

  if (catRes.status !== "fulfilled") {
    return <div className="container-page py-24 text-center text-ink-soft">Category not found.</div>;
  }

  const category = catRes.value.data;
  const subcategories = subRes.status === "fulfilled" ? subRes.value.data : [];
  const products = productsRes.status === "fulfilled" ? productsRes.value.data : [];
  const [from, to] = pickGradient(category.name);

  return (
    <div>
      <PageHero
        icon={<HiOutlineViewGrid size={18} />}
        title={category.name}
        subtitle={`${products.length} products in this category`}
        from={from}
        to={to}
      />

      <div className="container-page py-10">
        {subcategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {subcategories.map((s) => (
              <span
                key={s._id}
                className="px-4 py-2 rounded-full border border-line bg-paper-raised shadow-sm text-sm text-ink-soft"
              >
                {s.name}
              </span>
            ))}
          </div>
        )}
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
