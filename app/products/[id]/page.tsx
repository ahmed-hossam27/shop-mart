import api from "@/lib/api";
import ProductDetail from "@/components/ProductDetail";
import ProductGrid from "@/components/ProductGrid";
import { SectionTitle } from "@/components/ui";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [productRes, relatedRes] = await Promise.allSettled([
    api.getProduct(id),
    api.getProducts("?limit=4"),
  ]);

  if (productRes.status !== "fulfilled") {
    return (
      <div className="container-page py-24 text-center text-ink-soft">
        Couldn&apos;t load this product. It may have been removed.
      </div>
    );
  }

  const product = productRes.value.data;
  const related =
    relatedRes.status === "fulfilled"
      ? relatedRes.value.data.filter((p) => p._id !== product._id).slice(0, 4)
      : [];

  return (
    <div className="container-page py-12">
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-24 pt-16 border-t border-line">
          <SectionTitle eyebrow="More to like" title="You might also like" />
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
