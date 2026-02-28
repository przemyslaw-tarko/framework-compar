const {
  registerUser,
  searchProduct,
  addFirstProductToCart,
  fillCheckout,
  placeOrder,
  openDownloads
} = require('../support/flows');

function buildUser(email) {
  return {
    email,
    firstName: Cypress.env('TEST_USER_FIRSTNAME') || 'Jan',
    lastName: Cypress.env('TEST_USER_LASTNAME') || 'Kowalski',
    address: Cypress.env('TEST_USER_ADDRESS') || 'Testowa 1',
    city: Cypress.env('TEST_USER_CITY') || 'Warszawa',
    postcode: Cypress.env('TEST_USER_POSTCODE') || '00-001',
    phone: Cypress.env('TEST_USER_PHONE') || '500600700'
  };
}

it('[C1004] Verify purchase and download ebook from account', () => {
  const password = Cypress.env('TEST_USER_PASSWORD') || 'TestPass123!';
  registerUser(password).then((email) => {
    searchProduct('book');
    addFirstProductToCart();
    fillCheckout(buildUser(email));
    placeOrder();
    openDownloads();
  });
});
