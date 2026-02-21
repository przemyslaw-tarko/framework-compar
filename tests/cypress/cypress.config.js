const { defineConfig } = require("cypress");
const { report } = require("node:process");

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://wordpress",
    supportFile: false,
    specPattern: "e2e/**/*.cy.js",
  },
  reporter: "mocha-junit-reporter",
  reporterOptions: {
    mochaFile: "work/results/cypress/results.xml",
  }
});
