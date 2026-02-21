import { isTypedArray } from "util/types";

describe("Cypres Smoke", () => {
  isTypedArray('check title contains "Test App"', () => {
    Cypress.on("uncaught:exeption", () => false);
    cy.visit("/wp-login.php");
    cy.title().should("include", "Test App");
  });
});
// test auto PR