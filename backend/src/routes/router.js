const config = require('../config/config');
const { jsonResponse } = require('../middleware/middleware');
const { authenticate, authRateLimit } = require('../middleware/auth');

// Import route handlers
const healthRoutes = require('./health.routes');
const userRoutes = require('./user.routes');
const taskRoutes = require('./task.routes');
const authRoutes = require('./auth');

// Route registry
const routes = new Map();

// Route class
class Route {
  constructor(method, path, handler, middleware = []) {
    this.method = method;
    this.path = path;
    this.handler = handler;
    this.middleware = middleware;
    this.regex = this.pathToRegex(path);
  }

  pathToRegex(path) {
    // Convert path parameters to regex
    const pattern = path
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, '(?<$1>[^/]+)')
      .replace(/\*/g, '.*');
    return new RegExp(`^${pattern}$`);
  }

  match(pathname) {
    const match = pathname.match(this.regex);
    if (!match) return null;
    return match.groups || {};
  }
}

// Router class
class Router {
  constructor() {
    this.routes = [];
  }

  // Add route methods
  get(path, ...handlers) {
    this.addRoute('GET', path, handlers);
  }

  post(path, ...handlers) {
    this.addRoute('POST', path, handlers);
  }

  put(path, ...handlers) {
    this.addRoute('PUT', path, handlers);
  }

  delete(path, ...handlers) {
    this.addRoute('DELETE', path, handlers);
  }

  patch(path, ...handlers) {
    this.addRoute('PATCH', path, handlers);
  }

  // Add route to registry
  addRoute(method, path, handlers) {
    const middleware = handlers.slice(0, -1);
    const handler = handlers[handlers.length - 1];
    const route = new Route(method, path, handler, middleware);
    this.routes.push(route);
  }

  // Handle incoming request
  async handle(req, res) {
    const method = req.method;
    const pathname = req.pathname;

    // Find matching route
    for (const route of this.routes) {
      if (route.method !== method) continue;
      
      const params = route.match(pathname);
      if (params) {
        req.params = params;
        
        try {
          // Execute middleware
          for (const middleware of route.middleware) {
            await middleware(req, res);
          }
          
          // Execute handler
          await route.handler(req, res);
          return;
        } catch (error) {
          throw error;
        }
      }
    }

    // No route found
    jsonResponse(res, 404, {
      error: {
        message: 'Route not found',
        path: pathname,
        method: method
      }
    });
  }

  // Use sub-router
  use(prefix, subRouter) {
    for (const route of subRouter.routes) {
      const newPath = prefix + route.path;
      const newRoute = new Route(route.method, newPath, route.handler, route.middleware);
      this.routes.push(newRoute);
    }
  }
}

// Create main router
const mainRouter = new Router();

// Health check routes
mainRouter.get('/health', healthRoutes.healthCheck);
mainRouter.get('/api/v1/health', healthRoutes.healthCheck);
mainRouter.get('/api/v1/status', healthRoutes.detailedStatus);

// API routes
const apiRouter = new Router();

// Authentication routes (public)
apiRouter.post('/auth/register', authRateLimit, authRoutes.register);
apiRouter.post('/auth/login', authRateLimit, authRoutes.login);
apiRouter.post('/auth/refresh', authRoutes.refreshAccessToken);
apiRouter.post('/auth/forgot-password', authRateLimit, authRoutes.forgotPassword);
apiRouter.post('/auth/reset-password', authRoutes.resetPassword);
apiRouter.get('/auth/verify-email', authRoutes.verifyEmail);

// Authentication routes (protected)
apiRouter.post('/auth/logout', authenticate, authRoutes.logout);
apiRouter.get('/auth/me', authenticate, authRoutes.getCurrentUser);
apiRouter.put('/auth/me', authenticate, authRoutes.updateCurrentUser);
apiRouter.post('/auth/change-password', authenticate, authRoutes.changePassword);

// User routes
apiRouter.get('/users', userRoutes.getAllUsers);
apiRouter.get('/users/:id', userRoutes.getUserById);
apiRouter.post('/users', userRoutes.createUser);
apiRouter.put('/users/:id', userRoutes.updateUser);
apiRouter.delete('/users/:id', userRoutes.deleteUser);

// Task routes
apiRouter.get('/tasks', taskRoutes.getAllTasks);
apiRouter.get('/tasks/:id', taskRoutes.getTaskById);
apiRouter.post('/tasks', taskRoutes.createTask);
apiRouter.put('/tasks/:id', taskRoutes.updateTask);
apiRouter.delete('/tasks/:id', taskRoutes.deleteTask);
apiRouter.patch('/tasks/:id/status', taskRoutes.updateTaskStatus);

// Mount API routes
mainRouter.use(config.apiPrefix, apiRouter);

// Welcome route
mainRouter.get('/', (req, res) => {
  jsonResponse(res, 200, {
    message: 'Welcome to DirectorOfOne API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: config.apiPrefix,
      documentation: '/api/v1/docs',
      auth: {
        register: `${config.apiPrefix}/auth/register`,
        login: `${config.apiPrefix}/auth/login`,
        refresh: `${config.apiPrefix}/auth/refresh`,
        forgotPassword: `${config.apiPrefix}/auth/forgot-password`,
        resetPassword: `${config.apiPrefix}/auth/reset-password`,
        verifyEmail: `${config.apiPrefix}/auth/verify-email`
      }
    }
  });
});

module.exports = mainRouter;