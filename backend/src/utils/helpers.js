const crypto = require('crypto');

// Generate unique ID
function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

// Generate short ID
function generateShortId(length = 8) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

// Hash password (simple implementation - use bcrypt in production)
function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password + 'salt')
    .digest('hex');
}

// Verify password
function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// Generate token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Parse boolean from string
function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return false;
}

// Deep clone object
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
}

// Sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry function
async function retry(fn, options = {}) {
  const {
    retries = 3,
    delay = 1000,
    backoff = 2,
    onRetry = () => {}
  } = options;
  
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < retries - 1) {
        onRetry(error, i + 1);
        await sleep(delay * Math.pow(backoff, i));
      }
    }
  }
  
  throw lastError;
}

// Validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Sanitize string for logging
function sanitize(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[^\w\s@.-]/gi, '');
}

// Format date
function formatDate(date, format = 'ISO') {
  const d = new Date(date);
  
  switch (format) {
    case 'ISO':
      return d.toISOString();
    case 'UTC':
      return d.toUTCString();
    case 'locale':
      return d.toLocaleString();
    case 'date':
      return d.toLocaleDateString();
    case 'time':
      return d.toLocaleTimeString();
    default:
      return d.toString();
  }
}

// Calculate time difference
function timeDiff(start, end = Date.now()) {
  const diff = end - start;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  return {
    milliseconds: diff,
    seconds: seconds % 60,
    minutes: minutes % 60,
    hours: hours % 24,
    days,
    formatted: `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`
  };
}

module.exports = {
  generateId,
  generateShortId,
  hashPassword,
  verifyPassword,
  generateToken,
  parseBoolean,
  deepClone,
  sleep,
  retry,
  validateEmail,
  sanitize,
  formatDate,
  timeDiff
};