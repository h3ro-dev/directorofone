import { Router, Request, Response } from 'express';
import { WorkflowAuditService } from '../services/workflowAuditService';
import { AutomationTemplateService } from '../services/automationTemplateService';
import { PriorityManagementService } from '../services/priorityManagementService';
import { DashboardService } from '../services/dashboardService';

const router = Router();

// Initialize services
const workflowAuditService = new WorkflowAuditService();
const automationTemplateService = new AutomationTemplateService();
const priorityService = new PriorityManagementService();
const dashboardService = new DashboardService();

// Workflow Audit Routes
router.post('/audit/start', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const audit = await workflowAuditService.createAudit(userId || 'demo-user');
    res.json({ success: true, audit });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to start audit' });
  }
});

router.get('/audit/:auditId/results', async (req: Request, res: Response) => {
  try {
    const { auditId } = req.params;
    // In real implementation, fetch from database
    const results = await workflowAuditService.analyzeWorkflow('demo-user');
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get audit results' });
  }
});

// Automation Template Routes
router.get('/templates', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const templates = await automationTemplateService.getTemplates(category as any);
    res.json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get templates' });
  }
});

router.get('/templates/:templateId', async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;
    const template = await automationTemplateService.getTemplateById(templateId);
    
    if (!template) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }
    
    const roi = automationTemplateService.calculateROI(template);
    res.json({ success: true, template, roi });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get template' });
  }
});

router.get('/templates/recommended/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const templates = await automationTemplateService.getRecommendedTemplates({ userId });
    res.json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get recommendations' });
  }
});

// Priority Management Routes
router.post('/priority/matrix', async (req: Request, res: Response) => {
  try {
    const { userId, tasks } = req.body;
    const matrix = await priorityService.createPriorityMatrix(userId || 'demo-user', tasks || []);
    res.json({ success: true, matrix });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create priority matrix' });
  }
});

router.post('/priority/schedule', async (req: Request, res: Response) => {
  try {
    const { matrix } = req.body;
    const schedule = await priorityService.getOptimalSchedule(matrix);
    res.json({ success: true, schedule });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate schedule' });
  }
});

router.post('/priority/capacity', async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;
    const capacity = priorityService.calculateDailyCapacity(tasks);
    res.json({ success: true, capacity });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to calculate capacity' });
  }
});

// Dashboard Routes
router.post('/dashboards', async (req: Request, res: Response) => {
  try {
    const { userId, template } = req.body;
    const dashboard = await dashboardService.createDashboard(
      userId || 'demo-user', 
      template || 'executive'
    );
    res.json({ success: true, dashboard });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create dashboard' });
  }
});

router.put('/dashboards/:dashboardId/widgets/:widgetId', async (req: Request, res: Response) => {
  try {
    const { dashboardId, widgetId } = req.params;
    const updates = req.body;
    const widget = await dashboardService.updateWidget(dashboardId, widgetId, updates);
    res.json({ success: true, widget });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update widget' });
  }
});

router.get('/dashboards/:dashboardId/widgets/:widgetId/data', async (req: Request, res: Response) => {
  try {
    const { widgetId } = req.params;
    // In real implementation, fetch widget config from database
    const mockWidget = {
      id: widgetId,
      type: 'metric' as const,
      title: 'Sample Widget',
      dataSource: req.query.dataSource as string || 'tasks.completed.weekly',
      position: { x: 0, y: 0, width: 3, height: 2 },
      config: {}
    };
    
    const data = await dashboardService.getWidgetData(mockWidget);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to get widget data' });
  }
});

router.get('/dashboards/:dashboardId/insights', async (req: Request, res: Response) => {
  try {
    const { dashboardId } = req.params;
    const insights = await dashboardService.generateInsights(dashboardId);
    res.json({ success: true, ...insights });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate insights' });
  }
});

router.post('/dashboards/:dashboardId/export', async (req: Request, res: Response) => {
  try {
    const { dashboardId } = req.params;
    const { format } = req.body;
    const exportData = await dashboardService.exportDashboard(dashboardId, format || 'pdf');
    res.json({ success: true, ...exportData });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to export dashboard' });
  }
});

router.post('/dashboards/:dashboardId/schedule', async (req: Request, res: Response) => {
  try {
    const { dashboardId } = req.params;
    const schedule = req.body;
    const result = await dashboardService.scheduleDashboardReport(dashboardId, schedule);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to schedule report' });
  }
});

export default router;