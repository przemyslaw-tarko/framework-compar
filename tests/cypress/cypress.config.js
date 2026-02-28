const path = require('node:path');
const fs = require('node:fs');
const { publishJUnit, constants } = require('@bookstore/shared');

module.exports = {
  e2e: {
    baseUrl: constants.baseUrl,
    specPattern: 'tests/cypress/e2e/**/*.cy.js',
    supportFile: 'tests/cypress/support/e2e.js',
    screenshotsFolder: 'reports/cypress/screenshots',
    videosFolder: 'reports/cypress/videos',
    retries: {
      runMode: Number(process.env.UI_RETRIES || 1),
      openMode: 0
    },
    setupNodeEvents(on, config) {
      on('after:run', async (results) => {
        const metricsDir = path.resolve('reports/metrics');
        fs.mkdirSync(metricsDir, { recursive: true });
        const metrics = {
          framework: 'cypress',
          durationMs: results.totalDuration || 0,
          tests: results.totalTests || 0,
          passes: results.totalPassed || 0,
          failures: results.totalFailed || 0,
          skipped: results.totalSkipped || 0,
          timestamp: new Date().toISOString()
        };
        fs.writeFileSync(path.join(metricsDir, 'cypress.json'), JSON.stringify(metrics, null, 2));

        try {
          await publishJUnit({ junitPath: path.resolve('reports/cypress/junit.xml') });
        } catch (err) {
          // avoid failing run if TestRail publish fails
          console.error(`TestRail publish failed: ${err.message}`);
        }
      });
      return config;
    }
  },
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'tests/cypress/reporter-config.json'
  },
  video: true,
  screenshotOnRunFailure: true
};
