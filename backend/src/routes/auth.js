const User = require('../models/User');
const AuthUtils = require('../utils/auth');
const { authenticate, authRateLimit } = require('../middleware/auth');

// Helper function to get IP address
const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.socket.remoteAddress;
};

// Register new user
const register = async (req, res) => {
  try {
    const { email, username, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !username || !password) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Email, username, and password are required' }));
      return;
    }

    // Sanitize input
    const sanitizedData = {
      email: AuthUtils.sanitizeInput(email).toLowerCase(),
      username: AuthUtils.sanitizeInput(username).toLowerCase(),
      password,
      firstName: AuthUtils.sanitizeInput(firstName),
      lastName: AuthUtils.sanitizeInput(lastName)
    };

    // Validate password strength
    const passwordValidation = AuthUtils.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Password does not meet requirements',
        details: passwordValidation.errors 
      }));
      return;
    }

    // Create user
    const user = await User.create(sanitizedData);

    // Generate tokens
    const accessToken = AuthUtils.generateAccessToken(user);
    const refreshToken = await AuthUtils.generateRefreshToken(user.id);

    // Log event
    await AuthUtils.logAuthEvent(
      user.id, 
      'register', 
      getClientIp(req), 
      req.headers['user-agent']
    );

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'User registered successfully',
      user: user.toJSON(),
      accessToken,
      refreshToken,
      verificationToken: user.verificationToken
    }));
  } catch (error) {
    console.error('Registration error:', error);
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Email/username and password are required' }));
      return;
    }

    // Find user by email or username
    const user = await User.findByEmail(emailOrUsername) || 
                 await User.findByUsername(emailOrUsername);

    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid credentials' }));
      return;
    }

    // Check if account is locked
    if (user.isLocked()) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Account is locked. Please try again later.' }));
      return;
    }

    // Verify password
    const isValidPassword = await user.verifyPassword(password);
    
    if (!isValidPassword) {
      await user.incrementFailedAttempts();
      await AuthUtils.logAuthEvent(
        user.id, 
        'login_failed', 
        getClientIp(req), 
        req.headers['user-agent'],
        false
      );
      
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid credentials' }));
      return;
    }

    // Check if account is active
    if (!user.isActive) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Account is deactivated' }));
      return;
    }

    // Reset failed attempts
    await user.resetFailedAttempts();

    // Generate tokens
    const accessToken = AuthUtils.generateAccessToken(user);
    const refreshToken = await AuthUtils.generateRefreshToken(user.id);

    // Log event
    await AuthUtils.logAuthEvent(
      user.id, 
      'login', 
      getClientIp(req), 
      req.headers['user-agent']
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Login successful',
      user: user.toJSON(),
      accessToken,
      refreshToken
    }));
  } catch (error) {
    console.error('Login error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Login failed' }));
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await AuthUtils.revokeRefreshToken(refreshToken);
    }

    // Log event
    await AuthUtils.logAuthEvent(
      req.user.id, 
      'logout', 
      getClientIp(req), 
      req.headers['user-agent']
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Logout successful' }));
  } catch (error) {
    console.error('Logout error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Logout failed' }));
  }
};

// Refresh access token
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Refresh token is required' }));
      return;
    }

    // Verify refresh token
    const tokenData = await AuthUtils.verifyRefreshToken(refreshToken);
    
    // Get user
    const user = await User.findById(tokenData.user_id);
    
    if (!user || !user.isActive) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid refresh token' }));
      return;
    }

    // Generate new access token
    const accessToken = AuthUtils.generateAccessToken(user);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      accessToken,
      user: user.toJSON()
    }));
  } catch (error) {
    console.error('Token refresh error:', error);
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
};

// Request password reset
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Email is required' }));
      return;
    }

    const user = await User.findByEmail(email);
    
    if (!user) {
      // Don't reveal if user exists
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        message: 'If the email exists, a password reset link has been sent' 
      }));
      return;
    }

    // Generate reset token
    const resetToken = await user.generateResetToken();

    // TODO: Send email with reset token
    // For now, return token in response (remove in production)
    
    // Log event
    await AuthUtils.logAuthEvent(
      user.id, 
      'password_reset_requested', 
      getClientIp(req), 
      req.headers['user-agent']
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'Password reset token generated',
      resetToken // Remove in production
    }));
  } catch (error) {
    console.error('Forgot password error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to process request' }));
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Token and new password are required' }));
      return;
    }

    // Validate password strength
    const passwordValidation = AuthUtils.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Password does not meet requirements',
        details: passwordValidation.errors 
      }));
      return;
    }

    // Find user by reset token
    const user = await User.findByResetToken(token);
    
    if (!user) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid or expired reset token' }));
      return;
    }

    // Update password
    await user.updatePassword(newPassword);

    // Revoke all tokens
    await AuthUtils.revokeAllUserTokens(user.id);

    // Log event
    await AuthUtils.logAuthEvent(
      user.id, 
      'password_reset', 
      getClientIp(req), 
      req.headers['user-agent']
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Password reset successful' }));
  } catch (error) {
    console.error('Reset password error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to reset password' }));
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Verification token is required' }));
      return;
    }

    const user = await User.findByVerificationToken(token);
    
    if (!user) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid verification token' }));
      return;
    }

    await user.verifyEmail();

    // Log event
    await AuthUtils.logAuthEvent(
      user.id, 
      'email_verified', 
      getClientIp(req), 
      req.headers['user-agent']
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Email verified successfully' }));
  } catch (error) {
    console.error('Email verification error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to verify email' }));
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      user: req.user.toJSON()
    }));
  } catch (error) {
    console.error('Get current user error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to get user data' }));
  }
};

// Update current user
const updateCurrentUser = async (req, res) => {
  try {
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.password;
    delete updateData.password_hash;
    delete updateData.verification_token;
    delete updateData.reset_token;
    
    await req.user.update(updateData);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'User updated successfully',
      user: req.user.toJSON()
    }));
  } catch (error) {
    console.error('Update user error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to update user' }));
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Current and new passwords are required' }));
      return;
    }

    // Verify current password
    const isValid = await req.user.verifyPassword(currentPassword);
    if (!isValid) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Current password is incorrect' }));
      return;
    }

    // Validate new password
    const passwordValidation = AuthUtils.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Password does not meet requirements',
        details: passwordValidation.errors 
      }));
      return;
    }

    // Update password
    await req.user.updatePassword(newPassword);

    // Log event
    await AuthUtils.logAuthEvent(
      req.user.id, 
      'password_changed', 
      getClientIp(req), 
      req.headers['user-agent']
    );

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Password changed successfully' }));
  } catch (error) {
    console.error('Change password error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Failed to change password' }));
  }
};

// Export route handlers
module.exports = {
  register,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getCurrentUser,
  updateCurrentUser,
  changePassword
};