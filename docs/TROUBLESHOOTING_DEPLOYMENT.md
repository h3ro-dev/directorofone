# Director of One - Deployment Troubleshooting Guide

## Current Issue
The production site at https://directorofone.ai is showing a redirect to `/lander` instead of the Next.js application we built.

## Troubleshooting Steps

### 1. Verify Vercel Connection
1. Go to https://vercel.com/dashboard
2. Check if the `directorofone` project exists
3. Verify it's connected to the correct GitHub repository
4. Check the deployment history for recent deployments

### 2. Check Vercel Configuration
Ensure the following in your Vercel project settings:

#### Framework Preset
- Should be set to "Next.js"

#### Build & Development Settings
- **Framework Preset**: Next.js
- **Build Command**: `cd frontend && npm run build` (or use override from vercel.json)
- **Output Directory**: `frontend/.next`
- **Install Command**: `npm install && cd frontend && npm install`

#### Root Directory
- Should be set to the repository root (not `/frontend`)
- Our vercel.json handles the frontend navigation

### 3. Domain Configuration
1. Check if `directorofone.ai` is properly connected in Vercel
2. Verify DNS settings point to Vercel
3. Check for any domain redirects or rules

### 4. Check for Conflicting Deployments
The `/lander` redirect suggests there might be:
- Another deployment on the same domain
- A holding page or redirect rule
- Domain parking or redirect service

### 5. Verify Repository Structure
```
directorofone/
├── frontend/          # Next.js application
│   ├── app/          # App router pages
│   ├── src/          # Components and utilities
│   └── package.json
├── backend/          # Express API
├── scripts/          # Build scripts
├── vercel.json       # Vercel configuration
└── package.json      # Root package.json
```

### 6. Manual Deployment Commands
If automatic deployment isn't working, try:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy manually from project root
cd /path/to/directorofone
vercel --prod
```

### 7. Check Build Logs
In Vercel dashboard:
1. Go to the project
2. Click on the latest deployment
3. Check "Function Logs" or "Build Logs"
4. Look for errors or warnings

### 8. Environment Variables
Ensure these are set in Vercel if needed:
- `NEXT_PUBLIC_API_URL` (if using)
- Any other environment variables your app needs

### 9. Alternative Deployment Method
If Vercel continues to have issues:

```bash
# Build locally and check
cd frontend
npm run build
npm start

# If it works locally, the issue is with Vercel configuration
```

### 10. DNS Verification
Check if the domain is pointing to Vercel:
```bash
# Check DNS records
dig directorofone.ai
nslookup directorofone.ai

# Should show Vercel's servers (cname.vercel-dns.com or similar)
```

## Common Solutions

### Solution 1: Clear Cache and Redeploy
```bash
# In Vercel dashboard
1. Go to Settings → Functions
2. Click "Purge Cache"
3. Trigger new deployment by pushing empty commit:
   git commit --allow-empty -m "Trigger deployment"
   git push origin main
```

### Solution 2: Reset Vercel Project
1. Delete the project in Vercel dashboard
2. Re-import from GitHub
3. Ensure correct settings during import

### Solution 3: Check for index.html
The redirect might be from a static `index.html` file:
```bash
# Check if there's a conflicting index.html
find . -name "index.html" -type f
```

### Solution 4: Verify Next.js Export
Ensure the app is not using static export:
```javascript
// next.config.js should NOT have:
// output: 'export'
```

## Expected Behavior When Fixed
- Homepage shows "Running a Department of One? Work Smarter, Not Harder"
- `/login` shows the login form
- `/register` shows registration form
- `/demo` shows demo content
- `/consultation` shows consultation page
- `/dashboard` redirects to login (if not authenticated)

## Contact Support
If none of these solutions work:
1. Contact Vercel support with deployment ID
2. Check GitHub repository settings
3. Verify domain ownership

## Verification After Fix
Run the verification script:
```bash
./scripts/verify-deployment.sh
```

All checks should pass (green checkmarks).