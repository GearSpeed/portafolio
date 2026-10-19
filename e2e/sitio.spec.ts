import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const rutas = [
  '/',
  '/proyectos/plataforma-educacion-financiera/',
  '/proyectos/plataforma-educacion-financiera-honduras/',
  '/proyectos/administracion-educacion-financiera/',
  '/proyectos/administracion-educacion-financiera-honduras/',
  '/proyectos/una-vez-mas/',
  '/proyectos/una-vez-mas-sitio-web/',
  '/proyectos/retazos-de-historia/',
  '/contacto/enviado/',
  '/contacto/error/',
  '/ruta-que-no-existe',
];

// El widget de Turnstile no carga en pruebas: se bloquea para no depender de la red.
test.beforeEach(async ({ page }) => {
  await page.route('https://challenges.cloudflare.com/**', (ruta) => ruta.abort());
});

for (const ruta of rutas) {
  test(`${ruta} cumple WCAG 2.1 AA y no se desborda a lo ancho`, async ({ page }) => {
    await page.goto(ruta);
    await expect(page.locator('h1')).toHaveCount(1);

    const resultado = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(resultado.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);

    const desborde = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(desborde).toBeLessThanOrEqual(0);
  });
}

test('la portada no contiene cifras de relleno del maquetado', async ({ page }) => {
  // Regla del proyecto: ninguna cifra sin respaldo en el CV o en los documentos de contexto.
  await page.goto('/');
  const texto = await page.locator('body').innerText();
  // Los dos maquetados de Stitch traían datos de relleno; ninguno debe colarse al sitio.
  const relleno = ['SLA', '99.9', '42 ms', 'Core Web Vitals', 'RDS', 'Nginx', '558x', 'omardeseusa', '99.8', '-92%', '64%', '45%', '0% discrepancia'];
  for (const prohibido of relleno) {
    expect(texto, `«${prohibido}» no debe aparecer`).not.toContain(prohibido);
  }
});

// Regla del proyecto: de los sistemas de clientes no se publica el nombre del proyecto
// ni por dónde se entra o qué validación piden. Se revisa el HTML completo (incluye metadatos).
const terminosDeClientes = ['aprende y crece', 'aprende-y-crece', '/panel', 'túnel ssh', 'captcha', 'php-fpm', 'cortafuegos', '$2y$'];

for (const ruta of rutas) {
  test(`${ruta} no expone detalles de acceso de sistemas de clientes`, async ({ page }) => {
    await page.goto(ruta);
    const html = (await page.content()).toLowerCase();
    for (const termino of terminosDeClientes) {
      expect(html, `«${termino}» no debe aparecer`).not.toContain(termino);
    }
  });
}

test('cada enlace de la navegación apunta a una sección que existe', async ({ page }) => {
  await page.goto('/');
  const destinos = await page.locator('header nav[aria-label="Principal"] a').evaluateAll((enlaces) =>
    enlaces.map((a) => new URL((a as HTMLAnchorElement).href).hash.slice(1)),
  );
  expect(destinos.length).toBeGreaterThan(0);
  for (const id of [...destinos, 'inicio']) {
    await expect(page.locator(`#${id}`)).toHaveCount(1);
  }
});

test('los filtros muestran solo los proyectos de la categoría elegida', async ({ page }) => {
  await page.goto('/#proyectos');
  const tarjetas = page.locator('#proyectos [data-categoria]');
  const total = await tarjetas.count();

  await page.getByRole('button', { name: 'Inteligencia artificial' }).click();
  await expect(page.getByRole('button', { name: 'Inteligencia artificial' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('link', { name: 'Retazos de Historia' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Una vez más · Gestión' })).toBeHidden();

  await page.getByRole('button', { name: 'Todos' }).click();
  await expect(tarjetas.filter({ visible: true })).toHaveCount(total);
});

test('en móvil, la imagen del proyecto toma color al cruzar el centro de la pantalla', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'En escritorio el color aparece con el cursor');
  await page.goto('/');
  const tarjeta = page.locator('#proyectos article').nth(2);
  const filtro = () => tarjeta.locator('img').evaluate((img) => getComputedStyle(img).filter);

  // Fuera de la franja central: blanco y negro.
  expect(await filtro()).toContain('grayscale(1)');

  // Centrada en la pantalla: a color.
  await tarjeta.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await expect(tarjeta).toHaveAttribute('data-en-foco', '');
  await expect.poll(filtro).toContain('grayscale(0)');

  // De vuelta arriba: otra vez en blanco y negro.
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(tarjeta).not.toHaveAttribute('data-en-foco');
});

test('la foto de perfil se ve y, si no carga, queda el logo', async ({ page }) => {
  await page.goto('/');
  const foto = page.locator('#inicio img[data-foto]');
  await expect(foto).toBeVisible();
  expect(await foto.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);

  await page.route('**/_astro/foto-omar*', (ruta) => ruta.abort());
  await page.reload();
  const respaldo = page.locator('#inicio img[data-respaldo]');
  await expect(respaldo).toBeVisible();
  expect(await respaldo.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  expect(await page.locator('#inicio img[data-foto]').evaluate((img: HTMLImageElement) => img.naturalWidth)).toBe(0);
});

test('el CV se puede descargar', async ({ request }) => {
  const respuesta = await request.get('/docs/CV_Omar_Deseusa_Sampayo.pdf');
  expect(respuesta.ok()).toBe(true);
  expect(respuesta.headers()['content-type']).toContain('pdf');
});

test('las tarjetas de proyectos llevan a su caso de estudio', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Una vez más · Gestión' }).click();
  await expect(page).toHaveURL(/\/proyectos\/una-vez-mas\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Una vez más · Gestión');
});

test('el menú móvil abre, navega y se cierra', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Solo aplica en móvil');
  await page.goto('/');
  const boton = page.getByRole('button', { name: 'Abrir menú' });
  await boton.click();
  await expect(page.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute('aria-expanded', 'true');
  await page.locator('#menu-movil').getByRole('link', { name: 'Sobre mí' }).click();
  await expect(page.locator('#menu-movil')).toBeHidden();
  await expect(page).toHaveURL(/#sobre-mi$/);
});

test.describe('formulario de contacto', () => {
  test('pide los campos obligatorios antes de enviar', async ({ page }) => {
    await page.goto('/#contacto');
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(page.locator('#contacto-estado')).toContainText('Revisa los campos');
    await expect(page.locator('#contacto-nombre')).toBeFocused();
  });

  test('envía el mensaje y confirma al usuario', async ({ page }) => {
    let cuerpo = '';
    await page.route('**/api/contacto', async (ruta) => {
      cuerpo = ruta.request().postData() ?? '';
      await ruta.fulfill({ json: { ok: true, mensaje: 'Mensaje enviado.' } });
    });
    await page.goto('/#contacto');
    await page.getByLabel('Nombre').fill('Ana Pruebas');
    await page.getByLabel('Correo electrónico').fill('ana@ejemplo.com');
    await page.getByLabel('Tipo de proyecto').selectOption('Oferta de empleo o colaboración');
    await page.getByLabel('Cuéntame brevemente').fill('Hola, quiero platicar de un proyecto.');
    // Simula el token que normalmente agrega el widget de Turnstile.
    await page.evaluate(() => {
      const campo = document.createElement('input');
      campo.type = 'hidden';
      campo.name = 'cf-turnstile-response';
      campo.value = 'token-de-prueba';
      document.getElementById('formulario-contacto')?.append(campo);
    });
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();

    await expect(page.locator('#contacto-estado')).toContainText('Mensaje enviado');
    expect(cuerpo).toContain('Ana Pruebas');
    expect(cuerpo).toContain('Oferta de empleo o colaboración');
    await expect(page.getByLabel('Nombre')).toHaveValue('');
  });

  test('muestra el error del servidor', async ({ page }) => {
    await page.route('**/api/contacto', (ruta) =>
      ruta.fulfill({ status: 403, json: { ok: false, mensaje: 'La verificación antispam falló o expiró. Inténtalo de nuevo.' } }),
    );
    await page.goto('/#contacto');
    await page.getByLabel('Nombre').fill('Ana');
    await page.getByLabel('Correo electrónico').fill('ana@ejemplo.com');
    await page.getByLabel('Cuéntame brevemente').fill('Mensaje de prueba suficiente.');
    await page.evaluate(() => {
      const campo = document.createElement('input');
      campo.type = 'hidden';
      campo.name = 'cf-turnstile-response';
      campo.value = 'token-de-prueba';
      document.getElementById('formulario-contacto')?.append(campo);
    });
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(page.locator('#contacto-estado')).toContainText('verificación antispam');
  });
});
