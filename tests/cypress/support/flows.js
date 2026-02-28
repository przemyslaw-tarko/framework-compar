const { selectors } = require('@bookstore/shared');

function registerUser(password) {
  const { uniqueEmail } = require('@bookstore/shared');
  const email = uniqueEmail('bookstore');
  cy.visit('/my-account/');
  cy.get(selectors.myAccount.email).type(email);
  cy.get(selectors.myAccount.password).type(password, { log: false });
  cy.get(selectors.myAccount.registerButton).click();
  cy.get('.woocommerce-MyAccount-content', { timeout: 30000 }).should('be.visible');
  return cy.wrap(email, { log: false });
}

function searchProduct(term) {
  cy.visit('/shop/');
  cy.get('body').then(($body) => {
    if ($body.find(selectors.search.input).length) {
      cy.get(selectors.search.input).clear().type(term);
    } else {
      cy.get(selectors.search.fallbackInput).clear().type(term);
    }
  });
  cy.get(selectors.search.submit).click();
  cy.get('.products', { timeout: 30000 }).should('be.visible');
}

function addFirstProductToCart() {
  cy.get(selectors.product.addToCartButton, { timeout: 30000 }).first().click();
  cy.get(selectors.product.viewCartLink, { timeout: 30000 }).click();
  cy.get(selectors.cart.checkoutButton, { timeout: 30000 }).should('be.visible');
}

function fillStripeCard() {
  const cardNumber = Cypress.env('STRIPE_CARD_NUMBER') || '4242424242424242';
  const cardExp = Cypress.env('STRIPE_CARD_EXP') || '12/30';
  const cardCvc = Cypress.env('STRIPE_CARD_CVC') || '123';
  const cardZip = Cypress.env('STRIPE_CARD_ZIP') || '12345';

  cy.get('body').then(($body) => {
    const frame = $body.find('iframe[name^="__privateStripeFrame"], iframe[name*="stripe"], iframe[title*="Secure"]');
    if (!frame.length) return;
    cy.wrap(frame[0])
      .its('contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
      .find('input[name="cardnumber"]')
      .type(cardNumber, { log: false });

    cy.wrap(frame[0])
      .its('contentDocument.body')
      .then(cy.wrap)
      .find('input[name="exp-date"]')
      .type(cardExp, { log: false });

    cy.wrap(frame[0])
      .its('contentDocument.body')
      .then(cy.wrap)
      .find('input[name="cvc"]')
      .type(cardCvc, { log: false });

    cy.wrap(frame[0])
      .its('contentDocument.body')
      .then(cy.wrap)
      .find('input[name="postal"]')
      .type(cardZip, { log: false });
  });
}

function fillCheckout(user) {
  cy.get(selectors.cart.checkoutButton).click();
  cy.get(selectors.checkout.firstName, { timeout: 30000 }).clear().type(user.firstName);
  cy.get(selectors.checkout.lastName).clear().type(user.lastName);
  cy.get(selectors.checkout.address).clear().type(user.address);
  cy.get(selectors.checkout.city).clear().type(user.city);
  cy.get(selectors.checkout.postcode).clear().type(user.postcode);
  cy.get(selectors.checkout.phone).clear().type(user.phone);
  cy.get(selectors.checkout.email).clear().type(user.email);

  cy.get('body').then(($body) => {
    if ($body.find(selectors.checkout.paymentStripe).length) {
      cy.get(selectors.checkout.paymentStripe).check({ force: true });
      fillStripeCard();
    }
  });
}

function placeOrder() {
  cy.get(selectors.checkout.placeOrder).click();
  cy.get(selectors.order.receivedNotice, { timeout: 30000 }).should('be.visible');
}

function openDownloads() {
  cy.visit('/my-account/downloads/');
  cy.get(selectors.downloads.links, { timeout: 30000 }).should('exist');
}

module.exports = {
  registerUser,
  searchProduct,
  addFirstProductToCart,
  fillCheckout,
  placeOrder,
  openDownloads
};
