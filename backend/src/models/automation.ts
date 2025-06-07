// Automation Models for Director of One

export interface WorkflowAudit {
  id: string;
  userId: string;
  createdAt: Date;
  completedAt?: Date;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  results?: AuditResults;
}

export interface AuditResults {
  totalTasksAnalyzed: number;
  timeWasted: {
    hoursPerWeek: number;
    mainCulprits: TaskCategory[];
  };
  automationOpportunities: AutomationOpportunity[];
  priorityRecommendations: PriorityRecommendation[];
  estimatedTimeSavings: {
    hoursPerWeek: number;
    percentageImprovement: number;
  };
}

export interface TaskCategory {
  name: string;
  type: 'administrative' | 'scheduling' | 'reporting' | 'communication' | 'budgeting' | 'execution';
  hoursPerWeek: number;
  automationPotential: 'high' | 'medium' | 'low';
  description: string;
}

export interface AutomationOpportunity {
  id: string;
  taskCategory: string;
  currentProcess: string;
  proposedAutomation: string;
  timeSavings: number; // hours per week
  implementation: {
    difficulty: 'easy' | 'medium' | 'hard';
    estimatedSetupHours: number;
    tools: string[];
  };
  roi: {
    weeklyTimeSaved: number;
    monthlyValueGenerated: number;
    paybackPeriodWeeks: number;
  };
}

export interface PriorityRecommendation {
  id: string;
  task: string;
  currentPriority: number;
  recommendedPriority: number;
  impact: 'high' | 'medium' | 'low';
  urgency: 'high' | 'medium' | 'low';
  reasoning: string;
  dependencies: string[];
}

export interface AutomationTemplate {
  id: string;
  name: string;
  category: TaskCategory['type'];
  description: string;
  averageTimeSaved: number; // hours per week
  setupTime: number; // hours
  requiredTools: Tool[];
  steps: AutomationStep[];
  triggers: TriggerType[];
}

export interface Tool {
  name: string;
  type: 'software' | 'integration' | 'script' | 'ai-assistant';
  cost: 'free' | 'low' | 'medium' | 'high';
  link?: string;
}

export interface AutomationStep {
  order: number;
  name: string;
  description: string;
  automated: boolean;
  tool?: string;
  inputRequired: boolean;
  outputFormat?: string;
}

export type TriggerType = 
  | { type: 'schedule'; cron: string }
  | { type: 'event'; eventName: string }
  | { type: 'webhook'; endpoint: string }
  | { type: 'manual'; description: string };

export interface Dashboard {
  id: string;
  userId: string;
  name: string;
  widgets: DashboardWidget[];
  refreshInterval: number; // minutes
  lastUpdated: Date;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'calendar' | 'priority-matrix';
  title: string;
  dataSource: string;
  position: { x: number; y: number; width: number; height: number };
  config: Record<string, any>;
}

export interface ProcessAutomation {
  id: string;
  name: string;
  description: string;
  triggers: TriggerType[];
  actions: Action[];
  conditions: Condition[];
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  stats: {
    runsTotal: number;
    runsSuccessful: number;
    averageExecutionTime: number;
    timeSaved: number;
  };
}

export interface Action {
  id: string;
  type: 'email' | 'slack' | 'webhook' | 'database' | 'report' | 'calendar';
  config: Record<string, any>;
  order: number;
  errorHandling: 'stop' | 'continue' | 'retry';
}

export interface Condition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'in' | 'not_in';
  value: any;
  combine: 'and' | 'or';
}

export interface PriorityMatrix {
  userId: string;
  tasks: PriorityTask[];
  lastUpdated: Date;
  aiSuggestions: PrioritySuggestion[];
}

export interface PriorityTask {
  id: string;
  title: string;
  description?: string;
  urgency: 1 | 2 | 3 | 4 | 5; // 1 = low, 5 = high
  importance: 1 | 2 | 3 | 4 | 5; // 1 = low, 5 = high
  quadrant: 'do-first' | 'schedule' | 'delegate' | 'eliminate';
  estimatedHours: number;
  deadline?: Date;
  completed: boolean;
  automatable: boolean;
}

export interface PrioritySuggestion {
  taskId: string;
  suggestion: string;
  reasoning: string;
  confidence: number; // 0-1
  potentialTimeSaved: number; // hours
}