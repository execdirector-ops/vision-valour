import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import EventPage from './pages/EventPage';
import CalendarPage from './pages/CalendarPage';
import RegisterPage from './pages/RegisterPage';
import ContactPage from './pages/ContactPage';
import DocumentsPage from './pages/DocumentsPage';
import RoutePage from './pages/RoutePage';
import BlueberryMountainPage from './pages/BlueberryMountainPage';
import BigJimPage from './pages/BigJimPage';
import HeartOfTheRidePage from './pages/HeartOfTheRidePage';
import MPFBCPage from './pages/MPFBCPage';
import VisionValourRidePage from './pages/VisionValourRidePage';
import SponsorsPage from './pages/SponsorsPage';
import BoardsPage from './pages/BoardsPage';
import PhotosPage from './pages/PhotosPage';
import VideosPage from './pages/VideosPage';
import PressPage from './pages/PressPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminPage from './pages/AdminPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import WaiverPage from './pages/WaiverPage';
import SwagShopPage from './pages/SwagShopPage';
import FundraisingPage from './pages/FundraisingPage';

function Layout() {
  const location = useLocation();
  const hideNavAndFooter = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {!hideNavAndFooter && <Navigation />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/route" element={<RoutePage />} />
          <Route path="/blueberry-mountain" element={<BlueberryMountainPage />} />
          <Route path="/big-jim" element={<BigJimPage />} />
          <Route path="/heart-of-the-ride" element={<HeartOfTheRidePage />} />
          <Route path="/mpfbc" element={<MPFBCPage />} />
          <Route path="/vision-valour-ride" element={<VisionValourRidePage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/fundraising" element={<FundraisingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/waiver" element={<WaiverPage />} />
          <Route path="/swag-shop" element={<SwagShopPage />} />
        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;
