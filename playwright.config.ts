import { defineConfig, devices } from '@playwright/test';

const liveBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: false,
  reporter: 'line',
  use: {
    baseURL: liveBaseUrl ?? 'http://127.0.0.1:4174',
    trace: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: /mobile\.spec\.ts/ },
    { name: 'mobile-chromium', use: { ...devices['Pixel 5'] }, testMatch: /mobile\.spec\.ts/ }
  ],
  webServer: liveBaseUrl ? undefined : {
    command: 'npm run build && npm run preview -- --port 4174',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
    timeout: 60_000
  }
});
