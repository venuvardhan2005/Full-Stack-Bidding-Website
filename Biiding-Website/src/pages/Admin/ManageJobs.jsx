import { useState, useEffect } from 'react';
import api from '../../utils/api';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/admin/jobs');
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to force close this job?')) {
      return;
    }

    try {
      await api.put(`/admin/jobs/${jobId}/close`);
      fetchJobs();
      alert('Job closed successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to close job');
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Jobs</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{job.clientId?.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{job.clientId?.email || ''}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${job.budget.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(job.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {job.status !== 'closed' && (
                    <button
                      onClick={() => handleCloseJob(job._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Force Close
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageJobs;


