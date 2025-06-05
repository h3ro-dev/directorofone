#!/bin/bash

# DirectorOfOne API Startup Script

echo "🚀 Starting DirectorOfOne API Server..."
echo "=================================="

# Set environment defaults
export NODE_ENV=${NODE_ENV:-development}
export PORT=${PORT:-3000}
export HOST=${HOST:-0.0.0.0}

echo "📋 Configuration:"
echo "  - Environment: $NODE_ENV"
echo "  - Port: $PORT"
echo "  - Host: $HOST"
echo "=================================="

# Change to backend directory
cd "$(dirname "$0")"

# Start the server
node src/server.js