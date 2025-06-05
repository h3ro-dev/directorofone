# DirectorOfOne API

A zero-dependency REST API server built with pure Node.js. No external packages required!

## Features

- ✅ **Zero Dependencies** - Uses only Node.js built-in modules
- ✅ **RESTful API** - Full CRUD operations for users and tasks
- ✅ **In-Memory Storage** - Fast data access (replace with database in production)
- ✅ **Rate Limiting** - Built-in request throttling
- ✅ **CORS Support** - Cross-origin requests enabled
- ✅ **Health Monitoring** - Health check endpoints with system metrics
- ✅ **Request Logging** - JSON-formatted request logs
- ✅ **Error Handling** - Centralized error management
- ✅ **Validation** - Request validation middleware
- ✅ **Pagination** - Built-in pagination support
- ✅ **Filtering & Sorting** - Query parameter support

## Quick Start

```bash
# Navigate to backend directory
cd backend

# Start the server
npm start

# Or run in development mode
npm run dev

# Or run in production mode
npm run prod
```

The API will start on `http://localhost:3000`

## API Endpoints

### Health Check

```bash
GET /health
GET /api/v1/health
GET /api/v1/status  # Detailed system status
```

### Users

```bash
GET    /api/v1/users          # Get all users (paginated)
GET    /api/v1/users/:id      # Get user by ID
POST   /api/v1/users          # Create new user
PUT    /api/v1/users/:id      # Update user
DELETE /api/v1/users/:id      # Delete user
```

#### Create User Example:
```json
POST /api/v1/users
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "user"
}
```

### Tasks

```bash
GET    /api/v1/tasks          # Get all tasks (paginated, filterable)
GET    /api/v1/tasks/:id      # Get task by ID
POST   /api/v1/tasks          # Create new task
PUT    /api/v1/tasks/:id      # Update task
DELETE /api/v1/tasks/:id      # Delete task
PATCH  /api/v1/tasks/:id/status # Update task status only
```

#### Create Task Example:
```json
POST /api/v1/tasks
{
  "title": "Complete API documentation",
  "description": "Write comprehensive docs for the API",
  "priority": "high",
  "assignedTo": "1",
  "tags": ["documentation", "api"]
}
```

#### Task Filtering:
```bash
GET /api/v1/tasks?status=todo&priority=high&assignedTo=1&tag=api
GET /api/v1/tasks?sort=createdAt&order=desc&page=1&limit=10
```

## Configuration

Edit `src/config/config.js` to customize:

- Server port and host
- API prefix
- Rate limiting settings
- Logging configuration
- Response timeout

## Environment Variables

```bash
PORT=3000                    # Server port
HOST=0.0.0.0                # Server host
NODE_ENV=development         # Environment (development/production)
LOG_LEVEL=info              # Logging level
```

## Directory Structure

```
backend/
├── src/
│   ├── server.js           # Main server file
│   ├── config/
│   │   └── config.js       # Configuration
│   ├── middleware/
│   │   └── middleware.js   # All middleware functions
│   ├── routes/
│   │   ├── router.js       # Main router
│   │   ├── health.routes.js
│   │   ├── user.routes.js
│   │   └── task.routes.js
│   └── utils/
│       └── helpers.js      # Utility functions
├── package.json
└── README.md
```

## Response Format

### Success Response:
```json
{
  "data": {
    "id": "1",
    "username": "admin"
  },
  "message": "Operation successful"
}
```

### Error Response:
```json
{
  "error": {
    "message": "Resource not found",
    "statusCode": 404,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Paginated Response:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

## Authentication

Currently using a simple token-based auth. In production, replace with JWT or OAuth.

Use the `Authorization` header:
```bash
Authorization: Bearer valid-token
```

## Rate Limiting

Default: 100 requests per 15 minutes per IP address.

## Development

The API uses no external dependencies, making it:
- Fast to start
- Easy to deploy
- Simple to understand
- Portable across environments

## Production Considerations

1. Replace in-memory storage with a database
2. Implement proper authentication (JWT/OAuth)
3. Add request validation and sanitization
4. Set up proper logging (file/service)
5. Configure HTTPS/TLS
6. Add monitoring and metrics
7. Implement caching layer
8. Set up load balancing

## Testing

```bash
# Health check
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/api/v1/users

# Create a task
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Task description"}'
```

## License

MIT