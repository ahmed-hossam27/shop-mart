import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { HiOutlineTag } from "react-icons/hi";
import api from "@/lib/api";
import PageHero from "@/components/PageHero";

export default async function BrandsPage() {
  const res = await api.getBrands();
  const brands = res.data;

  return (
    <div>
      <PageHero
        icon={<HiOutlineTag size={18} />}
        title="Shop by Brand"
        subtitle={`Discover products from ${brands.length} trusted brands`}
        from="#8b5cf6"
        to="#7c3aed"
      />
      <div className="container-page py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((b) => (
            <Link
              key={b._id}
              href={`/brands/${b._id}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-line bg-paper-raised shadow-sm hover:bg-primary/5 hover:border-primary hover:shadow-md transition-all p-5"
            >
              <div className="relative w-full aspect-[3/2] rounded-lg bg-[#f7f8fa] overflow-hidden">
                <SafeImage
                  src={b.image}
                  alt={b.name}
                  fill
                  className="object-contain p-4"
                  sizes="180px"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-ink-soft group-hover:text-primary transition-colors">
                  {b.name}
                </p>
                <p className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                  View Products →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
