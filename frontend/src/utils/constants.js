export const EMOTIONAL_SCORES = {
  MIN: -10,
  MAX: 10
};

export const EMOTION_LABELS = {
  [-10]: 'Very Negative',
  [-8]: 'Extremely Negative',
  [-5]: 'Negative',
  [-3]: 'Somewhat Negative',
  [0]: 'Neutral',
  [3]: 'Somewhat Positive',
  [5]: 'Positive',
  [8]: 'Very Positive',
  [10]: 'Extremely Positive'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout'
  },
  MOVIES: {
    BASE: '/movies',
    BY_ID: (id) => `/movies/${id}`
  },
  STORY_FLOW: {
    BY_MOVIE_ID: (movieId) => `/storyflow/movie/${movieId}`,
    SCENE_ORDER: (id) => `/storyflow/${id}/scene-order`,
    EMOTIONAL_SCORES: (id) => `/storyflow/${id}/emotional-scores`
  },
  EXPORT: {
    PDF: (movieId) => `/export/movie/${movieId}`
  }
};