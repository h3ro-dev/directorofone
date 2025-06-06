const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const database = require('./database');

class AuthUtils {
  // Generate JWT access token
  static generateAccessToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      type: 'access'
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }

  // Generate refresh token
  static async generateRefreshToken(userId) {
    const token = uuidv4();
    const expiresAt = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days

    const query = `
      INSERT INTO refresh_tokens (id, user_id, token, expires_at)
      VALUES (?, ?, ?, ?)
    `;

    await database.run(query, [uuidv4(), userId, token, expiresAt]);

    return token;
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else {
        throw error;
      }
    }
  }

  // Verify refresh token
  static async verifyRefreshToken(token) {
    const query = `
      SELECT * FROM refresh_tokens 
      WHERE token = ? AND expires_at > ?
    `;

    const refreshToken = await database.get(query, [token, Date.now()]);

    if (!refreshToken) {
      throw new Error('Invalid or expired refresh token');
    }

    return refreshToken;
  }

  // Revoke refresh token
  static async revokeRefreshToken(token) {
    const query = 'DELETE FROM refresh_tokens WHERE token = ?';
    await database.run(query, [token]);
  }

  // Revoke all user tokens
  static async revokeAllUserTokens(userId) {
    const queries = [
      'DELETE FROM refresh_tokens WHERE user_id = ?',
      'DELETE FROM sessions WHERE user_id = ?'
    ];

    for (const query of queries) {
      await database.run(query, [userId]);
    }
  }

  // Create session
  static async createSession(userId, ipAddress, userAgent) {
    const sessionId = uuidv4();
    const token = uuidv4();
    const expiresAt = Date.now() + config.auth.sessionTimeout;

    const query = `
      INSERT INTO sessions (id, user_id, token, ip_address, user_agent, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await database.run(query, [sessionId, userId, token, ipAddress, userAgent, expiresAt]);

    return { sessionId, token };
  }

  // Verify session
  static async verifySession(token) {
    const query = `
      SELECT * FROM sessions 
      WHERE token = ? AND expires_at > ?
    `;

    const session = await database.get(query, [token, Date.now()]);

    if (!session) {
      throw new Error('Invalid or expired session');
    }

    return session;
  }

  // Extend session
  static async extendSession(token) {
    const newExpiresAt = Date.now() + config.auth.sessionTimeout;
    
    const query = `
      UPDATE sessions 
      SET expires_at = ?
      WHERE token = ? AND expires_at > ?
    `;

    const result = await database.run(query, [newExpiresAt, token, Date.now()]);

    if (result.changes === 0) {
      throw new Error('Session not found or already expired');
    }
  }

  // Clean up expired tokens and sessions
  static async cleanupExpiredTokens() {
    const now = Date.now();
    
    const queries = [
      'DELETE FROM refresh_tokens WHERE expires_at < ?',
      'DELETE FROM sessions WHERE expires_at < ?'
    ];

    for (const query of queries) {
      await database.run(query, [now]);
    }
  }

  // Log authentication event
  static async logAuthEvent(userId, action, ipAddress, userAgent, success = true) {
    const query = `
      INSERT INTO audit_logs (id, user_id, action, entity_type, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await database.run(query, [
      uuidv4(),
      userId,
      action,
      'authentication',
      ipAddress,
      userAgent
    ]);
  }

  // Extract bearer token from authorization header
  static extractBearerToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    return authHeader.substring(7);
  }

  // Generate random password
  static generateRandomPassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }

  // Validate password strength
  static validatePasswordStrength(password) {
    const errors = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Sanitize user input
  static sanitizeInput(input) {
    if (typeof input !== 'string') {
      return input;
    }

    // Remove leading/trailing whitespace
    input = input.trim();

    // Remove null bytes
    input = input.replace(/\0/g, '');

    // Basic XSS prevention
    input = input.replace(/[<>]/g, '');

    return input;
  }
}

module.exports = AuthUtils;