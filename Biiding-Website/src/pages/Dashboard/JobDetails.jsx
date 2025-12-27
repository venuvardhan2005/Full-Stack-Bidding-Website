import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { isClient, isFreelancer, getUser } from '../../utils/auth';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [bidForm, setBidForm] = useState({
    amount: '',
    message: '',
  });
  const [placingBid, setPlacingBid] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (isClient()) {
      fetchBids();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (isFreelancer() && job) {
      setBidForm((prev) => ({
        ...prev,
        amount: job.budget,
      }));
    }
  }, [job]);

  const fetchJobDetails = async () => {
    try {
      setError('');
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
      setError(error.response?.data?.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await api.get(`/jobs/${id}/bids`);
      setBids(response.data.bids || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const handleHire = async (bidId) => {
    if (!window.confirm('Are you sure you want to hire this freelancer?')) {
      return;
    }

    try {
      await api.put(`/bids/${bidId}/hire`);
      alert('Freelancer hired successfully!');
      fetchBids();
      fetchJobDetails();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to hire freelancer');
    }
  };

  const handleCloseJob = async () => {
    if (!window.confirm('Are you sure you want to close this job?')) {
      return;
    }

    try {
      await api.put(`/jobs/${id}/status`, { status: 'closed' });
      alert('Job closed successfully');
      navigate('/dashboard/my-jobs');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to close job');
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setPlacingBid(true);

    try {
      await api.post('/bids', {
        jobId: id,
        amount: parseFloat(bidForm.amount),
        message: bidForm.message,
      });
      alert('Bid placed successfully!');
      navigate('/dashboard/my-bids');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place bid');
    } finally {
      setPlacingBid(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
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

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
          {error}
        </div>
        <button
          onClick={() => navigate(isClient() ? '/dashboard/my-jobs' : '/dashboard/browse-jobs')}
          className="text-blue-600 hover:text-blue-700"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Job not found</p>
        <button
          onClick={() => navigate(isClient() ? '/dashboard/my-jobs' : '/dashboard/browse-jobs')}
          className="text-blue-600 hover:text-blue-700"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate(isClient() ? '/dashboard/my-jobs' : '/dashboard/browse-jobs')}
        className="text-blue-600 hover:text-blue-700 mb-4"
      >
        ← Back to {isClient() ? 'My Jobs' : 'Browse Jobs'}
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
            <p className="text-gray-600">{job.category}</p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              job.status === 'open'
                ? 'bg-green-100 text-green-800'
                : job.status === 'hired'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">Budget</p>
            <p className="text-xl font-bold text-gray-800">${job.budget.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Created</p>
            <p className="text-xl font-bold text-gray-800">
              {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
          {job.deadline && (
            <div>
              <p className="text-sm text-gray-600">Deadline</p>
              <p className="text-xl font-bold text-gray-800">
                {new Date(job.deadline).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
        </div>

        {isClient() && job.status === 'open' && (
          <button
            onClick={handleCloseJob}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Close Job
          </button>
        )}
      </div>

        {isClient() && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Bids ({bids.length})
            </h2>

            {bids.length === 0 ? (
              <p className="text-gray-600">No bids yet for this job.</p>
            ) : (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div
                    key={bid._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {bid.freelancerId?.name || 'Unknown'}
                        </h3>
                        <p className="text-sm text-gray-600">{bid.freelancerId?.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          ${bid.amount.toFixed(2)}
                        </p>
                        {getStatusBadge(bid.status)}
                      </div>
                    </div>

                    {bid.freelancerId?.skills && bid.freelancerId.skills.length > 0 && (
                      <div className="mb-2">
                        <div className="flex flex-wrap gap-2">
                          {bid.freelancerId.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="text-gray-700 mb-3">{bid.message}</p>

                    {job.status === 'open' && bid.status === 'pending' && (
                      <button
                        onClick={() => handleHire(bid._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Hire Freelancer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isFreelancer() && job.status === 'open' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Place Your Bid</h2>
            <form onSubmit={handlePlaceBid} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bid Amount ($)
                </label>
                <input
                  type="number"
                  value={bidForm.amount}
                  onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proposal Message
                </label>
                <textarea
                  value={bidForm.message}
                  onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Write your proposal..."
                />
              </div>
              <button
                type="submit"
                disabled={placingBid}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {placingBid ? 'Placing Bid...' : 'Submit Bid'}
              </button>
            </form>
          </div>
        )}
    </div>
  );
};

export default JobDetails;

