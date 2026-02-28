const fs = require('node:fs');
const path = require('node:path');
const { publishJUnit } = require('@bookstore/shared');

class MetricsReporter {
  onBegin() {
    this.start = Date.now();
  }

  async onEnd(result) {
    const durationMs = Date.now() - this.start;
    const metricsDir = path.resolve('reports/metrics');
    fs.mkdirSync(metricsDir, { recursive: true });

    const metrics = {
      framework: 'playwright',
      durationMs,
      status: result.status,
      timestamp: new Date().toISOString()
    };
    fs.writeFileSync(path.join(metricsDir, 'playwright.json'), JSON.stringify(metrics, null, 2));

    try {
      await publishJUnit({ junitPath: path.resolve('reports/playwright/junit.xml') });
    } catch (err) {
      console.error(`TestRail publish failed: ${err.message}`);
    }
  }
}

module.exports = MetricsReporter;
