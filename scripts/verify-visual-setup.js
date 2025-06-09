#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 Verifying Director of One Visual Setup...\n');

const checks = [];
let errors = [];

// Helper function to check if file exists
function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, '..', filePath);
  const exists = fs.existsSync(fullPath);
  checks.push({
    name: description,
    path: filePath,
    status: exists ? '✅' : '❌',
    exists
  });
  if (!exists) {
    errors.push(`Missing: ${filePath}`);
  }
  return exists;
}

// Helper function to check file content
function checkFileContent(filePath, searchString, description) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const found = content.includes(searchString);
    checks.push({
      name: description,
      path: filePath,
      status: found ? '✅' : '⚠️',
      exists: true,
      contentCheck: !found
    });
    if (!found) {
      errors.push(`Missing content in ${filePath}: ${searchString}`);
    }
    return found;
  }
  return false;
}

console.log('📁 Checking Core Files...');
// Design System
checkFile('frontend/src/styles/design-system.ts', 'Design System');
checkFile('frontend/tailwind.config.ts', 'Tailwind Configuration');
checkFile('frontend/postcss.config.mjs', 'PostCSS Configuration');
checkFile('frontend/app/globals.css', 'Global CSS');
checkFile('frontend/src/styles/design-system/css-variables.css', 'CSS Variables');

console.log('\n🎨 Checking Components...');
// UI Components
checkFile('frontend/src/components/ui/Button.tsx', 'Button Component');
checkFile('frontend/src/components/ui/Card.tsx', 'Card Component');
checkFile('frontend/src/components/ui/Input.tsx', 'Input Component');
checkFile('frontend/src/components/ui/Typography.tsx', 'Typography Component');
checkFile('frontend/src/components/sections/Hero.tsx', 'Hero Section');
checkFile('frontend/src/components/sections/Features.tsx', 'Features Section');

console.log('\n📄 Checking Pages...');
// Pages
checkFile('frontend/app/page.tsx', 'Landing Page');
checkFile('frontend/app/layout.tsx', 'Root Layout');
checkFile('frontend/app/dashboard/page.tsx', 'Dashboard Page');
checkFile('frontend/app/login/page.tsx', 'Login Page');
checkFile('frontend/app/register/page.tsx', 'Register Page');

console.log('\n🎨 Checking Visual Consistency...');
// Color Scheme - Director of One specific
checkFileContent('frontend/src/styles/design-system.ts', '#4169E1', 'Primary Color (Utlyze Blue)');
checkFileContent('frontend/src/styles/design-system.ts', '#00A878', 'Accent Color (Director Green)');
checkFileContent('frontend/tailwind.config.ts', 'colors.primary', 'Tailwind Primary Color Import');
checkFileContent('frontend/tailwind.config.ts', 'colors.accent', 'Tailwind Accent Color Import');
checkFileContent('frontend/src/styles/design-system/css-variables.css', '#4169E1', 'CSS Variable Primary Color');
checkFileContent('frontend/src/styles/design-system/css-variables.css', '#00A878', 'CSS Variable Accent Color');

// Animations
checkFileContent('frontend/tailwind.config.ts', 'animation:', 'Animation Configuration');
checkFileContent('frontend/tailwind.config.ts', 'fade-in', 'Fade In Animation');
checkFileContent('frontend/tailwind.config.ts', 'slide-up', 'Slide Up Animation');
checkFileContent('frontend/app/globals.css', 'animation-delay', 'Animation Delay Utilities');
checkFileContent('frontend/app/globals.css', 'gradient-text', 'Gradient Text Utility');
checkFileContent('frontend/app/globals.css', 'shadow-professional', 'Professional Shadow Classes');

// Typography
checkFileContent('frontend/src/styles/design-system.ts', 'Segoe UI', 'Professional Font Stack');

// Director of One specific features
checkFileContent('frontend/app/page.tsx', 'Director of One', 'Site Name');
checkFileContent('frontend/app/page.tsx', 'one-person department', 'Target Audience');
checkFileContent('frontend/app/page.tsx', '10+ hours', 'Value Proposition');

console.log('\n🔧 Checking Configuration...');
// Build Configuration
checkFile('frontend/package.json', 'Package.json');
checkFile('frontend/tsconfig.json', 'TypeScript Config');
checkFile('frontend/next.config.ts', 'Next.js Config');

console.log('\n📊 Verification Results:\n');

// Display results
checks.forEach(check => {
  console.log(`${check.status} ${check.name}`);
  if (check.contentCheck) {
    console.log(`   ⚠️  Content check failed`);
  }
});

// Summary
const totalChecks = checks.length;
const passedChecks = checks.filter(c => c.status === '✅').length;
const warningChecks = checks.filter(c => c.status === '⚠️').length;
const failedChecks = checks.filter(c => c.status === '❌').length;

console.log('\n📈 Summary:');
console.log(`   Total checks: ${totalChecks}`);
console.log(`   ✅ Passed: ${passedChecks}`);
console.log(`   ⚠️  Warnings: ${warningChecks}`);
console.log(`   ❌ Failed: ${failedChecks}`);

// Recommendations
if (errors.length > 0) {
  console.log('\n⚠️  Issues Found:');
  errors.forEach(error => console.log(`   - ${error}`));
  
  console.log('\n💡 Recommendations:');
  if (errors.some(e => e.includes('Missing:'))) {
    console.log('   - Run the agent-orchestrator.js to create missing files');
  }
  if (errors.some(e => e.includes('content'))) {
    console.log('   - Review files with content warnings to ensure proper implementation');
  }
} else {
  console.log('\n✅ All visual aspects are properly configured!');
  console.log('\n🚀 Next Steps:');
  console.log('   1. Run "npm run dev" in the frontend directory');
  console.log('   2. Visit http://localhost:3000 to view the site');
  console.log('   3. Test responsive design on different screen sizes');
  console.log('   4. Verify animations and interactions work smoothly');
}

console.log('\n🎯 Director of One - Ready to empower one-person departments!');

process.exit(errors.length > 0 ? 1 : 0);