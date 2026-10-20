---
titulo: Una vez más · Website
subtitulo: A prerendered sales site with a live catalog from the management system
cliente: Amaranth sweets and bakery business in Mexico
tipo: propio
rol: Product Owner and Front-End Developer
periodo: Sep 2026 – present
estado: In production
categoria: web
sector: Retail · Online sales
orden: 6
resumen: The public website of Una vez más. It is static, fast and SEO-optimized; it pulls the catalog, prices and availability live from the management system and closes the sale on WhatsApp with the order already written.
problema: The business needed to sell online without a server to maintain, with a catalog Google could index, in sync with the real inventory and without promising what the product is not.
solucion: Angular 21 prerendered on Cloudflare Pages. The catalog is fetched at build time so Google can index it, and the browser fetches it again to show current prices and availability.
resultado: Every product has its own indexable page, a new price or a sold-out item shows up without redeploying, and an automated check keeps misleading claims from coming back.
cifras:
  - valor: 0 redeploys
    etiqueta: to show a new price or a sold-out product
  - valor: 2 regulations
    etiqueta: LFPC and NOM-051, with automated claim checks
  - valor: '~1,600'
    etiqueta: lines of TypeScript, plus ~2,500 of HTML templates
stack:
  - Angular 21
  - Static prerendering (SSG)
  - Tailwind CSS v4
  - Cloudflare Pages
  - TypeScript
  - schema.org / JSON-LD
  - Vitest
  - Prettier
enlaces:
  - texto: Visit unavezmasmx.com
    href: https://www.unavezmasmx.com/
portada: ../../assets/proyectos/una-vez-mas-sitio-web.webp
portadaAlt: Catalog of the Una vez más website, with category filters, each product's availability and buttons to order on WhatsApp.
descripcionSeo: Case study of the Una vez más sales website. Angular 21 prerendered on Cloudflare Pages, a live catalog, technical SEO and WhatsApp checkout.
---

## Context

**Una vez más** is a real business selling Mexican amaranth sweets: alegrías, cookies and borrachitos. This is its **public website and sales funnel**. The sibling project is [the management system](/en/projects/una-vez-mas/) the business uses to run inventory, sales and finance, and together they form a single product.

Customers in Mexico buy through WhatsApp, so the site has no cart or payment gateway. Each product or order opens WhatsApp with **the message already written**, and a floating WhatsApp button is always at hand.

I turned the design into code, integrated it with the management system and deployed it. The first commit is from September 17, 2026, and it is in production at [unavezmasmx.com](https://www.unavezmasmx.com/), on Cloudflare Pages, with continuous deployment on every push to `main`.

## What it does

- **Pages**: a home page with the "House Favorites", the category cards and the amaranth section; a catalog with category filters; one page per product; About; Contact with FAQs; and a real 404 page.
- **Product detail as a child route** (`/catalogo/:slug`): it opens over the grid, the link can be shared and each product becomes HTML Google can index.
- **Its own link-in-bio page** (`/enlaces`) for Instagram and TikTok, without header or footer.
- **Volume discounts** per category, announced on the home page.
- **Mobile-first responsive design**, with a side menu and scroll locking when modals open.

## Static and live at the same time

The site is built with **Angular 21 and static prerendering**. The build generates a plain HTML file per page and per product, so there is no Node server in production: just files on Cloudflare's CDN.

The content combines the best of both worlds:

- **At build time**, a script fetches the catalog from the management system and embeds it in the HTML. That is what Google indexes and what visitors without JavaScript see.
- **In the browser**, the catalog is fetched again on load. A new price or a sold-out product shows up within minutes without redeploying; a redeploy is only needed when a new product arrives, so it gets its own page.
- **If the API fails, nothing breaks**: the build uses the copy stored in the repository and warns in the log, and the browser keeps what it already had.

## A clear contract with the management system

- **The site never touches the database.** It reads a public, read-only API with a documented contract.
- It only receives **availability** ("available", "last pieces", "sold out"), never the exact stock, so competitors cannot infer the sales volume.
- **The business manages content without coding**: products, photos, prices, descriptions, the home page favorites and the category cards are entered in the management system. The repository only holds the layout and the brand copy, in typed JSON validated on load.

## SEO and performance

- Prerendered, indexable HTML per page and per product, with `canonical`, Open Graph and share images for social networks.
- **schema.org JSON-LD** on every product, with its **real availability**, so Google does not advertise what is sold out.
- A `sitemap.xml` generated on every build from the catalog, plus `robots.txt`.
- Redirects for old slugs and **a real 404**: the URL responds with 404 and still shows the branded page.
- **Caching by file type**: bundles are hashed and marked `immutable`, images are cached for a week with `stale-while-revalidate` and the HTML is revalidated.
- **Security headers**: `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` and COOP.
- Images processed to the size at which they are used.

## Legal compliance of the content

This is what sets the project apart. The business resells an **industrially produced** product, so I audited the site against the **LFPC**, Mexico's consumer protection law that penalizes misleading advertising, and **NOM-051**, which limits labeling and health claims:

- I removed the claims that could not be backed up, such as "artisanal", "handmade", "fair trade", "no middlemen" or "70 % cocoa". Each one was checked with the supplier.
- The brand voice changed from "we make it" to **"we choose it"**.
- There are no health claims about the sweet: nutritional value is attributed to the amaranth grain.
- **An automated check** searches for the banned phrases in the code and in the built HTML. It normalizes whitespace to catch phrases the formatter split across lines.
- The script that fetches the catalog runs the descriptions entered in the system through the same list and warns in the log, because whoever enters a product does not read the README.
- The figures on the home page come from the catalog, not from hand-written numbers, so they never go stale or become false.

## Quality

- **Vitest** tests for the frontend and the build scripts, including the catalog download and its fallback when the API does not respond.
- **Strict TypeScript** and Prettier.
- **A custom design system**, "Herencia y Alegría Artesanal", with tokens in Tailwind CSS v4, ported from a Google Stitch mockup.

## How I worked

I am the product owner: I decide what gets built and in what order. I developed it with the support of an AI agent (Claude Code) and approve every change to production.
