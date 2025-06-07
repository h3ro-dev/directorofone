# Authentication & User Management Implementation

## Overview

A comprehensive authentication and user management system has been implemented for the Director of One application. The system includes secure user registration, login, session management, password reset functionality, and email verification.

## Architecture

### Backend (Node.js)
- **Database**: SQLite with proper schema for users, sessions, refresh tokens, and audit logs
- **Authentication**: JWT-based with access and refresh tokens
- **Security**: bcrypt for password hashing, rate limiting, account lockout mechanism
- **Middleware**: Authentication and authorization middleware for route protection

### Frontend (Next.js)
- **State Management**: React Context API for global auth state
- **API Client**: Centralized authentication API client with automatic token refresh
- **Protected Routes**: HOC for route protection
- **UI Components**: Login, registration, and dashboard pages

## Backend Implementation

### 1. Database Schema

#### Users Table
```sql
- id (UUID)
- email (unique)
- username (unique)
- password_hash
- first_name, last_name
- role (default: 'user')
- is_active, is_verified
- verification_token
- reset_token, reset_token_expires
- failed_login_attempts, locked_until
- last_login_at
- created_at, updated_at
```

#### Sessions Table
```sql
- id (UUID)
- user_id (foreign key)
- token (unique)
- ip_address, user_agent
- expires_at
- created_at
```

#### Refresh Tokens Table
```sql
- id (UUID)
- user_id (foreign key)
- token (unique)
- expires_at
- created_at
```

#### Audit Logs Table
```sql
- id (UUID)
- user_id (foreign key)
- action
- entity_type, entity_id
- old_values, new_values
- ip_address, user_agent
- created_at
```

### 2. API Endpoints

#### Public Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password with token
- `GET /api/v1/auth/verify-email` - Verify email address

#### Protected Endpoints
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/me` - Update current user
- `POST /api/v1/auth/change-password` - Change password

### 3. Security Features

- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

- **Account Security**:
  - Account lockout after 5 failed login attempts
  - 15-minute lockout period
  - Rate limiting on authentication endpoints
  - Secure password hashing with bcrypt (10 rounds)

- **Token Management**:
  - JWT access tokens (7-day expiry)
  - Refresh tokens (30-day expiry)
  - Automatic token cleanup for expired tokens

### 4. User Model Methods

- `User.create()` - Create new user
- `User.findById()` - Find user by ID
- `User.findByEmail()` - Find user by email
- `User.findByUsername()` - Find user by username
- `user.verifyPassword()` - Verify password
- `user.updatePassword()` - Update password
- `user.incrementFailedAttempts()` - Handle failed login
- `user.resetFailedAttempts()` - Reset on successful login
- `user.generateResetToken()` - Generate password reset token
- `user.verifyEmail()` - Mark email as verified

## Frontend Implementation

### 1. Authentication Context

The `AuthContext` provides:
- Global user state management
- Login/logout functionality
- User registration
- Error handling
- Automatic token management

### 2. API Client

The authentication API client includes:
- All authentication endpoints
- Automatic token storage/retrieval
- Response error handling
- Token refresh interceptor

### 3. Protected Routes

The `withAuth` HOC provides:
- Route protection
- Automatic redirection to login
- Loading states
- Email verification checking

### 4. UI Components

#### Login Page (`/login`)
- Email/username and password input
- Remember me functionality
- Link to registration
- Link to password reset
- Error display

#### Registration Page (`/register`)
- Full registration form
- Real-time password validation
- Error display
- Automatic login after registration

#### Dashboard Page (`/dashboard`)
- User information display
- Email verification status
- Logout functionality
- Links to profile and settings

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3001
HOST=localhost

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Database Configuration
DATABASE_PATH=./data/database.sqlite

# Security
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_TIME=900000
```

## Usage

### Starting the Services

1. **Backend**:
```bash
cd backend
npm install
npm start
```

2. **Frontend**:
```bash
cd frontend
npm install
npm run dev
```

### Testing Authentication

1. Navigate to `http://localhost:3000/register`
2. Create a new account
3. You'll be redirected to the dashboard
4. Test logout and login functionality

## Security Considerations

1. **Production Requirements**:
   - Use HTTPS in production
   - Set strong JWT secret
   - Configure CORS properly
   - Implement email verification service
   - Add CSRF protection
   - Implement proper session management

2. **Additional Security Measures**:
   - Two-factor authentication (prepared for future implementation)
   - IP-based restrictions
   - Device fingerprinting
   - Security headers (Helmet.js)

## Future Enhancements

1. **OAuth Integration**:
   - Google OAuth
   - GitHub OAuth
   - Microsoft OAuth

2. **Advanced Features**:
   - Two-factor authentication
   - Passwordless login
   - Biometric authentication
   - Social login

3. **User Management**:
   - Admin panel for user management
   - Role-based permissions
   - User activity tracking
   - Account suspension/deletion

## API Response Examples

### Successful Registration
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "isVerified": false
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

### Login Error
```json
{
  "error": "Invalid credentials"
}
```

### Validation Error
```json
{
  "error": "Password does not meet requirements",
  "details": [
    "Password must contain at least one uppercase letter",
    "Password must contain at least one special character"
  ]
}
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Ensure the data directory exists
   - Check file permissions

2. **Token Errors**:
   - Clear browser localStorage
   - Check token expiry

3. **CORS Issues**:
   - Verify frontend URL in backend config
   - Check CORS headers

## Conclusion

The authentication system provides a solid foundation for user management in the Director of One application. It includes all essential features for secure user authentication while maintaining flexibility for future enhancements.