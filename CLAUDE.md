# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Portafolio personal de Omar Dev Sampayo (omarsampayo.dev): sitio estático en Astro 7 + Tailwind 4, desplegado como Cloudflare Worker con *static assets*, con una sola función de servidor para el formulario de contacto. Todo está en español: textos, identificadores, comentarios y mensajes de commit. Mantén ese idioma al escribir código nuevo.

## Comandos

```bash
npm run dev              # http://127.0.0.1:4321
npm run build            # astro check (tipos + esquema de contenido) y build en dist/
npm run test:funciones   # node --test sobre tests/**/*.test.ts (Worker y función de contacto, fetch simulado)
npm run preview:worker   # build + wrangler dev en :8787: el sitio servido como en producción, con /api/contacto
npm run test:e2e         # Playwright + axe; compila y sirve dist/ con astro preview en el puerto 4322
npm test                 # ambas
```

- Las E2E compilan solas (`webServer` de `playwright.config.ts`) con la clave de pruebas de Turnstile, y sobrescriben `dist/`. Fuera de CI reutilizan un servidor que ya esté en :4322, que puede estar sirviendo un build viejo.
- Una sola prueba E2E: `npx playwright test -g "menú móvil" --project=movil`. Los proyectos son `escritorio` y `movil`.
- Una sola prueba de la función: `node --test --test-name-pattern="Turnstile" tests/contacto.test.ts`.
- En local no hay navegador de Playwright descargado. Usa `CHROME_BIN=$HOME/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome npx playwright test`, o instálalo con `npx playwright install chromium`.
- En una terminal no interactiva, `astro dev` y `astro preview` se van a segundo plano. Se detienen con `npx astro dev stop` o `npx astro preview stop`.
- La CI (`.github/workflows/ci.yml`) corre build, pruebas de la función y E2E en cada push a `main` y en cada PR.

## Arquitectura

- **Contenido separado de la presentación.**
  - `src/data/sitio.ts` concentra todo el texto de la portada: perfil, navegación, métricas, experiencia, habilidades, educación, etc.
  - Los casos de estudio son la colección `proyectos` (`src/content/proyectos/*.md`), validada por el esquema Zod de `src/content.config.ts`.
  - Ese esquema impone límites de longitud (`resumen` ≤ 260, `problema`/`solucion`/`resultado` ≤ 220, `descripcionSeo` ≤ 170) y de 2 a 4 `cifras`; `astro build` falla si no se cumplen.
  - El campo `orden` decide el orden de las tarjetas en la portada y el enlace al siguiente caso en `src/pages/proyectos/[id].astro`. `categoria` alimenta los filtros de la portada (etiquetas en `categoriasProyecto` de `sitio.ts`); `portada` (captura) es la imagen de la tarjeta y de la cabecera del caso.
  - La página de cada caso arma su índice lateral con los `##` del Markdown.
- **Negritas en `sitio.ts`.** Los logros usan `**texto**`. `conNegritas` (`src/lib/texto.ts`) los escapa y los convierte en `<strong>`, y se renderizan con `set:html`. Todo texto que vaya a `set:html` debe pasar por ese escape.
- **Formulario de contacto (mejora progresiva).**
  - `src/components/inicio/Contacto.astro` publica a `/api/contacto`. Con JavaScript usa `fetch` y pide JSON; sin JavaScript, la función responde con un 303 a `/contacto/enviado/` o `/contacto/error/`.
  - `wrangler.jsonc` sirve `dist/` como archivos estáticos y solo manda `/api/*` al Worker (`run_worker_first`), así que las visitas no consumen ejecuciones. `worker/index.ts` enruta `POST /api/contacto` a `responderContacto` (`worker/contacto.ts`) y deja el resto a `env.ASSETS`, que responde con `404.html`. El `name` del config debe coincidir con el Worker en Cloudflare.
  - `worker/` no lo compila Astro: está excluido de `tsconfig.json` y se prueba importándolo directo desde `tests/` (Node 24 ejecuta TypeScript). Las E2E usan `astro preview`, que no tiene la función; por eso `/api/contacto` se simula en ellas con `page.route`.
  - La función valida los campos y la trampa para bots, verifica Turnstile y envía el correo con Resend.
  - Variables de ejecución del Worker: `TURNSTILE_SECRET_KEY` y `RESEND_API_KEY` son *Secret* en el panel de Cloudflare; `CONTACTO_DESTINO` y `CONTACTO_REMITENTE` viven en `vars` de `wrangler.jsonc`, porque `wrangler deploy` borra las variables de texto creadas en el panel. `PUBLIC_TURNSTILE_SITE_KEY` es variable de build, no de ejecución.
  - Si falta `PUBLIC_TURNSTILE_SITE_KEY`: en `astro dev` se usa la clave de pruebas de Turnstile; en un build de producción el formulario se sustituye por un aviso con el correo, para que nunca se publique el widget «Solo para pruebas».
- **CSP estricta.** `public/_headers` (Workers static assets lo aplica igual que Pages) solo permite scripts propios y los de Cloudflare (Turnstile y Web Analytics). Por eso `vite.build.assetsInlineLimit: 0` en `astro.config.mjs`. No agregues `<script is:inline>` ni scripts o estilos de terceros sin actualizar la CSP.
- **`compressHTML: false` es intencional.** La compresión borraba el espacio entre texto y etiquetas en línea.
- **Sistema de diseño «Monochrome Editorial».** Paleta acromática y una sola fuente (Inter); la jerarquía sale de la escala tipográfica y del espacio, sin destellos ni degradados. Los únicos acentos de color son los que pidió Omar: `disponible` (verde, el punto de «Disponible para remoto») y `acento` (azul, «Dev» en el nombre de la portada).
  - Los tokens están en el bloque `@theme` de `src/styles/global.css`: colores `canvas`, `surface`, `elevated`, `line`, `line-strong`, `ink`, `ink-soft`, `ink-muted` e `ink-faint`, y escalas como `text-h3`, `text-label` o `text-overline`. Usa esas clases, no colores hex sueltos.
  - Clases de componente en la misma hoja: `.card`, `.rotulo` (rótulo en mayúsculas), `.chip`, `.btn` con `.btn-primario`/`.btn-secundario`, `.campo` y `.prose-caso`. El rótulo no se llama `overline` porque Tailwind ya tiene esa utilidad (`text-decoration: overline`).
  - `ink-faint` (#555) no llega a 4.5:1 sobre negro: úsalo solo en adornos, nunca en texto.
  - Al pasar el cursor, las tarjetas solo avivan el borde (`hover:border-line-strong`); no se mueven ni cambian de escala.
- **Portada.** Secciones en este orden: inicio, `#impacto` (métricas), `#proyectos` (filtros por `categoria`), `#caso-estudio`, `#experiencia`, `#sobre-mi` y `#contacto`. La navegación vive en `navegacion` de `sitio.ts`, y una prueba E2E comprueba que cada enlace apunte a una sección existente.
- **SEO.** `src/layouts/Base.astro` arma los metadatos, Open Graph y el JSON-LD de `Person`. El sitemap excluye `/contacto/`.

## Reglas de contenido (las vigilan pruebas E2E)

- **Ninguna cifra inventada.** Cada número o afirmación sale del CV o de los documentos de contexto de cada proyecto, que están fuera del repo. Los maquetados de Stitch de los que partió el diseño traían datos y puestos de relleno; se toma de ellos el diseño, nunca el contenido. La prueba «cifras de relleno» de `e2e/sitio.spec.ts` falla si reaparecen.
- **Sistemas de clientes.** No se publica el nombre interno del proyecto de Banco Azteca: se llama «Plataforma de educación financiera». Tampoco se publica nada sobre cómo se accede a esos sistemas: rutas de administración, tipo de login o captcha, túneles, usuarios de base de datos, autenticación, topología de servidores ni controles de seguridad que falten.
  - Sí se pueden nombrar Grupo Salinas, Banco Azteca, CNBS, UCENM y UCRISH.
  - La lista `terminosDeClientes` de `e2e/sitio.spec.ts` revisa el HTML de cada ruta. Si agregas una página, agrégala también a `rutas`.
- **Capturas de pantalla** (`src/assets/proyectos/`, campo `portada` del Markdown): las que se publican ya van editadas. Antes de agregar una nueva, pixela el nombre del proyecto del cliente, las cifras privadas del negocio (ventas, utilidad, existencias) y los datos personales, como nombres de empleados o la cuenta personal de YouTube. La prueba de términos prohibidos no revisa imágenes.
- **Imágenes siempre en `.webp`**, para mantener el sitio ligero. Toda imagen nueva se convierte antes de agregarla (por ejemplo con `sharp`, que ya viene con Astro; calidad 82–90) y se reduce al tamaño que de verdad se muestra. `getImage` también pide `format: 'webp'`. Únicas excepciones, por compatibilidad: `public/img/og.png` (LinkedIn y otras redes no muestran la vista previa en WebP), `favicon.ico`, `favicon-32.png` y `apple-touch-icon.png`.
- **Foto de perfil** (`src/assets/foto-omar.webp`): en la presentación va encima del logo (`public/img/monograma-256.webp`). Si la foto no carga, queda a la vista el logo, sin JavaScript; una prueba E2E bloquea la foto para comprobarlo.
- En IEECO (AWS), Omar *participó* en la arquitectura; no la implementó solo. No infles el rol en el trabajo de cliente.

## Forma de trabajar
- Cambios pequeños y enfocados; No reescribas lo que ya funciona
- Al terminar, resume que has cambiado y cualquier decisión que deba revisar
- Haz solo lo que se te pide; No añadas funcionalidades por tu cuenta.

## Limites
- Solicitar VoBo: siempre que se aplique un cambio nuevo se debe solicitar VoBo para mandar a producción, nunca asumir que todo cumple y deployarlo sin un VoBo humano.
- Siempre actualiza MEMORY.md al terminar cada tarea
- Nunca commites información delicada del proyecto (llaves, .env, credenciales, etc.)

## Git

El git global de esta máquina firma con un correo corporativo que no debe aparecer en este repo público. Este repo tiene configurados localmente `user.name` y `user.email` (noreply de GitHub); no los cambies. El remoto es por SSH porque el token de `gh` no tiene el scope `workflow`.
