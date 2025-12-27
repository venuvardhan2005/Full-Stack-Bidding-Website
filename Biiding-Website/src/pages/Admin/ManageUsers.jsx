import { useState, useEffect } from 'react';
import api from '../../utils/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { status: newStatus });
      fetchUsers();
      alert(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
      alert('User deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
        Active
      </span>
    ) : (
      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
        Blocked
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const styles = {
      client: 'bg-blue-100 text-blue-800',
      freelancer: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[role]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Users</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {user.role !== 'admin' && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(user._id, user.status === 'active' ? 'blocked' : 'active')
                        }
                        className={`${
                          user.status === 'active'
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {user.status === 'active' ? 'Block' : 'Unblock'}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {user.role === 'admin' && (
                    <span className="text-gray-400">Protected</span>
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

export default ManageUsers;


