---
titulo: Una vez más · Management
subtitulo: Inventory, sales and finance for a real bakery business
cliente: Cookie and bakery business in Mexico
tipo: propio
rol: Product Owner and Full-Stack Developer
periodo: Sep 2026 – present
estado: In production · daily use
categoria: negocio
sector: Retail · Bakery
orden: 5
resumen: A real business ran purchases, inventory and sales in an Excel file. In a few weeks I took it to a production web system that the owner and the sales team use every day.
problema: Everything lived in an Excel file with no users or permissions. Nobody knew how much stock each salesperson carried and the real profit was invisible.
solucion: A typed monorepo (Angular 22, NestJS, Drizzle, PostgreSQL 18) with a shared package that does all money calculations with exact decimals.
resultado: Inventory by location, a mobile point of sale and financial reports in production, with more than 300 tests and WCAG 2.1 AA on every screen.
cifras:
  - valor: 300+
    etiqueta: automated tests (170+ integration and 88 E2E)
  - valor: '~17,500'
    etiqueta: lines of TypeScript, not counting tests
  - valor: '27'
    etiqueta: database migrations with hand-written permissions
stack:
  - Angular 22
  - NestJS
  - Drizzle ORM
  - PostgreSQL 18
  - Zod
  - big.js
  - Docker Compose
  - Cloudflare Tunnel
  - Cloudflare Access
  - Cloudflare R2
  - GitHub Actions
  - Vitest
  - Testcontainers
  - Playwright
portada: ../../assets/proyectos/una-vez-mas.webp
portadaAlt: Home screen of the Una vez más management system, with quick actions, a sales summary and products running low; the figures are hidden.
descripcionSeo: Case study of Una vez más, an inventory, sales and finance system in production for a real bakery business. Angular 22, NestJS, PostgreSQL and Cloudflare.
---

## Context

**Una vez más** is a real cookie and bakery business in Mexico. It ran purchases, inventory and sales in an Excel file: there were no users or permissions, nobody knew how much stock each salesperson carried and the real profit was invisible.

I designed, built and deployed it, and I run it. The first commit is from September 21, 2026, and within a few weeks the system was **in production**, used every day by the owner and the sales team. It keeps the calculation rules from the Excel file, such as spreading each purchase's fuel cost across the pieces, and adds what was missing.

## Features

- **Purchases**: each purchase is a trip to a supplier, with the fuel cost prorated per piece.
- **Inventory by location**: the warehouse plus one location per salesperson, with transfers, shrinkage, adjustments, physical counts and an **immutable ledger** of movements.
- **Moving weighted average cost** per product: the profit of each sale is calculated with the cost the product had at that moment.
- **Mobile point of sale**: salespeople charge from their phones, only with the stock they carry, with mixed payments (cash, transfer and card). The card terminal fee is calculated automatically.
- **Bank transfer payments**: the CLABE account number is validated with its check digit and the salesperson can show the bank QR code on screen.
- **Returns** with partial refunds, including the share of the fee the terminal gives back.
- **Salesperson commissions** on profit, with a balance owed and a payment log.
- **Finance**: expenses by category, partner contributions and withdrawals kept apart from profit, an income statement and "Where is the money", the balance per cash pocket.
- **Reports** by day, product, salesperson, channel and payment method; cash closing; a price simulator; CSV and Excel export with charts.
- **AI-assisted catalog**: photos processed on the server (resized and stripped of GPS metadata) and product descriptions generated with the OpenAI API.
- **[Public website](/en/projects/una-vez-mas-sitio-web/)** fed by a cached, read-only API that publishes availability (available, last pieces, sold out), never the exact stock.

## A correct accounting model

The most delicate part of the project is not the interface but making the numbers add up. The model covers weighted average cost, fuel proration, terminal and salesperson commissions, partial returns, partner capital kept apart from profit and balances per cash pocket.

All money calculations live in a **shared package** and use **exact decimals** (big.js, never `number`). The API and the frontend call the same functions, so they always produce the same number. The model is tested against the figures of the original Excel file.

## Architecture

- **Monorepo** with npm workspaces and strict TypeScript end to end.
- **Backend**: NestJS, Drizzle ORM and PostgreSQL 18, with Zod validation, structured errors in Spanish and **idempotency** on every document (sales, purchases and expenses).
- **Frontend**: Angular 22 with standalone components, signals, `httpResource` and OnPush, and Angular Material 3 with a custom theme. It is designed mobile first.
- **Infrastructure**: Docker Compose on a VPS. **Cloudflare Tunnel** keeps the app from opening ports to the internet, **Cloudflare Access** acts as the login (the API validates its JWT) and **R2** stores images and backups.
- **CI/CD**: GitHub Actions runs lint and tests and builds an image tagged per commit in GHCR. Deployments use an **exact SHA**, never `latest`, with automatic migrations on startup.

## Security and data

- **Defense in depth**: Cloudflare Access to get in and role permissions with a guard that **denies by default** any route that does not declare its permission. The API filters costs and margins by role: a salesperson never receives them.
- **Three separate Postgres roles** (owner, app and website read-only). The app cannot delete or rewrite the ledger, and permissions live in hand-written migrations.
- **The public website never touches the database.** I deliberately ruled out exposing Postgres through the tunnel.
- **Daily backups** with `pg_dump`, encrypted with rclone crypt in a bucket with locked retention, and a tested restore procedure.
- **Audit log** of sensitive changes and a hardened server: SSH with keys only, fail2ban and a deny-by-default firewall.

## Quality

| Type | Tool | Scope |
| --- | --- | --- |
| Unit | Vitest | All three monorepo packages |
| Integration | Testcontainers | 170+ API tests against real PostgreSQL 18 |
| End-to-end | Playwright | 88 tests, on desktop and mobile |
| Accessibility | axe | WCAG 2.1 AA on every screen, as a requirement |

## How I worked

I am the product owner: I decide what gets built and in what order. I develop with the support of an AI agent (Claude Code) and approve every step to production.
