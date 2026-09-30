import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import api from "@/lib/api";
import HomeHero from "@/components/HomeHero";
import ProductGrid from "@/components/ProductGrid";
import PromoBanners from "@/components/PromoBanners";
import NewsletterAppCard from "@/components/NewsletterAppCard";
import FeatureBar from "@/components/FeatureBar";
import { BarHeading } from "@/components/ui";
import { HiArrowRight } from "react-icons/hi";
import type { Brand, Category } from "@/lib/types";

// Hero background photos. Leave empty to auto-pick images from the API's
// categories, or drop your own wide store photos in /public and list them
// here instead, e.g. ["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg"].
const HERO_IMAGES: string[] = [];

export default async function HomePage() {
  const [productsRes, categoriesRes, brandsRes] = await Promise.allSettled([
    api.getProducts("?limit=10"),
    api.getCategories(),
    api.getBrands(),
  ]);

  const products = productsRes.status === "fulfilled" ? productsRes.value.data : [];
  const categories: Category[] = categoriesRes.status === "fulfilled" ? categoriesRes.value.data : [];
  const brands: Brand[] = brandsRes.status === "fulfilled" ? brandsRes.value.data.slice(0, 8) : [];

  const pickCategory = (keywords: string[]) =>
    categories.find((c) => keywords.some((k) => c.name.toLowerCase().includes(k)));
  const heroCategories = [
    pickCategory(["fashion", "women", "men"]),
    pickCategory(["electronic", "mobile", "home"]),
    pickCategory(["super", "grocery", "baby"]),
  ];
  const heroImages: string[] = HERO_IMAGES.length
    ? HERO_IMAGES
    : (heroCategories.map((c, i) => c?.image || categories[i]?.image).filter(Boolean) as string[]);

  return (
    <div>
      <HomeHero images={heroImages} />

      <FeatureBar />

      {/* Categories */}
      <section className="container-page py-10">
        <div className="flex items-end justify-between mb-6">
          <BarHeading title="Shop By Category" highlight="Category" />
          <Link href="/categories" className="text-sm text-primary hover:underline hidden sm:inline-flex items-center gap-1">
            View All Categories <HiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 12).map((cat: Category) => (
            <Link
              key={cat._id}
              href={`/categories/${cat._id}`}
              className="group border border-line rounded-xl p-4 flex flex-col items-center text-center bg-paper-raised shadow-sm hover:border-primary hover:shadow-md transition-all"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-[#eceef2] mb-3">
                <SafeImage
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <p className="text-sm font-medium group-hover:text-primary transition-colors">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo banners */}
      <section className="container-page pb-10">
        <PromoBanners />
      </section>

      {/* Featured products */}
      <section className="container-page py-10 border-t border-line">
        <div className="flex items-end justify-between mb-8 gap-4">
          <BarHeading title="Featured Products" highlight="Products" />
          <Link href="/products" className="btn-secondary hidden sm:inline-flex shrink-0">
            View all
          </Link>
        </div>
        <ProductGrid products={products} columns={5} />
        <Link href="/products" className="btn-secondary sm:hidden w-full mt-8 inline-flex justify-center">
          View all products
        </Link>
      </section>

      {/* Brands */}
      {brands.length > 0 && (
        <section className="container-page py-10 border-t border-line">
          <BarHeading title="Shop By Brand" highlight="Brand" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {brands.map((b: Brand) => (
              <Link
                key={b._id}
                href={`/brands/${b._id}`}
                className="rounded-xl border border-line bg-paper-raised shadow-sm hover:bg-primary/5 hover:border-primary hover:shadow-md transition-all p-5"
              >
                <div className="relative w-full aspect-[3/2] rounded-lg bg-[#f7f8fa] overflow-hidden">
                  <SafeImage src={b.image} alt={b.name} fill className="object-contain p-4" sizes="200px" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="bg-paper-raised border-t border-line mt-4">
        <section className="container-page py-10">
          <NewsletterAppCard />
        </section>

        <FeatureBar bordered={false} />
      </div>
    </div>
  );
}
