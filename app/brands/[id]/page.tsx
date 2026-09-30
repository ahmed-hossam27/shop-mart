import SafeImage from "@/components/SafeImage";
import api from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

export default async function BrandDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [brandRes, productsRes] = await Promise.allSettled([
    api.getBrand(id),
    api.getProducts(`?brand=${id}&limit=40`),
  ]);

  if (brandRes.status !== "fulfilled") {
    return <div className="container-page py-24 text-center text-ink-soft">Brand not found.</div>;
  }

  const brand = brandRes.value.data;
  const products = productsRes.status === "fulfilled" ? productsRes.value.data : [];

  return (
    <div className="container-page py-14">
      <div className="flex items-center gap-6 mb-12">
        <div className="relative w-24 h-24 rounded-xl border border-line bg-paper-raised p-3 shrink-0">
          <SafeImage src={brand.image} alt={brand.name} fill className="object-contain p-2" sizes="96px" />
        </div>
        <div>
          <p className="text-sm text-primary mb-1">Brand</p>
          <h1 className="font-display text-3xl md:text-4xl">{brand.name}</h1>
        </div>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
