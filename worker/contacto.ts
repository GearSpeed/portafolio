/**
 * POST /api/contacto. Lo llama el Worker (worker/index.ts); el resto del sitio son archivos estáticos.
 *
 * 1. Valida los campos y la trampa para bots.
 * 2. Verifica el token de Turnstile contra Cloudflare.
 * 3. Envía el mensaje por correo con Resend, con «responder a» apuntando al visitante.
 *
 * Responde JSON si el cliente lo pide (envío con fetch) y, si no, redirige a
 * /contacto/enviado/ o /contacto/error/ para que el formulario funcione sin JavaScript.
 *
 * Variables de entorno (Worker → Settings → Variables and Secrets):
 *   TURNSTILE_SECRET_KEY  secreto de Turnstile
 *   RESEND_API_KEY        clave de la API de Resend
 *   CONTACTO_DESTINO      correo que recibe los mensajes
 *   CONTACTO_REMITENTE    remitente verificado en Resend, p. ej. "Portafolio <contacto@omarsampayo.dev>"
 */

export interface Entorno {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  CONTACTO_DESTINO?: string;
  CONTACTO_REMITENTE?: string;
}

type Resultado = { ok: true } | { ok: false; estado: number; mensaje: string };

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function texto(valor: FormDataEntryValue | null): string {
  return typeof valor === 'string' ? valor.trim() : '';
}

function escaparHtml(valor: string): string {
  return valor.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
}

async function verificarTurnstile(token: string, secreto: string, ip: string | null): Promise<boolean> {
  const cuerpo = new FormData();
  cuerpo.append('secret', secreto);
  cuerpo.append('response', token);
  if (ip) cuerpo.append('remoteip', ip);

  const respuesta = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: cuerpo });
  if (!respuesta.ok) return false;
  const datos = (await respuesta.json()) as { success?: boolean };
  return datos.success === true;
}

async function procesar(request: Request, env: Entorno): Promise<Resultado> {
  if (!env.TURNSTILE_SECRET_KEY || !env.RESEND_API_KEY || !env.CONTACTO_DESTINO || !env.CONTACTO_REMITENTE) {
    console.error('[contacto] Faltan variables de entorno');
    return { ok: false, estado: 503, mensaje: 'El formulario no está disponible ahora. Escríbeme directo por correo.' };
  }

  let formulario: FormData;
  try {
    formulario = await request.formData();
  } catch {
    return { ok: false, estado: 400, mensaje: 'La solicitud no es válida.' };
  }

  // Un bot que llena el campo oculto recibe un «ok» sin que se envíe nada.
  if (texto(formulario.get('sitio_web')) !== '') return { ok: true };

  const nombre = texto(formulario.get('nombre'));
  const correo = texto(formulario.get('correo'));
  const mensaje = texto(formulario.get('mensaje'));
  // Campo opcional del <select>; se recorta y se aplana para que no rompa el asunto.
  const tipo = texto(formulario.get('tipo')).replace(/[\r\n]+/g, ' ').slice(0, 100);
  const token = texto(formulario.get('cf-turnstile-response'));

  if (!nombre || nombre.length > 100) return { ok: false, estado: 422, mensaje: 'Escribe tu nombre (máximo 100 caracteres).' };
  if (!CORREO_VALIDO.test(correo) || correo.length > 200) return { ok: false, estado: 422, mensaje: 'Escribe un correo válido.' };
  if (mensaje.length < 10 || mensaje.length > 5000) {
    return { ok: false, estado: 422, mensaje: 'El mensaje debe tener entre 10 y 5,000 caracteres.' };
  }
  if (!token) return { ok: false, estado: 422, mensaje: 'Falta la verificación antispam. Recarga la página e inténtalo de nuevo.' };

  const humano = await verificarTurnstile(token, env.TURNSTILE_SECRET_KEY, request.headers.get('CF-Connecting-IP'));
  if (!humano) return { ok: false, estado: 403, mensaje: 'La verificación antispam falló o expiró. Inténtalo de nuevo.' };

  const envio = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACTO_REMITENTE,
      to: [env.CONTACTO_DESTINO],
      reply_to: correo,
      subject: `Portafolio · ${tipo ? `${tipo} · ` : ''}Mensaje de ${nombre.replace(/[\r\n]+/g, ' ')}`,
      text: `Nombre: ${nombre}\nCorreo: ${correo}${tipo ? `\nTipo: ${tipo}` : ''}\n\n${mensaje}`,
      html: `<p><strong>Nombre:</strong> ${escaparHtml(nombre)}<br><strong>Correo:</strong> ${escaparHtml(correo)}${tipo ? `<br><strong>Tipo:</strong> ${escaparHtml(tipo)}` : ''}</p><p style="white-space:pre-wrap">${escaparHtml(mensaje)}</p>`,
    }),
  });

  if (!envio.ok) {
    console.error('[contacto] Resend respondió', envio.status, await envio.text());
    return { ok: false, estado: 502, mensaje: 'No se pudo enviar el mensaje. Escríbeme directo por correo.' };
  }

  return { ok: true };
}

export async function responderContacto(request: Request, env: Entorno): Promise<Response> {
  const resultado = await procesar(request, env);
  const quiereJson = (request.headers.get('Accept') ?? '').includes('application/json');

  if (quiereJson) {
    return Response.json(resultado.ok ? { ok: true, mensaje: 'Mensaje enviado.' } : { ok: false, mensaje: resultado.mensaje }, {
      status: resultado.ok ? 200 : resultado.estado,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const destino = new URL(resultado.ok ? '/contacto/enviado/' : '/contacto/error/', request.url);
  return Response.redirect(destino.toString(), 303);
}
