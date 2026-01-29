import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { createContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { Toaster } from './components/ui/sonner';
import Header from './components/Header';
import DatabaseIndicator from './components/DatabaseIndicator';

// Pages
import Landing from './components/pages/Landing';
import FlightSearch from './components/pages/FlightSearch';
import FlightDetails from './components/pages/FlightDetails';
import Booking from './components/pages/Booking';
import BookingConfirmation from './components/pages/BookingConfirmation';
import Dashboard from './components/pages/Dashboard';
import Alerts from './components/pages/Alerts';
import FlightStatus from './components/pages/FlightStatus';
import Profile from './components/pages/Profile';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import Chat from './components/pages/Chat';
import Support from './components/pages/Support';
import DatabaseAdmin from './components/pages/DatabaseAdmin';
import AdminLogin from './components/pages/AdminLogin';
import DatabaseSettings from './components/pages/DatabaseSettings';
import AdminSignup from './components/pages/AdminSignup';

// Supabase client
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// App Context
export const AppContext = createContext<{
  user: any;
  setUser: (user: any) => void;
  supabase: any;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
} | null>(null);

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session?.access_token) {
          setAccessToken(session.access_token);
          // Get user data from session
          const userData = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            role: session.user.user_metadata?.role || 'user',
          };
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }
    return user ? <>{children}</> : <Navigate to="/login" replace />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const MainContent = () => {
    const location = useLocation();
    const isLandingPage = location.pathname === '/';
    
    return (
      <main className={isLandingPage ? '' : 'pt-16'}>
        <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/flights/search" element={<FlightSearch />} />
              <Route path="/flights/details/:id" element={<FlightDetails />} />
              <Route path="/booking/:id" element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } />
              <Route path="/booking/confirmation/:bookingId" element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/alerts" element={
                <ProtectedRoute>
                  <Alerts />
                </ProtectedRoute>
              } />
              <Route path="/status" element={<FlightStatus />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/support" element={<Support />} />
              <Route path="/admin/database" element={
                <ProtectedRoute>
                  <DatabaseSettings />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute>
                  <DatabaseSettings />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    );
  };

  return (
    <AppContext.Provider value={{ user, setUser, supabase, accessToken, setAccessToken }}>
      <Router>
        <div className="min-h-screen bg-background">
          <Header />
          <MainContent />
          <Toaster />
          <DatabaseIndicator />
        </div>
      </Router>
    </AppContext.Provider>
  );
}