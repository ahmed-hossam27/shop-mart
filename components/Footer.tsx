import Link from "next/link";
import { HiOutlinePhone, HiOutlineMail, HiOutlineLocationMarker, HiOutlineShoppingBag } from "react-icons/hi";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import api from "@/lib/api";
import FooterNewsletter from "./FooterNewsletter";

const PAYMENT_BADGES = [
  { label: "Visa", color: "#1A1F71" },
  { label: "Mastercard", color: "#EB001B" },
  { label: "PayPal", color: "#003087" },
  { label: "Apple Pay", color: "#000000" },
];

export default async function Footer() {
  const categoriesRes = await api.getCategories().catch(() => null);
  const categories = categoriesRes?.data?.slice(0, 5) || [];

  return (
    <footer className="bg-[#0f172a] text-white/70">
      <div className="container-page py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <p className="flex items-center gap-2 font-display text-lg text-white mb-3">
            <span className="w-7 h-7 rounded-md bg-primary text-white flex items-center justify-center shrink-0">
              <HiOutlineShoppingBag size={16} />
            </span>
            Shop<span className="text-primary">Mart</span>
          </p>
          <p className="text-sm max-w-xs mb-4 leading-relaxed">
            Your one-stop destination for fashion, electronics and everyday
            essentials. Quality products delivered with love.
          </p>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <HiOutlinePhone size={12} />
              </span>
              +20 123 456 7890
            </p>
            <p className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <HiOutlineMail size={12} />
              </span>
              support@shopmart.com
            </p>
            <p className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <HiOutlineLocationMarker size={12} />
              </span>
              Cairo, Egypt
            </p>
          </div>
        </div>

        <FooterCol
          title="Categories"
          links={
            categories.length > 0
              ? categories.map((c) => ({ href: `/categories/${c._id}`, label: c.name }))
              : [{ href: "/categories", label: "Browse all" }]
          }
        />

        <FooterCol
          title="Quick Links"
          links={[
            { href: "/about", label: "About Us" },
            { href: "/contact", label: "Contact Us" },
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
            { href: "/products", label: "Shop All" },
          ]}
        />
        <FooterCol
          title="My Account"
          links={[
            { href: "/account/profile", label: "My Profile" },
            { href: "/orders", label: "My Orders" },
            { href: "/wishlist", label: "Wishlist" },
            { href: "/cart", label: "Shopping Cart" },
            { href: "/checkout", label: "Checkout" },
          ]}
        />

        <div>
          <p className="text-sm font-semibold text-white mb-3">Newsletter</p>
          <p className="text-sm mb-3 leading-relaxed">
            Subscribe to get updates on new arrivals, special offers and more!
          </p>
          <FooterNewsletter />
          <p className="text-sm font-semibold text-white mt-5 mb-3">Follow Us</p>
          <div className="flex items-center gap-2">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                aria-label="Social link"
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-4 text-xs flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          <span className="flex items-center gap-1.5">
            <HiOutlineShoppingBag size={13} className="text-primary" />
            © {new Date().getFullYear()} ShopMart. All rights reserved.
          </span>
          <span className="flex items-center gap-2">
            We accept:
            <span className="flex items-center gap-1.5 ml-1">
              {PAYMENT_BADGES.map((p) => (
                <span
                  key={p.label}
                  className="border rounded px-1.5 py-0.5 text-[10px] font-medium"
                  style={{ borderColor: `${p.color}55`, color: p.color, backgroundColor: "#ffffff" }}
                >
                  {p.label}
                </span>
              ))}
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-white mb-3">{title}</p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
            <Link href={l.href} className="text-sm hover:text-white transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
