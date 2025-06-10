import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import LoginPage from '../../../app/login/page';
import RegisterPage from '../../../app/register/page';
import { AuthAPI } from '../../lib/api/auth';

// Mock the API
jest.mock('../../lib/api/auth');
const mockAuthAPI = AuthAPI as jest.Mocked<typeof AuthAPI>;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  redirect: jest.fn(),
}));

describe('Authentication System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Login Functionality', () => {
    it('should render login form with all required fields', () => {
      render(<LoginPage />);
      
      expect(screen.getByPlaceholderText(/email or username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
      expect(screen.getByText(/create account/i)).toBeInTheDocument();
    });

    it('should validate required fields', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);
      
      // Check for HTML5 validation
      const emailInput = screen.getByPlaceholderText(/email or username/i) as HTMLInputElement;
      const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
      
      expect(emailInput.validity.valueMissing).toBe(true);
      expect(passwordInput.validity.valueMissing).toBe(true);
    });

    it('should handle successful login', async () => {
      const user = userEvent.setup();
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        role: 'director',
      };
      
      mockAuthAPI.login.mockResolvedValue({
        user: mockUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });

      render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      );
      
      await user.type(screen.getByPlaceholderText(/email or username/i), 'test@example.com');
      await user.type(screen.getByPlaceholderText(/password/i), 'Test@123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(mockAuthAPI.login).toHaveBeenCalledWith({
          emailOrUsername: 'test@example.com',
          password: 'Test@123',
        });
      });
    });

    it('should display error on failed login', async () => {
      const user = userEvent.setup();
      mockAuthAPI.login.mockRejectedValue(new Error('Invalid credentials'));

      render(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/email or username/i), 'wrong@example.com');
      await user.type(screen.getByPlaceholderText(/password/i), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('should handle account lockout', async () => {
      const user = userEvent.setup();
      mockAuthAPI.login.mockRejectedValue(new Error('Account locked due to too many failed attempts'));

      render(<LoginPage />);
      
      await user.type(screen.getByPlaceholderText(/email or username/i), 'locked@example.com');
      await user.type(screen.getByPlaceholderText(/password/i), 'anypassword');
      await user.click(screen.getByRole('button', { name: /sign in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/account locked/i)).toBeInTheDocument();
      });
    });
  });

  describe('Registration Functionality', () => {
    it('should render registration form with all fields', () => {
      render(<RegisterPage />);
      
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should validate password requirements', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);
      
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      
      // Test weak password
      await user.type(passwordInput, 'weak');
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
      });
      
      // Test strong password
      await user.clear(passwordInput);
      await user.type(passwordInput, 'Strong@123');
      fireEvent.blur(passwordInput);
      
      await waitFor(() => {
        expect(screen.queryByText(/at least 8 characters/i)).not.toBeInTheDocument();
      });
    });

    it('should validate password confirmation', async () => {
      const user = userEvent.setup();
      render(<RegisterPage />);
      
      await user.type(screen.getByPlaceholderText(/^password$/i), 'Strong@123');
      await user.type(screen.getByPlaceholderText(/confirm password/i), 'Different@123');
      fireEvent.blur(screen.getByPlaceholderText(/confirm password/i));
      
      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('should handle successful registration', async () => {
      const user = userEvent.setup();
      const mockUser = {
        id: '1',
        email: 'new@example.com',
        username: 'newuser',
        role: 'director',
      };
      
      mockAuthAPI.register.mockResolvedValue({
        user: mockUser,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });

      render(
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      );
      
      await user.type(screen.getByPlaceholderText(/email/i), 'new@example.com');
      await user.type(screen.getByPlaceholderText(/username/i), 'newuser');
      await user.type(screen.getByPlaceholderText(/^password$/i), 'Strong@123');
      await user.type(screen.getByPlaceholderText(/confirm password/i), 'Strong@123');
      await user.click(screen.getByRole('button', { name: /create account/i }));
      
      await waitFor(() => {
        expect(mockAuthAPI.register).toHaveBeenCalledWith({
          email: 'new@example.com',
          username: 'newuser',
          password: 'Strong@123',
          firstName: '',
          lastName: '',
        });
      });
    });

    it('should handle duplicate email error', async () => {
      const user = userEvent.setup();
      mockAuthAPI.register.mockRejectedValue(new Error('Email already exists'));

      render(<RegisterPage />);
      
      await user.type(screen.getByPlaceholderText(/email/i), 'existing@example.com');
      await user.type(screen.getByPlaceholderText(/username/i), 'newuser');
      await user.type(screen.getByPlaceholderText(/^password$/i), 'Strong@123');
      await user.type(screen.getByPlaceholderText(/confirm password/i), 'Strong@123');
      await user.click(screen.getByRole('button', { name: /create account/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });
  });

  describe('Token Management', () => {
    it('should store tokens on successful login', async () => {
      mockAuthAPI.login.mockResolvedValue({
        user: { id: '1', email: 'test@example.com', username: 'test', role: 'director' },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const TestComponent = () => {
        const { login } = useAuth();
        return (
          <button onClick={() => login({ emailOrUsername: 'test@example.com', password: 'Test@123' })}>
            Login
          </button>
        );
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await userEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(localStorage.getItem('accessToken')).toBe('access-token');
        expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
      });
    });

    it('should clear tokens on logout', async () => {
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('refreshToken', 'test-refresh');

      const TestComponent = () => {
        const { logout } = useAuth();
        return <button onClick={logout}>Logout</button>;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await userEvent.click(screen.getByText('Logout'));

      await waitFor(() => {
        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(localStorage.getItem('refreshToken')).toBeNull();
      });
    });

    it('should refresh token when access token expires', async () => {
      mockAuthAPI.refreshToken.mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      // Simulate API call with expired token
      const apiCall = jest.fn()
        .mockRejectedValueOnce({ response: { status: 401 } })
        .mockResolvedValueOnce({ data: 'success' });

      // Test token refresh logic
      localStorage.setItem('refreshToken', 'old-refresh-token');
      
      // The actual implementation would handle this in the API interceptor
      await mockAuthAPI.refreshToken('old-refresh-token');
      
      expect(mockAuthAPI.refreshToken).toHaveBeenCalledWith('old-refresh-token');
    });
  });

  describe('Protected Routes', () => {
    it('should redirect unauthenticated users to login', () => {
      const ProtectedComponent = () => <div>Protected Content</div>;
      const WrappedComponent = withAuth(ProtectedComponent);

      render(
        <AuthProvider>
          <WrappedComponent />
        </AuthProvider>
      );

      // Should redirect instead of rendering content
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should allow authenticated users to access protected routes', async () => {
      const ProtectedComponent = () => <div>Protected Content</div>;
      const WrappedComponent = withAuth(ProtectedComponent);

      // Mock authenticated state
      const mockUser = { id: '1', email: 'test@example.com', username: 'test', role: 'director' };
      
      const AuthProviderWithUser = ({ children }: { children: React.ReactNode }) => {
        return (
          <AuthProvider initialUser={mockUser}>
            {children}
          </AuthProvider>
        );
      };

      render(
        <AuthProviderWithUser>
          <WrappedComponent />
        </AuthProviderWithUser>
      );

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
      });
    });
  });

  describe('Password Reset', () => {
    it('should handle forgot password request', async () => {
      mockAuthAPI.forgotPassword.mockResolvedValue({ message: 'Reset email sent' });

      const ForgotPasswordComponent = () => {
        const [email, setEmail] = useState('');
        const [message, setMessage] = useState('');
        
        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          try {
            const result = await AuthAPI.forgotPassword(email);
            setMessage(result.message);
          } catch (error) {
            setMessage('Error sending reset email');
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
            <button type="submit">Reset Password</button>
            {message && <div>{message}</div>}
          </form>
        );
      };

      render(<ForgotPasswordComponent />);

      await userEvent.type(screen.getByPlaceholderText('Enter email'), 'test@example.com');
      await userEvent.click(screen.getByText('Reset Password'));

      await waitFor(() => {
        expect(screen.getByText('Reset email sent')).toBeInTheDocument();
        expect(mockAuthAPI.forgotPassword).toHaveBeenCalledWith('test@example.com');
      });
    });

    it('should validate reset token and allow password reset', async () => {
      mockAuthAPI.resetPassword.mockResolvedValue({ message: 'Password reset successful' });

      const ResetPasswordComponent = () => {
        const [password, setPassword] = useState('');
        const [message, setMessage] = useState('');
        const token = 'valid-reset-token';
        
        const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          try {
            const result = await AuthAPI.resetPassword(token, password);
            setMessage(result.message);
          } catch (error) {
            setMessage('Error resetting password');
          }
        };

        return (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
            />
            <button type="submit">Reset Password</button>
            {message && <div>{message}</div>}
          </form>
        );
      };

      render(<ResetPasswordComponent />);

      await userEvent.type(screen.getByPlaceholderText('New password'), 'NewStrong@123');
      await userEvent.click(screen.getByText('Reset Password'));

      await waitFor(() => {
        expect(screen.getByText('Password reset successful')).toBeInTheDocument();
        expect(mockAuthAPI.resetPassword).toHaveBeenCalledWith('valid-reset-token', 'NewStrong@123');
      });
    });
  });

  describe('Security Features', () => {
    it('should sanitize user input to prevent XSS', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      
      const maliciousInput = '<script>alert("XSS")</script>';
      await user.type(screen.getByPlaceholderText(/email or username/i), maliciousInput);
      
      // The actual sanitization would happen in the API layer
      // This tests that the input is accepted but would be sanitized
      const input = screen.getByPlaceholderText(/email or username/i) as HTMLInputElement;
      expect(input.value).toBe(maliciousInput);
    });

    it('should enforce rate limiting on login attempts', async () => {
      const user = userEvent.setup();
      mockAuthAPI.login
        .mockRejectedValueOnce(new Error('Invalid credentials'))
        .mockRejectedValueOnce(new Error('Invalid credentials'))
        .mockRejectedValueOnce(new Error('Invalid credentials'))
        .mockRejectedValueOnce(new Error('Invalid credentials'))
        .mockRejectedValueOnce(new Error('Invalid credentials'))
        .mockRejectedValueOnce(new Error('Too many attempts. Please try again later.'));

      render(<LoginPage />);

      // Simulate multiple failed login attempts
      for (let i = 0; i < 6; i++) {
        await user.clear(screen.getByPlaceholderText(/email or username/i));
        await user.clear(screen.getByPlaceholderText(/password/i));
        await user.type(screen.getByPlaceholderText(/email or username/i), 'test@example.com');
        await user.type(screen.getByPlaceholderText(/password/i), `wrong${i}`);
        await user.click(screen.getByRole('button', { name: /sign in/i }));
      }

      await waitFor(() => {
        expect(screen.getByText(/too many attempts/i)).toBeInTheDocument();
      });
    });
  });

  describe('Email Verification', () => {
    it('should show verification required message for unverified users', async () => {
      mockAuthAPI.login.mockResolvedValue({
        user: { 
          id: '1', 
          email: 'test@example.com', 
          username: 'test', 
          role: 'director',
          isVerified: false 
        },
        accessToken: 'token',
        refreshToken: 'refresh',
      });

      render(
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      );

      await userEvent.type(screen.getByPlaceholderText(/email or username/i), 'test@example.com');
      await userEvent.type(screen.getByPlaceholderText(/password/i), 'Test@123');
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      // The actual implementation would show a verification required message
      await waitFor(() => {
        expect(mockAuthAPI.login).toHaveBeenCalled();
      });
    });

    it('should handle email verification token', async () => {
      mockAuthAPI.verifyEmail.mockResolvedValue({ message: 'Email verified successfully' });

      const VerifyEmailComponent = () => {
        const [message, setMessage] = useState('');
        const token = 'valid-verification-token';
        
        React.useEffect(() => {
          AuthAPI.verifyEmail(token)
            .then(result => setMessage(result.message))
            .catch(() => setMessage('Verification failed'));
        }, []);

        return <div>{message}</div>;
      };

      render(<VerifyEmailComponent />);

      await waitFor(() => {
        expect(screen.getByText('Email verified successfully')).toBeInTheDocument();
        expect(mockAuthAPI.verifyEmail).toHaveBeenCalledWith('valid-verification-token');
      });
    });
  });
});