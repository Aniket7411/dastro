import crypto from 'crypto';

const BUNNY_STREAM_BASE_URL = 'https://video.bunnycdn.com';
const BUNNY_IFRAME_BASE_URL = 'https://iframe.mediadelivery.net';
const PLACEHOLDER_VALUES = new Set([
  '',
  'your_bunny_api_key_here',
  'your_bunny_library_id_here',
  'your_bunny_token_key_here',
  'your_library_id'
]);

const getRequiredEnv = (name) => {
  const value = process.env[name]?.trim();
  if (!value || PLACEHOLDER_VALUES.has(value)) {
    throw new Error(`${name} is not configured`);
  }
  return value;
};

export const getBunnyLibraryId = () => getRequiredEnv('BUNNY_LIBRARY_ID');

export const extractBunnyVideoId = (input = '') => {
  const value = String(input).trim();
  if (!value) return '';

  try {
    const url = new URL(value);
    const parts = url.pathname.split('/').filter(Boolean);
    const candidate = parts[parts.length - 1];
    return candidate || value;
  } catch {
    return value;
  }
};

/**
 * Generate a secure URL token for Bunny.net Stream
 * @param {string} videoId - The Bunny.net video ID
 * @param {number} expiresInSeconds - How long the token is valid (e.g. 3600 for 1 hr)
 * @returns {string} - The token signature to append to the URL
 */
export const generateBunnyToken = (videoId, expiresInSeconds = 3600) => {
  const securityKey = getRequiredEnv('BUNNY_TOKEN_KEY');

  // Token expiration time
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;

  // The string to sign: securityKey + videoId + expires
  const dataToSign = securityKey + videoId + expires;

  // Create SHA256 hash
  const hash = crypto.createHash('sha256').update(dataToSign).digest('hex');

  // Return the query string parameters required by Bunny.net
  return `?token=${hash}&expires=${expires}`;
};

export const getBunnyPlaybackInfo = (videoId, expiresInSeconds = 7200) => {
  const libraryId = getBunnyLibraryId();
  const cleanVideoId = extractBunnyVideoId(videoId);
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const securityKey = getRequiredEnv('BUNNY_TOKEN_KEY');
  const dataToSign = securityKey + cleanVideoId + expires;
  const hash = crypto.createHash('sha256').update(dataToSign).digest('hex');
  const playbackUrl = `${BUNNY_IFRAME_BASE_URL}/embed/${libraryId}/${cleanVideoId}?token=${hash}&expires=${expires}`;

  return {
    playbackUrl,
    expiresAt: new Date(expires * 1000).toISOString(),
  };
};

export const getBunnyEmbedUrl = (videoId, expiresInSeconds = 7200) =>
  getBunnyPlaybackInfo(videoId, expiresInSeconds).playbackUrl;

const bunnyFetch = async (path, options = {}) => {
  const apiKey = getRequiredEnv('BUNNY_API_KEY');
  const res = await fetch(`${BUNNY_STREAM_BASE_URL}${path}`, {
    ...options,
    headers: {
      AccessKey: apiKey,
      ...(options.headers || {})
    }
  });

  const text = await res.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    throw new Error(data.message || `Bunny Stream request failed with ${res.status}`);
  }

  return data;
};

export const createBunnyVideo = async (title) => {
  const libraryId = getBunnyLibraryId();
  const data = await bunnyFetch(`/library/${libraryId}/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  if (!data.guid) {
    throw new Error('Bunny Stream did not return a video GUID');
  }

  return data;
};

export const uploadBunnyVideoFile = async (videoId, fileBuffer) => {
  const libraryId = getBunnyLibraryId();
  return bunnyFetch(`/library/${libraryId}/videos/${videoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: fileBuffer
  });
};

export const checkBunnyConnection = async () => {
  const libraryId = getBunnyLibraryId();
  await bunnyFetch(`/library/${libraryId}/videos?page=1&itemsPerPage=1`, {
    method: 'GET'
  });
  return { libraryId };
};
