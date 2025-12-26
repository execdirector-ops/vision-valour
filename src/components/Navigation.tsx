import { Menu, X, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname.substring(1) || 'home';

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    {
      id: 'about',
      label: 'About',
      children: [
        { id: 'about', label: 'About Us', path: '/about' },
        { id: 'big-jim', label: 'Big Jim', path: '/big-jim' },
        { id: 'heart-of-the-ride', label: 'Heart of the Ride', path: '/heart-of-the-ride' },
        { id: 'blueberry-mountain', label: 'Blueberry Mountain', path: '/blueberry-mountain' },
        { id: 'mpfbc', label: 'MPFBC', path: '/mpfbc' },
        { id: 'vision-valour-ride', label: 'Vision & Valour Ride', path: '/vision-valour-ride' },
      ]
    },
    {
      id: 'event',
      label: 'Event',
      children: [
        { id: 'calendar', label: 'Calendar', path: '/calendar' },
        { id: 'route', label: 'Routes', path: '/route' },
        { id: 'register', label: 'Register', path: '/register' },
        { id: 'fundraising', label: 'Fundraising', path: '/fundraising' },
        { id: 'waiver', label: 'Waiver Form', path: '/waiver' },
        { id: 'swag-shop', label: 'Swag Shop', path: '/swag-shop' },
        { id: 'sponsors', label: 'Sponsors', path: '/sponsors' },
        { id: 'documents', label: 'Documents', path: '/documents' },
      ]
    },
    {
      id: 'media',
      label: 'Media',
      children: [
        { id: 'press', label: 'Press', path: '/press' },
        { id: 'photos', label: 'Photos', path: '/photos' },
      ]
    },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-gradient-to-r from-red-900 to-red-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-4">
            <img
              src="/Vision & Valour Logo.png"
              alt="Vision & Valour"
              className="h-16 w-16 object-contain"
            />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold">Ride for Vision & Valour</h1>
              <p className="text-sm text-red-200">Ride with Heart, Inspire Valour</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              item.children ? (
                <div key={item.id} className="relative group">
                  <button
                    className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 ${
                      item.children.some(child => child.id === currentPage)
                        ? 'bg-white text-red-900 font-semibold'
                        : 'hover:bg-red-800 text-red-50'
                    }`}
                  >
                    {item.label}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {item.children.map((child) => (
                      <Link
                        key={child.id}
                        to={child.path}
                        className={`block w-full text-left px-4 py-3 hover:bg-gray-100 transition-all first:rounded-t-lg last:rounded-b-lg ${
                          currentPage === child.id
                            ? 'bg-red-50 text-red-900 font-semibold'
                            : 'text-gray-700'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    currentPage === item.id
                      ? 'bg-white text-red-900 font-semibold'
                      : 'hover:bg-red-800 text-red-50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
            {user && (
              <>
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    currentPage === 'admin'
                      ? 'bg-white text-red-900 font-semibold'
                      : 'hover:bg-red-800 text-red-50'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
                <button
                  onClick={handleSignOut}
                  className="ml-2 px-4 py-2 rounded-lg transition-all hover:bg-red-800 text-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            )}
            {!user && (
              <Link
                to="/login"
                className="ml-2 px-4 py-2 rounded-lg transition-all bg-white text-red-900 font-semibold hover:bg-red-50"
              >
                Admin Login
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-red-800"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-red-800 border-t border-red-700">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              item.children ? (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (item.id === 'about') {
                        setIsAboutOpen(!isAboutOpen);
                        setIsEventOpen(false);
                        setIsMediaOpen(false);
                      } else if (item.id === 'event') {
                        setIsEventOpen(!isEventOpen);
                        setIsAboutOpen(false);
                        setIsMediaOpen(false);
                      } else if (item.id === 'media') {
                        setIsMediaOpen(!isMediaOpen);
                        setIsAboutOpen(false);
                        setIsEventOpen(false);
                      }
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
                      item.children.some(child => child.id === currentPage)
                        ? 'bg-white text-red-900 font-semibold'
                        : 'hover:bg-red-700 text-red-50'
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      (item.id === 'about' && isAboutOpen) || (item.id === 'event' && isEventOpen) || (item.id === 'media' && isMediaOpen) ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {((item.id === 'about' && isAboutOpen) || (item.id === 'event' && isEventOpen) || (item.id === 'media' && isMediaOpen)) && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          to={child.path}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsAboutOpen(false);
                            setIsEventOpen(false);
                            setIsMediaOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 rounded-lg transition-all ${
                            currentPage === child.id
                              ? 'bg-white text-red-900 font-semibold'
                              : 'bg-red-700 hover:bg-red-600 text-red-50'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-all ${
                    currentPage === item.id
                      ? 'bg-white text-red-900 font-semibold'
                      : 'hover:bg-red-700 text-red-50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
            {user && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-2 ${
                    currentPage === 'admin'
                      ? 'bg-white text-red-900 font-semibold'
                      : 'hover:bg-red-700 text-red-50'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 rounded-lg transition-all hover:bg-red-700 text-red-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            )}
            {!user && (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-4 py-3 rounded-lg transition-all bg-white text-red-900 font-semibold"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
