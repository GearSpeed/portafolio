/**
 * Idiomas del sitio. El español vive en la raíz (las URLs de siempre) y el inglés bajo /en/.
 * Las etiquetas de interfaz de cada componente viven en ese componente, en un diccionario
 * { es, en }; aquí solo va lo que comparten varios: rutas, CV y el cambio de idioma.
 */

export const idiomas = ['es', 'en'] as const;
export type Idioma = (typeof idiomas)[number];

export function idiomaDe(locale: string | undefined): Idioma {
  return locale === 'en' ? 'en' : 'es';
}

/** Equivalencia de prefijos entre idiomas, de la más específica a la más general. */
const prefijos: { es: string; en: string }[] = [
  { es: '/contacto/enviado/', en: '/en/contact/sent/' },
  { es: '/contacto/error/', en: '/en/contact/error/' },
  { es: '/proyectos/', en: '/en/projects/' },
  { es: '/', en: '/en/' },
];

export const rutas = {
  inicio: (idioma: Idioma) => (idioma === 'en' ? '/en/' : '/'),
  proyecto: (idioma: Idioma, id: string) => `${idioma === 'en' ? '/en/projects/' : '/proyectos/'}${id}/`,
  enviado: (idioma: Idioma) => prefijos[0][idioma],
  error: (idioma: Idioma) => prefijos[1][idioma],
};

/** La misma página en el otro idioma: /proyectos/x/ ⇄ /en/projects/x/. */
export function rutaEquivalente(pathname: string, destino: Idioma): string {
  const ruta = pathname.endsWith('/') ? pathname : `${pathname}/`;
  // La 404 es una sola para todo el sitio: su equivalente es la portada.
  if (ruta === '/404/') return rutas.inicio(destino);
  const origen: Idioma = ruta.startsWith('/en/') ? 'en' : 'es';
  if (origen === destino) return ruta;
  const par = prefijos.find((p) => ruta.startsWith(p[origen]));
  return par ? par[destino] + ruta.slice(par[origen].length) : rutas.inicio(destino);
}

/** Los dos CV se ofrecen en ambos idiomas; primero el de la página. */
export const cvs = [
  { idioma: 'es', href: '/docs/CV_Omar_Deseusa_Sampayo.pdf', etiqueta: { es: 'CV en español', en: 'CV in Spanish' } },
  { idioma: 'en', href: '/docs/CV_Omar_Deseusa_Sampayo_EN.pdf', etiqueta: { es: 'CV en inglés', en: 'CV in English' } },
] as const;

export function cvsPara(idioma: Idioma) {
  return [...cvs].sort((a, b) => Number(b.idioma === idioma) - Number(a.idioma === idioma));
}
