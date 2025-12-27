import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setError('');
      const response = await api.get('/jobs/client/my-jobs');
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-green-100 text-green-800',
      hired: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      closed: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Jobs</h1>
        <Link
          to="/dashboard/post-job"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Post New Job
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">You haven't posted any jobs yet.</p>
          <Link
            to="/dashboard/post-job"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Post your first job →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    <div className="text-sm text-gray-500">{job.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${job.budget.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(job.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/dashboard/jobs/${job._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyJobs;

