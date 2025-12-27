import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUser, removeAuthToken } from '../../utils/auth';

const DashboardLayout = ({ children }) => {
  const [user, setUserState] = useState(getUser());
  const navigate = useNavigate();
  const location = useLocation();

  // Update user state when it changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setUserState(getUser());
    };
    window.addEventListener('storage', handleStorageChange);
    // Also check on mount and location change
    setUserState(getUser());
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location]);

  const handleLogout = () => {
    removeAuthToken();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/dashboard', label: 'Overview', icon: '📊' },
    {
      path: user?.role === 'client' ? '/dashboard/my-jobs' : '/dashboard/browse-jobs',
      label: user?.role === 'client' ? 'My Jobs' : 'Browse Jobs',
      icon: '💼',
    },
    {
      path: user?.role === 'freelancer' ? '/dashboard/my-bids' : '/dashboard/post-job',
      label: user?.role === 'freelancer' ? 'My Bids' : 'Post Job',
      icon: user?.role === 'freelancer' ? '📝' : '➕',
    },
    { path: '/dashboard/messages', label: 'Messages', icon: '💬' },
    { path: '/dashboard/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">FreelanceHub</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome, {user?.name}</p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            // Only show menu items that are relevant to the user's role
            if (item.path === '/dashboard/post-job' && user?.role !== 'client') {
              return null;
            }
            if (item.path === '/dashboard/my-jobs' && user?.role !== 'client') {
              return null;
            }
            if (item.path === '/dashboard/browse-jobs' && user?.role !== 'freelancer') {
              return null;
            }
            if (item.path === '/dashboard/my-bids' && user?.role !== 'freelancer') {
              return null;
            }
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  isActive(item.path) ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
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

export default DashboardLayout;

