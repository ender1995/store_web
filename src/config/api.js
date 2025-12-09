export const API_BASE_URL = import.meta.env.VUE_APP_API_BASE_URL || 'http://localhost:8080/api';

export const LOGIN_URL = `${API_BASE_URL}/auth/login`;
export const FORGOT_PASSWORD_URL = `${API_BASE_URL}/auth/forgot-password`;
export const RESET_PASSWORD_URL = `${API_BASE_URL}/auth/reset-password`;