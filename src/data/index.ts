import * as es from './sitio';
import * as en from './sitio.en';
import type { Idioma } from '../i18n';

const porIdioma = { es, en };

/** Contenido de la portada en el idioma de la página. */
export function contenido(idioma: Idioma) {
  return porIdioma[idioma];
}
