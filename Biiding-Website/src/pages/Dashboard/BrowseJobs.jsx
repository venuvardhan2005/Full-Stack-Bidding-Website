import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setError('');
      setLoading(true);
      const params = new URLSearchParams();
      params.append('status', 'open'); // Only show open jobs for freelancers
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);

      const response = await api.get(`/jobs?${params.toString()}`);
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Web Development',
    'Mobile Development',
    'Design',
    'Writing',
    'Marketing',
    'Data Entry',
    'Other',
  ];

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Browse Jobs</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Jobs
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by title or description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {jobs.length === 0 && !loading ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-600">No open jobs found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.filter(job => job.status === 'open').map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {job.category}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {job.description.substring(0, 150)}...
              </p>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-2xl font-bold text-blue-600">${job.budget.toFixed(2)}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>

              {job.status === 'open' ? (
                <Link
                  to={`/dashboard/jobs/${job._id}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Details & Bid
                </Link>
              ) : (
                <div className="block w-full text-center bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed">
                  Job {job.status}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseJobs;

