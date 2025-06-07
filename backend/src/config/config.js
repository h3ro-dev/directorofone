// Load environment variables
require('dotenv').config();

// API Configuration
module.exports = {
  // Server settings
  port: process.env.PORT || 3001,
  host: process.env.HOST || 'localhost',
  
  // API settings
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  
  // Database settings
  database: {
    path: process.env.DATABASE_PATH || './data/database.sqlite'
  },
  
  // JWT settings
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  
  // Authentication settings
  auth: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
    lockoutTime: parseInt(process.env.LOCKOUT_TIME) || 900000, // 15 minutes
    sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 3600000, // 1 hour
    sessionSecret: process.env.SESSION_SECRET || 'default-session-secret'
  },
  
  // Email settings
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    from: process.env.EMAIL_FROM || 'noreply@directorofone.com'
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5 // Stricter for auth endpoints
    }
  },
  
  // Logging
  logging: {
    enabled: true,
    level: process.env.LOG_LEVEL || 'info',
    format: 'json'
  },
  
  // Security
  security: {
    enableHelmet: true,
    enableCors: true,
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000']
  },
  
  // Response settings
  response: {
    timeout: 30000, // 30 seconds
    compression: true
  },
  
  // Development settings
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production'
};