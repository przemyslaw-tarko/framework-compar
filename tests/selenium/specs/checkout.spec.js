const {
  createDriver,
  registerUser,
  searchProduct,
  addFirstProductToCart,
  fillCheckout,
  placeOrder
} = require('./utils');

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

describe('Checkout', () => {
  it('[C1003] Add product to cart and checkout with Stripe', async () => {
    const driver = await createDriver();
    try {
      const password = process.env.TEST_USER_PASSWORD || 'TestPass123!';
      const email = await registerUser(driver, password);
      await searchProduct(driver, 'book');
      await addFirstProductToCart(driver);
      await fillCheckout(driver, buildUser(email));
      await placeOrder(driver);
    } finally {
      await driver.quit();
    }
  });
});
