const { setTimeout: wait } = require('node:timers/promises');

const path = require('node:path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const { constants } = require('../packages/shared/src/config/constants');
const baseUrl = constants.baseUrl;
const path = '/wp-login.php';
const maxAttempts = Number(process.env.APP_WAIT_ATTEMPTS || 30);
const delayMs = Number(process.env.APP_WAIT_DELAY_MS || 5000);

async function check() {
  const url = `${baseUrl}${path}`;
  for (let i = 1; i <= maxAttempts; i += 1) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) {
        process.stdout.write(`App ready: ${url}\n`);
        return;
      }
    } catch (err) {
      // ignore and retry
    }
    process.stdout.write(`Waiting for app (${i}/${maxAttempts})...\n`);
    await wait(delayMs);
  }
  throw new Error(`App did not become ready in time at ${baseUrl}`);
}

check().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
