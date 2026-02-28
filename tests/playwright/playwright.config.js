const { defineConfig } = require('@playwright/test');
const { constants } = require('@bookstore/shared');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000,
  retries: Number(process.env.UI_RETRIES || 1),
  reporter: [
    ['html', { outputFolder: 'reports/playwright/html', open: 'never' }],
    ['junit', { outputFile: 'reports/playwright/junit.xml' }],
    [require('node:path').resolve(__dirname, 'reporter.js')]
  ],
  use: {
    baseURL: constants.baseUrl,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  }
});
