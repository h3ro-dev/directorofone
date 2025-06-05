const { jsonResponse, validateRequest, authenticate, rateLimit } = require('../middleware/middleware');
const { generateId } = require('../utils/helpers');

// In-memory storage (replace with database in production)
const users = new Map();

// Seed initial data
users.set('1', {
  id: '1',
  username: 'admin',
  email: 'admin@directorofone.com',
  role: 'admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Get all users
async function getAllUsers(req, res) {
  try {
    // Apply rate limiting
    rateLimit(req, res);
    
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Convert to array and paginate
    const allUsers = Array.from(users.values());
    const paginatedUsers = allUsers.slice(offset, offset + limit);
    
    jsonResponse(res, 200, {
      data: paginatedUsers.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      })),
      pagination: {
        page,
        limit,
        total: allUsers.length,
        pages: Math.ceil(allUsers.length / limit)
      }
    });
  } catch (error) {
    throw error;
  }
}

// Get user by ID
async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const user = users.get(id);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    jsonResponse(res, 200, {
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    throw error;
  }
}

// Create user
async function createUser(req, res) {
  try {
    // Validate request
    const validation = validateRequest({
      body: {
        username: { required: true, type: 'string' },
        email: { required: true, type: 'string' },
        password: { required: true, type: 'string' }
      }
    });
    validation(req, res);
    
    const { username, email, password, role = 'user' } = req.body;
    
    // Check if username or email already exists
    const existingUser = Array.from(users.values()).find(
      u => u.username === username || u.email === email
    );
    
    if (existingUser) {
      const error = new Error('Username or email already exists');
      error.statusCode = 409;
      throw error;
    }
    
    // Create new user
    const newUser = {
      id: generateId(),
      username,
      email,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.set(newUser.id, newUser);
    
    jsonResponse(res, 201, {
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      },
      message: 'User created successfully'
    });
  } catch (error) {
    throw error;
  }
}

// Update user
async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const user = users.get(id);
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    const { username, email, role } = req.body;
    
    // Update fields if provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    user.updatedAt = new Date().toISOString();
    
    users.set(id, user);
    
    jsonResponse(res, 200, {
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      message: 'User updated successfully'
    });
  } catch (error) {
    throw error;
  }
}

// Delete user
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    
    if (!users.has(id)) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    users.delete(id);
    
    jsonResponse(res, 200, {
      message: 'User deleted successfully'
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};