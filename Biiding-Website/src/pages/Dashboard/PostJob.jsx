import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
    deadline: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    'Web Development',
    'Mobile Development',
    'Design',
    'Writing',
    'Marketing',
    'Data Entry',
    'Other',
  ];

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
      // Validate budget
      if (!formData.budget || parseFloat(formData.budget) <= 0) {
        setError('Budget must be greater than 0');
        setLoading(false);
        return;
      }

      // Validate deadline if provided
      if (formData.deadline) {
        const deadlineDate = new Date(formData.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (deadlineDate < today) {
          setError('Deadline cannot be in the past');
          setLoading(false);
          return;
        }
      }

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        budget: parseFloat(formData.budget),
        deadline: formData.deadline || null,
      };

      const response = await api.post('/jobs', payload);

      



      if (response.data) {
        // Success - navigate to my jobs
        navigate('/dashboard/my-jobs');
      }
    } catch (err) {
      console.error('Post job error:', err);
      const errorMessage = err.response?.data?.message ||
        err.message ||
        'Failed to post job. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Post a New Job</h1>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Need a React Developer"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the job requirements in detail..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget ($) *
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="500"
              />
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                Deadline (optional)
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/my-jobs')}
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

export default PostJob;

