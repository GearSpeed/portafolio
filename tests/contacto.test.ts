/**
 * Pruebas de la función de contacto con `fetch` simulado (Turnstile y Resend).
 * Se ejecutan con el runner nativo de Node: `npm run test:funciones`.
 */
import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { responderContacto } from '../worker/contacto.ts';

const env = {
  TURNSTILE_SECRET_KEY: 'secreto',
  RESEND_API_KEY: 'clave',
  CONTACTO_DESTINO: 'destino@ejemplo.com',
  CONTACTO_REMITENTE: 'Portafolio <contacto@ejemplo.com>',
};

type Llamada = { url: string; init?: RequestInit };
let llamadas: Llamada[] = [];
let turnstileOk = true;
let resendOk = true;
const fetchOriginal = globalThis.fetch;

beforeEach(() => {
  llamadas = [];
  turnstileOk = true;
  resendOk = true;
  globalThis.fetch = (async (url: string | URL, init?: RequestInit) => {
    llamadas.push({ url: String(url), init });
    if (String(url).includes('turnstile')) return Response.json({ success: turnstileOk });
    if (String(url).includes('resend')) return new Response(resendOk ? '{"id":"1"}' : 'error', { status: resendOk ? 200 : 500 });
    throw new Error(`fetch inesperado: ${url}`);
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = fetchOriginal;
});

function solicitud(campos: Record<string, string>, json = true): Request {
  const cuerpo = new FormData();
  for (const [k, v] of Object.entries(campos)) cuerpo.append(k, v);
  return new Request('https://omarsampayo.dev/api/contacto', {
    method: 'POST',
    body: cuerpo,
    headers: json ? { Accept: 'application/json' } : {},
  });
}

const validos = {
  nombre: 'Ana',
  correo: 'ana@ejemplo.com',
  mensaje: 'Hola, me interesa tu trabajo.',
  'cf-turnstile-response': 'token',
};

describe('POST /api/contacto', () => {
  it('envía el correo con «responder a» del visitante', async () => {
    const respuesta = await responderContacto(solicitud(validos), env);
    assert.equal(respuesta.status, 200);
    assert.deepEqual(await respuesta.json(), { ok: true, mensaje: 'Mensaje enviado.' });

    const envio = llamadas.find((l) => l.url.includes('resend'));
    assert.ok(envio, 'debió llamar a Resend');
    const datos = JSON.parse(String(envio.init?.body));
    assert.equal(datos.reply_to, 'ana@ejemplo.com');
    assert.deepEqual(datos.to, ['destino@ejemplo.com']);
  });

  it('escapa el HTML del mensaje', async () => {
    await responderContacto(solicitud({ ...validos, mensaje: '<script>alert(1)</script> hola' }), env);
    const datos = JSON.parse(String(llamadas.find((l) => l.url.includes('resend'))?.init?.body));
    assert.ok(!datos.html.includes('<script>'));
    assert.ok(datos.html.includes('&lt;script&gt;'));
  });

  it('incluye el tipo de proyecto en el asunto, en una sola línea y recortado', async () => {
    const tipo = 'Oferta de empleo\r\nBcc: otro@ejemplo.com ' + 'x'.repeat(200);
    await responderContacto(solicitud({ ...validos, tipo }), env);
    const datos = JSON.parse(String(llamadas.find((l) => l.url.includes('resend'))?.init?.body));
    assert.ok(datos.subject.startsWith('Portafolio · Oferta de empleo Bcc: otro@ejemplo.com x'));
    assert.ok(!/[\r\n]/.test(datos.subject));
    assert.ok(datos.text.includes(`Tipo: ${tipo.replace(/[\r\n]+/g, ' ').slice(0, 100)}\n`));
  });

  it('rechaza un correo inválido sin llamar a servicios externos', async () => {
    const respuesta = await responderContacto(solicitud({ ...validos, correo: 'no-es-correo' }), env);
    assert.equal(respuesta.status, 422);
    assert.equal(llamadas.length, 0);
  });

  it('rechaza un mensaje demasiado corto', async () => {
    const respuesta = await responderContacto(solicitud({ ...validos, mensaje: 'hola' }), env);
    assert.equal(respuesta.status, 422);
  });

  it('rechaza si Turnstile no valida y no envía correo', async () => {
    turnstileOk = false;
    const respuesta = await responderContacto(solicitud(validos), env);
    assert.equal(respuesta.status, 403);
    assert.ok(!llamadas.some((l) => l.url.includes('resend')));
  });

  it('finge éxito ante la trampa para bots sin enviar nada', async () => {
    const respuesta = await responderContacto(solicitud({ ...validos, sitio_web: 'http://spam' }), env);
    assert.equal(respuesta.status, 200);
    assert.equal(llamadas.length, 0);
  });

  it('responde 502 si Resend falla', async () => {
    resendOk = false;
    const respuesta = await responderContacto(solicitud(validos), env);
    assert.equal(respuesta.status, 502);
  });

  it('responde 503 si faltan variables de entorno', async () => {
    const respuesta = await responderContacto(solicitud(validos), {});
    assert.equal(respuesta.status, 503);
  });

  it('sin JavaScript redirige a la página de confirmación o de error', async () => {
    const ok = await responderContacto(solicitud(validos, false), env);
    assert.equal(ok.status, 303);
    assert.equal(ok.headers.get('Location'), 'https://omarsampayo.dev/contacto/enviado/');

    const error = await responderContacto(solicitud({ ...validos, correo: 'x' }, false), env);
    assert.equal(error.headers.get('Location'), 'https://omarsampayo.dev/contacto/error/');
  });
});
