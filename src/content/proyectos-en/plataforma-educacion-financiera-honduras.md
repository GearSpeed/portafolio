---
titulo: Financial education platform · Honduras
subtitulo: Diagnosing a legacy system and a CNBS requirement
cliente: Banco Azteca Honduras · UCENM and UCRISH
tipo: cliente
rol: Sole developer and deployment owner
periodo: 2026 – present
estado: In production
categoria: web
sector: Banco Azteca Honduras · Fintech
orden: 3
destacado: true
resumen: The Honduran installation of the platform, a diploma course for UCENM and UCRISH students. I fixed failures that had gone undetected for years and implemented a CNBS requirement.
problema: A legacy system with no tests, failures hidden for years and a new requirement from the Honduran banking regulator (CNBS).
solucion: A measured diagnosis of every failure before touching code, and an Impact Assessment locked on the server, designed for mobile.
resultado: Password recovery working again and 151 graduates invited to the assessment without a single failure.
cifras:
  - valor: 95 s → 0.17 s
    etiqueta: password recovery, broken since 2020
  - valor: '151'
    etiqueta: graduates invited to the CNBS assessment, with no failures
  - valor: 8 → 2 vCPU
    etiqueta: recommended server after measuring fifteen days of logs
stack:
  - Laravel 11
  - PHP 8.5
  - Blade
  - MariaDB
  - AWS EC2
  - Apache
portada: ../../assets/proyectos/plataforma-educacion-financiera-honduras.webp
portadaAlt: Public home page of the financial education platform in Honduras, with its online personal finance courses.
descripcionSeo: Banco Azteca's financial education platform in Honduras. Diagnosing a legacy system and a CNBS requirement delivered end to end.
---

## Context

Honduras is the third installation of [Banco Azteca's financial education platform](/en/projects/plataforma-educacion-financiera/): an online financial education diploma course for students of local universities (**UCENM** and **UCRISH**), with modules, lessons, per-module certificates and a final diploma. It has about 500 accounts. I am the **sole developer** of the site.

It is a legacy system: years-old code, no tests, commented-out fragments and decisions piled up by several authors. The work splits into three fronts: fixing real failures, building the panel that did not exist and implementing regulator requirements. The panel, built from scratch in NestJS and Angular, has [its own case study](/en/projects/administracion-educacion-financiera-honduras/).

## Impact Assessment: a CNBS requirement

The National Banking and Insurance Commission (CNBS) requires measuring the program's impact. I implemented the full 14-question questionnaire as a **three-step full-screen wizard**, designed for mobile, which is where most students study. It saves progress at every step so nobody loses their answers.

- **The lock lives on the server, not on the screen.** Without a completed assessment, no diploma is issued. A dialog can be closed with Escape; a condition in diploma issuance cannot. The three places in the code that issue diplomas check the same verification.
- **It is enabled per course** through a configuration column, not with an identifier hardcoded in the code.
- The questionnaire lives **in a single file**, from which the screen, the per-step validation and the export are generated.
- **Before coding it, I audited the instrument** sent by the institution. I found overlapping age ranges, a gap between two income ranges and a question whose scale did not match what it asked. I documented them, proposed fixes and the institution accepted them.

To reach the **151 graduates** who finished before the assessment existed, and whom the lock no longer covered, I wrote an email invitation command with a dry-run mode, a test send and a log of who was invited, so running it again does not duplicate messages. All 151 emails went out without a single failure.

## Diagnosing a legacy system

### Password recovery, broken since 2020

The link in the email returned a 500 error. The token lookup went through **every row** of the table, running bcrypt on each one. Measured on the server: **72 ms per row × 1,313 rows = 95 seconds**, against a PHP execution limit of 30. It did not fail sometimes: it could never finish.

I reproduced it, measured it and brought it down to **0.17 s**. The logs told the story: recovery attempts per year since 2020 were 608, 473, 195, 25 and 2. That was people giving up.

### Other failures

- **A column missing in production**: it existed in the local database but never reached the server, because it had been added by hand. I solved it with a guarded migration, so it runs in both environments.
- **Raw validation messages**: the Spanish language file had two messages out of twenty-something; the rest were shown to users as `validation.between.numeric`.

## The 403 that was not ours

A student was reported as unable to finish the course because of a **403 Forbidden** error on some lessons. Before accepting the report, I checked it layer by layer:

1. The application **does not generate any 403 response** anywhere in its code.
2. Across fourteen days of logs, all **968 responses with a 403** came from automated crawlers probing nonexistent routes. None from a real page.
3. I searched for the student by email, ID document, student number and name, including deactivated accounts and the neighboring country's database. No such student existed. The audit log had no trace of that email either.

The screenshot I asked for closed the case: the address bar showed **a different domain and a different platform**. The error was never in the system being reported.

> Do not take a problem description at face value, and back the conclusion with reproducible evidence before communicating it to the client.

## Sizing measured, not estimated

Ahead of a server migration, I split fifteen days of web server logs by domain to isolate each site's footprint. The server at the time (**8 vCPU and 31 GB**) was at **2.9 % memory with a load of 0.00**, and the real peak was **one request per second**. I recommended **2 vCPU and 4 GB**. I also found that of the 35 GB in use, 27 were old copies that did not need to be migrated.

I deliver these analyses as PDF documents with charts, ready to circulate with the client.

## How I worked

Development supported by an AI agent (Claude Code). I set the approach, question the results and explicitly authorize every change to production, with the rule of testing locally first.
