// API Configuration
// Update this URL to your backend server URL
export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  signup: `${API_BASE_URL}/api/auth/signup`,
  verify: `${API_BASE_URL}/api/auth/verify`,
  login: `${API_BASE_URL}/api/auth/login`,
  cart: `${API_BASE_URL}/api/cart`,
};
