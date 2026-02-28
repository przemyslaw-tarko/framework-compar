const { createDriver, searchProduct } = require('./utils');

describe('Search', () => {
  it('[C1002] Browse and search products', async () => {
    const driver = await createDriver();
    try {
      await searchProduct(driver, 'book');
    } finally {
      await driver.quit();
    }
  });
});
