const { TestRailClient } = require('./client');
const { parseJUnit } = require('./junit');

async function publishJUnit({ junitPath, runId }) {
  const enabled = String(process.env.TESTRAIL_ENABLED || 'false').toLowerCase() === 'true';
  if (!enabled) {
    console.log('TestRail publishing disabled.');
    return;
  }

  const baseUrl = process.env.TESTRAIL_URL;
  const user = process.env.TESTRAIL_USER;
  const apiKey = process.env.TESTRAIL_API_KEY;
  const resolvedRunId = runId || process.env.TESTRAIL_RUN_ID;

  if (!baseUrl || !user || !apiKey || !resolvedRunId) {
    throw new Error('Missing TestRail configuration.');
  }

  const results = parseJUnit(junitPath);
  if (results.length === 0) {
    console.log('No TestRail case IDs found in JUnit. Skipping publish.');
    return;
  }

  const client = new TestRailClient({ baseUrl, user, apiKey });
  await client.addResultsForCases(resolvedRunId, results);
  console.log(`Published ${results.length} results to TestRail run ${resolvedRunId}.`);
}

module.exports = { publishJUnit };
