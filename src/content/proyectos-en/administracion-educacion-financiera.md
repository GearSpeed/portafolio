---
titulo: Administrative panel · Mexico and Guatemala
subtitulo: Content, metrics and reports for the financial education platform
cliente: Banco Azteca · Grupo Salinas
tipo: cliente
rol: Sole author of the panel in both countries
periodo: Aug 2025 – present
estado: In production
categoria: negocio
sector: Banco Azteca · Fintech
orden: 2
resumen: The panel Banco Azteca uses to run its financial education platform in Mexico and Guatemala. I built it from scratch in Filament 5 and took it to the second country.
problema: Publishing a course, changing a banner or knowing how many people were studying went through a developer and manual database queries.
solucion: A Filament 5 panel with manageable roles and permissions, a drill-down metrics dashboard and streaming Excel export built on a single counting rule.
resultado: The client runs its own content, and the panel and the Excel report cannot contradict each other. That is how 127 orphaned enrollments in Guatemala came to light.
cifras:
  - valor: '~74'
    etiqueta: PHP classes in the panel, all written by me
  - valor: '114'
    etiqueta: files (~6,900 lines) to bring it to Guatemala
  - valor: 127 of 307
    etiqueta: orphaned enrollments detected in Guatemala
  - valor: '0'
    etiqueta: rows deleted in production when fixing the inflated figures
stack:
  - Filament 5
  - Laravel 11
  - PHP 8.5
  - Livewire
  - MySQL 8
  - OpenSpout
  - spatie/laravel-permission
portada: ../../assets/proyectos/administracion-educacion-financiera.webp
portadaAlt: Dashboard of the administrative panel in Filament, with the content menu, the metric cards and the enrollments-per-year chart, with the figures hidden.
descripcionSeo: Filament 5 administrative panel for Banco Azteca's financial education platform in Mexico and Guatemala. Content, metrics and Excel reports.
---

## Context

This is the panel of [Banco Azteca's financial education platform](/en/projects/plataforma-educacion-financiera/) in **Mexico and Guatemala**, both installations in production. The platform already existed as a course site; the panel did not. I am the **sole author** of the panel in both countries. Honduras has [another panel](/en/projects/administracion-educacion-financiera-honduras/), built from scratch with a different stack.

## The problem

The site had the student area and some scattered legacy settings screens, but **no content management**. Publishing a course, changing the home banner or knowing how many people were studying required a developer and manual database queries.

## What I built

### Content management (Filament 5)

An administrative panel with **roles and permissions** managed from the panel itself. It has full resources for courses, modules, sessions and lessons, students, users, certificates, FAQs and the home carousel. I also built custom settings pages (welcome banner, social networks) that write to the table the frontend already read.

- **Reordering modules and sessions by dragging**, instead of typing sequence numbers.
- **Image uploads with validation and recommended sizes** on every field. It came from a real problem: banners were uploaded with the wrong aspect ratio and looked distorted on mobile.

### Metrics and reports

- **Dashboard with widgets**: enrolled students, module enrollments, students with completed modules, certificates issued, enrollments per year, and progress per course and module with the completion percentage colored by thresholds.
- Every card is **drill-down**: it leads to the list of people behind the number.
- **Streaming Excel export** with OpenSpout: the report is never loaded into memory. It is a workbook with a summary, a general sheet and one sheet per year.
- The rule for "who counts as a student" lives **in one place**, shared by the widgets, the detail page and the exporter, so the panel and the Excel report cannot contradict each other.

### Bringing it to Guatemala

Mexico and Guatemala share a codebase. I ported the full panel to the Guatemala installation: **114 files and about 6,900 lines**, now in production.

## The report was right

Already in production, the Guatemala panel showed **69 students and 125 enrolled**, but the Excel report had **3 rows**. I did not adjust the number to make it match: I went looking for the reason.

The database carried **orphaned rows**: enrollments, certificates and roles pointing to users that had been hard-deleted without cleaning their related tables. The widgets counted over the pivot tables without checking that the person existed, so they added up ghosts. The report went through the users table, so it only saw the real ones.

| Table | Total | Orphaned |
| --- | --- | --- |
| Enrollments | 307 | 127 |
| Certificates | 42 | 20 |

There was also a deeper problem: **only 3 of 94 users had a role assigned** while 79 were enrolled. Any report filtered by role would come out empty by design.

I solved it by centralizing the counting rule **without deleting anything in production**: orphaned rows are ignored, not removed. I verified every figure against direct SQL before deploying, and took both root causes to the client (nobody assigns the role, and users are deleted without cleaning their data) instead of leaving them hidden behind the fix.

## How I worked

Development supported by an AI agent (Claude Code). I direct every technical decision, review the results and approve every step to production.
