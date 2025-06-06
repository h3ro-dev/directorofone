import { API_BASE_URL } from '../config';

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  lastLoginAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  error: string;
  details?: string[];
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json() as ApiError;
    throw new Error(error.error || 'An error occurred');
  }
  return response.json();
}

// Auth API client
export class AuthAPI {
  private static baseURL = `${API_BASE_URL}/api/v1/auth`;

  // Get stored tokens
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  // Store tokens
  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  // Clear tokens
  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  // Register new user
  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await handleResponse<AuthResponse>(response);
    this.setTokens(result.accessToken, result.refreshToken);
    return result;
  }

  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result = await handleResponse<AuthResponse>(response);
    this.setTokens(result.accessToken, result.refreshToken);
    return result;
  }

  // Logout user
  static async logout(): Promise<void> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (accessToken) {
      try {
        await fetch(`${this.baseURL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    this.clearTokens();
  }

  // Get current user
  static async getCurrentUser(): Promise<User> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token');
    }

    const response = await fetch(`${this.baseURL}/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const result = await handleResponse<{ user: User }>(response);
    return result.user;
  }

  // Update current user
  static async updateCurrentUser(data: Partial<User>): Promise<User> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token');
    }

    const response = await fetch(`${this.baseURL}/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await handleResponse<{ user: User }>(response);
    return result.user;
  }

  // Change password
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token');
    }

    const response = await fetch(`${this.baseURL}/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    await handleResponse<{ message: string }>(response);
  }

  // Refresh access token
  static async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await fetch(`${this.baseURL}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const result = await handleResponse<{ accessToken: string; user: User }>(response);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', result.accessToken);
    }
    
    return result.accessToken;
  }

  // Forgot password
  static async forgotPassword(email: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    await handleResponse<{ message: string }>(response);
  }

  // Reset password
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    await handleResponse<{ message: string }>(response);
  }

  // Verify email
  static async verifyEmail(token: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/verify-email?token=${token}`);
    await handleResponse<{ message: string }>(response);
  }
}

// Axios-like interceptor for automatic token refresh
export function setupAuthInterceptor() {
  if (typeof window === 'undefined') return;

  const originalFetch = window.fetch;
  
  window.fetch = async (...args) => {
    let [resource, config] = args;
    
    // Add auth header if we have a token
    const accessToken = AuthAPI.getAccessToken();
    if (accessToken && config) {
      config = {
        ...config,
        headers: {
          ...(config.headers || {}),
          'Authorization': `Bearer ${accessToken}`,
        },
      };
    }
    
    let response = await originalFetch(resource, config);
    
    // If we get a 401, try to refresh the token
    if (response.status === 401 && !resource.toString().includes('/auth/refresh')) {
      try {
        const newAccessToken = await AuthAPI.refreshAccessToken();
        
        // Retry the original request with new token
        if (config) {
          config = {
            ...config,
            headers: {
              ...(config.headers || {}),
              'Authorization': `Bearer ${newAccessToken}`,
            },
          };
        }
        
        response = await originalFetch(resource, config);
      } catch (error) {
        // Refresh failed, redirect to login
        AuthAPI.clearTokens();
        window.location.href = '/login';
      }
    }
    
    return response;
  };
}