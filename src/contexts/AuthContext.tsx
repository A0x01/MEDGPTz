/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the app.
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi, setAuthToken, clearAuthToken, isAuthenticated } from '../api';
import type { User, LoginRequest, RegisterRequest } from '../api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await authApi.me();
          setUser(userData);
        } catch (err) {
          // Token is invalid or expired
          clearAuthToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for logout events (e.g., from 401 errors)
    const handleLogout = () => {
      setUser(null);
    };
    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    setAuthToken(response.access_token);

    // Fetch user data
    const userData = await authApi.me();
    setUser(userData);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authApi.register(data);
    setAuthToken(response.access_token);

    // Fetch user data
    const userData = await authApi.me();
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore errors during logout
      console.error('Logout error:', err);
    } finally {
      clearAuthToken();
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (isAuthenticated()) {
      try {
        const userData = await authApi.me();
        setUser(userData);
      } catch (err) {
        clearAuthToken();
        setUser(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
