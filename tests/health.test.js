const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

test('Health endpoint returns HTTP 200', async () => {
  const server = app.listen(0);

  try {
    const port = server.address().port;
    const response = await fetch(`http://localhost:${port}/`);

    assert.equal(response.status, 200);

    const data = await response.json();
    assert.equal(data.status, 'operational');
  } finally {
    server.close();
  }
});