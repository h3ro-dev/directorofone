import { AutomationTemplate, TaskCategory } from '../models/automation';

export class AutomationTemplateService {
  private templates: AutomationTemplate[] = [
    // Email Management Templates
    {
      id: 'template-email-triage',
      name: 'Intelligent Email Triage',
      category: 'communication',
      description: 'Automatically categorize, prioritize, and draft responses to emails',
      averageTimeSaved: 5,
      setupTime: 2,
      requiredTools: [
        { name: 'Gmail/Outlook', type: 'software', cost: 'free' },
        { name: 'AI Email Assistant', type: 'ai-assistant', cost: 'low' },
        { name: 'Email Rules Engine', type: 'integration', cost: 'free' }
      ],
      steps: [
        {
          order: 1,
          name: 'Set up email filters',
          description: 'Create rules to auto-categorize emails by sender, subject, keywords',
          automated: true,
          tool: 'Gmail/Outlook filters',
          inputRequired: true,
          outputFormat: 'Categorized folders'
        },
        {
          order: 2,
          name: 'Configure AI assistant',
          description: 'Train AI to recognize email patterns and suggest responses',
          automated: true,
          tool: 'AI Email Assistant',
          inputRequired: true,
          outputFormat: 'Draft responses'
        },
        {
          order: 3,
          name: 'Create response templates',
          description: 'Build templates for common email types',
          automated: false,
          inputRequired: true,
          outputFormat: 'Email templates'
        },
        {
          order: 4,
          name: 'Set up auto-responses',
          description: 'Configure automatic replies for routine inquiries',
          automated: true,
          tool: 'Email automation',
          inputRequired: false,
          outputFormat: 'Automated replies'
        }
      ],
      triggers: [
        { type: 'event', eventName: 'new_email_received' },
        { type: 'schedule', cron: '0 8,12,16 * * *' }
      ]
    },

    // Meeting Scheduling Templates
    {
      id: 'template-smart-scheduling',
      name: 'Smart Meeting Scheduler',
      category: 'scheduling',
      description: 'Eliminate back-and-forth scheduling with intelligent calendar management',
      averageTimeSaved: 3,
      setupTime: 1,
      requiredTools: [
        { name: 'Calendly', type: 'software', cost: 'low', link: 'https://calendly.com' },
        { name: 'Google Calendar', type: 'integration', cost: 'free' },
        { name: 'Zoom/Teams', type: 'integration', cost: 'low' }
      ],
      steps: [
        {
          order: 1,
          name: 'Connect calendars',
          description: 'Sync all your calendars to show accurate availability',
          automated: true,
          tool: 'Calendar sync',
          inputRequired: true,
          outputFormat: 'Unified calendar'
        },
        {
          order: 2,
          name: 'Set availability rules',
          description: 'Define when you\'re available for different meeting types',
          automated: false,
          inputRequired: true,
          outputFormat: 'Availability settings'
        },
        {
          order: 3,
          name: 'Create booking links',
          description: 'Generate custom links for different meeting types',
          automated: true,
          tool: 'Calendly',
          inputRequired: false,
          outputFormat: 'Booking URLs'
        },
        {
          order: 4,
          name: 'Automate reminders',
          description: 'Set up automatic meeting reminders and prep emails',
          automated: true,
          tool: 'Email automation',
          inputRequired: false,
          outputFormat: 'Reminder emails'
        }
      ],
      triggers: [
        { type: 'event', eventName: 'meeting_request' },
        { type: 'webhook', endpoint: '/api/schedule' }
      ]
    },

    // Reporting Templates
    {
      id: 'template-auto-reports',
      name: 'Automated Report Generator',
      category: 'reporting',
      description: 'Generate beautiful reports automatically from multiple data sources',
      averageTimeSaved: 6,
      setupTime: 8,
      requiredTools: [
        { name: 'Google Data Studio', type: 'software', cost: 'free', link: 'https://datastudio.google.com' },
        { name: 'API Connector', type: 'integration', cost: 'low' },
        { name: 'Report Scheduler', type: 'script', cost: 'free' }
      ],
      steps: [
        {
          order: 1,
          name: 'Connect data sources',
          description: 'Link all your data sources (CRM, analytics, spreadsheets)',
          automated: true,
          tool: 'API Connector',
          inputRequired: true,
          outputFormat: 'Connected datasets'
        },
        {
          order: 2,
          name: 'Design report templates',
          description: 'Create reusable report templates with charts and KPIs',
          automated: false,
          inputRequired: true,
          outputFormat: 'Report templates'
        },
        {
          order: 3,
          name: 'Set up data refresh',
          description: 'Configure automatic data updates',
          automated: true,
          tool: 'Data Studio',
          inputRequired: false,
          outputFormat: 'Live data'
        },
        {
          order: 4,
          name: 'Schedule distribution',
          description: 'Automatically send reports to stakeholders',
          automated: true,
          tool: 'Report Scheduler',
          inputRequired: true,
          outputFormat: 'Scheduled emails'
        }
      ],
      triggers: [
        { type: 'schedule', cron: '0 9 * * MON' },
        { type: 'schedule', cron: '0 9 1 * *' }
      ]
    },

    // Budget Tracking Templates
    {
      id: 'template-budget-automation',
      name: 'Smart Budget Tracker',
      category: 'budgeting',
      description: 'Automatically track expenses, flag anomalies, and forecast budgets',
      averageTimeSaved: 4,
      setupTime: 5,
      requiredTools: [
        { name: 'QuickBooks/Xero', type: 'software', cost: 'medium' },
        { name: 'Bank API', type: 'integration', cost: 'free' },
        { name: 'Budget Alert System', type: 'script', cost: 'free' }
      ],
      steps: [
        {
          order: 1,
          name: 'Connect bank accounts',
          description: 'Link bank accounts and credit cards for auto-import',
          automated: true,
          tool: 'Bank API',
          inputRequired: true,
          outputFormat: 'Transaction feed'
        },
        {
          order: 2,
          name: 'Set up categorization',
          description: 'Create rules to auto-categorize expenses',
          automated: true,
          tool: 'QuickBooks',
          inputRequired: true,
          outputFormat: 'Categorized expenses'
        },
        {
          order: 3,
          name: 'Configure alerts',
          description: 'Set up alerts for overspending or anomalies',
          automated: true,
          tool: 'Budget Alert System',
          inputRequired: true,
          outputFormat: 'Alert notifications'
        },
        {
          order: 4,
          name: 'Generate forecasts',
          description: 'Automatically project future spending based on trends',
          automated: true,
          tool: 'AI forecasting',
          inputRequired: false,
          outputFormat: 'Budget forecasts'
        }
      ],
      triggers: [
        { type: 'event', eventName: 'new_transaction' },
        { type: 'schedule', cron: '0 10 * * *' }
      ]
    },

    // Task Prioritization Templates
    {
      id: 'template-priority-matrix',
      name: 'AI Priority Assistant',
      category: 'administrative',
      description: 'Use AI to automatically prioritize tasks based on impact and urgency',
      averageTimeSaved: 2,
      setupTime: 1,
      requiredTools: [
        { name: 'Task Management App', type: 'software', cost: 'low' },
        { name: 'AI Priority Engine', type: 'ai-assistant', cost: 'low' },
        { name: 'Calendar Integration', type: 'integration', cost: 'free' }
      ],
      steps: [
        {
          order: 1,
          name: 'Import tasks',
          description: 'Connect all task sources (email, project tools, notes)',
          automated: true,
          tool: 'Task importer',
          inputRequired: true,
          outputFormat: 'Unified task list'
        },
        {
          order: 2,
          name: 'Define criteria',
          description: 'Set impact and urgency criteria for your role',
          automated: false,
          inputRequired: true,
          outputFormat: 'Priority rules'
        },
        {
          order: 3,
          name: 'AI analysis',
          description: 'Let AI analyze and score each task',
          automated: true,
          tool: 'AI Priority Engine',
          inputRequired: false,
          outputFormat: 'Scored tasks'
        },
        {
          order: 4,
          name: 'Daily planning',
          description: 'Generate daily priority list and time blocks',
          automated: true,
          tool: 'Calendar Integration',
          inputRequired: false,
          outputFormat: 'Daily schedule'
        }
      ],
      triggers: [
        { type: 'schedule', cron: '0 7 * * *' },
        { type: 'event', eventName: 'new_task_added' }
      ]
    },

    // Data Entry Automation
    {
      id: 'template-data-sync',
      name: 'Multi-System Data Sync',
      category: 'administrative',
      description: 'Automatically sync data between spreadsheets, CRM, and other tools',
      averageTimeSaved: 6,
      setupTime: 10,
      requiredTools: [
        { name: 'Zapier/Make', type: 'integration', cost: 'medium', link: 'https://zapier.com' },
        { name: 'Google Sheets API', type: 'integration', cost: 'free' },
        { name: 'Database Connector', type: 'script', cost: 'free' }
      ],
      steps: [
        {
          order: 1,
          name: 'Map data fields',
          description: 'Identify matching fields across systems',
          automated: false,
          inputRequired: true,
          outputFormat: 'Field mapping'
        },
        {
          order: 2,
          name: 'Create workflows',
          description: 'Build automated workflows for data movement',
          automated: true,
          tool: 'Zapier',
          inputRequired: true,
          outputFormat: 'Automation workflows'
        },
        {
          order: 3,
          name: 'Set sync schedule',
          description: 'Configure real-time or batch sync',
          automated: true,
          tool: 'Workflow scheduler',
          inputRequired: false,
          outputFormat: 'Sync schedule'
        },
        {
          order: 4,
          name: 'Error handling',
          description: 'Set up notifications for sync errors',
          automated: true,
          tool: 'Alert system',
          inputRequired: false,
          outputFormat: 'Error alerts'
        }
      ],
      triggers: [
        { type: 'event', eventName: 'data_updated' },
        { type: 'schedule', cron: '*/30 * * * *' },
        { type: 'webhook', endpoint: '/api/sync' }
      ]
    }
  ];

  async getTemplates(category?: TaskCategory['type']): Promise<AutomationTemplate[]> {
    if (category) {
      return this.templates.filter(t => t.category === category);
    }
    return this.templates;
  }

  async getTemplateById(id: string): Promise<AutomationTemplate | undefined> {
    return this.templates.find(t => t.id === id);
  }

  async getRecommendedTemplates(userProfile: any): Promise<AutomationTemplate[]> {
    // In a real implementation, this would analyze user profile and recommend templates
    // For now, return top templates by time saved
    return this.templates
      .sort((a, b) => b.averageTimeSaved - a.averageTimeSaved)
      .slice(0, 3);
  }

  calculateROI(template: AutomationTemplate, hourlyRate: number = 50): {
    setupCost: number;
    weeklyValue: number;
    monthlyValue: number;
    paybackWeeks: number;
  } {
    const setupCost = template.setupTime * hourlyRate;
    const weeklyValue = template.averageTimeSaved * hourlyRate;
    const monthlyValue = weeklyValue * 4.33;
    const paybackWeeks = setupCost / weeklyValue;

    return {
      setupCost,
      weeklyValue,
      monthlyValue,
      paybackWeeks
    };
  }
}