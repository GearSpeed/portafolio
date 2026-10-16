---
titulo: Una vez más · Sitio web
subtitulo: Sitio de ventas prerenderizado, con catálogo en vivo desde el sistema de gestión
cliente: Negocio de dulces de amaranto y repostería en México
tipo: propio
rol: Product Owner y Front-End Developer
periodo: Sep 2026 – hoy
estado: En producción
categoria: web
sector: Retail · Venta en línea
orden: 4
destacado: false
resumen: El sitio público de Una vez más. Es estático, rápido y optimizado para SEO; toma el catálogo, los precios y la disponibilidad en vivo del sistema de gestión y cierra la venta por WhatsApp con el pedido ya escrito.
problema: El negocio necesitaba vender en línea sin un servidor que mantener, con un catálogo que Google pudiera indexar, al día con el inventario real y sin prometer lo que el producto no es.
solucion: Angular 21 prerenderizado en Cloudflare Pages. El catálogo se baja al compilar para que Google lo indexe y el navegador lo vuelve a pedir para mostrar precios y disponibilidad al día.
resultado: Cada producto tiene su página indexable, un precio nuevo o un agotado se ve sin volver a publicar y una revisión automática impide que regresen afirmaciones engañosas.
cifras:
  - valor: 0 redeploys
    etiqueta: para mostrar un precio nuevo o un producto agotado
  - valor: '2 normas'
    etiqueta: LFPC y NOM-051, con revisión automática de afirmaciones
  - valor: ~1,600
    etiqueta: líneas de TypeScript, más ~2,500 de plantillas HTML
stack:
  - Angular 21
  - Prerender estático (SSG)
  - Tailwind CSS v4
  - Cloudflare Pages
  - TypeScript
  - schema.org / JSON-LD
  - Vitest
  - Prettier
enlaces:
  - texto: Visitar unavezmasmx.com
    href: https://www.unavezmasmx.com/
portada: ../../assets/proyectos/una-vez-mas-sitio-web.webp
portadaAlt: Catálogo del sitio de Una vez más, con filtros por categoría, disponibilidad de cada producto y botones para pedir por WhatsApp.
descripcionSeo: Caso de estudio del sitio de ventas de Una vez más. Angular 21 prerenderizado en Cloudflare Pages, catálogo en vivo, SEO técnico y checkout por WhatsApp.
---

## Contexto

**Una vez más** es un negocio real de dulces mexicanos de amaranto en México: alegrías, galletas y borrachitos. Este es su **sitio público y su embudo de ventas**. El proyecto hermano es [el sistema de gestión](/proyectos/una-vez-mas/) con el que el negocio opera inventario, ventas y finanzas, y los dos forman un solo producto.

El cliente en México compra por WhatsApp, así que el sitio no tiene carrito ni pasarela de pago. Cada producto o pedido abre WhatsApp con **el mensaje ya escrito**, y un botón flotante de WhatsApp está siempre a la mano.

Llevé el diseño a código, lo integré con el sistema de gestión y lo desplegué. El primer commit es del 17 de septiembre de 2026 y está en producción en [unavezmasmx.com](https://www.unavezmasmx.com/), en Cloudflare Pages, con despliegue continuo en cada push a `main`.

## Qué hace

- **Páginas**: inicio con los «Favoritos de la Casa», las tarjetas de categoría y la sección del amaranto; catálogo con filtros por categoría; una página por producto; Nosotros; Contacto con preguntas frecuentes, y una página 404 real.
- **Detalle de producto como ruta hija** (`/catalogo/:slug`): se abre sobre la grilla, el enlace se puede compartir y cada producto queda como HTML que Google puede indexar.
- **Link-in-bio propio** (`/enlaces`) para Instagram y TikTok, sin encabezado ni pie.
- **Descuento por volumen** de cada categoría, anunciado en la portada.
- **Responsive con prioridad en el celular**, con menú lateral y bloqueo de scroll al abrir ventanas modales.

## Estático y en vivo a la vez

El sitio se construye con **Angular 21 y prerender estático**. El build genera un HTML plano por página y por producto, así que en producción no hay servidor de Node: solo archivos en la CDN de Cloudflare.

El contenido combina lo mejor de los dos mundos:

- **Al compilar**, un script baja el catálogo del sistema de gestión y lo deja dentro del HTML. Eso es lo que indexa Google y lo que ve quien llega sin JavaScript.
- **En el navegador**, el catálogo se vuelve a pedir al cargar. Un precio nuevo o un producto agotado se ven en minutos sin volver a publicar; solo hace falta republicar cuando entra un producto nuevo, para que tenga su página.
- **Si la API falla, nada se rompe**: el build usa la copia del repositorio y lo avisa en el log, y el navegador se queda con lo que ya tenía.

## Un contrato claro con el sistema de gestión

- **El sitio nunca toca la base de datos.** Lee una API pública de solo lectura con un contrato documentado.
- Solo recibe la **disponibilidad** («disponible», «últimas piezas», «agotado»), nunca la existencia exacta, para no revelar a la competencia el volumen de ventas.
- **El negocio administra el contenido sin programar**: productos, fotos, precios, fichas, los favoritos de la portada y las tarjetas de categoría se capturan en el sistema de gestión. En el repositorio solo quedan el maquetado y los textos de marca, en JSON tipados y validados al cargar.

## SEO y rendimiento

- HTML prerenderizado e indexable por página y por producto, con `canonical`, Open Graph e imágenes para compartir en redes.
- **JSON-LD de schema.org** en cada producto, con su **disponibilidad real**, para que Google no anuncie lo que está agotado.
- `sitemap.xml` generado en cada build a partir del catálogo, y `robots.txt`.
- Redirecciones de slugs viejos y **404 de verdad**: la URL responde 404 y aun así se ve la página de la marca.
- **Caché por tipo de archivo**: los bundles llevan hash y se marcan `immutable`, las imágenes se cachean una semana con `stale-while-revalidate` y el HTML se revalida.
- **Cabeceras de seguridad**: `nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` y COOP.
- Imágenes procesadas al tamaño en que se usan.

## Cumplimiento legal del contenido

Esto es lo que distingue al proyecto. El negocio revende un producto de **producción industrial**, así que audité el sitio contra la **LFPC**, que sanciona la publicidad engañosa, y la **NOM-051**, que acota el etiquetado y las declaraciones de salud:

- Retiré las afirmaciones que no se podían sostener, como «artesanal», «hecho a mano», «comercio justo», «sin intermediarios» o «cacao al 70 %». Cada una se revisó con el proveedor.
- La voz de la marca pasó de «nosotros lo hacemos» a **«nosotros lo escogemos»**.
- No hay afirmaciones de salud sobre el dulce: lo nutricional se atribuye al grano de amaranto.
- **Una revisión automática** busca las frases prohibidas en el código y en el HTML compilado. Normaliza los espacios para encontrar frases que el formateador partió entre líneas.
- El script que baja el catálogo pasa las fichas capturadas en el sistema por la misma lista y avisa en el log, porque quien captura un producto no lee el README.
- Las métricas de la portada salen del catálogo, no de números escritos a mano, para que nunca queden viejas ni falsas.

## Calidad

- Pruebas con **Vitest** del front y de los scripts de build, incluida la descarga del catálogo con su respaldo cuando la API no responde.
- **TypeScript estricto** y Prettier.
- **Design system propio**, «Herencia y Alegría Artesanal», con tokens en Tailwind CSS v4, portado desde un maquetado de Google Stitch.

## Cómo lo trabajé

Soy el dueño del producto: decido qué se construye y en qué orden. Lo desarrollé con apoyo de un agente de IA (Claude Code) y apruebo cada cambio a producción.
