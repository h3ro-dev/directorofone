const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const database = require('../utils/database');
const config = require('../config/config');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.username = data.username;
    this.passwordHash = data.password_hash;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.role = data.role || 'user';
    this.isActive = data.is_active !== undefined ? data.is_active : true;
    this.isVerified = data.is_verified || false;
    this.verificationToken = data.verification_token;
    this.resetToken = data.reset_token;
    this.resetTokenExpires = data.reset_token_expires;
    this.failedLoginAttempts = data.failed_login_attempts || 0;
    this.lockedUntil = data.locked_until;
    this.lastLoginAt = data.last_login_at;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Create a new user
  static async create(userData) {
    const { email, username, password, firstName, lastName, role } = userData;

    // Check if user already exists
    const existingUser = await this.findByEmailOrUsername(email, username);
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, config.auth.bcryptRounds);
    const verificationToken = uuidv4();

    // Insert user
    const userId = uuidv4();
    const query = `
      INSERT INTO users (
        id, email, username, password_hash, first_name, last_name, 
        role, verification_token
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await database.run(query, [
      userId,
      email.toLowerCase(),
      username.toLowerCase(),
      passwordHash,
      firstName,
      lastName,
      role || 'user',
      verificationToken
    ]);

    return this.findById(userId);
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const userData = await database.get(query, [id]);
    return userData ? new User(userData) : null;
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const userData = await database.get(query, [email.toLowerCase()]);
    return userData ? new User(userData) : null;
  }

  // Find user by username
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const userData = await database.get(query, [username.toLowerCase()]);
    return userData ? new User(userData) : null;
  }

  // Find user by email or username
  static async findByEmailOrUsername(email, username) {
    const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
    const userData = await database.get(query, [email.toLowerCase(), username.toLowerCase()]);
    return userData ? new User(userData) : null;
  }

  // Find user by verification token
  static async findByVerificationToken(token) {
    const query = 'SELECT * FROM users WHERE verification_token = ?';
    const userData = await database.get(query, [token]);
    return userData ? new User(userData) : null;
  }

  // Find user by reset token
  static async findByResetToken(token) {
    const query = 'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?';
    const userData = await database.get(query, [token, Date.now()]);
    return userData ? new User(userData) : null;
  }

  // Verify password
  async verifyPassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  }

  // Update password
  async updatePassword(newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, config.auth.bcryptRounds);
    const query = `
      UPDATE users 
      SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL, 
          updated_at = strftime('%s', 'now')
      WHERE id = ?
    `;
    await database.run(query, [passwordHash, this.id]);
    this.passwordHash = passwordHash;
    this.resetToken = null;
    this.resetTokenExpires = null;
  }

  // Check if account is locked
  isLocked() {
    return this.lockedUntil && this.lockedUntil > Date.now();
  }

  // Increment failed login attempts
  async incrementFailedAttempts() {
    this.failedLoginAttempts++;
    
    let query;
    if (this.failedLoginAttempts >= config.auth.maxLoginAttempts) {
      // Lock account
      const lockUntil = Date.now() + config.auth.lockoutTime;
      query = `
        UPDATE users 
        SET failed_login_attempts = ?, locked_until = ?, 
            updated_at = strftime('%s', 'now')
        WHERE id = ?
      `;
      await database.run(query, [this.failedLoginAttempts, lockUntil, this.id]);
      this.lockedUntil = lockUntil;
    } else {
      query = `
        UPDATE users 
        SET failed_login_attempts = ?, updated_at = strftime('%s', 'now')
        WHERE id = ?
      `;
      await database.run(query, [this.failedLoginAttempts, this.id]);
    }
  }

  // Reset failed login attempts
  async resetFailedAttempts() {
    const query = `
      UPDATE users 
      SET failed_login_attempts = 0, locked_until = NULL, 
          last_login_at = ?, updated_at = strftime('%s', 'now')
      WHERE id = ?
    `;
    const now = Date.now();
    await database.run(query, [now, this.id]);
    this.failedLoginAttempts = 0;
    this.lockedUntil = null;
    this.lastLoginAt = now;
  }

  // Verify email
  async verifyEmail() {
    const query = `
      UPDATE users 
      SET is_verified = 1, verification_token = NULL, 
          updated_at = strftime('%s', 'now')
      WHERE id = ?
    `;
    await database.run(query, [this.id]);
    this.isVerified = true;
    this.verificationToken = null;
  }

  // Generate reset token
  async generateResetToken() {
    const resetToken = uuidv4();
    const resetTokenExpires = Date.now() + 3600000; // 1 hour

    const query = `
      UPDATE users 
      SET reset_token = ?, reset_token_expires = ?, 
          updated_at = strftime('%s', 'now')
      WHERE id = ?
    `;
    await database.run(query, [resetToken, resetTokenExpires, this.id]);
    
    this.resetToken = resetToken;
    this.resetTokenExpires = resetTokenExpires;
    
    return resetToken;
  }

  // Update user
  async update(updateData) {
    const allowedFields = ['first_name', 'last_name', 'email', 'username', 'role', 'is_active'];
    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(updateData[field]);
      }
    }

    if (updates.length === 0) {
      return this;
    }

    updates.push(`updated_at = strftime('%s', 'now')`);
    values.push(this.id);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await database.run(query, values);

    // Refresh user data
    const updatedUser = await User.findById(this.id);
    Object.assign(this, updatedUser);
    
    return this;
  }

  // Delete user
  async delete() {
    const query = 'DELETE FROM users WHERE id = ?';
    await database.run(query, [this.id]);
  }

  // Get all users (with pagination)
  static async findAll(options = {}) {
    const { page = 1, limit = 20, role, isActive } = options;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM users WHERE 1=1';
    const params = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    if (isActive !== undefined) {
      query += ' AND is_active = ?';
      params.push(isActive ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const users = await database.all(query, params);
    return users.map(userData => new User(userData));
  }

  // Convert to JSON (without sensitive data)
  toJSON() {
    const { passwordHash, resetToken, resetTokenExpires, verificationToken, ...publicData } = this;
    return {
      ...publicData,
      fullName: `${this.firstName || ''} ${this.lastName || ''}`.trim()
    };
  }
}

module.exports = User;