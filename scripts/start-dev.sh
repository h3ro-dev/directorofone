#!/bin/bash

echo "🎯 Starting Director of One Development Environment"
echo "================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    echo "Please run this script from the directorofone directory"
    exit 1
fi

# Check if node_modules exists in frontend
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install
    cd ..
fi

# Check if .env.local exists
if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "Creating .env.local from example..."
    echo "# API Configuration" > frontend/.env.local
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001" >> frontend/.env.local
    echo "" >> frontend/.env.local
    echo "# Site Configuration" >> frontend/.env.local
    echo "NEXT_PUBLIC_SITE_URL=http://localhost:3000" >> frontend/.env.local
    echo "✅ Created frontend/.env.local - Please update with your values if needed"
fi

# Start the frontend
echo ""
echo "🎨 Starting Frontend (Next.js)..."
echo "================================"
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Development environment started!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "🎯 Ready to empower one-person departments with AI!"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap 'kill $FRONTEND_PID; exit' INT
wait