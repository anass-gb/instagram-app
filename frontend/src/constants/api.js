// ─────────────────────────────────────────────────────────────────────────────
//  CONFIGURATION API — Backend Spring Boot + APIs gratuites
// ─────────────────────────────────────────────────────────────────────────────


export const API_BASE_URL = 'http://192.168.1.205:8080/api';


export const CLOUDINARY = {
  CLOUD_NAME: 'dzi6ralfd',
  UPLOAD_PRESET: 'instagram',
  BASE_URL: 'https://api.cloudinary.com/v1_1',
};
export const uploadToCloudinary = async (fileUri, resourceType = 'image') => {
  const formData = new FormData();
  formData.append('file', { uri: fileUri, type: 'image/jpeg', name: 'upload.jpg' });
  formData.append('upload_preset', CLOUDINARY.UPLOAD_PRESET);
  formData.append('cloud_name', CLOUDINARY.CLOUD_NAME);
  const res = await fetch(
    `${CLOUDINARY.BASE_URL}/${CLOUDINARY.CLOUD_NAME}/${resourceType}/upload`,
    { method: 'POST', body: formData }
  );
  const data = await res.json();
  return data.secure_url; // URL publique de l'image
};

// ── DiceBear Avatars (avatars générés — 100% gratuit) ────────────────────────
export const getDiceBearAvatar = (seed) =>
  `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=1DB954`;

// ── Nominatim OpenStreetMap (géolocalisation inversée — 100% gratuit) ─────────
export const reverseGeocode = async (lat, lon) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { 'Accept-Language': 'fr' } }
  );
  const data = await res.json();
  return data.display_name || '';
};

// ── Emoji API (emojis — gratuit basique) ─────────────────────────────────────
export const EMOJI_REACTIONS = ['❤️', '😂', '😮', '😢', '😡', '👏'];

// ── LibreTranslate (traduction — open source, gratuit) ───────────────────────
export const translateText = async (text, targetLang = 'fr') => {
  try {
    const res = await fetch('https://libretranslate.de/translate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ q: text, source: 'auto', target: targetLang }),
    });
    const data = await res.json();
    return data.translatedText || text;
  } catch { return text; }
};

// ── Picsum Photos (images placeholder pour tests — gratuit) ──────────────────
export const getPlaceholderImage = (width = 800, height = 800, id) =>
  id ? `https://picsum.photos/id/${id}/${width}/${height}` : `https://picsum.photos/${width}/${height}`;

// ── Endpoints Backend ─────────────────────────────────────────────────────────
export const EP = {
  // Auth
  SIGNUP:         '/auth/signup',
  SIGNIN:         '/auth/signin',
  SIGNOUT:        '/auth/signout',
  // Users
  ME:             '/users/me',
  USER:           (id) => `/users/${id}`,
  UPDATE_PROFILE: '/users/me',
  SEARCH_USERS:   '/users/search',
  // Posts
  POSTS:          '/posts',
  POST:           (id) => `/posts/${id}`,
  FEED:           '/posts/feed',
  USER_POSTS:     (id) => `/posts/user/${id}`,
  // Likes
  LIKE_POST:      (id) => `/likes/posts/${id}`,
  LIKE_COMMENT:   (id) => `/likes/comments/${id}`,
  LIKE_MESSAGE:   (id) => `/likes/messages/${id}`,
  LIKE_STORY:     (id) => `/likes/story/${id}`,
  // Comments
  COMMENTS:       (pid)=> `/posts/${pid}/comments`,
  DELETE_COMMENT: (id) => `/comments/${id}`,
  // Follow
  FOLLOW:         (id) => `/follow/${id}`,
  FOLLOWERS:      (id) => `/follow/${id}/followers`,
  FOLLOWING:      (id) => `/follow/${id}/following`,
  // Stories
  STORIES:        '/stories',
  STORY_FEED:     '/stories/feed',
  USER_STORIES:   (id) => `/stories/user/${id}`,
  VIEW_STORY:     (id) => `/stories/${id}/view`,
  // Messages
  SEND_MSG:       (id) => `/messages/${id}`,
  CONVERSATION:   (id) => `/messages/conversation/${id}`,
  MARK_READ:      (id) => `/messages/${id}/read`,
  // Notifications
  NOTIFS:         '/notifications',
  UNREAD_COUNT:   '/notifications/unread-count',
  READ_ALL:       '/notifications/read-all',
  // Saved
  SAVE:           (id) => `/saved/${id}`,
  SAVED:          '/saved',
  // Blocks
  BLOCK:          (id) => `/blocks/${id}`,
  BLOCKED:        '/blocks',
  // Search
  SEARCH:         '/search',
  SEARCH_USERS:   '/search/users',
  SEARCH_POSTS:   '/search/posts',
};
