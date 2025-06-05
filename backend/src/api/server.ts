import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Director of One API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Director of One API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      consultation: '/api/consultation',
      automation: '/api/automation',
      analytics: '/api/analytics',
    },
  });
});

// Consultation endpoint
app.post('/api/consultation', async (req: Request, res: Response) => {
  try {
    const { name, email, company, department, challenges } = req.body;
    
    // TODO: Implement consultation booking logic
    // For now, just return success
    res.json({
      success: true,
      message: 'Consultation request received',
      data: {
        name,
        email,
        company,
        department,
        challenges,
        bookingId: `DOO-${Date.now()}`,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing consultation request',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Automation workflow endpoint
app.get('/api/automation/workflows', async (req: Request, res: Response) => {
  // TODO: Implement workflow retrieval
  res.json({
    success: true,
    workflows: [
      {
        id: 'wf-001',
        name: 'Daily Status Report',
        description: 'Automated daily department status report',
        frequency: 'daily',
        enabled: true,
      },
      {
        id: 'wf-002',
        name: 'Task Prioritization',
        description: 'AI-powered task priority assignment',
        frequency: 'real-time',
        enabled: true,
      },
      {
        id: 'wf-003',
        name: 'Budget Alert',
        description: 'Automated budget threshold notifications',
        frequency: 'on-trigger',
        enabled: true,
      },
    ],
  });
});

// Analytics endpoint
app.get('/api/analytics/summary', async (req: Request, res: Response) => {
  // TODO: Implement real analytics
  res.json({
    success: true,
    summary: {
      timeSaved: {
        weekly: 12,
        monthly: 48,
        unit: 'hours',
      },
      tasksAutomated: 156,
      efficiencyGain: 68,
      activeWorkflows: 8,
    },
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Start server only if not in Vercel environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Director of One API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  });
}

// Export for Vercel
export default app; 