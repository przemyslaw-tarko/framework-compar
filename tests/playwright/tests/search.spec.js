const { test } = require('@playwright/test');
const { searchProduct } = require('./flows');

test('[C1002] Browse and search products', async ({ page }) => {
  await searchProduct(page, 'book');
});
