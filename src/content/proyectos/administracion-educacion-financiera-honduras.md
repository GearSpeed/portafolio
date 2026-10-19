---
titulo: Panel administrativo · Honduras
subtitulo: NestJS 11 + Angular 21 desde cero sobre una base heredada
cliente: Banco Azteca Honduras · UCENM y UCRISH
tipo: cliente
rol: Autor único del panel
periodo: 2026 – hoy
estado: En producción
categoria: negocio
sector: Banco Azteca Honduras · Fintech
orden: 4
resumen: La herramienta interna con la que se opera la plataforma de educación financiera en Honduras, con métricas por institución e informes en Excel. Autoría completa, desde cero.
problema: No existía ningún panel, y las universidades no estaban modeladas como relación. UCENM aparecía con 0 alumnos y no había forma de medir por institución.
solucion: API en NestJS 11 + TypeORM sobre un esquema heredado que no controlo y frontend en Angular 21, fuera de internet y con privilegios mínimos.
resultado: Ocho pantallas, métricas por institución que no existían, informes listos para entregar y 46 matrículas duplicadas expuestas como aviso permanente.
cifras:
  - valor: 0 → 318
    etiqueta: alumnos de UCENM visibles en las métricas
  - valor: '8'
    etiqueta: pantallas, de usuarios a la evaluación de la CNBS
  - valor: '125'
    etiqueta: archivos entre API y frontend, todos de mi autoría
  - valor: '46'
    etiqueta: matrículas duplicadas detectadas, que afectaban a 123 alumnos
stack:
  - NestJS 11
  - TypeORM
  - Angular 21
  - Angular Material
  - Chart.js
  - ExcelJS
  - MariaDB
portada: ../../assets/proyectos/administracion-educacion-financiera-honduras.webp
portadaAlt: Dashboard del panel administrativo de Honduras, con el resumen general, inscritos por curso y usuarios por departamento, con las cifras ocultas.
descripcionSeo: Panel administrativo en NestJS y Angular de la plataforma de educación financiera de Banco Azteca en Honduras. Métricas por institución e informes en Excel.
---

## Contexto

Es el panel de la [plataforma de educación financiera en Honduras](/proyectos/plataforma-educacion-financiera-honduras/), la tercera instalación del producto. A diferencia de México y Guatemala, que usan [otro panel](/proyectos/administracion-educacion-financiera/), aquí no existía ninguno: lo construí **desde cero y soy su autor completo**.

Es una herramienta interna, **no expuesta a internet**, que opera con privilegios mínimos sobre la base de producción.

## Lo que construí

- **API en NestJS 11 + TypeORM** con `synchronize: false` sobre un esquema heredado que no controlo, y módulos por dominio.
- **Frontend en Angular 21** con componentes standalone, signals y el control de flujo `@if`/`@for`, más Angular Material y Chart.js.
- **Ocho pantallas**: dashboard, usuarios, contenido, cursos, certificados, instituciones, FAQs y evaluación de impacto.
- **Exportación a Excel** en varias hojas, pensada para entregarse como informe.
- Lo puse bajo control de versiones, porque vivía en una sola copia sin respaldo, cuidando que no se publicara ninguna credencial.

## De cero a 318 alumnos

Las universidades no estaban modeladas con llaves foráneas sino en una tabla clave/valor, con **dos claves distintas** conviviendo para lo mismo. Reconstruí la relación con CTEs y agregados condicionales, y UCENM pasó de mostrar **0 alumnos a 318**, con desglose por carrera, avance y certificados.

En el camino detecté que la cifra «con matrícula» contaba valores distintos en vez de personas: mostraba 240 cuando eran 317. Al corregirlo salió a la luz un problema de datos del cliente, **46 matrículas duplicadas que afectaban a 123 alumnos**, 17 de ellos con la matrícula «1». Quedó expuesto como aviso permanente en el panel.

## Cómo lo trabajé

Desarrollo con apoyo de un agente de IA (Claude Code). Yo defino el enfoque, cuestiono los resultados y autorizo expresamente cada cambio a producción, con la regla de probar antes en local.
