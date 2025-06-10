const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');

// Mock the database
jest.mock('../utils/database');

describe('Authentication API Integration Tests', () => {
  let server;
  
  beforeAll(() => {
    server = app.listen(0); // Random port
  });

  afterAll((done) => {
    server.close(done);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    User.users = new Map(); // Reset in-memory users
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Test@123',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(server)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should reject registration with weak password', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'weak'
      };

      const response = await request(server)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toMatch(/password must be at least 8 characters/i);
    });

    it('should reject registration with duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser1',
        password: 'Test@123'
      };

      // First registration
      await request(server)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Duplicate email
      const response = await request(server)
        .post('/api/auth/register')
        .send({ ...userData, username: 'testuser2' })
        .expect(400);

      expect(response.body.error).toMatch(/email already exists/i);
    });

    it('should reject registration with duplicate username', async () => {
      const userData = {
        email: 'test1@example.com',
        username: 'testuser',
        password: 'Test@123'
      };

      // First registration
      await request(server)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Duplicate username
      const response = await request(server)
        .post('/api/auth/register')
        .send({ ...userData, email: 'test2@example.com' })
        .expect(400);

      expect(response.body.error).toMatch(/username already exists/i);
    });

    it('should sanitize XSS attempts in input', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'test<script>alert("xss")</script>user',
        password: 'Test@123',
        firstName: '<img src=x onerror=alert("xss")>'
      };

      const response = await request(server)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.username).toBe('testscriptalert("xss")/scriptuser');
      expect(response.body.user.firstName).toBe('img src=x onerror=alert("xss")');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await bcrypt.hash('Test@123', 10);
      const user = new User({
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
        isActive: true,
        isVerified: true
      });
      User.users.set(user.id, user);
    });

    it('should login with valid email', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'test@example.com',
          password: 'Test@123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should login with valid username', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'testuser',
          password: 'Test@123'
        })
        .expect(200);

      expect(response.body.user.username).toBe('testuser');
    });

    it('should reject login with invalid credentials', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'test@example.com',
          password: 'WrongPassword'
        })
        .expect(401);

      expect(response.body.error).toMatch(/invalid credentials/i);
    });

    it('should track failed login attempts', async () => {
      // Make 4 failed attempts
      for (let i = 0; i < 4; i++) {
        await request(server)
          .post('/api/auth/login')
          .send({
            emailOrUsername: 'test@example.com',
            password: 'WrongPassword'
          })
          .expect(401);
      }

      // 5th attempt should lock the account
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'test@example.com',
          password: 'WrongPassword'
        })
        .expect(403);

      expect(response.body.error).toMatch(/account locked/i);
    });

    it('should reject login for inactive user', async () => {
      const user = Array.from(User.users.values())[0];
      user.isActive = false;

      const response = await request(server)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'test@example.com',
          password: 'Test@123'
        })
        .expect(403);

      expect(response.body.error).toMatch(/account is inactive/i);
    });

    it('should update last login timestamp', async () => {
      const beforeLogin = new Date();
      
      await request(server)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'test@example.com',
          password: 'Test@123'
        })
        .expect(200);

      const user = Array.from(User.users.values())[0];
      expect(user.lastLogin).toBeInstanceOf(Date);
      expect(user.lastLogin.getTime()).toBeGreaterThanOrEqual(beforeLogin.getTime());
    });
  });

  describe('POST /api/auth/refresh', () => {
    let validRefreshToken;
    let userId;

    beforeEach(async () => {
      // Create a test user and generate tokens
      const user = new User({
        email: 'test@example.com',
        username: 'testuser',
        password: await bcrypt.hash('Test@123', 10)
      });
      User.users.set(user.id, user);
      userId = user.id;

      validRefreshToken = jwt.sign(
        { userId: user.id, type: 'refresh' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '30d' }
      );
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(server)
        .post('/api/auth/refresh')
        .send({ refreshToken: validRefreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      
      // Verify new access token is valid
      const decoded = jwt.verify(
        response.body.accessToken,
        process.env.JWT_SECRET || 'test-secret'
      );
      expect(decoded.userId).toBe(userId);
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(server)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.error).toMatch(/invalid token/i);
    });

    it('should reject expired refresh token', async () => {
      const expiredToken = jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '-1s' }
      );

      const response = await request(server)
        .post('/api/auth/refresh')
        .send({ refreshToken: expiredToken })
        .expect(401);

      expect(response.body.error).toMatch(/token expired/i);
    });
  });

  describe('Protected Routes', () => {
    let accessToken;
    let userId;

    beforeEach(async () => {
      // Create a test user and generate access token
      const user = new User({
        email: 'test@example.com',
        username: 'testuser',
        password: await bcrypt.hash('Test@123', 10)
      });
      User.users.set(user.id, user);
      userId = user.id;

      accessToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'test-secret',
        { expiresIn: '15m' }
      );
    });

    it('should access protected route with valid token', async () => {
      const response = await request(server)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject access without token', async () => {
      const response = await request(server)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.error).toMatch(/no token provided/i);
    });

    it('should reject access with invalid token', async () => {
      const response = await request(server)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.error).toMatch(/invalid token/i);
    });
  });

  describe('Password Reset Flow', () => {
    let user;

    beforeEach(async () => {
      user = new User({
        email: 'test@example.com',
        username: 'testuser',
        password: await bcrypt.hash('Test@123', 10)
      });
      User.users.set(user.id, user);
    });

    it('should generate reset token for valid email', async () => {
      const response = await request(server)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' })
        .expect(200);

      expect(response.body.message).toMatch(/reset instructions sent/i);
      
      const updatedUser = User.users.get(user.id);
      expect(updatedUser.resetToken).toBeTruthy();
      expect(updatedUser.resetTokenExpiry).toBeInstanceOf(Date);
    });

    it('should not reveal if email exists', async () => {
      const response = await request(server)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(200);

      // Same message for both existing and non-existing emails
      expect(response.body.message).toMatch(/reset instructions sent/i);
    });

    it('should reset password with valid token', async () => {
      // Generate reset token
      user.generateResetToken();
      const resetToken = user.resetToken;

      const response = await request(server)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          password: 'NewPassword@123'
        })
        .expect(200);

      expect(response.body.message).toMatch(/password reset successful/i);

      // Verify old password doesn't work
      const loginResponse = await request(server)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'test@example.com',
          password: 'Test@123'
        })
        .expect(401);
    });

    it('should reject reset with expired token', async () => {
      user.generateResetToken();
      const resetToken = user.resetToken;
      
      // Manually expire the token
      user.resetTokenExpiry = new Date(Date.now() - 1000);

      const response = await request(server)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          password: 'NewPassword@123'
        })
        .expect(400);

      expect(response.body.error).toMatch(/invalid or expired/i);
    });
  });

  describe('Rate Limiting', () => {
    it('should rate limit registration attempts', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Test@123'
      };

      // Make 5 requests quickly
      for (let i = 0; i < 5; i++) {
        await request(server)
          .post('/api/auth/register')
          .send({ ...userData, email: `test${i}@example.com`, username: `user${i}` });
      }

      // 6th request should be rate limited
      const response = await request(server)
        .post('/api/auth/register')
        .send({ ...userData, email: 'test6@example.com', username: 'user6' })
        .expect(429);

      expect(response.body.error).toMatch(/too many requests/i);
    });

    it('should rate limit login attempts per IP', async () => {
      const loginData = {
        emailOrUsername: 'test@example.com',
        password: 'Test@123'
      };

      // Make 5 requests quickly
      for (let i = 0; i < 5; i++) {
        await request(server)
          .post('/api/auth/login')
          .send(loginData);
      }

      // 6th request should be rate limited
      const response = await request(server)
        .post('/api/auth/login')
        .send(loginData)
        .expect(429);

      expect(response.body.error).toMatch(/too many requests/i);
    });
  });

  describe('Email Verification', () => {
    let user;
    let verificationToken;

    beforeEach(async () => {
      user = new User({
        email: 'test@example.com',
        username: 'testuser',
        password: await bcrypt.hash('Test@123', 10),
        isVerified: false
      });
      User.users.set(user.id, user);
      verificationToken = user.verificationToken;
    });

    it('should verify email with valid token', async () => {
      const response = await request(server)
        .get(`/api/auth/verify-email?token=${verificationToken}`)
        .expect(200);

      expect(response.body.message).toMatch(/email verified/i);
      
      const updatedUser = User.users.get(user.id);
      expect(updatedUser.isVerified).toBe(true);
      expect(updatedUser.verificationToken).toBeNull();
    });

    it('should reject invalid verification token', async () => {
      const response = await request(server)
        .get('/api/auth/verify-email?token=invalid-token')
        .expect(400);

      expect(response.body.error).toMatch(/invalid verification token/i);
    });

    it('should allow login but show unverified status', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'test@example.com',
          password: 'Test@123'
        })
        .expect(200);

      expect(response.body.user.isVerified).toBe(false);
    });
  });

  describe('Security Headers', () => {
    it('should include security headers in responses', async () => {
      const response = await request(server)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'test@example.com',
          password: 'Test@123'
        });

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });
  });
});