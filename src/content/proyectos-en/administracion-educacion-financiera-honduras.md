---
titulo: Administrative panel · Honduras
subtitulo: NestJS 11 + Angular 21 from scratch on top of a legacy database
cliente: Banco Azteca Honduras · UCENM and UCRISH
tipo: cliente
rol: Sole author of the panel
periodo: 2026 – present
estado: In production
categoria: negocio
sector: Banco Azteca Honduras · Fintech
orden: 4
resumen: The internal tool used to run the financial education platform in Honduras, with per-institution metrics and Excel reports. Fully authored by me, from scratch.
problema: There was no panel at all, and universities were not modeled as a relation. UCENM showed 0 students and there was no way to measure by institution.
solucion: A NestJS 11 + TypeORM API over a legacy schema I do not control and an Angular 21 frontend, kept off the internet and running with least privilege.
resultado: Eight screens, per-institution metrics that did not exist, reports ready to deliver and 46 duplicate student numbers exposed as a permanent warning.
cifras:
  - valor: 0 → 318
    etiqueta: UCENM students visible in the metrics
  - valor: '8'
    etiqueta: screens, from users to the CNBS assessment
  - valor: '125'
    etiqueta: files across API and frontend, all written by me
  - valor: '46'
    etiqueta: duplicate student numbers detected, affecting 123 students
stack:
  - NestJS 11
  - TypeORM
  - Angular 21
  - Angular Material
  - Chart.js
  - ExcelJS
  - MariaDB
portada: ../../assets/proyectos/administracion-educacion-financiera-honduras.webp
portadaAlt: Dashboard of the Honduras administrative panel, with the overview, enrollments per course and users per department, with the figures hidden.
descripcionSeo: NestJS and Angular administrative panel for Banco Azteca's financial education platform in Honduras. Per-institution metrics and Excel reports.
---

## Context

This is the panel of the [financial education platform in Honduras](/en/projects/plataforma-educacion-financiera-honduras/), the third installation of the product. Unlike Mexico and Guatemala, which use [another panel](/en/projects/administracion-educacion-financiera/), there was none here: I built it **from scratch and I am its sole author**.

It is an internal tool, **not exposed to the internet**, that runs with least privilege over the production database.

## What I built

- **NestJS 11 + TypeORM API** with `synchronize: false` over a legacy schema I do not control, and modules by domain.
- **Angular 21 frontend** with standalone components, signals and the `@if`/`@for` control flow, plus Angular Material and Chart.js.
- **Eight screens**: dashboard, users, content, courses, certificates, institutions, FAQs and impact assessment.
- **Excel export** across several sheets, designed to be delivered as a report.
- I put it under version control, because it lived in a single copy with no backup, making sure no credential was published.

## From zero to 318 students

Universities were not modeled with foreign keys but in a key/value table, with **two different keys** coexisting for the same thing. I rebuilt the relation with CTEs and conditional aggregates, and UCENM went from showing **0 students to 318**, broken down by degree, progress and certificates.

Along the way I found that the "with student number" figure counted distinct values instead of people: it showed 240 when there were 317. Fixing it surfaced a data problem on the client's side, **46 duplicate student numbers affecting 123 students**, 17 of them with the student number "1". It is now shown as a permanent warning in the panel.

## How I worked

Development supported by an AI agent (Claude Code). I set the approach, question the results and explicitly authorize every change to production, with the rule of testing locally first.
