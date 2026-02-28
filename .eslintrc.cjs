module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  ignorePatterns: ["reports/", "results/", "node_modules/", "**/*.min.js"],
  globals: {
    fetch: "readonly"
  },
  rules: {
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": "off"
  },
  overrides: [
    {
      files: ["tests/cypress/**/*.js"],
      env: {
        mocha: true
      },
      globals: {
        Cypress: "readonly",
        cy: "readonly"
      }
    },
    {
      files: ["tests/selenium/**/*.js"],
      env: {
        mocha: true
      }
    },
    {
      files: ["tests/playwright/**/*.js"],
      env: {
        jest: true
      }
    }
  ]
};
