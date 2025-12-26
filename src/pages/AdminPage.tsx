import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Calendar, Users, Mail, FolderOpen, Settings, MapPin, Award, Mountain, UserPlus, Shield, FileSignature, Heart, Bike, Newspaper, CalendarDays } from 'lucide-react';
import ManagePages from '../components/admin/ManagePages';
import ManageEvents from '../components/admin/ManageEvents';
import ManageRideCalendar from '../components/admin/ManageRideCalendar';
import ManageRegistrations from '../components/admin/ManageRegistrations';
import ManageContacts from '../components/admin/ManageContacts';
import ManageDocuments from '../components/admin/ManageDocuments';
import ManageSettings from '../components/admin/ManageSettings';
import ManageRoute from '../components/admin/ManageRoute';
import ManageSponsors from '../components/admin/ManageSponsors';
import ManageBlueberryMountain from '../components/admin/ManageBlueberryMountain';
import ManageMPFBC from '../components/admin/ManageMPFBC';
import ManageRegistrationInstructions from '../components/admin/ManageRegistrationInstructions';
import ManagePrivacyPolicy from '../components/admin/ManagePrivacyPolicy';
import ManageWaivers from '../components/admin/ManageWaivers';
import ManageVisionValourRide from '../components/admin/ManageVisionValourRide';
import ManagePressArticles from '../components/admin/ManagePressArticles';

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('pages');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const savedTab = localStorage.getItem('adminActiveTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    localStorage.setItem('adminActiveTab', tabId);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You must be logged in to access the admin panel.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-red-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'route', label: 'Route & Itinerary', icon: MapPin },
    { id: 'blueberry', label: 'Blueberry Mountain', icon: Mountain },
    { id: 'mpfbc', label: 'MPFBC Page', icon: Heart },
    { id: 'vision-valour-ride', label: 'Vision & Valour Ride', icon: Bike },
    { id: 'sponsors', label: 'Sponsors', icon: Award },
    { id: 'events', label: 'Calendar Events', icon: Calendar },
    { id: 'ride-calendar', label: '13-Day Ride Calendar', icon: CalendarDays },
    { id: 'registrations', label: 'Registrations', icon: Users },
    { id: 'waivers', label: 'Waiver Submissions', icon: FileSignature },
    { id: 'reg-instructions', label: 'Registration Instructions', icon: UserPlus },
    { id: 'contacts', label: 'Contact Messages', icon: Mail },
    { id: 'press', label: 'Press Articles', icon: Newspaper },
    { id: 'documents', label: 'Documents', icon: FolderOpen },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex">
      <aside className={`${
        sidebarOpen ? 'w-72' : 'w-20'
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
        <div className="bg-gradient-to-r from-red-900 to-red-800 text-white p-6">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 flex-shrink-0" />
            {sidebarOpen && (
              <div>
                <h2 className="text-xl font-bold">Admin</h2>
                <p className="text-xs text-red-100">Dashboard</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mt-4 w-full bg-red-800 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold transition-all"
          >
            {sidebarOpen ? '← Collapse' : '→'}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-red-900 text-white border-l-4 border-red-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={!sidebarOpen ? tab.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm">{tab.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-8 px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {tabs.find(t => t.id === activeTab)?.label || 'Admin Dashboard'}
              </h1>
              <p className="text-red-100 mt-1">Manage your website content</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-red-800 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
            >
              View Site
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {activeTab === 'pages' && <ManagePages />}
            {activeTab === 'route' && <ManageRoute />}
            {activeTab === 'blueberry' && <ManageBlueberryMountain />}
            {activeTab === 'mpfbc' && <ManageMPFBC onSave={() => setActiveTab('pages')} />}
            {activeTab === 'vision-valour-ride' && <ManageVisionValourRide />}
            {activeTab === 'sponsors' && <ManageSponsors />}
            {activeTab === 'events' && <ManageEvents />}
            {activeTab === 'ride-calendar' && <ManageRideCalendar />}
            {activeTab === 'registrations' && <ManageRegistrations />}
            {activeTab === 'waivers' && <ManageWaivers />}
            {activeTab === 'reg-instructions' && <ManageRegistrationInstructions />}
            {activeTab === 'contacts' && <ManageContacts />}
            {activeTab === 'press' && <ManagePressArticles />}
            {activeTab === 'documents' && <ManageDocuments />}
            {activeTab === 'privacy' && <ManagePrivacyPolicy />}
            {activeTab === 'settings' && <ManageSettings />}
          </div>
        </div>
      </main>
    </div>
  );
}
