Cypress.on("uncaught:exception", () => false);

describe("Cypres Smoke", () => {
  it('check title contains "Test App"', () => {
    cy.visit("/wp-login.php");
    cy.title().should("include", "Test App");
  });
});