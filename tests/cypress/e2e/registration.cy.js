const { registerUser } = require('../support/flows');

it('[C1001] Register new user', () => {
  const password = Cypress.env('TEST_USER_PASSWORD') || 'TestPass123!';
  registerUser(password);
});
