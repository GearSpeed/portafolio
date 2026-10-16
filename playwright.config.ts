import { defineConfig, devices } from '@playwright/test';

const puerto = 4322;
// Permite usar un Chromium ya instalado en local (CHROME_BIN); en CI se usa el de Playwright.
const launchOptions = process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${puerto}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], launchOptions } },
    { name: 'movil', use: { ...devices['Pixel 7'], launchOptions } },
  ],
  // Compila con la clave de pruebas de Turnstile (si no hay una real) para que el formulario
  // exista: un build de producción sin clave lo sustituye por un aviso.
  webServer: {
    command: `npx astro build && npx astro preview --port ${puerto} --host 127.0.0.1 --ignore-lock`,
    env: { PUBLIC_TURNSTILE_SITE_KEY: process.env.PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA' },
    url: `http://127.0.0.1:${puerto}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
