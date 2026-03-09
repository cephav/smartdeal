import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SmartDeal
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</Link>
              <Link to="/search" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Search</Link>
              <Link to="/browse" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Browse All</Link>
              {token && (
                <>
                  <Link to="/add-deal" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Add Deal</Link>
                  <Link to="/alerts" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Alerts</Link>
                  <Link to="/notifications" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Notifications</Link>
                  <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Dashboard</Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {token ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
