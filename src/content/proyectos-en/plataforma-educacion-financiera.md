---
titulo: Financial education platform
subtitulo: Public site, local environment and deployment in two countries · Mexico and Guatemala
cliente: Banco Azteca · Grupo Salinas
tipo: cliente
rol: E-learning Technical Lead · lead developer and deployment owner
periodo: Aug 2025 – present
estado: In production
categoria: web
sector: Banco Azteca · Fintech
orden: 1
destacado: true
resumen: Banco Azteca's free financial education platform. I am its lead developer in Mexico and Guatemala. I rebuilt the public site, set up the local environment and deployed it in a second country.
problema: The site could not run outside the client's server, banners broke on mobile, lesson navigation skipped sessions and Guatemala still had to be deployed.
solucion: A manageable, responsive public site, a local environment with Docker Compose, a fix for signed URLs behind the AWS load balancer and the Guatemala deployment.
resultado: Two installations in production, Guatemala launched on a shared server with no service impact, and a project that now runs locally.
cifras:
  - valor: 140 / 184
    etiqueta: commits in the Mexico repository are mine
  - valor: '2'
    etiqueta: installations in production, Mexico and Guatemala
stack:
  - Laravel 11
  - PHP 8.5
  - MySQL 8
  - Blade
  - Bootstrap 5
  - Vite
  - AWS
  - Cloudflare
  - Docker Compose
portada: ../../assets/proyectos/plataforma-educacion-financiera.webp
portadaAlt: Public home page of Banco Azteca's financial education platform in Mexico, inviting visitors to sign up for the diploma course.
descripcionSeo: Case study of Banco Azteca's financial education platform. Public site, local environment, AWS and deployment in Guatemala.
---

## Context

This is **Banco Azteca's free financial education platform**: online courses with modules, sessions, video lessons, progress tracking and certificates. I am the lead developer of the platform and of its installations in **Mexico and Guatemala**, both in production. The third one, Honduras, has [its own case study](/en/projects/plataforma-educacion-financiera-honduras/).

It is client work within Grupo Salinas: the platform already existed as a course site. What it lacked to be run and measured, the administrative panel, has [its own case](/en/projects/administracion-educacion-financiera/).

## What I built

### Public site

A manageable hero carousel (image or video), per-course banners, **demo modules** open to visitors with sign-up to continue, and banners rebuilt so they no longer broke on mobile. I also fixed lesson navigation, which jumped to the next session instead of the next lesson, and the progress calculation, which ignored the total number of lessons in the module.

### Infrastructure and deployment

- I set up a **local environment with Docker Compose** that did not exist before, with a README and dump loading. I also removed a dependency on the client's server that prevented running the project locally.
- **Mexico on AWS**: I diagnosed and fixed a failure in signed URLs behind the load balancer. I participated in the development and production architecture (load balancer and S3) and in certifying the application at **IEECO**, the internal certification platform of Grupo Salinas.
- **Guatemala to production**, on a shared server with no documentation: I verified the configuration serving the site before touching anything and deployed it with no service impact. I resolved a `composer` block caused by PHP version caps after checking the history to confirm those dependencies were already installed that way.

## How I worked

Development supported by an AI agent (Claude Code). I direct every technical decision, review the results and approve every step to production.
