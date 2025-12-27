import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';
import AdminLayout from './components/Layout/AdminLayout';
import { isAuthenticated, getUser, isAdmin } from './utils/auth';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Pages
import Overview from './pages/Dashboard/Overview';
import PostJob from './pages/Dashboard/PostJob';
import MyJobs from './pages/Dashboard/MyJobs';
import JobDetails from './pages/Dashboard/JobDetails';
import BrowseJobs from './pages/Dashboard/BrowseJobs';
import PlaceBid from './pages/Dashboard/PlaceBid';
import MyBids from './pages/Dashboard/MyBids';
import Messages from './pages/Dashboard/Messages';
import Profile from './pages/Dashboard/Profile';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageJobs from './pages/Admin/ManageJobs';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Overview />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/post-job"
          element={
            <ProtectedRoute requiredRole="client">
              <DashboardLayout>
                <PostJob />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/my-jobs"
          element={
            <ProtectedRoute requiredRole="client">
              <DashboardLayout>
                <MyJobs />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/jobs/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <JobDetails />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/browse-jobs"
          element={
            <ProtectedRoute requiredRole="freelancer">
              <DashboardLayout>
                <BrowseJobs />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/place-bid/:id"
          element={
            <ProtectedRoute requiredRole="freelancer">
              <DashboardLayout>
                <PlaceBid />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/my-bids"
          element={
            <ProtectedRoute requiredRole="freelancer">
              <DashboardLayout>
                <MyBids />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/messages"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Messages />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <ManageUsers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <ManageJobs />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
