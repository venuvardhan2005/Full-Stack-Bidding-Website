import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser, removeAuthToken } from '../../utils/auth';

const AdminLayout = ({ children }) => {
  const [user] = useState(getUser());
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Manage Users', icon: '👥' },
    { path: '/admin/jobs', label: 'Manage Jobs', icon: '💼' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-purple-600">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome, {user?.name}</p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors ${
                isActive(item.path)
                  ? 'bg-purple-50 text-purple-600 border-r-4 border-purple-600'
                  : ''
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="mr-3">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;


