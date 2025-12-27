# Freelance Marketplace Backend API

Backend REST API for the Freelance Marketplace platform built with Node.js, Express.js, and MongoDB.

## Features

- 🔐 JWT-based Authentication
- 👥 User Management (Client, Freelancer, Admin roles)
- 💼 Job Posting and Management
- 💰 Bid Management
- 💬 Messaging System
- 🛡️ Role-based Authorization
- ✅ Input Validation with Joi

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Joi

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freelance_marketplace
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# On Windows (if MongoDB is installed as a service, it should start automatically)
# Or use MongoDB Compass to start the service

# On Mac/Linux
mongod
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Client only)
- `GET /api/jobs/client/my-jobs` - Get client's jobs
- `GET /api/jobs/:id/bids` - Get bids for a job
- `PUT /api/jobs/:id/status` - Update job status
- `DELETE /api/jobs/:id` - Delete job

### Bids
- `POST /api/bids` - Place a bid (Freelancer only)
- `GET /api/bids/my-bids` - Get freelancer's bids
- `GET /api/bids/job/:jobId` - Get bids for a job
- `PUT /api/bids/:id/hire` - Hire freelancer (Client only)

### Messages
- `GET /api/messages/job/:jobId` - Get messages for a job
- `POST /api/messages` - Send a message

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Block/Unblock user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/jobs` - Get all jobs
- `PUT /api/admin/jobs/:id/close` - Force close job

## Database Models

### User
- name, email, password, role, bio, skills, status, createdAt

### Job
- clientId, title, category, description, budget, deadline, status, createdAt

### Bid
- jobId, freelancerId, amount, message, status, createdAt

### Message
- jobId, senderId, receiverId, message, createdAt

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation
- Protected routes middleware

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)


