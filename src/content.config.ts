import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Un archivo Markdown por caso de estudio y por idioma: `proyectos` (español) y
 * `proyectosEn` (inglés, mismo nombre de archivo y mismo esquema). El esquema obliga a
 * que cada tarjeta de la portada tenga problema, solución y resultado, y que las cifras
 * vayan separadas del texto para poder revisarlas contra los documentos de contexto.
 */
const esquema = ({ image }: SchemaContext) =>
  z.object({
    titulo: z.string(),
    subtitulo: z.string(),
    cliente: z.string(),
    tipo: z.enum(['cliente', 'propio']),
    rol: z.string(),
    periodo: z.string(),
    estado: z.string(),
    categoria: z.enum(['web', 'negocio', 'ia']),
    sector: z.string(),
    orden: z.number().int(),
    destacado: z.boolean().default(false),
    resumen: z.string().max(260),
    problema: z.string().max(220),
    solucion: z.string().max(220),
    resultado: z.string().max(220),
    cifras: z
      .array(z.object({ valor: z.string(), etiqueta: z.string() }))
      .min(2)
      .max(4),
    stack: z.array(z.string()).min(3),
    enlaces: z.array(z.object({ texto: z.string(), href: z.url() })).default([]),
    descripcionSeo: z.string().max(170),
    // Captura del proyecto, ya revisada: sin nombres de cliente, cifras privadas ni datos personales.
    portada: image(),
    portadaAlt: z.string(),
  });

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: esquema,
});

const proyectosEn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos-en' }),
  schema: esquema,
});

export const collections = { proyectos, proyectosEn };
