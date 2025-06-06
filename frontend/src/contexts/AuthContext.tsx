'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthAPI, User, LoginCredentials, RegisterData } from '@/lib/api/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const accessToken = AuthAPI.getAccessToken();
      
      if (accessToken) {
        const user = await AuthAPI.getCurrentUser();
        setUser(user);
      }
    } catch (err) {
      console.error('Failed to load user:', err);
      AuthAPI.clearTokens();
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await AuthAPI.login(credentials);
      setUser(response.user);
      
      // Redirect to dashboard or intended page
      const redirectTo = new URLSearchParams(window.location.search).get('from') || '/dashboard';
      router.push(redirectTo);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await AuthAPI.register(data);
      setUser(response.user);
      
      // Redirect to verification page or dashboard
      if (response.user.isVerified) {
        router.push('/dashboard');
      } else {
        router.push('/verify-email');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await AuthAPI.logout();
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const updateUser = useCallback(async (data: Partial<User>) => {
    try {
      setError(null);
      const updatedUser = await AuthAPI.updateCurrentUser(data);
      setUser(updatedUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user';
      setError(message);
      throw err;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const user = await AuthAPI.getCurrentUser();
      setUser(user);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { redirectTo?: string; requireVerified?: boolean }
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        const currentPath = window.location.pathname;
        router.push(`/login?from=${encodeURIComponent(currentPath)}`);
      } else if (!loading && user && options?.requireVerified && !user.isVerified) {
        router.push('/verify-email');
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!user || (options?.requireVerified && !user.isVerified)) {
      return null;
    }

    return <Component {...props} />;
  };
}