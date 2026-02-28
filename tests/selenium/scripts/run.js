const path = require('node:path');
const fs = require('node:fs');
const Mocha = require('mocha');
const { publishJUnit } = require('@bookstore/shared');

const rootDir = path.resolve(__dirname, '../../..');
process.chdir(rootDir);
const reportsDir = path.join(rootDir, 'reports/selenium');
const metricsDir = path.join(rootDir, 'reports/metrics');
fs.mkdirSync(reportsDir, { recursive: true });
fs.mkdirSync(metricsDir, { recursive: true });

const mocha = new Mocha({
  timeout: 120000,
  retries: Number(process.env.UI_RETRIES || 1),
  reporter: 'mocha-multi-reporters',
  reporterOptions: {
    configFile: path.resolve(__dirname, '../mocha-reporters.json')
  }
});

mocha.addFile(path.resolve(__dirname, '../specs/registration.spec.js'));
mocha.addFile(path.resolve(__dirname, '../specs/search.spec.js'));
mocha.addFile(path.resolve(__dirname, '../specs/checkout.spec.js'));
mocha.addFile(path.resolve(__dirname, '../specs/download.spec.js'));

const start = Date.now();
const runner = mocha.run(async (failures) => {
  const durationMs = Date.now() - start;
  const stats = runner.stats || {};
  const metrics = {
    framework: 'selenium',
    durationMs,
    tests: stats.tests || 0,
    passes: stats.passes || 0,
    failures: stats.failures || 0,
    retries: stats.retries || 0,
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync(path.join(metricsDir, 'selenium.json'), JSON.stringify(metrics, null, 2));

  try {
    await publishJUnit({ junitPath: path.join(reportsDir, 'junit.xml') });
  } catch (err) {
    console.error(`TestRail publish failed: ${err.message}`);
  }

  process.exit(failures ? 1 : 0);
});
