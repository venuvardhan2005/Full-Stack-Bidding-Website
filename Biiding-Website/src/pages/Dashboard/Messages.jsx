import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { getUser } from '../../utils/auth';

const Messages = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (selectedJob) {
      fetchMessages(selectedJob._id);
      const interval = setInterval(() => {
        fetchMessages(selectedJob._id);
      }, 3000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedJob]);

  const fetchJobs = async () => {
    try {
      setError('');
      if (user?.role === 'client') {
        const response = await api.get('/jobs/client/my-jobs');
        const hiredJobs = response.data.jobs.filter((j) => j.status === 'hired');
        setJobs(hiredJobs);
        if (hiredJobs.length > 0) {
          setSelectedJob(hiredJobs[0]);
        }
      } else if (user?.role === 'freelancer') {
        const bidsResponse = await api.get('/bids/my-bids');
        const acceptedBids = bidsResponse.data.bids.filter((b) => b.status === 'accepted' && b.jobId);
        const jobIds = acceptedBids.map((b) => b.jobId?._id || b.jobId);
        if (jobIds.length > 0) {
          const jobPromises = jobIds.map((id) => api.get(`/jobs/${id}`));
          const jobResponses = await Promise.all(jobPromises);
          const jobsList = jobResponses.map((r) => r.data.job);
          setJobs(jobsList);
          if (jobsList.length > 0) {
            setSelectedJob(jobsList[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (jobId) => {
    try {
      const response = await api.get(`/messages/job/${jobId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedJob) return;

    try {
      let receiverId;
      
      if (user.role === 'client') {
        // Get the accepted bid's freelancer
        const bidsResponse = await api.get(`/bids/job/${selectedJob._id}`);
        const acceptedBid = bidsResponse.data.bids.find((b) => b.status === 'accepted');
        if (!acceptedBid) {
          alert('No hired freelancer found for this job');
          return;
        }
        receiverId = acceptedBid.freelancerId._id;
      } else {
        receiverId = selectedJob.clientId?._id || selectedJob.clientId;
      }

      await api.post('/messages', {
        jobId: selectedJob._id,
        receiverId,
        message: newMessage,
      });

      setNewMessage('');
      fetchMessages(selectedJob._id);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send message');
    }
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
          onClick={fetchJobs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          {user?.role === 'client'
            ? "You don't have any hired jobs yet. Messages will appear here once you hire a freelancer."
            : "You don't have any accepted bids yet. Messages will appear here once a client hires you."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)]">
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-800">Conversations</h2>
        </div>
        {jobs.map((job) => (
          <button
            key={job._id}
            onClick={() => setSelectedJob(job)}
            className={`w-full p-4 text-left border-b hover:bg-gray-50 ${
              selectedJob?._id === job._id ? 'bg-blue-50' : ''
            }`}
          >
            <p className="font-medium text-gray-800">{job.title}</p>
            <p className="text-sm text-gray-600">
              {user?.role === 'client'
                ? 'With Freelancer'
                : `Client: ${job.clientId?.name || 'Unknown'}`}
            </p>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        {selectedJob ? (
          <>
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-800">{selectedJob.title}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                    const isOwnMessage = 
                      msg.senderId?._id === user?.id || 
                      msg.senderId?._id === user?._id ||
                      String(msg.senderId?._id) === String(user?.id);
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">{msg.senderId.name}</p>
                      <p>{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;

