export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3010',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      MAGIC_LINK: '/auth/magic-link',
      LOGOUT: '/auth/logout',
    },
    ASTRO: {
      NATAL_CHART: '/astro/natal-chart',
      TRANSITS: '/astro/transits',
      SYNASTRY: '/astro/synastry',
    },
    USERS: {
      PROFILE: '/users/profile',
      DASHBOARD: '/users/dashboard',
      UPDATE: '/users/update',
    },
    HEALTH: '/health',
  },
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
