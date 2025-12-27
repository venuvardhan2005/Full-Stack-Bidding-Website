import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { getUser, isClient, isFreelancer } from '../../utils/auth';

const Overview = () => {
  const [stats, setStats] = useState({
    myJobs: 0,
    myBids: 0,
    activeJobs: 0,
    pendingBids: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setError('');
      if (isClient()) {
        const jobsRes = await api.get('/jobs/client/my-jobs');
        const jobs = jobsRes.data.jobs;
        setStats({
          myJobs: jobs.length,
          activeJobs: jobs.filter((j) => j.status === 'open').length,
          myBids: 0,
          pendingBids: 0,
        });
      } else if (isFreelancer()) {
        const bidsRes = await api.get('/bids/my-bids');
        const bids = bidsRes.data.bids;
        setStats({
          myBids: bids.length,
          pendingBids: bids.filter((b) => b.status === 'pending').length,
          myJobs: 0,
          activeJobs: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard statistics. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isClient() && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">My Jobs</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.myJobs}</p>
                </div>
                <div className="text-4xl">💼</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.activeJobs}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>
          </>
        )}

        {isFreelancer() && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">My Bids</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.myBids}</p>
                </div>
                <div className="text-4xl">📝</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Pending Bids</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pendingBids}</p>
                </div>
                <div className="text-4xl">⏳</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isClient() && (
            <Link
              to="/dashboard/post-job"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <span className="text-2xl mb-2 block">➕</span>
              <p className="font-medium text-gray-800">Post a New Job</p>
            </Link>
          )}

          {isFreelancer() && (
            <Link
              to="/dashboard/browse-jobs"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
            >
              <span className="text-2xl mb-2 block">🔍</span>
              <p className="font-medium text-gray-800">Browse Jobs</p>
            </Link>
          )}

          <Link
            to="/dashboard/profile"
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
          >
            <span className="text-2xl mb-2 block">👤</span>
            <p className="font-medium text-gray-800">Update Profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Overview;

