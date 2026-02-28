class TestRailClient {
  constructor({ baseUrl, user, apiKey }) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.user = user;
    this.apiKey = apiKey;
  }

  async request(method, path, body) {
    const url = `${this.baseUrl}/${path.replace(/^\//, '')}`;
    const auth = Buffer.from(`${this.user}:${this.apiKey}`).toString('base64');
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`TestRail API error ${res.status}: ${text}`);
    }
    return res.json();
  }

  async addResultsForCases(runId, results) {
    return this.request('POST', `index.php?/api/v2/add_results_for_cases/${runId}`, {
      results
    });
  }
}

module.exports = { TestRailClient };
