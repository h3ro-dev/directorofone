import { Dashboard, DashboardWidget } from '../models/automation';

export class DashboardService {
  // Pre-configured dashboard templates
  private readonly dashboardTemplates = {
    executive: {
      name: 'Executive Overview',
      description: 'High-level metrics and KPIs for directors',
      widgets: [
        {
          type: 'metric' as const,
          title: 'Tasks Completed This Week',
          dataSource: 'tasks.completed.weekly',
          position: { x: 0, y: 0, width: 3, height: 2 },
          config: {
            format: 'number',
            trend: true,
            color: 'green'
          }
        },
        {
          type: 'metric' as const,
          title: 'Hours Saved via Automation',
          dataSource: 'automation.hours_saved',
          position: { x: 3, y: 0, width: 3, height: 2 },
          config: {
            format: 'hours',
            trend: true,
            color: 'blue'
          }
        },
        {
          type: 'priority-matrix' as const,
          title: 'Task Priority Matrix',
          dataSource: 'priority.matrix',
          position: { x: 6, y: 0, width: 6, height: 4 },
          config: {
            showSuggestions: true,
            interactive: true
          }
        },
        {
          type: 'chart' as const,
          title: 'Department Performance',
          dataSource: 'performance.metrics',
          position: { x: 0, y: 2, width: 6, height: 4 },
          config: {
            chartType: 'line',
            metrics: ['productivity', 'efficiency', 'quality'],
            timeRange: '30d'
          }
        },
        {
          type: 'list' as const,
          title: 'Upcoming Deadlines',
          dataSource: 'tasks.deadlines',
          position: { x: 6, y: 4, width: 6, height: 4 },
          config: {
            limit: 10,
            sortBy: 'deadline',
            showUrgency: true
          }
        },
        {
          type: 'calendar' as const,
          title: 'Schedule Overview',
          dataSource: 'calendar.events',
          position: { x: 0, y: 6, width: 12, height: 4 },
          config: {
            view: 'week',
            showConflicts: true,
            colorByType: true
          }
        }
      ]
    },
    operational: {
      name: 'Operations Dashboard',
      description: 'Day-to-day operational metrics',
      widgets: [
        {
          type: 'metric' as const,
          title: 'Open Tasks',
          dataSource: 'tasks.open.count',
          position: { x: 0, y: 0, width: 2, height: 2 },
          config: {
            format: 'number',
            threshold: { warning: 20, critical: 30 }
          }
        },
        {
          type: 'metric' as const,
          title: 'Budget Utilization',
          dataSource: 'budget.utilization',
          position: { x: 2, y: 0, width: 2, height: 2 },
          config: {
            format: 'percentage',
            threshold: { warning: 80, critical: 95 }
          }
        },
        {
          type: 'chart' as const,
          title: 'Task Completion Rate',
          dataSource: 'tasks.completion_rate',
          position: { x: 4, y: 0, width: 8, height: 4 },
          config: {
            chartType: 'bar',
            timeRange: '7d',
            groupBy: 'category'
          }
        },
        {
          type: 'list' as const,
          title: 'Automation Opportunities',
          dataSource: 'automation.opportunities',
          position: { x: 0, y: 4, width: 6, height: 4 },
          config: {
            limit: 5,
            showROI: true,
            sortBy: 'timeSavings'
          }
        },
        {
          type: 'chart' as const,
          title: 'Time Allocation',
          dataSource: 'time.allocation',
          position: { x: 6, y: 4, width: 6, height: 4 },
          config: {
            chartType: 'donut',
            groupBy: 'taskType'
          }
        }
      ]
    }
  };

  async createDashboard(userId: string, template: 'executive' | 'operational' | 'custom'): Promise<Dashboard> {
    const templateConfig = this.dashboardTemplates[template as keyof typeof this.dashboardTemplates];
    
    const dashboard: Dashboard = {
      id: `dashboard-${Date.now()}`,
      userId,
      name: templateConfig?.name || 'Custom Dashboard',
      widgets: this.generateWidgets(templateConfig?.widgets || []),
      refreshInterval: 15, // 15 minutes default
      lastUpdated: new Date()
    };

    return dashboard;
  }

  private generateWidgets(templateWidgets: any[]): DashboardWidget[] {
    return templateWidgets.map((widget, index) => ({
      id: `widget-${Date.now()}-${index}`,
      ...widget
    }));
  }

  async updateWidget(
    dashboardId: string, 
    widgetId: string, 
    updates: Partial<DashboardWidget>
  ): Promise<DashboardWidget> {
    // In real implementation, this would update the widget in the database
    const widget: DashboardWidget = {
      id: widgetId,
      type: updates.type || 'metric',
      title: updates.title || 'Updated Widget',
      dataSource: updates.dataSource || '',
      position: updates.position || { x: 0, y: 0, width: 3, height: 2 },
      config: updates.config || {}
    };

    return widget;
  }

  async getWidgetData(widget: DashboardWidget): Promise<any> {
    // Simulate fetching data based on widget configuration
    switch (widget.dataSource) {
      case 'tasks.completed.weekly':
        return {
          value: 47,
          previousValue: 42,
          trend: 'up',
          percentage: 11.9
        };
      
      case 'automation.hours_saved':
        return {
          value: 12.5,
          previousValue: 10.2,
          trend: 'up',
          percentage: 22.5
        };
      
      case 'priority.matrix':
        return {
          quadrants: {
            'do-first': 5,
            'schedule': 12,
            'delegate': 8,
            'eliminate': 3
          },
          suggestions: 4
        };
      
      case 'tasks.deadlines':
        return [
          { title: 'Q4 Budget Report', deadline: '2024-12-31', urgency: 'high' },
          { title: 'Team Performance Reviews', deadline: '2024-12-15', urgency: 'medium' },
          { title: 'Strategy Presentation', deadline: '2024-12-20', urgency: 'high' }
        ];
      
      default:
        return null;
    }
  }

  async generateInsights(dashboardId: string): Promise<{
    insights: Array<{
      type: 'success' | 'warning' | 'info';
      title: string;
      description: string;
      action?: string;
    }>;
  }> {
    // AI-powered insights based on dashboard data
    return {
      insights: [
        {
          type: 'success',
          title: 'Productivity Up 15%',
          description: 'Your task completion rate has increased significantly this week',
          action: 'View detailed report'
        },
        {
          type: 'warning',
          title: 'Budget Alert',
          description: 'Department spending is at 85% with 2 months remaining',
          action: 'Review budget breakdown'
        },
        {
          type: 'info',
          title: 'Automation Opportunity',
          description: 'Report generation could save 6 hours/week if automated',
          action: 'Explore automation'
        }
      ]
    };
  }

  async exportDashboard(dashboardId: string, format: 'pdf' | 'excel' | 'csv'): Promise<{
    url: string;
    filename: string;
  }> {
    // Simulate export functionality
    return {
      url: `/api/dashboards/${dashboardId}/export/${format}`,
      filename: `dashboard-${new Date().toISOString().split('T')[0]}.${format}`
    };
  }

  async scheduleDashboardReport(
    dashboardId: string,
    schedule: {
      frequency: 'daily' | 'weekly' | 'monthly';
      recipients: string[];
      format: 'pdf' | 'excel';
      includeInsights: boolean;
    }
  ): Promise<{ scheduleId: string }> {
    // Schedule automated dashboard reports
    return {
      scheduleId: `schedule-${Date.now()}`
    };
  }
}