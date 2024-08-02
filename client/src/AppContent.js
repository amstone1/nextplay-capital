import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useGlobalState } from './context/GlobalState';
import ErrorBoundary from './components/ErrorBoundary';
import NavBar from './components/NavBar';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const Athletes = lazy(() => import('./pages/Athletes'));
const AthleteDetail = lazy(() => import('./pages/AthleteDetail'));
const Contracts = lazy(() => import('./pages/Contracts'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/registration/Register'));
const Invest = lazy(() => import('./pages/Invest'));
const UTRPlayerSearch = lazy(() => import('./pages/UTRPlayerSearch'));
const TennisAnalytics = lazy(() => import('./pages/TennisAnalytics')); // Add this line

function AppContent({ toggleTheme }) {
  const { token, user } = useGlobalState();

  const ProtectedRoute = ({ children, allowedUserType }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    if (allowedUserType && (!user || user.userType !== allowedUserType)) {
      return <Navigate to="/profile" replace />;
    }
    return children;
  };

  return (
    <>
      <NavBar toggleTheme={toggleTheme} />
      <main>
        <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={token ? <Navigate to="/profile" replace /> : <Login />} />
              <Route path="/register" element={token ? <Navigate to="/profile" replace /> : <Register />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/athletes" element={<ProtectedRoute allowedUserType="investor"><Athletes /></ProtectedRoute>} />
              <Route path="/athletes/:id" element={<ProtectedRoute allowedUserType="investor"><AthleteDetail /></ProtectedRoute>} />
              <Route path="/contracts" element={<ProtectedRoute><Contracts /></ProtectedRoute>} />
              <Route path="/invest/:id" element={<ProtectedRoute allowedUserType="investor"><Invest /></ProtectedRoute>} />
              <Route path="/utr-search" element={<UTRPlayerSearch />} />
              <Route path="/tennis-analytics" element={<TennisAnalytics />} /> {/* Add this line */}
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </>
  );
}

export default AppContent;