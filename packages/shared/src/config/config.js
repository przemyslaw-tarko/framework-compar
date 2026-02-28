const { constants } = require('./constants');

const config = {
  baseUrl: constants.baseUrl,
  timeouts: {
    short: 3000,
    medium: 10000,
    long: 30000
  },
  retries: {
    ui: Number(process.env.UI_RETRIES || 1)
  }
};

module.exports = { config };
