/**
 * Authentication API Service
 *
 * Handles login, registration, and user session management.
 */

import { apiClient } from './client';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  full_name?: string;
  specialty?: string;
  institution?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  role: 'super_admin' | 'admin' | 'editor' | 'student' | 'viewer';
  specialty?: string;
  institution?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login?: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

const BASE_PATH = '/auth';

export const authApi = {
  /**
   * Login with email and password
   */
  login: (credentials: LoginRequest) =>
    apiClient.post<TokenResponse>(`${BASE_PATH}/login`, credentials),

  /**
   * Register a new account
   */
  register: (data: RegisterRequest) =>
    apiClient.post<TokenResponse>(`${BASE_PATH}/register`, {
      ...data,
      role: 'student', // Force student role for app.medgptx.local
    }),

  /**
   * Get current user info
   */
  me: () =>
    apiClient.get<User>(`${BASE_PATH}/me`),

  /**
   * Change password
   */
  changePassword: (data: PasswordChangeRequest) =>
    apiClient.post<{ message: string }>(`${BASE_PATH}/change-password`, data),

  /**
   * Logout and invalidate token
   */
  logout: () =>
    apiClient.post<{ message: string }>(`${BASE_PATH}/logout`),
};

// Helper functions
export function setAuthToken(token: string) {
  apiClient.setToken(token);
}

export function clearAuthToken() {
  apiClient.setToken(null);
}

export function isAuthenticated(): boolean {
  return apiClient.isAuthenticated();
}
