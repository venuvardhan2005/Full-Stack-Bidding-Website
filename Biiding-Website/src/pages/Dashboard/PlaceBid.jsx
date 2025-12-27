import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const PlaceBid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data.job);
      setFormData((prev) => ({
        ...prev,
        amount: response.data.job.budget,
      }));
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/bids', {
        jobId: id,
        amount: parseFloat(formData.amount),
        message: formData.message,
      });
      alert('Bid placed successfully!');
      navigate('/dashboard/my-bids');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!job) {
    return <div className="text-center py-12">Job not found</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate('/dashboard/browse-jobs')}
        className="text-blue-600 hover:text-blue-700 mb-4"
      >
        ← Back to Browse Jobs
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
        <p className="text-gray-600 mb-4">{job.category}</p>
        <p className="text-gray-700 mb-4">{job.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Budget</p>
            <p className="text-2xl font-bold text-blue-600">${job.budget.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Posted</p>
            <p className="text-lg text-gray-800">
              {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Place Your Bid</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Bid Amount ($) *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your bid amount"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Proposal Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write a detailed proposal explaining why you're the best fit for this job..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Placing Bid...' : 'Submit Bid'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/browse-jobs')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaceBid;


