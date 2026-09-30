import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { HiOutlineViewGrid } from "react-icons/hi";
import api from "@/lib/api";
import PageHero from "@/components/PageHero";

export default async function CategoriesPage() {
  const res = await api.getCategories();
  const categories = res.data;

  return (
    <div>
      <PageHero
        icon={<HiOutlineViewGrid size={18} />}
        title="All Categories"
        subtitle={`Browse ${categories.length} categories, then narrow down from there`}
        from="#10b981"
        to="#059669"
      />
      <div className="container-page py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link key={cat._id} href={`/categories/${cat._id}`} className="group relative">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#e9ebe5]">
                <SafeImage src={cat.image} alt={cat.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
                <p className="absolute bottom-4 left-4 right-4 text-white font-medium text-lg">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
