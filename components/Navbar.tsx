"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSupport,
  HiOutlineSearch,
  HiChevronDown,
} from "react-icons/hi";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import api from "@/lib/api";
import TopBar from "./TopBar";
import type { Category } from "@/lib/types";
import type { ReactNode } from "react";

const LINKS = [
  { href: "/", label: "Home", exact: true },
  { href: "/products", label: "Shop" },
  { href: "/brands", label: "Brands" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthed, user, logout } = useAuth();
  const cart = useCart();
  const wishlist = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    api.getCategories().then((res) => setCategories(res.data.slice(0, 8))).catch(() => {});
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/products?keyword=${encodeURIComponent(query.trim())}` : "/products");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-shadow ${
        scrolled ? "shadow-[0_1px_0_0_var(--line)] bg-paper/90 backdrop-blur" : "bg-paper"
      }`}
    >
      <TopBar isAuthed={isAuthed} />

      <div className="container-page flex h-16 items-center gap-4 lg:gap-8">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl tracking-tight shrink-0">
          <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shrink-0">
            <HiOutlineShoppingBag size={18} />
          </span>
          Shop<span className="text-primary">Mart</span>
        </Link>

        <form onSubmit={onSearch} className="hidden md:flex flex-1 max-w-md relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands and more…"
            className="w-full rounded-full border border-line bg-paper pl-4 pr-11 py-2 text-sm focus:outline-none focus:border-primary"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
          >
            <HiOutlineSearch size={16} />
          </button>
        </form>

        <nav className="hidden lg:flex items-center gap-7 text-sm shrink-0">
          {LINKS.map((l) => {
            const active = l.exact ? pathname === l.href : pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative py-1 transition-colors hover:text-primary ${
                  active ? "text-primary" : "text-ink-soft"
                }`}
              >
                {l.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary"
                  />
                )}
              </Link>
            );
          })}

          <div className="relative group">
            <Link
              href="/categories"
              className={`flex items-center gap-1 py-1 transition-colors hover:text-primary ${
                pathname?.startsWith("/categories") ? "text-primary" : "text-ink-soft"
              }`}
            >
              Categories <HiChevronDown size={14} />
            </Link>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-56 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-150 z-50">
              <div className="bg-paper-raised border border-line rounded-lg shadow-lg overflow-hidden py-1.5">
                {categories.map((c: Category) => (
                  <Link key={c._id} href={`/categories/${c._id}`} className="block px-4 py-2 text-sm hover:bg-black/5">
                    {c.name}
                  </Link>
                ))}
                <Link href="/categories" className="block px-4 py-2 text-sm text-primary font-medium hover:bg-black/5 border-t border-line mt-1 pt-2.5">
                  View all categories
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
          <Link
            href="/contact"
            className="hidden xl:flex items-center gap-2 rounded-full border border-line pl-1.5 pr-3 py-1 hover:border-primary transition-colors mr-1"
          >
            <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
              <HiOutlineSupport size={15} />
            </span>
            <span className="leading-none">
              <span className="block text-[10px] text-ink-soft">Support</span>
              <span className="block text-xs font-medium text-primary">24/7 Help</span>
            </span>
          </Link>

          <IconLink href="/wishlist" count={wishlist?.items?.length} label="Wishlist">
            <HiOutlineHeart size={22} />
          </IconLink>
          <IconLink href="/cart" count={cart?.count} label="Cart" bump={!!cart?.bumpId}>
            <HiOutlineShoppingBag size={22} />
          </IconLink>

          {isAuthed ? (
            <div className="relative group hidden sm:block">
              <button className="w-9 h-9 rounded-full border border-line flex items-center justify-center hover:border-primary transition-colors" aria-label="Account">
                <HiOutlineUser size={18} />
              </button>
              <div className="absolute right-0 top-full pt-2 w-52 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-150">
                <div className="bg-paper-raised border border-line rounded-lg shadow-lg overflow-hidden">
                  <p className="px-4 py-3 text-sm text-ink-soft border-b border-line truncate">
                    {user?.name || "My account"}
                  </p>
                  <Link href="/account/profile" className="block px-4 py-2.5 text-sm hover:bg-black/5">Profile</Link>
                  <Link href="/orders" className="block px-4 py-2.5 text-sm hover:bg-black/5">Orders</Link>
                  <Link href="/account/address" className="block px-4 py-2.5 text-sm hover:bg-black/5">Addresses</Link>
                  <Link href="/account/change-password" className="block px-4 py-2.5 text-sm hover:bg-black/5">Change password</Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-black/5">
                    Log out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center w-9 h-9 rounded-full border border-line justify-center hover:border-primary transition-colors"
              aria-label="Sign in"
            >
              <HiOutlineUser size={18} />
            </Link>
          )}

          <button
            className="lg:hidden p-2 rounded-full hover:bg-black/5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-line bg-paper"
          >
            <div className="container-page py-4 flex flex-col gap-1">
              <form onSubmit={onSearch} className="relative mb-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full rounded-full border border-line bg-paper pl-4 pr-11 py-2 text-sm"
                />
                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <HiOutlineSearch size={16} />
                </button>
              </form>
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="py-2.5 text-sm">
                  {l.label}
                </Link>
              ))}
              <Link href="/categories" className="py-2.5 text-sm">Categories</Link>
              <Link href="/contact" className="py-2.5 text-sm">Support 24/7</Link>
              <div className="h-px bg-line my-2" />
              {isAuthed ? (
                <>
                  <Link href="/account/profile" className="py-2.5 text-sm">Profile</Link>
                  <Link href="/orders" className="py-2.5 text-sm">Orders</Link>
                  <Link href="/account/address" className="py-2.5 text-sm">Addresses</Link>
                  <Link href="/account/change-password" className="py-2.5 text-sm">Change password</Link>
                  <button onClick={logout} className="py-2.5 text-sm text-left text-danger">Log out</button>
                </>
              ) : (
                <Link href="/login" className="py-2.5 text-sm text-primary">Sign in</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function IconLink({
  href,
  count,
  label,
  children,
  bump,
}: {
  href: string;
  count?: number;
  label: string;
  children: ReactNode;
  bump?: boolean;
}) {
  return (
    <Link href={href} className="relative p-2 rounded-full hover:bg-black/5 transition-colors" aria-label={label}>
      {children}
      <AnimatePresence>
        {!!count && (
          <motion.span
            key={count}
            initial={{ scale: bump ? 1.6 : 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-semibold flex items-center justify-center"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
