# omarsampayo.dev

Portafolio de **Omar Dev Sampayo**, Full-Stack Developer y Automatización con IA. Es un sitio estático en Astro, con una sola función de servidor para el formulario de contacto, desplegado en Cloudflare Pages.

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Astro 7 (salida estática) + TypeScript estricto |
| Estilos | Tailwind CSS 4 con los tokens del sistema de diseño «Monochrome Editorial» (`src/styles/global.css`) |
| Contenido | Content collections: un Markdown por caso de estudio, validado con Zod (`src/content.config.ts`) |
| Fuentes | Inter, alojada en el sitio (Fontsource) |
| Formulario | Cloudflare Pages Function (`functions/api/contacto.ts`) + Turnstile + Resend |
| Pruebas | Node test runner (función), Playwright + axe (E2E y WCAG 2.1 AA, escritorio y móvil) |
| CI | GitHub Actions: tipos, build, pruebas de la función, E2E y accesibilidad |

## Comandos

```bash
npm install
npm run dev              # servidor de desarrollo en http://localhost:4321
npm run build            # astro check + build en dist/
npm run preview          # sirve dist/
npm run test:funciones   # pruebas de /api/contacto con fetch simulado
npm run test:e2e         # Playwright + axe (requiere un build previo)
npm test                 # ambas
```

La primera vez que corras las E2E, instala el navegador con `npx playwright install chromium`.

## Dónde se edita cada cosa

| Qué | Archivo |
| --- | --- |
| Datos personales, experiencia, habilidades, certificaciones | `src/data/sitio.ts` |
| Casos de estudio (texto, cifras, stack) | `src/content/proyectos/*.md` |
| CV descargable | `public/docs/CV_Omar_Deseusa_Sampayo.pdf` |
| Logo, favicon e imagen para redes | `public/img/`, `public/favicon*`, `public/apple-touch-icon.png` |
| Cabeceras de seguridad y caché | `public/_headers` |

**Regla de contenido:** cada cifra del sitio sale del CV o de los documentos de contexto de cada proyecto. Los maquetados de Stitch traían datos de relleno (SLA, latencias, porcentajes); una prueba E2E falla si alguno reaparece.

## Despliegue en Cloudflare Pages

1. **Crear el proyecto.** Cloudflare → Workers & Pages → Create → Pages → conectar el repositorio de GitHub.
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Variable `NODE_VERSION` = `24`
2. **Dominio.** Pages → Custom domains → `omarsampayo.dev` (y `www.omarsampayo.dev` con redirección al dominio raíz).
3. **Turnstile.** Cloudflare → Turnstile → Add widget, con dominio `omarsampayo.dev` y modo *Managed*.
   - Clave del sitio → variable **`PUBLIC_TURNSTILE_SITE_KEY`** (en Pages y en GitHub → Settings → Variables).
   - Clave secreta → secreto **`TURNSTILE_SECRET_KEY`** en Pages.
4. **Resend.** Crear cuenta, agregar el dominio `omarsampayo.dev` y copiar en Cloudflare DNS los registros que indique (SPF, DKIM). Luego, en Pages:
   - `RESEND_API_KEY`: la clave de la API (secreto).
   - `CONTACTO_DESTINO`: `omar.1993.ds@hotmail.com`
   - `CONTACTO_REMITENTE`: `Portafolio <contacto@omarsampayo.dev>`
5. **Analítica (opcional).** Pages → Metrics → Web Analytics. No usa cookies y la CSP ya la permite.

Sin las variables del paso 4, el formulario responde «no disponible» y sugiere escribir por correo; el resto del sitio funciona igual.

### Probar la función en local

```bash
cp .dev.vars.example .dev.vars   # y completar RESEND_API_KEY
npm run build
npx wrangler pages dev dist
```

## Estructura

```
src/
  components/      Encabezado, pie, íconos y secciones de la portada (inicio/)
  content/         Casos de estudio en Markdown
  data/sitio.ts    Contenido de la portada
  layouts/         Plantilla base con SEO, Open Graph y JSON-LD
  pages/           Portada, /proyectos/[id], /contacto/{enviado,error}, 404
functions/api/     Función de contacto (Cloudflare Pages)
tests/             Pruebas de la función
e2e/               Pruebas E2E y de accesibilidad
```
