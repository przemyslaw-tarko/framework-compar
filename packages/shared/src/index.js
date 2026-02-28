const { config } = require('./config/config');
const { constants } = require('./config/constants');
const { uniqueEmail, uniqueUsername } = require('./helpers/data');
const { selectors } = require('./selectors/selectors');
const { publishJUnit } = require('./testrail/publish');

module.exports = {
  config,
  constants,
  uniqueEmail,
  uniqueUsername,
  selectors,
  publishJUnit
};
