// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://omarsampayo.dev',
  trailingSlash: 'ignore',
  // La compresión borra el salto de línea entre texto y etiqueta en línea («en<strong>0.17»),
  // que debe leerse como un espacio. El HTML pesa unos KB más; a cambio el texto es fiel.
  compressHTML: false,
  integrations: [sitemap({ filter: (pagina) => !pagina.includes('/contacto/') && !pagina.includes('/contact/') })],
  // Español en la raíz (las URLs de siempre) e inglés bajo /en/. Ver src/i18n.ts.
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
  },
  vite: {
    plugins: [tailwindcss()],
    // Sin scripts en línea: la CSP de public/_headers solo permite scripts propios ('self').
    build: { assetsInlineLimit: 0 },
  },
});
