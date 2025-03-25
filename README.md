# Users API

## Project Setup Guide

### Prerequisites
- Node.js (v20 or higher)
- Docker and Docker Compose
- npm or yarn package manager

### 1. Clone the Project
```bash
git clone <repository-url>
cd users-api
```

### 2. Environment Setup
1. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

2. Configure the following environment variables in `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=admin
DB_NAME=db_users
JWT_SECRET=your_jwt_secret_here
PORT=3000
```

### 3. Database Setup with Docker
1. Start the PostgreSQL database using Docker Compose:
```bash
docker-compose up -d
```

2. The database will be initialized with:
   - Database name: `db_users`
   - Username: `admin`
   - Password: `admin`
   - Port: `5432`

3. Initial admin user credentials:
   - Email: `admin@example.com`
   - Password: `password123`

### 4. Install Dependencies
```bash
npm install
```

### 5. Running the Application

#### Development Mode
```bash
npm run start:dev
```

#### Production Mode
```bash
npm run build
npm run start:prod
```

### 6. API Endpoints

#### Authentication
- POST `/api/v1/auth/register` - Register a new user
- POST `/api/v1/auth/login` - Login user
- POST `/api/v1/auth/logout` - Logout user

#### Users
- GET `/api/v1/users` - Get all users (requires admin role)
- PATCH `/api/v1/users/:id` - Update user (requires admin role)
- DELETE `/api/v1/users/:id` - Delete user (requires admin role)


### 7. Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### 8. Stopping the Application
```bash
# Stop the application
Ctrl + C

# Stop Docker containers
docker-compose down
```

## Project Structure
```
users-api/
├── src/
│   ├── modules/
│   │   ├── auth/         # Authentication module
│   │   └── user/         # User management module
│   ├── common/           # Shared components
│   ├── config/           # Configuration files
│   └── scripts/          # Database scripts
├── docker-compose.yml    # Docker configuration
└── package.json         # Project dependencies
```

## Security Notes
- The application uses JWT for authentication
- Passwords are hashed using bcrypt
- HTTP-only cookies are used for token storage
- Rate limiting is implemented for API endpoints

## Troubleshooting
1. If the database connection fails:
   - Check if Docker containers are running
   - Verify environment variables in `.env`
   - Ensure port 5432 is not in use

2. For authentication issues:
   - Verify JWT_SECRET in .env
   - Check if cookies are enabled in your browser
   - Ensure CORS settings are correct