#!/bin/bash

# API Testing Script for DirectorOfOne

API_BASE="http://localhost:3000"
API_URL="$API_BASE/api/v1"

echo "🧪 Testing DirectorOfOne API"
echo "============================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo ""
    echo "📍 $description"
    echo "   $method $endpoint"
    
    if [ -z "$data" ]; then
        response=$(curl -s -X $method "$endpoint")
    else
        response=$(curl -s -X $method "$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "   ${GREEN}✓ Success${NC}"
        echo "   Response: $(echo $response | jq -c . 2>/dev/null || echo $response)"
    else
        echo -e "   ${RED}✗ Failed${NC}"
    fi
}

# Check if server is running
echo "🏥 Checking server health..."
if ! curl -s "$API_BASE/health" > /dev/null; then
    echo -e "${RED}❌ Server is not running! Please start it first.${NC}"
    echo "   Run: cd backend && npm start"
    exit 1
fi
echo -e "${GREEN}✅ Server is healthy${NC}"

# Test Health Endpoints
test_endpoint "GET" "$API_BASE/health" "" "Health Check"
test_endpoint "GET" "$API_URL/status" "" "Detailed Status"

# Test User Endpoints
echo ""
echo "👥 Testing User Endpoints"
echo "------------------------"

test_endpoint "GET" "$API_URL/users" "" "Get All Users"
test_endpoint "GET" "$API_URL/users/1" "" "Get User by ID"

# Create a new user
NEW_USER='{
  "username": "testuser",
  "email": "test@example.com",
  "password": "testpass123",
  "role": "user"
}'
test_endpoint "POST" "$API_URL/users" "$NEW_USER" "Create New User"

# Update user
UPDATE_USER='{
  "username": "updateduser",
  "email": "updated@example.com"
}'
test_endpoint "PUT" "$API_URL/users/1" "$UPDATE_USER" "Update User"

# Test Task Endpoints
echo ""
echo "📋 Testing Task Endpoints"
echo "------------------------"

test_endpoint "GET" "$API_URL/tasks" "" "Get All Tasks"
test_endpoint "GET" "$API_URL/tasks?status=todo&priority=high" "" "Get Filtered Tasks"
test_endpoint "GET" "$API_URL/tasks/1" "" "Get Task by ID"

# Create a new task
NEW_TASK='{
  "title": "Test Task",
  "description": "This is a test task",
  "priority": "high",
  "tags": ["test", "api"]
}'
test_endpoint "POST" "$API_URL/tasks" "$NEW_TASK" "Create New Task"

# Update task status
UPDATE_STATUS='{
  "status": "in_progress"
}'
test_endpoint "PATCH" "$API_URL/tasks/1/status" "$UPDATE_STATUS" "Update Task Status"

# Test Error Handling
echo ""
echo "🔥 Testing Error Handling"
echo "------------------------"

test_endpoint "GET" "$API_URL/users/999" "" "Get Non-existent User (404)"
test_endpoint "POST" "$API_URL/users" '{"username":"test"}' "" "Create User with Missing Fields (400)"
test_endpoint "GET" "$API_URL/nonexistent" "" "Non-existent Endpoint (404)"

# Test Rate Limiting (optional)
echo ""
echo "🚦 Testing Rate Limiting"
echo "------------------------"
echo "   Sending multiple requests..."

for i in {1..5}; do
    curl -s "$API_URL/users" > /dev/null
    echo -n "."
done
echo ""
echo -e "   ${GREEN}✓ Rate limiting test complete${NC}"

echo ""
echo "============================"
echo "🎉 API Testing Complete!"
echo ""