/**
 * Pruebas del enrutador del Worker: /api/contacto va a la función y lo demás a los archivos.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import worker, { type Entorno } from '../worker/index.ts';

const pedidosAArchivos: string[] = [];
const env: Entorno = {
  ASSETS: {
    async fetch(request: Request) {
      pedidosAArchivos.push(new URL(request.url).pathname);
      return new Response('archivo', { status: 404 });
    },
  },
};

describe('Worker', () => {
  it('manda el POST de /api/contacto a la función de contacto', async () => {
    // Sin variables de entorno la función responde 503 sin llamar a servicios externos.
    const respuesta = await worker.fetch(
      new Request('https://omarsampayo.dev/api/contacto', { method: 'POST', body: new FormData(), headers: { Accept: 'application/json' } }),
      env,
    );
    assert.equal(respuesta.status, 503);
    assert.equal((await respuesta.json()).ok, false);
  });

  it('rechaza otros métodos en /api/contacto', async () => {
    const respuesta = await worker.fetch(new Request('https://omarsampayo.dev/api/contacto'), env);
    assert.equal(respuesta.status, 405);
    assert.equal(respuesta.headers.get('Allow'), 'POST');
  });

  it('deja el resto de /api/* a los archivos estáticos (página 404)', async () => {
    const respuesta = await worker.fetch(new Request('https://omarsampayo.dev/api/otra'), env);
    assert.equal(respuesta.status, 404);
    assert.deepEqual(pedidosAArchivos, ['/api/otra']);
  });
});
