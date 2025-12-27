import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      setError('');
      const response = await api.get('/bids/my-bids');
      setBids(response.data.bids);
    } catch (error) {
      console.error('Error fetching bids:', error);
      setError('Failed to load bids. Please try again.');
    } finally {
      setLoading(false);
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

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bids</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {bids.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">You haven't placed any bids yet.</p>
          <Link
            to="/dashboard/browse-jobs"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Browse available jobs →
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
                  Bid Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bids.map((bid) => (
                <tr key={bid._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {bid.jobId?.title || 'Job Deleted'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {bid.jobId?.category || ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-blue-600">
                      ${bid.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(bid.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(bid.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {bid.jobId ? (
                      <Link
                        to={`/dashboard/jobs/${bid.jobId._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Job
                      </Link>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
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

export default MyBids;

