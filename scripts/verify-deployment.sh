#!/bin/bash

# Director of One - Deployment Verification Script
# This script checks if the production site is properly deployed

echo "🔍 Director of One - Deployment Verification"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="https://directorofone.ai"

# Function to check if a page contains expected content
check_page() {
    local url=$1
    local search_text=$2
    local description=$3
    
    echo -n "Checking $description... "
    
    if curl -s "$url" | grep -q "$search_text"; then
        echo -e "${GREEN}✓ Pass${NC}"
        return 0
    else
        echo -e "${RED}✗ Fail${NC}"
        return 1
    fi
}

# Function to check HTTP status
check_status() {
    local url=$1
    local description=$2
    
    echo -n "Checking $description status... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status" = "200" ]; then
        echo -e "${GREEN}✓ 200 OK${NC}"
        return 0
    else
        echo -e "${RED}✗ Status: $status${NC}"
        return 1
    fi
}

echo "1. Checking Site Availability"
echo "-----------------------------"
check_status "$BASE_URL" "Homepage"
check_status "$BASE_URL/login" "Login page"
check_status "$BASE_URL/register" "Register page"
check_status "$BASE_URL/demo" "Demo page"
check_status "$BASE_URL/consultation" "Consultation page"

echo ""
echo "2. Checking Page Content"
echo "------------------------"
check_page "$BASE_URL" "Director of One" "Homepage has branding"
check_page "$BASE_URL" "Running a Department of One" "Homepage has correct headline"
check_page "$BASE_URL" "Get Your Free Workflow Audit" "Homepage has primary CTA"
check_page "$BASE_URL/login" "Welcome back" "Login page content"
check_page "$BASE_URL/register" "Start your free trial" "Register page content"
check_page "$BASE_URL/demo" "See Director of One in Action" "Demo page content"
check_page "$BASE_URL/consultation" "Free Workflow Audit" "Consultation page content"

echo ""
echo "3. Checking Key Features"
echo "------------------------"
check_page "$BASE_URL" "Automated Dashboards" "Features section exists"
check_page "$BASE_URL" "Save 10+ Hours Per Week" "Time savings promise"
check_page "$BASE_URL" "We Understand Your Challenges" "Pain points section"

echo ""
echo "4. Checking Design Elements"
echo "---------------------------"
# Check for primary color in CSS
echo -n "Checking for primary color (#4169E1)... "
if curl -s "$BASE_URL" | grep -q "4169E1\|4169e1"; then
    echo -e "${GREEN}✓ Found${NC}"
else
    echo -e "${RED}✗ Not found${NC}"
fi

echo ""
echo "==========================================="
echo "Verification Complete!"
echo ""
echo "Note: This is a basic verification. For full testing:"
echo "1. Manually visit $BASE_URL"
echo "2. Test the authentication flow"
echo "3. Check responsive design on mobile"
echo "4. Verify all interactive elements"
echo ""