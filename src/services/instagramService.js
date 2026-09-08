const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;

const FAKE_POSTS = [
  {
    id: '1',
    caption: 'Wedding photography session at sunset. The golden hour never disappoints! 📸✨',
    mediaUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    permalink: 'https://instagram.com/',
    mediaType: 'IMAGE',
    timestamp: '2026-09-07T12:00:00Z'
  },
  {
    id: '2',
    caption: 'Portrait session with the amazing Sarah. Natural light is everything!',
    mediaUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    permalink: 'https://instagram.com/',
    mediaType: 'IMAGE',
    timestamp: '2026-09-06T15:30:00Z'
  },
  {
    id: '3',
    caption: 'Landscape photography in the mountains. Sometimes you just need to breathe it all in.',
    mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    permalink: 'https://instagram.com/',
    mediaType: 'IMAGE',
    timestamp: '2026-09-05T09:15:00Z'
  },
  {
    id: '4',
    caption: 'Street photography in the city. Every corner tells a story.',
    mediaUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80',
    permalink: 'https://instagram.com/',
    mediaType: 'IMAGE',
    timestamp: '2026-09-04T18:45:00Z'
  },
  {
    id: '5',
    caption: 'Product shoot for a local coffee brand. Freshly roasted beans = pure magic.',
    mediaUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    permalink: 'https://instagram.com/',
    mediaType: 'IMAGE',
    timestamp: '2026-09-03T11:20:00Z'
  },
  {
    id: '6',
    caption: 'Nature macro photography. The beauty in the smallest details.',
    mediaUrl: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=800&q=80',
    permalink: 'https://instagram.com/',
    mediaType: 'IMAGE',
    timestamp: '2026-09-02T07:00:00Z'
  }
];

function mapInstagramPost(igPost) {
  return {
    id: igPost.id || '',
    caption: igPost.caption || '',
    mediaUrl: igPost.media_url || igPost.thumbnail_url || '',
    permalink: igPost.permalink || '',
    mediaType: igPost.media_type || 'IMAGE',
    timestamp: igPost.timestamp || new Date().toISOString()
  };
}

async function fetchFromInstagram() {
  if (!ACCESS_TOKEN || !ACCOUNT_ID) {
    return null;
  }

  const url = `https://graph.instagram.com/v18.0/${ACCOUNT_ID}/media?fields=id,caption,media_url,thumbnail_url,permalink,media_type,timestamp&access_token=${ACCESS_TOKEN}&limit=20`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Instagram API error response:', errorText);
      throw new Error(`Instagram API returned status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Network error fetching Instagram posts:', error.message);
    throw error;
  }
}

async function getPosts() {
  try {
    const igData = await fetchFromInstagram();

    if (igData && Array.isArray(igData.data) && igData.data.length > 0) {
      return igData.data.map(mapInstagramPost);
    }

    if (!ACCESS_TOKEN || !ACCOUNT_ID) {
      console.warn('Instagram credentials not configured - returning fake posts');
      return FAKE_POSTS;
    }

    if (!igData) {
      const error = new Error('No response from Instagram API');
      error.statusCode = 502;
      error.publicMessage = 'Unable to retrieve Instagram posts';
      throw error;
    }

    return [];
  } catch (error) {
    if (error.message.includes('status 401') || error.message.includes('status 403')) {
      const customError = new Error('Invalid or expired Instagram credentials');
      customError.statusCode = 502;
      customError.publicMessage = 'Unable to retrieve Instagram posts';
      throw customError;
    }

    if (error.statusCode && error.publicMessage) {
      throw error;
    }

    const customError = new Error(`Failed to fetch Instagram posts: ${error.message}`);
    customError.statusCode = 502;
    customError.publicMessage = 'Unable to retrieve Instagram posts';
    throw customError;
  }
}

module.exports = {
  getPosts,
  mapInstagramPost
};
