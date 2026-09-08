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

function createPostCard(post) {
  const card = document.createElement('a');
  card.className = 'post-card';
  card.href = post.permalink || '#';
  card.target = '_blank';
  card.rel = 'noopener noreferrer';

  let mediaHtml = '';
  if (post.mediaType === 'VIDEO') {
    mediaHtml = `<video src="${post.mediaUrl}" poster="" muted playsinline></video>`;
  } else if (post.mediaType === 'CAROUSEL_ALBUM') {
    mediaHtml = `<img src="${post.mediaUrl}" alt="${escapeHtml(post.caption || 'Instagram post')}" loading="lazy">`;
  } else {
    mediaHtml = `<img src="${post.mediaUrl}" alt="${escapeHtml(post.caption || 'Instagram post')}" loading="lazy">`;
  }

  let mediaBadge = '';
  if (post.mediaType === 'VIDEO') {
    mediaBadge = '<span class="media-type-badge">Video</span>';
  } else if (post.mediaType === 'CAROUSEL_ALBUM') {
    mediaBadge = '<span class="media-type-badge">Album</span>';
  }

  card.innerHTML = `
    <div class="post-media">
      ${mediaHtml}
      ${mediaBadge}
    </div>
    <div class="post-content">
      <p class="post-caption">${escapeHtml(post.caption || '')}</p>
      <div class="post-meta">
        <span class="post-date">${formatDate(post.timestamp)}</span>
        <span class="post-link">View on Instagram &rarr;</span>
      </div>
    </div>
  `;

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

    if (!Array.isArray(posts) || posts.length === 0) {
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
    showState('error');
  }
}

retryBtn.addEventListener('click', loadPosts);

document.addEventListener('DOMContentLoaded', loadPosts);
