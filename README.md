# Freelance Marketplace - Job Bidding Service Platform

A full-stack freelance marketplace platform where clients can post jobs and hire freelancers, and freelancers can browse jobs and submit bids.

## 🎯 Project Overview

This platform provides a smooth interaction between job posters and freelancers with a scalable architecture, secure authentication, and clear role-based access control.

## 🧩 Tech Stack

### Frontend
- **React.js 19** - UI library
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router DOM** - Routing
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Validation

## 👤 User Roles

- **Client**: Post/manage jobs, review bids, hire freelancers
- **Freelancer**: Browse jobs, submit bids, track bid status
- **Admin**: Manage users, jobs, and platform health

## ✨ Features

### Authentication & Authorization
- User registration with role selection (Client/Freelancer)
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes based on user roles

### Client Features
- Post new jobs with budget, category, and deadline
- View and manage posted jobs
- Review bids on jobs
- Hire freelancers
- Close or complete jobs
- Message hired freelancers

### Freelancer Features
- Browse available jobs with search and filters
- Place bids on jobs with proposal message
- Track bid status (pending/accepted/rejected)
- View all submitted bids
- Message clients for hired jobs

### Admin Features
- Dashboard with platform statistics
- Manage users (view, block/unblock, delete)
- Manage jobs (view all, force close)
- Monitor platform activity

### Common Features
- Profile management
- Basic messaging system
- Responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freelance_marketplace
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start MongoDB (if running locally)

5. Start the server:
```bash
npm start
# or for development
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd Biiding-Website
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
.
├── backend/
│   ├── models/         # MongoDB models (User, Job, Bid, Message)
│   ├── routes/         # API routes (auth, jobs, bids, admin, messages)
│   ├── middleware/     # Auth middleware
│   ├── server.js       # Express server
│   └── package.json
│
└── Biiding-Website/
    ├── src/
    │   ├── components/ # Reusable components
    │   ├── pages/      # Page components
    │   ├── utils/      # Utilities (api, auth)
    │   └── App.jsx     # Main app
    └── package.json
```

## 📊 Database Models

### User
- name, email, password (hashed), role, bio, skills, status, timestamps

### Job
- clientId, title, category, description, budget, deadline, status, timestamps

### Bid
- jobId, freelancerId, amount, message, status, timestamps

### Message
- jobId, senderId, receiverId, message, timestamps

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation with Joi
- Protected API routes
- CORS configuration

## 🎨 UI Features

- Modern, responsive design with Tailwind CSS
- Role-based navigation
- Intuitive dashboard layouts
- Clean and professional interface
- Real-time-like messaging (polling)

## 📌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Jobs
- `GET /api/jobs` - List jobs (with filters)
- `POST /api/jobs` - Create job
- `GET /api/jobs/:id` - Get job details
- `GET /api/jobs/client/my-jobs` - Get client's jobs
- `GET /api/jobs/:id/bids` - Get bids for job
- `PUT /api/jobs/:id/status` - Update job status

### Bids
- `POST /api/bids` - Place bid
- `GET /api/bids/my-bids` - Get freelancer's bids
- `GET /api/bids/job/:jobId` - Get bids for job
- `PUT /api/bids/:id/hire` - Hire freelancer

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id/status` - Block/unblock user
- `GET /api/admin/jobs` - List all jobs
- `PUT /api/admin/jobs/:id/close` - Force close job

## 🚀 Future Enhancements

- Payment Integration
- Real-time Chat (Socket.io)
- Job Categories filtering & recommender
- Reviews & Ratings
- Mobile App (React Native)
- Notification System
- Dispute Resolution
- File uploads for job attachments
- Portfolio for freelancers

## 📝 Notes

- For production, change `JWT_SECRET` to a secure random string
- Use MongoDB Atlas for cloud database
- Deploy frontend to Vercel/Netlify
- Deploy backend to Render/Heroku
- Configure CORS for production domains

## 👨‍💻 Development

This project was built as a college project demonstrating full-stack development skills with modern web technologies.

## 📄 License

This project is for educational purposes.


