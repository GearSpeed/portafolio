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
  webServer: {
    command: `npx astro preview --port ${puerto} --host 127.0.0.1 --ignore-lock`,
    url: `http://127.0.0.1:${puerto}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
