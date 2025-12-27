# Freelance Marketplace Frontend

Modern React frontend for the Freelance Marketplace platform built with Vite, React, and Tailwind CSS.

## Features

- 🎨 Modern UI with Tailwind CSS
- 🔐 Authentication (Login/Register)
- 👥 Role-based Dashboards (Client, Freelancer, Admin)
- 💼 Job Posting and Browsing
- 💰 Bid Management
- 💬 Messaging System
- 📱 Responsive Design

## Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React Hooks

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Navigate to the frontend directory:
```bash
cd Biiding-Website
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

If not provided, it defaults to `http://localhost:5000/api`

4. Start the development server:
```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another port if 5173 is occupied)

## Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout/         # Layout components (DashboardLayout, AdminLayout)
│   └── ProtectedRoute.jsx
├── pages/              # Page components
│   ├── Dashboard/      # Client & Freelancer pages
│   ├── Admin/          # Admin panel pages
│   ├── Login.jsx
│   └── Register.jsx
├── utils/              # Utility functions
│   ├── api.js         # Axios configuration
│   └── auth.js        # Authentication helpers
├── App.jsx             # Main app component with routing
└── main.jsx           # Entry point
```

## User Roles

### Client
- Post jobs
- View and manage posted jobs
- Review and accept bids
- Hire freelancers
- Send messages to hired freelancers

### Freelancer
- Browse available jobs
- Place bids on jobs
- View bid status
- Send messages to clients

### Admin
- View platform statistics
- Manage users (block/unblock, delete)
- Manage jobs (force close)
- Monitor platform activity

## Available Routes

### Public
- `/login` - Login page
- `/register` - Registration page

### Client Dashboard
- `/dashboard` - Overview
- `/dashboard/post-job` - Post a new job
- `/dashboard/my-jobs` - View posted jobs
- `/dashboard/jobs/:id` - Job details with bids
- `/dashboard/messages` - Messages
- `/dashboard/profile` - Profile settings

### Freelancer Dashboard
- `/dashboard` - Overview
- `/dashboard/browse-jobs` - Browse available jobs
- `/dashboard/jobs/:id` - View job and place bid
- `/dashboard/my-bids` - View submitted bids
- `/dashboard/messages` - Messages
- `/dashboard/profile` - Profile settings

### Admin Panel
- `/admin/dashboard` - Admin overview
- `/admin/users` - Manage users
- `/admin/jobs` - Manage jobs

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Features in Detail

### Authentication
- JWT token stored in localStorage
- Automatic token injection in API requests
- Protected routes based on authentication status
- Role-based route protection

### Job Management
- Client can create, view, update, and delete jobs
- Jobs have statuses: open, hired, completed, closed
- Search and filter functionality for freelancers

### Bid System
- Freelancers can place bids on open jobs
- Bid statuses: pending, accepted, rejected
- When a bid is accepted, all other bids are automatically rejected

### Messaging
- Real-time-like messaging (polling every 3 seconds)
- Messages are job-specific
- Only clients and hired freelancers can message

## Development

The app uses:
- **Vite** for fast HMR (Hot Module Replacement)
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls with interceptors

## Troubleshooting

1. **CORS errors**: Make sure the backend CORS is configured to allow requests from your frontend URL
2. **401 Unauthorized**: Check if the token is stored in localStorage and valid
3. **API connection errors**: Verify the backend server is running and `VITE_API_URL` is correct
