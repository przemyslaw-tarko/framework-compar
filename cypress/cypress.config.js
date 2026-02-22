const { defineConfig } = require("cypress");
module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://wordpress",
    supportFile: false,
    specPattern: "e2e/**/*.cy.js",
    allowCypressEnv: false,
  },
  reporter: "mocha-junit-reporter",
  reporterOptions: {
    mochaFile: "/work/results/cypress/results.xml",
    toConsole: false,
  }
});
