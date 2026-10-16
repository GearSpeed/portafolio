/**
 * Entrada del Worker de Cloudflare.
 *
 * El sitio es estático (dist/) y Cloudflare lo sirve sin ejecutar este código: wrangler.jsonc
 * solo manda aquí las rutas /api/* (`run_worker_first`). Así las visitas normales no cuentan
 * contra la cuota de ejecuciones del plan gratuito.
 */
import { responderContacto, type Entorno as EntornoContacto } from './contacto.ts';

export interface Entorno extends EntornoContacto {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Entorno): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/contacto' || pathname === '/api/contacto/') {
      if (request.method === 'POST') return responderContacto(request, env);
      return new Response('Método no permitido', { status: 405, headers: { Allow: 'POST' } });
    }

    // Cualquier otra ruta /api/* no existe: se responde con la página 404 del sitio.
    return env.ASSETS.fetch(request);
  },
};
