const AuthUtils = require('../utils/auth');
const User = require('../models/User');
const config = require('../config/config');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = AuthUtils.extractBearerToken(authHeader);

    if (!token) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No token provided' }));
      return;
    }

    // Verify token
    const decoded = AuthUtils.verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not found' }));
      return;
    }

    if (!user.isActive) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Account is deactivated' }));
      return;
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message || 'Invalid token' }));
  }
};

// Authorization middleware - check user role
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Insufficient permissions' }));
      return;
    }

    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = AuthUtils.extractBearerToken(authHeader);

    if (token) {
      const decoded = AuthUtils.verifyToken(token);
      const user = await User.findById(decoded.id);
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (error) {
    // Ignore errors in optional auth
    console.debug('Optional auth error:', error.message);
  }

  next();
};

// Session-based authentication
const sessionAuth = async (req, res, next) => {
  try {
    const sessionToken = req.headers['x-session-token'] || req.query.session_token;

    if (!sessionToken) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No session token provided' }));
      return;
    }

    // Verify session
    const session = await AuthUtils.verifySession(sessionToken);
    
    // Get user
    const user = await User.findById(session.user_id);
    
    if (!user || !user.isActive) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid session' }));
      return;
    }

    // Extend session
    await AuthUtils.extendSession(sessionToken);

    req.user = user;
    req.session = session;
    next();
  } catch (error) {
    console.error('Session auth error:', error);
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message || 'Invalid session' }));
  }
};

// Rate limiting for auth endpoints
const authRateLimit = (() => {
  const attempts = new Map();
  const cleanupInterval = 60000; // 1 minute

  // Cleanup old entries
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of attempts.entries()) {
      if (now - data.firstAttempt > config.rateLimit.auth.windowMs) {
        attempts.delete(key);
      }
    }
  }, cleanupInterval);

  return (req, res, next) => {
    const ip = req.socket.remoteAddress;
    const now = Date.now();
    
    if (!attempts.has(ip)) {
      attempts.set(ip, {
        count: 1,
        firstAttempt: now
      });
    } else {
      const data = attempts.get(ip);
      
      if (now - data.firstAttempt > config.rateLimit.auth.windowMs) {
        // Reset window
        data.count = 1;
        data.firstAttempt = now;
      } else {
        data.count++;
        
        if (data.count > config.rateLimit.auth.maxRequests) {
          res.writeHead(429, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Too many requests. Please try again later.' }));
          return;
        }
      }
    }
    
    next();
  };
})();

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  sessionAuth,
  authRateLimit
};