const config = require('../config/config');

// Request logger middleware
function logRequest(req) {
  if (!config.logging.enabled) return;
  
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  if (config.logging.format === 'json') {
    console.log(JSON.stringify({
      timestamp,
      method,
      url,
      ip,
      headers: req.headers
    }));
  } else {
    console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
  }
}

// Error handler middleware
function errorHandler(error, req, res) {
  const timestamp = new Date().toISOString();
  
  // Log error
  console.error(JSON.stringify({
    timestamp,
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  }));
  
  // Send error response
  const statusCode = error.statusCode || 500;
  const message = config.isDevelopment ? error.message : 'Internal Server Error';
  
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: {
      message,
      statusCode,
      timestamp
    }
  }));
}

// Authentication middleware
async function authenticate(req, res, next) {
  const token = req.headers.authorization;
  
  if (!token) {
    const error = new Error('No authorization token provided');
    error.statusCode = 401;
    throw error;
  }
  
  // Simple token validation (replace with actual auth logic)
  if (token !== 'Bearer valid-token') {
    const error = new Error('Invalid authorization token');
    error.statusCode = 401;
    throw error;
  }
  
  req.user = { id: 1, username: 'user' };
  if (next) next();
}

// Rate limiting middleware (simple in-memory implementation)
const requestCounts = new Map();

function rateLimit(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  const windowStart = now - config.rateLimit.windowMs;
  
  // Clean old entries
  for (const [key, data] of requestCounts.entries()) {
    if (data.resetTime < now) {
      requestCounts.delete(key);
    }
  }
  
  // Check rate limit
  const userRequests = requestCounts.get(ip) || { count: 0, resetTime: now + config.rateLimit.windowMs };
  
  if (userRequests.count >= config.rateLimit.maxRequests) {
    const error = new Error('Rate limit exceeded');
    error.statusCode = 429;
    throw error;
  }
  
  // Update request count
  userRequests.count++;
  requestCounts.set(ip, userRequests);
  
  if (next) next();
}

// JSON response helper
function jsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });
  res.end(JSON.stringify(data));
}

// Validation middleware
function validateRequest(schema) {
  return (req, res, next) => {
    // Simple validation (can be extended)
    const errors = [];
    
    if (schema.body) {
      for (const [field, rules] of Object.entries(schema.body)) {
        if (rules.required && !req.body[field]) {
          errors.push(`${field} is required`);
        }
        if (rules.type && typeof req.body[field] !== rules.type) {
          errors.push(`${field} must be of type ${rules.type}`);
        }
      }
    }
    
    if (errors.length > 0) {
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.details = errors;
      throw error;
    }
    
    if (next) next();
  };
}

module.exports = {
  logRequest,
  errorHandler,
  authenticate,
  rateLimit,
  jsonResponse,
  validateRequest
};