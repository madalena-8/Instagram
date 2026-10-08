const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(
  path.join(__dirname, '../public/index.html'),
  'utf8'
);

const appJs = fs.readFileSync(
  path.join(__dirname, '../public/app.js'),
  'utf8'
);

function setupFrontend(mockFetch) {
  const dom = new JSDOM(html, {
    url: 'http://localhost:3000/',
    runScripts: 'outside-only'
  });

  dom.window.fetch = mockFetch;

  // Prevent an automatic page-load request during tests.
  const originalAddEventListener =
    dom.window.document.addEventListener.bind(dom.window.document);

  dom.window.document.addEventListener = (event, handler, options) => {
    if (event === 'DOMContentLoaded') return;
    return originalAddEventListener(event, handler, options);
  };

  dom.window.eval(appJs);

  return {
    dom,
    document: dom.window.document,
    loadPosts: dom.window.__loadPostsForTesting
  };
}

test('Frontend shows loading state while fetching posts', async () => {
  const { dom, document, loadPosts } = setupFrontend(
    () => new Promise(() => {})
  );

  loadPosts();

  const loading = document.getElementById('feed-loading');

  assert.equal(loading.style.display, 'block');

  dom.window.close();
});

test('Frontend displays Instagram posts successfully', async () => {
  const fakePosts = [{
    id: '123',
    caption: 'My photography test',
    mediaUrl: 'https://example.com/photo.jpg',
    permalink: 'https://instagram.com/p/test',
    mediaType: 'IMAGE',
    timestamp: '2026-10-08T12:00:00Z'
  }];

  const { dom, document, loadPosts } = setupFrontend(
    async () => ({
      ok: true,
      json: async () => fakePosts
    })
  );

  await loadPosts();

  const grid = document.getElementById('feed-grid');
  const card = grid.querySelector('.post-card');

  assert.equal(grid.style.display, 'grid');
  assert.ok(card);
  assert.equal(
    card.querySelector('.post-caption').textContent,
    'My photography test'
  );
  assert.equal(card.href, 'https://instagram.com/p/test');

  dom.window.close();
});

test('Frontend displays empty state when no posts exist', async () => {
  const { dom, document, loadPosts } = setupFrontend(
    async () => ({
      ok: true,
      json: async () => []
    })
  );

  await loadPosts();

  assert.equal(
    document.getElementById('feed-empty').style.display,
    'block'
  );

  assert.equal(
    document.getElementById('feed-grid').style.display,
    'none'
  );

  dom.window.close();
});

test('Frontend shows error and recovers when user retries', async () => {
  let attempts = 0;

  const fakePosts = [{
    id: '456',
    caption: 'Recovered Instagram post',
    mediaUrl: 'https://example.com/photo.jpg',
    permalink: 'https://instagram.com/p/recovered',
    mediaType: 'IMAGE',
    timestamp: '2026-10-08T12:00:00Z'
  }];

  const { dom, document, loadPosts } = setupFrontend(
    async () => {
      attempts++;

      if (attempts === 1) {
        throw new Error('Network unavailable');
      }

      return {
        ok: true,
        json: async () => fakePosts
      };
    }
  );

  // First request fails.
  await loadPosts();

  assert.equal(attempts, 1);
  assert.equal(
    document.getElementById('feed-error').style.display,
    'block'
  );

  // User clicks retry.
  document.getElementById('retry-btn').click();

  // Wait for the retried request to complete.
  await new Promise(resolve => setImmediate(resolve));

  assert.equal(attempts, 2);
  assert.equal(
    document.getElementById('feed-grid').style.display,
    'grid'
  );

  assert.equal(
    document.querySelector('.post-caption').textContent,
    'Recovered Instagram post'
  );

  dom.window.close();
});

test('Frontend renders VIDEO and CAROUSEL_ALBUM posts', async () => {
  const posts = [
    {
      id: 'video-1',
      caption: 'Behind the scenes',
      mediaUrl: 'https://example.com/video.mp4',
      permalink: 'https://instagram.com/p/video',
      mediaType: 'VIDEO'
    },
    {
      id: 'album-1',
      caption: 'Photo collection',
      mediaUrl: 'https://example.com/album.jpg',
      permalink: 'https://instagram.com/p/album',
      mediaType: 'CAROUSEL_ALBUM'
    }
  ];

  const { dom, document, loadPosts } = setupFrontend(
    async () => ({
      ok: true,
      json: async () => posts
    })
  );

  await loadPosts();

  const cards = document.querySelectorAll('.post-card');

  assert.equal(cards.length, 2);
  assert.ok(cards[0].querySelector('video'));
  assert.ok(cards[1].querySelector('img'));
  assert.equal(
    cards[0].querySelector('.media-type-badge').textContent,
    'Video'
  );
  assert.equal(
    cards[1].querySelector('.media-type-badge').textContent,
    'Album'
  );

  dom.window.close();
});

test('Frontend handles posts with missing optional fields', async () => {
  const posts = [{
    id: 'missing-fields',
    mediaUrl: 'https://example.com/photo.jpg',
    mediaType: 'IMAGE'
  }];

  const { dom, document, loadPosts } = setupFrontend(
    async () => ({
      ok: true,
      json: async () => posts
    })
  );

  await loadPosts();

  const card = document.querySelector('.post-card');

  assert.ok(card);
  assert.equal(
    card.querySelector('.post-caption').textContent,
    ''
  );
  assert.equal(
    document.getElementById('feed-grid').style.display,
    'grid'
  );

  dom.window.close();
});

test('Frontend shows error for invalid API response', async () => {
  const { dom, document, loadPosts } = setupFrontend(
    async () => ({
      ok: true,
      json: async () => ({
        message: 'Unexpected response'
      })
    })
  );

  await loadPosts();

  assert.equal(
    document.getElementById('feed-error').style.display,
    'block'
  );

  assert.equal(
    document.getElementById('feed-empty').style.display,
    'none'
  );

  dom.window.close();
});

test('Frontend rejects unsafe media and link URLs', async () => {
  const posts = [{
    id: 'unsafe-1',
    caption: '<script>alert("test")</script>',
    mediaUrl: 'javascript:alert(1)',
    permalink: 'javascript:alert(2)',
    mediaType: 'IMAGE'
  }];

  const { dom, document, loadPosts } = setupFrontend(
    async () => ({
      ok: true,
      json: async () => posts
    })
  );

  await loadPosts();

  const card = document.querySelector('.post-card');

  assert.ok(card);
  assert.equal(card.hasAttribute('href'), false);
  assert.equal(card.querySelector('img'), null);
  assert.equal(card.querySelector('script'), null);
  assert.equal(
    card.querySelector('.post-caption').textContent,
    '<script>alert("test")</script>'
  );

  dom.window.close();
});

