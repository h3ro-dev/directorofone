import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';
const API_URL = process.env.E2E_API_URL || 'http://localhost:3001';

// Helper to generate unique test data
const generateTestUser = () => ({
  email: `test-${Date.now()}@example.com`,
  username: `testuser${Date.now()}`,
  password: 'Test@123!',
  firstName: 'Test',
  lastName: 'User'
});

test.describe('Authentication E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test.describe('Registration Flow', () => {
    test('should complete full registration flow', async ({ page }) => {
      const testUser = generateTestUser();
      
      // Navigate to registration
      await page.click('text=Create Account');
      await expect(page).toHaveURL(`${BASE_URL}/register`);
      
      // Fill registration form
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="username"]', testUser.username);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.fill('input[name="firstName"]', testUser.firstName);
      await page.fill('input[name="lastName"]', testUser.lastName);
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard after successful registration
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`, { timeout: 10000 });
      
      // Verify user is logged in
      await expect(page.locator('text=Welcome')).toBeVisible();
    });

    test('should show validation errors for weak password', async ({ page }) => {
      await page.goto(`${BASE_URL}/register`);
      
      // Try weak password
      await page.fill('input[name="password"]', 'weak');
      await page.click('body'); // Trigger blur
      
      // Check for validation messages
      await expect(page.locator('text=At least 8 characters')).toBeVisible();
      await expect(page.locator('text=One uppercase letter')).toBeVisible();
      await expect(page.locator('text=One number')).toBeVisible();
      await expect(page.locator('text=One special character')).toBeVisible();
    });

    test('should show error for mismatched passwords', async ({ page }) => {
      await page.goto(`${BASE_URL}/register`);
      
      await page.fill('input[name="password"]', 'Test@123!');
      await page.fill('input[name="confirmPassword"]', 'Different@123!');
      await page.click('body'); // Trigger blur
      
      await expect(page.locator('text=Passwords do not match')).toBeVisible();
    });

    test('should handle duplicate email error', async ({ page }) => {
      const testUser = generateTestUser();
      
      // First registration
      await page.goto(`${BASE_URL}/register`);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="username"]', testUser.username);
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.click('button[type="submit"]');
      
      // Wait for redirect
      await page.waitForURL(`${BASE_URL}/dashboard`);
      
      // Logout
      await page.click('button[aria-label="User menu"]');
      await page.click('text=Logout');
      
      // Try to register with same email
      await page.goto(`${BASE_URL}/register`);
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="username"]', 'differentusername');
      await page.fill('input[name="password"]', testUser.password);
      await page.fill('input[name="confirmPassword"]', testUser.password);
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=Email already exists')).toBeVisible();
    });
  });

  test.describe('Login Flow', () => {
    let testUser: any;

    test.beforeEach(async ({ page }) => {
      // Register a user for login tests
      testUser = generateTestUser();
      
      const response = await page.request.post(`${API_URL}/api/auth/register`, {
        data: testUser
      });
      
      expect(response.ok()).toBeTruthy();
    });

    test('should login with email', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      await page.fill('input[name="emailOrUsername"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
      await expect(page.locator(`text=Welcome ${testUser.firstName}`)).toBeVisible();
    });

    test('should login with username', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      await page.fill('input[name="emailOrUsername"]', testUser.username);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      await page.fill('input[name="emailOrUsername"]', testUser.email);
      await page.fill('input[name="password"]', 'WrongPassword123!');
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=Invalid credentials')).toBeVisible();
      await expect(page).toHaveURL(`${BASE_URL}/login`);
    });

    test('should handle account lockout after failed attempts', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Make 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        await page.fill('input[name="emailOrUsername"]', testUser.email);
        await page.fill('input[name="password"]', `WrongPassword${i}`);
        await page.click('button[type="submit"]');
        await page.waitForTimeout(500); // Small delay between attempts
      }
      
      // 6th attempt should show lockout message
      await page.fill('input[name="emailOrUsername"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=Account locked')).toBeVisible();
    });

    test('should persist login with remember me', async ({ page, context }) => {
      await page.goto(`${BASE_URL}/login`);
      
      await page.fill('input[name="emailOrUsername"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.check('input[name="rememberMe"]');
      await page.click('button[type="submit"]');
      
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
      
      // Get cookies
      const cookies = await context.cookies();
      const authCookie = cookies.find(c => c.name === 'authToken');
      
      // Check cookie has long expiration
      expect(authCookie).toBeTruthy();
      if (authCookie) {
        const expiryDate = new Date(authCookie.expires * 1000);
        const daysDiff = (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        expect(daysDiff).toBeGreaterThan(7); // Should be valid for more than 7 days
      }
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing protected route without auth', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Should redirect to login
      await expect(page).toHaveURL(`${BASE_URL}/login`);
      
      // Should show redirect message
      await expect(page.locator('text=Please login to continue')).toBeVisible();
    });

    test('should maintain requested URL after login', async ({ page }) => {
      const testUser = generateTestUser();
      
      // Register user
      await page.request.post(`${API_URL}/api/auth/register`, {
        data: testUser
      });
      
      // Try to access protected route
      await page.goto(`${BASE_URL}/dashboard/analytics`);
      
      // Should redirect to login
      await expect(page).toHaveURL(`${BASE_URL}/login?redirect=/dashboard/analytics`);
      
      // Login
      await page.fill('input[name="emailOrUsername"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      // Should redirect to originally requested page
      await expect(page).toHaveURL(`${BASE_URL}/dashboard/analytics`);
    });
  });

  test.describe('Password Reset Flow', () => {
    let testUser: any;

    test.beforeEach(async ({ page }) => {
      testUser = generateTestUser();
      await page.request.post(`${API_URL}/api/auth/register`, {
        data: testUser
      });
    });

    test('should complete password reset flow', async ({ page }) => {
      // Navigate to forgot password
      await page.goto(`${BASE_URL}/login`);
      await page.click('text=Forgot password?');
      
      await expect(page).toHaveURL(`${BASE_URL}/forgot-password`);
      
      // Request password reset
      await page.fill('input[name="email"]', testUser.email);
      await page.click('button[type="submit"]');
      
      // Should show success message
      await expect(page.locator('text=Password reset instructions sent')).toBeVisible();
      
      // In a real test, we would:
      // 1. Intercept the email or get the token from the database
      // 2. Navigate to reset password page with token
      // 3. Set new password
      // 4. Login with new password
      
      // For this test, we'll simulate the token part
      const mockToken = 'mock-reset-token';
      await page.goto(`${BASE_URL}/reset-password?token=${mockToken}`);
      
      // Set new password
      const newPassword = 'NewPassword@123!';
      await page.fill('input[name="password"]', newPassword);
      await page.fill('input[name="confirmPassword"]', newPassword);
      await page.click('button[type="submit"]');
      
      // Should redirect to login with success message
      await expect(page).toHaveURL(`${BASE_URL}/login`);
      await expect(page.locator('text=Password reset successful')).toBeVisible();
    });

    test('should validate new password requirements', async ({ page }) => {
      await page.goto(`${BASE_URL}/reset-password?token=mock-token`);
      
      // Try weak password
      await page.fill('input[name="password"]', 'weak');
      await page.click('body');
      
      // Should show validation errors
      await expect(page.locator('text=At least 8 characters')).toBeVisible();
    });
  });

  test.describe('Logout Flow', () => {
    test('should logout and clear session', async ({ page, context }) => {
      const testUser = generateTestUser();
      
      // Register and login
      await page.request.post(`${API_URL}/api/auth/register`, {
        data: testUser
      });
      
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="emailOrUsername"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
      
      // Logout
      await page.click('button[aria-label="User menu"]');
      await page.click('text=Logout');
      
      // Should redirect to home or login
      await expect(page).toHaveURL(new RegExp(`${BASE_URL}/(login|$)`));
      
      // Try to access protected route
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Should redirect to login
      await expect(page).toHaveURL(`${BASE_URL}/login`);
      
      // Check cookies are cleared
      const cookies = await context.cookies();
      const authCookie = cookies.find(c => c.name === 'authToken');
      expect(authCookie).toBeFalsy();
    });
  });

  test.describe('Session Management', () => {
    test('should refresh token automatically', async ({ page }) => {
      const testUser = generateTestUser();
      
      // Register and login
      await page.request.post(`${API_URL}/api/auth/register`, {
        data: testUser
      });
      
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="emailOrUsername"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      // Wait for dashboard
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
      
      // Simulate token expiration by waiting or manipulating localStorage
      await page.evaluate(() => {
        // Set access token to expired
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjB9.invalid';
        localStorage.setItem('accessToken', expiredToken);
      });
      
      // Make an API call that requires auth
      await page.click('text=Analytics'); // Navigate to a page that fetches data
      
      // Should still work (token refreshed in background)
      await expect(page).toHaveURL(`${BASE_URL}/dashboard/analytics`);
      await expect(page.locator('text=Analytics Dashboard')).toBeVisible();
    });

    test('should handle concurrent requests with expired token', async ({ page }) => {
      const testUser = generateTestUser();
      
      // Register and login
      await page.request.post(`${API_URL}/api/auth/register`, {
        data: testUser
      });
      
      await page.goto(`${BASE_URL}/login`);
      await page.fill('input[name="emailOrUsername"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
      
      // Expire token
      await page.evaluate(() => {
        const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjB9.invalid';
        localStorage.setItem('accessToken', expiredToken);
      });
      
      // Navigate to a page that makes multiple API calls
      await page.goto(`${BASE_URL}/dashboard`);
      
      // All data should load correctly (only one refresh should happen)
      await expect(page.locator('text=Recent Tasks')).toBeVisible();
      await expect(page.locator('text=Priority Alerts')).toBeVisible();
      await expect(page.locator('text=Department Metrics')).toBeVisible();
    });
  });

  test.describe('Security Features', () => {
    test('should sanitize XSS attempts in inputs', async ({ page }) => {
      await page.goto(`${BASE_URL}/register`);
      
      const xssPayload = '<script>alert("XSS")</script>';
      
      await page.fill('input[name="username"]', xssPayload);
      await page.fill('input[name="firstName"]', xssPayload);
      
      // Submit form (with valid other fields)
      await page.fill('input[name="email"]', generateTestUser().email);
      await page.fill('input[name="password"]', 'Test@123!');
      await page.fill('input[name="confirmPassword"]', 'Test@123!');
      await page.click('button[type="submit"]');
      
      // Check that no alert was triggered
      page.on('dialog', () => {
        throw new Error('XSS payload executed!');
      });
      
      // Wait a bit to ensure no dialog appears
      await page.waitForTimeout(2000);
    });

    test('should enforce HTTPS in production', async ({ page }) => {
      // This test would only run in production environment
      if (process.env.NODE_ENV === 'production') {
        const response = await page.goto(BASE_URL.replace('https://', 'http://'));
        
        // Should redirect to HTTPS
        expect(response?.url()).toMatch(/^https:\/\//);
      }
    });

    test('should include security headers', async ({ page }) => {
      const response = await page.goto(BASE_URL);
      
      const headers = response?.headers();
      
      expect(headers?.['x-content-type-options']).toBe('nosniff');
      expect(headers?.['x-frame-options']).toBe('DENY');
      expect(headers?.['x-xss-protection']).toBe('1; mode=block');
      expect(headers?.['strict-transport-security']).toBeTruthy();
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

    test('should work on mobile devices', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Check that form is properly displayed on mobile
      await expect(page.locator('form')).toBeVisible();
      await expect(page.locator('input[name="emailOrUsername"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      
      // Test login on mobile
      const testUser = generateTestUser();
      await page.request.post(`${API_URL}/api/auth/register`, {
        data: testUser
      });
      
      await page.fill('input[name="emailOrUsername"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      
      await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
      
      // Check mobile menu
      await page.click('button[aria-label="Mobile menu"]');
      await expect(page.locator('nav[aria-label="Mobile navigation"]')).toBeVisible();
    });
  });
});