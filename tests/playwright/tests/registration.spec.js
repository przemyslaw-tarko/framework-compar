const { test } = require('@playwright/test');
const { registerUser } = require('./flows');

test('[C1001] Register new user', async ({ page }) => {
  const password = process.env.TEST_USER_PASSWORD || 'TestPass123!';
  await registerUser(page, password);
});
