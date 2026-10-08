const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? `http://localhost:${window.location.port || 3000}`
  : '';

const loadingEl = document.getElementById('feed-loading');
const errorEl = document.getElementById('feed-error');
const emptyEl = document.getElementById('feed-empty');
const gridEl = document.getElementById('feed-grid');
const retryBtn = document.getElementById('retry-btn');

function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function showState(state) {
  loadingEl.style.display = 'none';
  errorEl.style.display = 'none';
  emptyEl.style.display = 'none';
  gridEl.style.display = 'none';

  switch (state) {
    case 'loading':
      loadingEl.style.display = 'block';
      break;
    case 'error':
      errorEl.style.display = 'block';
      break;
    case 'empty':
      emptyEl.style.display = 'block';
      break;
    case 'loaded':
      gridEl.style.display = 'grid';
      break;
  }
}

function safeUrl(value) {
  if (typeof value !== 'string') return null;

  try {
    const url = new URL(value);

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

function createPostCard(post) {
  const card = document.createElement('a');
  card.className = 'post-card';

  const permalink = safeUrl(post.permalink);
  if (permalink) {
    card.href = permalink;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
  } else {
    card.removeAttribute('href');
  }

  const mediaContainer = document.createElement('div');
  mediaContainer.className = 'post-media';

  const mediaUrl = safeUrl(post.mediaUrl);
  const caption = typeof post.caption === 'string' ? post.caption : '';

  if (mediaUrl) {
    const isVideo = post.mediaType === 'VIDEO';
    const media = document.createElement(isVideo ? 'video' : 'img');

    media.src = mediaUrl;

    if (isVideo) {
      media.muted = true;
      media.playsInline = true;
    } else {
      media.alt = caption || 'Instagram post';
      media.loading = 'lazy';
    }

    mediaContainer.appendChild(media);
  }

  if (post.mediaType === 'VIDEO' || post.mediaType === 'CAROUSEL_ALBUM') {
    const badge = document.createElement('span');
    badge.className = 'media-type-badge';
    badge.textContent = post.mediaType === 'VIDEO' ? 'Video' : 'Album';
    mediaContainer.appendChild(badge);
  }

  const content = document.createElement('div');
  content.className = 'post-content';

  const captionEl = document.createElement('p');
  captionEl.className = 'post-caption';
  captionEl.textContent = caption;

  const meta = document.createElement('div');
  meta.className = 'post-meta';

  const date = document.createElement('span');
  date.className = 'post-date';
  date.textContent = formatDate(post.timestamp);

  const linkText = document.createElement('span');
  linkText.className = 'post-link';
  linkText.textContent = permalink ? 'View on Instagram →' : '';

  meta.append(date, linkText);
  content.append(captionEl, meta);
  card.append(mediaContainer, content);

  return card;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function loadPosts() {
  showState('loading');

  try {
    const response = await fetch(`${API_BASE_URL}/api/posts`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const posts = await response.json();

// The API must return an array of posts.
if (!Array.isArray(posts)) {
  throw new Error('Invalid API response: expected an array of posts');
}

// An empty array is valid, but there are no posts to display.
if (posts.length === 0) {
  gridEl.innerHTML = '';
  showState('empty');
  return;
}
    gridEl.innerHTML = '';
    posts.forEach(post => {
      const card = createPostCard(post);
      gridEl.appendChild(card);
    });

    showState('loaded');

} catch (error) {
  console.error('Failed to load Instagram posts:', error);
  gridEl.innerHTML = '';
  showState('error');
}
}

retryBtn.addEventListener('click', loadPosts);

document.addEventListener('DOMContentLoaded', loadPosts);
if (typeof window !== 'undefined') {
  window.__loadPostsForTesting = loadPosts;
}