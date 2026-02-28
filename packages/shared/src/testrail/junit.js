const fs = require('node:fs');
const { XMLParser } = require('fast-xml-parser');

function extractCaseId(name) {
  const match = /\[C(\d+)\]/.exec(name || '');
  return match ? Number(match[1]) : null;
}

function normalizeTestcases(testcases) {
  if (!testcases) return [];
  if (Array.isArray(testcases)) return testcases;
  return [testcases];
}

function parseJUnit(filePath) {
  const xml = fs.readFileSync(filePath, 'utf8');
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
  const data = parser.parse(xml);
  const suites = data.testsuites?.testsuite || data.testsuite;
  const suitesArr = Array.isArray(suites) ? suites : suites ? [suites] : [];

  const results = [];
  for (const suite of suitesArr) {
    const cases = normalizeTestcases(suite.testcase);
    for (const tc of cases) {
      const name = tc.name || '';
      const caseId = extractCaseId(name);
      if (!caseId) continue;
      let statusId = 1;
      let comment = '';
      if (tc.failure) {
        statusId = 5;
        comment = typeof tc.failure === 'string' ? tc.failure : tc.failure.message || 'failure';
      } else if (tc.skipped) {
        statusId = 3;
        comment = 'skipped';
      }
      results.push({ case_id: caseId, status_id: statusId, comment });
    }
  }
  return results;
}

module.exports = { parseJUnit };
