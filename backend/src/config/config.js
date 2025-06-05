// API Configuration
module.exports = {
  // Server settings
  port: 3000,
  host: '0.0.0.0',
  
  // API settings
  apiPrefix: '/api/v1',
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100
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
    corsOrigins: ['*']
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