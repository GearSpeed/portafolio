# omarsampayo.dev

Portafolio de **Omar Dev Sampayo**, Full-Stack Developer y Automatización con IA. Es un sitio estático en Astro, con una sola función de servidor para el formulario de contacto, desplegado en Cloudflare Workers.

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Astro 7 (salida estática) + TypeScript estricto |
| Estilos | Tailwind CSS 4 con los tokens del sistema de diseño «Monochrome Editorial» (`src/styles/global.css`) |
| Contenido | Content collections: un Markdown por caso de estudio, validado con Zod (`src/content.config.ts`) |
| Fuentes | Inter, alojada en el sitio (Fontsource) |
| Formulario | Cloudflare Worker (`worker/`) + Turnstile + Resend |
| Pruebas | Node test runner (función), Playwright + axe (E2E y WCAG 2.1 AA, escritorio y móvil) |
| CI | GitHub Actions: tipos, build, pruebas de la función, E2E y accesibilidad |

## Comandos

```bash
npm install
npm run dev              # servidor de desarrollo en http://localhost:4321
npm run build            # astro check + build en dist/
npm run preview          # sirve dist/
npm run test:funciones   # pruebas del Worker y de /api/contacto con fetch simulado
npm run test:e2e         # Playwright + axe (requiere un build previo)
npm test                 # ambas
```

La primera vez que corras las E2E, instala el navegador con `npx playwright install chromium`.

## Dónde se edita cada cosa

| Qué | Archivo |
| --- | --- |
| Datos personales, experiencia, habilidades, certificaciones | `src/data/sitio.ts` (español) y `src/data/sitio.en.ts` (inglés) |
| Casos de estudio (texto, cifras, stack) | `src/content/proyectos/*.md` (español) y `src/content/proyectos-en/*.md` (inglés) |
| Etiquetas de la interfaz | El diccionario `{ es, en }` de cada componente |
| CV descargable | `public/docs/CV_Omar_Deseusa_Sampayo.pdf` (español) y `CV_Omar_Deseusa_Sampayo_EN.pdf` (inglés) |
| Logo, favicon e imagen para redes | `public/img/`, `public/favicon*`, `public/apple-touch-icon.png` |
| Cabeceras de seguridad y caché | `public/_headers` |

**Regla de contenido:** cada cifra del sitio sale del CV o de los documentos de contexto de cada proyecto. Los maquetados de Stitch traían datos de relleno (SLA, latencias, porcentajes); una prueba E2E falla si alguno reaparece.

## Despliegue en Cloudflare Workers

El sitio es un Worker con *static assets*: Cloudflare sirve `dist/` directamente y solo ejecuta código en `/api/*` (el formulario). La configuración está en `wrangler.jsonc`, y el `name` debe coincidir con el nombre del Worker en Cloudflare.

1. **Crear el Worker.** Cloudflare → Workers & Pages → Create → Import a repository → este repositorio.
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Variable de build `NODE_VERSION` = `24`
2. **Dominio.** Worker → Domains → Add Domain → `omarsampayo.dev`, y otra vez con el subdominio `www`. Para mandar `www` al dominio raíz: zona `omarsampayo.dev` → Rules → Redirect Rules → plantilla «Redirect from WWW to root».
3. **Turnstile.** Cloudflare → Turnstile → Add widget, con dominio `omarsampayo.dev` y modo *Managed*.
   - Clave del sitio → **`PUBLIC_TURNSTILE_SITE_KEY`** como variable **de build** (Worker → Settings → Build → Variables and secrets) y en GitHub → Settings → Variables, para la CI. Se incrusta en el HTML al compilar.
   - Clave secreta → secreto **`TURNSTILE_SECRET_KEY`** en Worker → Settings → Variables and Secrets (variables de ejecución).
4. **Resend.** Crear cuenta, agregar el dominio `omarsampayo.dev` y copiar en Cloudflare DNS los registros que indique (DKIM y los del subdominio `send`). Crear una API key con permiso de envío y guardarla en Worker → Settings → Variables and Secrets como **`RESEND_API_KEY`**, tipo *Secret*.
   - `CONTACTO_DESTINO` y `CONTACTO_REMITENTE` ya están en `wrangler.jsonc` (`vars`). No se capturan en el panel: `wrangler deploy` borra las variables de texto creadas a mano y solo conserva los secretos.
5. **Analítica (opcional).** Zona `omarsampayo.dev` → Analytics & Logs → Web Analytics. No usa cookies y la CSP ya la permite.

Sin `RESEND_API_KEY`, el formulario responde «no disponible» y sugiere escribir por correo; el resto del sitio funciona igual.

**Costo.** En el plan gratuito, los archivos estáticos no tienen límite y el Worker admite 100,000 ejecuciones al día; solo el formulario las consume. Si se rebasan, las peticiones extra fallan ese día, sin cargos.

### Probar el Worker en local

```bash
cp .dev.vars.example .dev.vars   # y completar RESEND_API_KEY
npm run preview:worker           # build + wrangler dev en http://localhost:8787
```

## Estructura

```
src/
  components/      Encabezado, pie, íconos y secciones de la portada (inicio/)
  content/         Casos de estudio en Markdown
  data/sitio.ts    Contenido de la portada
  layouts/         Plantilla base con SEO, Open Graph y JSON-LD
  pages/           Portada, /proyectos/[id], /contacto/{enviado,error}, 404
worker/            Entrada del Worker y función de contacto
tests/             Pruebas del Worker y de la función
e2e/               Pruebas E2E y de accesibilidad
```
