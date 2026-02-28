const { selectors } = require('@bookstore/shared');

Cypress.Commands.add('registerUser', (password) => {
  const { uniqueEmail } = require('@bookstore/shared');
  const email = uniqueEmail('bookstore');
  cy.visit('/my-account/');
  cy.get(selectors.myAccount.email).type(email);
  cy.get(selectors.myAccount.password).type(password, { log: false });
  cy.get(selectors.myAccount.registerButton).click();
  cy.get('.woocommerce-MyAccount-content', { timeout: 30000 }).should('be.visible');
  return cy.wrap(email, { log: false });
});
