const { jsonResponse, validateRequest, authenticate } = require('../middleware/middleware');
const { generateId } = require('../utils/helpers');

// In-memory storage
const tasks = new Map();

// Task status enum
const TaskStatus = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  ARCHIVED: 'archived'
};

// Seed initial data
tasks.set('1', {
  id: '1',
  title: 'Setup API Infrastructure',
  description: 'Create the initial API infrastructure with no dependencies',
  status: TaskStatus.IN_PROGRESS,
  priority: 'high',
  assignedTo: '1',
  tags: ['backend', 'infrastructure'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Get all tasks
async function getAllTasks(req, res) {
  try {
    // Query parameters
    const { status, assignedTo, priority, tag, sort = 'createdAt', order = 'desc' } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Filter tasks
    let filteredTasks = Array.from(tasks.values());
    
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    if (assignedTo) {
      filteredTasks = filteredTasks.filter(task => task.assignedTo === assignedTo);
    }
    if (priority) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }
    if (tag) {
      filteredTasks = filteredTasks.filter(task => task.tags.includes(tag));
    }
    
    // Sort tasks
    filteredTasks.sort((a, b) => {
      const aValue = a[sort];
      const bValue = b[sort];
      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return order === 'desc' ? -comparison : comparison;
    });
    
    // Paginate
    const offset = (page - 1) * limit;
    const paginatedTasks = filteredTasks.slice(offset, offset + limit);
    
    jsonResponse(res, 200, {
      data: paginatedTasks,
      pagination: {
        page,
        limit,
        total: filteredTasks.length,
        pages: Math.ceil(filteredTasks.length / limit)
      }
    });
  } catch (error) {
    throw error;
  }
}

// Get task by ID
async function getTaskById(req, res) {
  try {
    const { id } = req.params;
    const task = tasks.get(id);
    
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    
    jsonResponse(res, 200, {
      data: task
    });
  } catch (error) {
    throw error;
  }
}

// Create task
async function createTask(req, res) {
  try {
    // Validate request
    const validation = validateRequest({
      body: {
        title: { required: true, type: 'string' },
        description: { required: false, type: 'string' }
      }
    });
    validation(req, res);
    
    const {
      title,
      description = '',
      status = TaskStatus.TODO,
      priority = 'medium',
      assignedTo = null,
      tags = []
    } = req.body;
    
    // Create new task
    const newTask = {
      id: generateId(),
      title,
      description,
      status,
      priority,
      assignedTo,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    tasks.set(newTask.id, newTask);
    
    jsonResponse(res, 201, {
      data: newTask,
      message: 'Task created successfully'
    });
  } catch (error) {
    throw error;
  }
}

// Update task
async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const task = tasks.get(id);
    
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    
    const { title, description, status, priority, assignedTo, tags } = req.body;
    
    // Update fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (tags !== undefined) task.tags = tags;
    task.updatedAt = new Date().toISOString();
    
    tasks.set(id, task);
    
    jsonResponse(res, 200, {
      data: task,
      message: 'Task updated successfully'
    });
  } catch (error) {
    throw error;
  }
}

// Update task status
async function updateTaskStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !Object.values(TaskStatus).includes(status)) {
      const error = new Error('Invalid status');
      error.statusCode = 400;
      throw error;
    }
    
    const task = tasks.get(id);
    
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    
    task.status = status;
    task.updatedAt = new Date().toISOString();
    
    tasks.set(id, task);
    
    jsonResponse(res, 200, {
      data: task,
      message: 'Task status updated successfully'
    });
  } catch (error) {
    throw error;
  }
}

// Delete task
async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    
    if (!tasks.has(id)) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    
    tasks.delete(id);
    
    jsonResponse(res, 200, {
      message: 'Task deleted successfully'
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
};