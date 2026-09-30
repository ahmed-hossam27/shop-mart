# ShopMart — Next.js E-Commerce (Route Academy Final Project)

A full-stack-feel e-commerce storefront built with **Next.js (App Router)**,
**Tailwind CSS v4**, and **Framer Motion**, wired to the Route Academy
e-commerce API: `https://ecommerce.routemisr.com/api/v1`.

## Features

- **Auth:** Login, Register, Forgot Password (email → code → reset), Change Password
- **Homepage:** animated hero, category strip, featured products, value props, brand grid
- **Catalogue:** product/brand/category listing and detail pages, search & sort
- **Cart:** add / remove / update quantity, animated line items, live totals
- **Wishlist:** add / remove, heart micro-interaction
- **Checkout:** saved or manual shipping address, Cash or Online payment
- **Orders:** full order history pulled from the API
- **Addresses:** add / remove saved addresses

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm run start
```

## Notes on the API

- The API expects the auth token on a plain `token` request header (not
  `Authorization: Bearer …`) — see `lib/api.js`.
- Base URL is hard-coded in `lib/api.js`. If you need to point at a different
  environment, that's the only place to change it.
- Online payment (`/orders/checkout-session/:cartId`) redirects to a Stripe
  Checkout session URL returned by the API.

## Project structure

```
app/            routes (App Router)
components/     shared UI (Navbar, Footer, ProductCard, ProductDetail, ui.js, ...)
context/        AuthContext, CartContext, WishlistContext
lib/api.js      single place all API calls go through
```
