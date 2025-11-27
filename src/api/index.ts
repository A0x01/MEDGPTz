/**
 * API Module Exports
 *
 * Central export point for all API services and types.
 */

// Export API client
export { apiClient } from './client';

// Export auth API and helpers
export { authApi, setAuthToken, clearAuthToken, isAuthenticated } from './auth';
export type { LoginRequest, RegisterRequest, TokenResponse, User, PasswordChangeRequest } from './auth';

// Export API services
export { quizApi } from './quiz';
export { notesApi } from './notes';
export { flashcardsApi } from './flashcards';
export { statsApi } from './stats';

// Export all types
export * from './types';
