const { test } = require('@playwright/test');
const {
  registerUser,
  searchProduct,
  addFirstProductToCart,
  fillCheckout,
  placeOrder
} = require('./flows');

function buildUser(email) {
  return {
    email,
    firstName: process.env.TEST_USER_FIRSTNAME || 'Jan',
    lastName: process.env.TEST_USER_LASTNAME || 'Kowalski',
    address: process.env.TEST_USER_ADDRESS || 'Testowa 1',
    city: process.env.TEST_USER_CITY || 'Warszawa',
    postcode: process.env.TEST_USER_POSTCODE || '00-001',
    phone: process.env.TEST_USER_PHONE || '500600700'
  };
}

test('[C1003] Add product to cart and checkout with Stripe', async ({ page }) => {
  const password = process.env.TEST_USER_PASSWORD || 'TestPass123!';
  const email = await registerUser(page, password);
  await searchProduct(page, 'book');
  await addFirstProductToCart(page);
  await fillCheckout(page, buildUser(email));
  await placeOrder(page);
});
