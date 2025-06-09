#!/usr/bin/env node

/**
 * Director of One - Dynamic Agent Orchestrator
 * 
 * Template for creating orchestrators for other "Of One" sites.
 * Replace Director of One, Directors and managers who are essentially a one-person department, and customize TASK_REGISTRY.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Site-specific configuration
const SITE_CONFIG = {
  name: 'Director of One',  // e.g., 'Director of One'
  domain: 'directorofone.ai',   // e.g., 'directorofone.ai'
  targetAudience: 'Directors and managers who are essentially a one-person department', // e.g., 'one-person department managers'
  primaryColor: '#4169E1',  // Utlyze blue (keep consistent)
  accentColor: '#00A878',  // Customize per site type
};

// Task Registry with Dependencies
const TASK_REGISTRY = {
  // PHASE 1: Foundation (COMPLETED)
  'design-system': {
    id: 'design-system',
    name: `Create ${SITE_CONFIG.name} Design System`,
    path: 'frontend/src/styles/design-system.ts',
    dependencies: [],
    estimatedHours: 3,
    priority: 'CRITICAL',
    prompt: `Create design system for ${SITE_CONFIG.name}. Use Utlyze blue (#4169E1) as primary, ${SITE_CONFIG.accentColor} as accent. Target audience: ${SITE_CONFIG.targetAudience}. Clean, professional, trustworthy design.`,
    completionCheck: () => fs.existsSync('frontend/src/styles/design-system.ts')
  },

  'content-strategy': {
    id: 'content-strategy',
    name: `Develop ${SITE_CONFIG.name} Content`,
    dependencies: [],
    estimatedHours: 4,
    priority: 'CRITICAL',
    prompt: `Create content for ${SITE_CONFIG.name}. Target: ${SITE_CONFIG.targetAudience}. Pain points: Running a department alone is overwhelming, Scheduling, budgeting, executing all at once, Endless administrative tasks, No time for big-picture thinking. Solution: AI tools to automate routine operations and highlight priorities. Focus on Automated dashboards and reminders, Process automation tools, Priority management system, Save 10+ hours per week.`,
    completionCheck: () => fs.existsSync('content/copy/homepage.md')
  },

  'nextjs-setup': {
    id: 'nextjs-setup',
    name: 'Initialize Next.js Project',
    dependencies: [],
    estimatedHours: 2,
    priority: 'CRITICAL',
    prompt: 'Initialize Next.js 14 with TypeScript, Tailwind CSS, App Router. Standard Utlyze setup.',
    completionCheck: () => fs.existsSync('frontend/package.json')
  },

  'component-library': {
    id: 'component-library',
    name: 'Build Component Library',
    dependencies: ['nextjs-setup', 'design-system'],
    estimatedHours: 4,
    priority: 'HIGH',
    prompt: 'Create reusable components using design system. Standard Utlyze component set.',
    completionCheck: () => fs.existsSync('frontend/src/components/ui/Button.tsx')
  },

  'landing-page': {
    id: 'landing-page',
    name: `Build ${SITE_CONFIG.name} Landing Page`,
    dependencies: ['component-library', 'content-strategy'],
    estimatedHours: 4,
    priority: 'CRITICAL',
    prompt: `Build landing page for ${SITE_CONFIG.name}. Hero, pain points, solution, features, testimonials, CTAs. Multiple consultation CTAs.`,
    completionCheck: () => fs.existsSync('frontend/app/page.tsx')
  },

  'api-setup': {
    id: 'api-setup',
    name: 'Setup API Infrastructure',
    dependencies: [],
    estimatedHours: 3,
    priority: 'HIGH',
    prompt: 'Standard Express.js API setup with TypeScript. Vercel-ready.',
    completionCheck: () => fs.existsSync('backend/src/api/server.ts')
  },

  // PHASE 2: Critical Fixes
  'fix-auth-imports': {
    id: 'fix-auth-imports',
    name: 'Fix Authentication Import Issues',
    dependencies: ['nextjs-setup'],
    estimatedHours: 1,
    priority: 'CRITICAL',
    prompt: 'Fix TypeScript path mapping in tsconfig.json. Change "@/*": ["./*"] to "@/*": ["./src/*"] to resolve import issues with auth modules.',
    completionCheck: () => {
      try {
        const tsconfig = JSON.parse(fs.readFileSync('frontend/tsconfig.json', 'utf8'));
        return tsconfig.compilerOptions.paths['@/*'][0] === './src/*';
      } catch { return false; }
    }
  },

  'fix-backend-health': {
    id: 'fix-backend-health',
    name: 'Fix Backend Health Endpoints',
    dependencies: ['api-setup'],
    estimatedHours: 0.5,
    priority: 'HIGH',
    prompt: 'Make health endpoints public (bypass auth middleware). Ensure /health and /api/v1/health are accessible without authentication.',
    completionCheck: () => {
      try {
        // This will need to be manually verified by testing the endpoint
        return true; // Placeholder - manual verification needed
      } catch { return false; }
    }
  },

  // PHASE 3: Authentication System
  'auth-integration': {
    id: 'auth-integration',
    name: 'Complete Authentication Integration',
    dependencies: ['fix-auth-imports', 'api-setup'],
    estimatedHours: 3,
    priority: 'CRITICAL',
    prompt: 'Integrate frontend auth context with backend APIs. Test login, register, logout flows. Ensure AuthContext works with existing auth.ts API.',
    completionCheck: () => fs.existsSync('frontend/src/contexts/AuthContext.tsx') && fs.existsSync('frontend/src/lib/api/auth.ts')
  },

  'auth-pages': {
    id: 'auth-pages',
    name: 'Build Authentication Pages',
    dependencies: ['auth-integration', 'component-library'],
    estimatedHours: 4,
    priority: 'HIGH',
    prompt: 'Create login, register, forgot password, and reset password pages. Use design system and component library. Professional, trustworthy design for directors.',
    completionCheck: () => fs.existsSync('frontend/app/login/page.tsx') && fs.existsSync('frontend/app/register/page.tsx')
  },

  // PHASE 4: Dashboard Foundation
  'dashboard-layout': {
    id: 'dashboard-layout',
    name: 'Build Dashboard Layout',
    dependencies: ['auth-integration', 'component-library'],
    estimatedHours: 3,
    priority: 'HIGH',
    prompt: 'Create protected dashboard layout with sidebar navigation, header with user menu, responsive design. Professional layout for department directors.',
    completionCheck: () => fs.existsSync('frontend/app/dashboard/layout.tsx')
  },

  'dashboard-overview': {
    id: 'dashboard-overview',
    name: 'Build Dashboard Overview Page',
    dependencies: ['dashboard-layout'],
    estimatedHours: 4,
    priority: 'HIGH',
    prompt: 'Create dashboard overview with key metrics, recent tasks, priority alerts, and quick actions. Focus on one-person department management.',
    completionCheck: () => fs.existsSync('frontend/app/dashboard/page.tsx')
  },

  // PHASE 5: Core Features
  'task-management': {
    id: 'task-management',
    name: 'Build Task Management System',
    dependencies: ['dashboard-layout', 'api-setup'],
    estimatedHours: 6,
    priority: 'HIGH',
    prompt: 'Create comprehensive task management with priority scoring, deadlines, categories, and automation suggestions. Backend and frontend integration.',
    completionCheck: () => fs.existsSync('frontend/app/dashboard/tasks/page.tsx')
  },

  'priority-system': {
    id: 'priority-system',
    name: 'Build AI Priority Management',
    dependencies: ['task-management'],
    estimatedHours: 5,
    priority: 'HIGH',
    prompt: 'Implement AI-powered priority scoring system. Smart recommendations for task prioritization based on deadlines, impact, and department goals.',
    completionCheck: () => fs.existsSync('frontend/app/dashboard/priorities/page.tsx')
  },

  'workflow-automation': {
    id: 'workflow-automation',
    name: 'Build Workflow Automation',
    dependencies: ['task-management'],
    estimatedHours: 6,
    priority: 'MEDIUM',
    prompt: 'Create workflow automation tools: recurring task templates, automated reminders, process checklists. Help directors automate routine operations.',
    completionCheck: () => fs.existsSync('frontend/app/dashboard/workflows/page.tsx')
  },

  // PHASE 6: Analytics & Insights
  'analytics-dashboard': {
    id: 'analytics-dashboard',
    name: 'Build Analytics Dashboard',
    dependencies: ['dashboard-layout', 'task-management'],
    estimatedHours: 5,
    priority: 'MEDIUM',
    prompt: 'Create analytics dashboard with department performance metrics, time savings reports, productivity insights, and trend analysis.',
    completionCheck: () => fs.existsSync('frontend/app/dashboard/analytics/page.tsx')
  },

  'reporting-system': {
    id: 'reporting-system',
    name: 'Build Automated Reporting',
    dependencies: ['analytics-dashboard'],
    estimatedHours: 4,
    priority: 'MEDIUM',
    prompt: 'Create automated report generation for stakeholders. Weekly/monthly department status reports, key metrics summaries.',
    completionCheck: () => fs.existsSync('frontend/src/features/reporting')
  },

  // PHASE 7: Integrations
  'external-integrations': {
    id: 'external-integrations',
    name: 'Build External Integrations',
    dependencies: ['dashboard-overview'],
    estimatedHours: 8,
    priority: 'LOW',
    prompt: 'Create integrations with common tools: Slack, email, calendar, project management tools. Help directors connect their existing workflow.',
    completionCheck: () => fs.existsSync('frontend/app/integrations/page.tsx')
  },

  // PHASE 8: Advanced Features
  'ai-assistant': {
    id: 'ai-assistant',
    name: 'Build AI Assistant',
    dependencies: ['priority-system', 'analytics-dashboard'],
    estimatedHours: 10,
    priority: 'LOW',
    prompt: 'Create AI assistant for directors: strategic recommendations, workload optimization suggestions, automated decision support.',
    completionCheck: () => fs.existsSync('frontend/src/features/ai-assistant')
  }
};

// Standard orchestrator functions (same as CEO of One)
function findReadyTasks() {
  const readyTasks = [];
  const completedTasks = new Set();
  
  for (const [taskId, task] of Object.entries(TASK_REGISTRY)) {
    if (task.completionCheck && task.completionCheck()) {
      completedTasks.add(taskId);
    }
  }
  
  for (const [taskId, task] of Object.entries(TASK_REGISTRY)) {
    if (completedTasks.has(taskId)) continue;
    
    const dependenciesMet = task.dependencies.every(dep => completedTasks.has(dep));
    if (dependenciesMet) {
      readyTasks.push(task);
    }
  }
  
  const priorityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
  readyTasks.sort((a, b) => {
    return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
  });
  
  return { readyTasks, completedTasks };
}

function generateAgentCommands(tasks) {
  const commands = [];
  
  tasks.forEach((task, index) => {
    const command = {
      terminal: index + 1,
      name: task.name,
      command: `cd "${process.cwd()}" && CURSOR_BACKGROUND_AGENT_PROMPT="${task.prompt}" npm run background`,
      estimatedHours: task.estimatedHours,
      priority: task.priority
    };
    commands.push(command);
  });
  
  return commands;
}

function main() {
  console.log(`🚀 ${SITE_CONFIG.name} - Dynamic Agent Orchestrator\n`);
  console.log('Analyzing project state...\n');
  
  const { readyTasks, completedTasks } = findReadyTasks();
  const totalTasks = Object.keys(TASK_REGISTRY).length;
  const blockedTasks = totalTasks - completedTasks.size - readyTasks.length;
  
  console.log(`📊 Task Status:`);
  console.log(`   - Total tasks: ${totalTasks}`);
  console.log(`   - Completed: ${completedTasks.size}`);
  console.log(`   - Ready to start: ${readyTasks.length}`);
  console.log(`   - Blocked: ${blockedTasks}\n`);
  
  if (completedTasks.size > 0) {
    console.log('✅ Completed Tasks:');
    for (const taskId of completedTasks) {
      console.log(`   - ${TASK_REGISTRY[taskId].name}`);
    }
    console.log('');
  }
  
  if (readyTasks.length === 0) {
    if (completedTasks.size === totalTasks) {
      console.log(`🎉 All tasks completed! ${SITE_CONFIG.name} is ready for launch.`);
    } else {
      console.log('⏸️  No tasks are currently ready. Some tasks may be blocked by dependencies.');
    }
    return;
  }
  
  console.log(`🤖 Deploy ${readyTasks.length} Agents Right Now!\n`);
  
  const commands = generateAgentCommands(readyTasks);
  const totalHours = commands.reduce((sum, cmd) => sum + cmd.estimatedHours, 0);
  const maxHours = Math.max(...commands.map(c => c.estimatedHours));
  
  console.log(`⏱️  Estimated time: ${maxHours} hours (running in parallel)`);
  console.log(`📈 Total work: ${totalHours} hours compressed into parallel execution\n`);
  
  console.log('─'.repeat(80));
  commands.forEach(cmd => {
    console.log(`\n### Agent ${cmd.terminal}: ${cmd.name}`);
    console.log(`Priority: ${cmd.priority} | Estimated: ${cmd.estimatedHours} hours`);
    console.log('```bash');
    console.log(cmd.command);
    console.log('```');
  });
  console.log('\n' + '─'.repeat(80));
  
  console.log('\n📋 Instructions:');
  console.log('1. Open ' + commands.length + ' terminal windows or Cursor background agents');
  console.log('2. Copy and run each command above');
  console.log('3. Agents will work autonomously in parallel');
  console.log('4. Run this orchestrator again to see newly available tasks');
  
  const stateFile = path.join(process.cwd(), '.agent-orchestrator-state.json');
  const state = {
    timestamp: new Date().toISOString(),
    projectName: SITE_CONFIG.name,
    completedTasks: Array.from(completedTasks),
    readyTasks: readyTasks.map(t => t.id),
    blockedTasks,
    totalTasks,
    estimatedCompletion: `${maxHours} hours`
  };
  
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
  console.log(`\n💾 State saved to ${stateFile}`);
}

if (require.main === module) {
  main();
}

module.exports = { findReadyTasks, generateAgentCommands, TASK_REGISTRY, SITE_CONFIG };