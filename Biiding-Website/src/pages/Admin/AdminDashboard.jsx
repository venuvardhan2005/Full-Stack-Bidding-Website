import { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalFreelancers: 0,
    totalJobs: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
      setRecentUsers(response.data.recentUsers);
      setRecentJobs(response.data.recentJobs);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalUsers}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Clients</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalClients}</p>
            </div>
            <div className="text-4xl">💼</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Freelancers</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalFreelancers}</p>
            </div>
            <div className="text-4xl">👨‍💻</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalJobs}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Users</h2>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    user.role === 'client'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Jobs</h2>
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium text-gray-800">{job.title}</p>
                  <p className="text-sm text-gray-600">
                    By {job.clientId?.name || 'Unknown'}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    job.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


