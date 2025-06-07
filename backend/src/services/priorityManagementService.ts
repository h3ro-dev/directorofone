import { 
  PriorityMatrix, 
  PriorityTask, 
  PrioritySuggestion 
} from '../models/automation';

export class PriorityManagementService {
  // Eisenhower Matrix quadrants
  private readonly QUADRANTS = {
    'do-first': { name: 'Do First', description: 'Urgent & Important - Crisis management' },
    'schedule': { name: 'Schedule', description: 'Not Urgent & Important - Strategic planning' },
    'delegate': { name: 'Delegate', description: 'Urgent & Not Important - Interruptions' },
    'eliminate': { name: 'Eliminate', description: 'Not Urgent & Not Important - Time wasters' }
  };

  async createPriorityMatrix(userId: string, tasks: Partial<PriorityTask>[]): Promise<PriorityMatrix> {
    const prioritizedTasks = await this.prioritizeTasks(tasks);
    const suggestions = await this.generateAISuggestions(prioritizedTasks);

    return {
      userId,
      tasks: prioritizedTasks,
      lastUpdated: new Date(),
      aiSuggestions: suggestions
    };
  }

  private async prioritizeTasks(tasks: Partial<PriorityTask>[]): Promise<PriorityTask[]> {
    return tasks.map((task, index) => {
      const urgency = task.urgency || this.calculateUrgency(task);
      const importance = task.importance || this.calculateImportance(task);
      const quadrant = this.determineQuadrant(urgency, importance);
      
      return {
        id: task.id || `task-${Date.now()}-${index}`,
        title: task.title || 'Untitled Task',
        description: task.description,
        urgency,
        importance,
        quadrant,
        estimatedHours: task.estimatedHours || 1,
        deadline: task.deadline,
        completed: task.completed || false,
        automatable: this.isTaskAutomatable(task)
      };
    });
  }

  private calculateUrgency(task: Partial<PriorityTask>): 1 | 2 | 3 | 4 | 5 {
    // Calculate urgency based on deadline
    if (!task.deadline) return 3;
    
    const daysUntilDeadline = Math.ceil(
      (new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilDeadline < 0) return 5; // Overdue
    if (daysUntilDeadline <= 1) return 5;
    if (daysUntilDeadline <= 3) return 4;
    if (daysUntilDeadline <= 7) return 3;
    if (daysUntilDeadline <= 14) return 2;
    return 1;
  }

  private calculateImportance(task: Partial<PriorityTask>): 1 | 2 | 3 | 4 | 5 {
    // Simple heuristic based on keywords and estimated hours
    const title = (task.title || '').toLowerCase();
    const description = (task.description || '').toLowerCase();
    const combined = `${title} ${description}`;

    let score = 3; // Default middle importance

    // Keywords that increase importance
    const highImportanceKeywords = [
      'strategic', 'revenue', 'customer', 'deadline', 'critical',
      'board', 'executive', 'compliance', 'legal', 'budget'
    ];
    
    const lowImportanceKeywords = [
      'routine', 'optional', 'nice to have', 'cleanup', 'organize'
    ];

    highImportanceKeywords.forEach(keyword => {
      if (combined.includes(keyword)) score = Math.min(5, score + 1);
    });

    lowImportanceKeywords.forEach(keyword => {
      if (combined.includes(keyword)) score = Math.max(1, score - 1);
    });

    // Long tasks are usually more important
    if (task.estimatedHours && task.estimatedHours > 4) {
      score = Math.min(5, score + 1);
    }

    return score as 1 | 2 | 3 | 4 | 5;
  }

  private determineQuadrant(
    urgency: number, 
    importance: number
  ): 'do-first' | 'schedule' | 'delegate' | 'eliminate' {
    const isUrgent = urgency >= 4;
    const isImportant = importance >= 4;

    if (isUrgent && isImportant) return 'do-first';
    if (!isUrgent && isImportant) return 'schedule';
    if (isUrgent && !isImportant) return 'delegate';
    return 'eliminate';
  }

  private isTaskAutomatable(task: Partial<PriorityTask>): boolean {
    const title = (task.title || '').toLowerCase();
    const description = (task.description || '').toLowerCase();
    const combined = `${title} ${description}`;

    const automatableKeywords = [
      'report', 'email', 'schedule', 'reminder', 'update',
      'data entry', 'follow up', 'notify', 'send', 'generate'
    ];

    return automatableKeywords.some(keyword => combined.includes(keyword));
  }

  private async generateAISuggestions(tasks: PriorityTask[]): Promise<PrioritySuggestion[]> {
    const suggestions: PrioritySuggestion[] = [];

    // Suggest automation for repetitive tasks
    const automatableTasks = tasks.filter(t => t.automatable && !t.completed);
    automatableTasks.forEach(task => {
      suggestions.push({
        taskId: task.id,
        suggestion: `Automate "${task.title}" to save ${task.estimatedHours} hours`,
        reasoning: 'This task appears to be repetitive and suitable for automation',
        confidence: 0.85,
        potentialTimeSaved: task.estimatedHours * 0.8
      });
    });

    // Suggest delegation for urgent but not important tasks
    const delegateTasks = tasks.filter(t => t.quadrant === 'delegate' && !t.completed);
    delegateTasks.forEach(task => {
      suggestions.push({
        taskId: task.id,
        suggestion: `Consider delegating "${task.title}" or using a service`,
        reasoning: 'This task is urgent but not strategically important to your role',
        confidence: 0.75,
        potentialTimeSaved: task.estimatedHours * 0.9
      });
    });

    // Suggest elimination for time wasters
    const eliminateTasks = tasks.filter(t => t.quadrant === 'eliminate' && !t.completed);
    eliminateTasks.forEach(task => {
      suggestions.push({
        taskId: task.id,
        suggestion: `Consider eliminating "${task.title}" from your workflow`,
        reasoning: 'This task provides low value relative to time investment',
        confidence: 0.7,
        potentialTimeSaved: task.estimatedHours
      });
    });

    // Suggest batching similar tasks
    const emailTasks = tasks.filter(t => 
      t.title.toLowerCase().includes('email') && !t.completed
    );
    if (emailTasks.length > 2) {
      suggestions.push({
        taskId: emailTasks[0].id,
        suggestion: 'Batch process all email tasks in dedicated time blocks',
        reasoning: 'Processing similar tasks together is more efficient',
        confidence: 0.9,
        potentialTimeSaved: emailTasks.reduce((sum, t) => sum + t.estimatedHours, 0) * 0.3
      });
    }

    return suggestions;
  }

  async getOptimalSchedule(matrix: PriorityMatrix): Promise<{
    morning: PriorityTask[];
    afternoon: PriorityTask[];
    evening: PriorityTask[];
  }> {
    const incompleteTasks = matrix.tasks.filter(t => !t.completed);
    
    // Do First tasks in the morning when energy is highest
    const doFirst = incompleteTasks.filter(t => t.quadrant === 'do-first');
    
    // Strategic tasks in focused afternoon blocks
    const schedule = incompleteTasks.filter(t => t.quadrant === 'schedule');
    
    // Delegatable tasks in between or end of day
    const delegate = incompleteTasks.filter(t => t.quadrant === 'delegate');

    return {
      morning: doFirst.slice(0, 3), // Max 3 critical tasks
      afternoon: schedule.slice(0, 2), // Max 2 strategic tasks
      evening: delegate.slice(0, 2) // Max 2 delegatable tasks
    };
  }

  calculateDailyCapacity(tasks: PriorityTask[]): {
    totalHours: number;
    doFirstHours: number;
    scheduleHours: number;
    delegateHours: number;
    eliminateHours: number;
    utilizationScore: number;
  } {
    const byQuadrant = {
      'do-first': 0,
      'schedule': 0,
      'delegate': 0,
      'eliminate': 0
    };

    tasks.forEach(task => {
      if (!task.completed) {
        byQuadrant[task.quadrant] += task.estimatedHours;
      }
    });

    const totalHours = Object.values(byQuadrant).reduce((sum, hours) => sum + hours, 0);
    
    // Calculate utilization score (0-100)
    // Ideal distribution: 25% do-first, 50% schedule, 20% delegate, 5% eliminate
    const idealDistribution = {
      'do-first': 0.25,
      'schedule': 0.50,
      'delegate': 0.20,
      'eliminate': 0.05
    };

    let utilizationScore = 100;
    if (totalHours > 0) {
      Object.entries(byQuadrant).forEach(([quadrant, hours]) => {
        const actual = hours / totalHours;
        const ideal = idealDistribution[quadrant as keyof typeof idealDistribution];
        const deviation = Math.abs(actual - ideal);
        utilizationScore -= deviation * 50; // Penalty for deviation
      });
    }

    return {
      totalHours,
      doFirstHours: byQuadrant['do-first'],
      scheduleHours: byQuadrant['schedule'],
      delegateHours: byQuadrant['delegate'],
      eliminateHours: byQuadrant['eliminate'],
      utilizationScore: Math.max(0, Math.round(utilizationScore))
    };
  }
}