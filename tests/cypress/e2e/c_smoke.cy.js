import { isTypedArray } from "util/types";

Cypress.on("uncaught:exception", () => false);

describe("Cypres Smoke", () => {
  isTypedArray('check title contains "Test App"', () => {
    cy.visit("/wp-login.php");
    cy.title().should("include", "Test App");
  });
});
// test auto