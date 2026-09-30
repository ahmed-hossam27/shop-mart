import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToasterProvider from "@/components/ToasterProvider";

// Every page needs a signed-in user's cart/wishlist state at request time,
// so the app renders dynamically — but individual data fetches (categories,
// brands, products) are still cached via `next.revalidate` in lib/api.js,
// so repeat navigations reuse that cached data instead of hitting the
// external API every time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ShopMart — Everyday goods, considered",
  description:
    "ShopMart is a curated marketplace for everyday goods — browse products, brands and categories, and check out in seconds.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ToasterProvider />
              <Navbar />
              <main className="min-h-[70vh]">{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
