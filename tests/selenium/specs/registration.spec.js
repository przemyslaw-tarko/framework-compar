const { createDriver, registerUser } = require('./utils');

describe('Registration', () => {
  it('[C1001] Register new user', async () => {
    const driver = await createDriver();
    try {
      const password = process.env.TEST_USER_PASSWORD || 'TestPass123!';
      await registerUser(driver, password);
    } finally {
      await driver.quit();
    }
  });
});
