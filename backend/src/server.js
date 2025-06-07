#!/usr/bin/env node

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

// Import configuration
const config = require('./config/config');
const router = require('./routes/router');
const { logRequest, errorHandler } = require('./middleware/middleware');
const database = require('./utils/database');

// Initialize database
async function initializeDatabase() {
  try {
    await database.initialize();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

// Create server
const server = http.createServer(async (req, res) => {
  try {
    // Log incoming request
    logRequest(req);

    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // Add parsed data to request
    req.pathname = pathname;
    req.query = query;

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    // Parse body for POST/PUT requests
    if (req.method === 'POST' || req.method === 'PUT') {
      const body = await parseBody(req);
      req.body = body;
    }

    // Route request
    await router.handle(req, res);

  } catch (error) {
    errorHandler(error, req, res);
  }
});

// Parse request body
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        // Try to parse as JSON
        if (req.headers['content-type'] === 'application/json') {
          resolve(JSON.parse(body));
        } else {
          resolve(body);
        }
      } catch (error) {
        resolve(body);
      }
    });
    req.on('error', reject);
  });
}

// Start server
const PORT = process.env.PORT || config.port || 3001;
const HOST = process.env.HOST || config.host || '0.0.0.0';

// Initialize database and start server
initializeDatabase().then(() => {
  server.listen(PORT, HOST, () => {
    console.log(`API Server running at http://${HOST}:${PORT}/`);
    console.log('Press Ctrl+C to stop');
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await database.close();
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    await database.close();
    console.log('HTTP server closed');
    process.exit(0);
  });
});