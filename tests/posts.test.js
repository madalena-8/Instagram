const test = require('node:test');
const assert = require('node:assert/strict');

const instagramService = require('../src/services/instagramService');
const app = require('../src/app');

test('GET /api/posts returns Instagram posts as JSON', async (t) => {
  const fakePosts = [
    {
      id: '123',
      caption: 'Test Instagram post',
      mediaUrl: 'https://example.com/photo.jpg',
      permalink: 'https://instagram.com/p/test',
      mediaType: 'IMAGE',
      timestamp: '2026-10-08T12:00:00Z'
    }
  ];

  t.mock.method(instagramService, 'getPosts', async () => fakePosts);

  const server = app.listen(0);

  try {
    const port = server.address().port;
    const response = await fetch(`http://localhost:${port}/api/posts`);
    const data = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(data, fakePosts);
  } finally {
    server.close();
  }
});

test('GET /api/posts handles Instagram service errors', async (t) => {
  const instagramError = new Error('Instagram unavailable');

  instagramError.statusCode = 502;
  instagramError.publicMessage = 'Unable to retrieve Instagram posts';

  t.mock.method(instagramService, 'getPosts', async () => {
    throw instagramError;
  });

  const server = app.listen(0);

  try {
    const port = server.address().port;
    const response = await fetch(`http://localhost:${port}/api/posts`);
    const data = await response.json();

    assert.equal(response.status, 502);
    assert.deepEqual(data, {
      error: 'Unable to retrieve Instagram posts'
    });
  } finally {
    server.close();
  }
});

test('Unknown endpoint returns HTTP 404', async () => {
  const server = app.listen(0);

  try {
    const port = server.address().port;
    const response = await fetch(`http://localhost:${port}/unknown`);
    const data = await response.json();

    assert.equal(response.status, 404);
    assert.deepEqual(data, {
      error: 'Endpoint not found'
    });
  } finally {
    server.close();
  }
});