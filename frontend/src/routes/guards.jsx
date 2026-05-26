import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ROUTES } from './routes.constants';

// ─────────────────────────────────────────────────────────────────────────────
// Full-screen loading spinner shown while auth state is hydrating from storage
// ─────────────────────────────────────────────────────────────────────────────
const AuthLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-900">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
      <p className="text-slate-400 text-sm tracking-wide">Loading ClinicDesk…</p>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// ProtectedRoute
// Redirects unauthenticated users to /login, preserving the attempted URL.
// ─────────────────────────────────────────────────────────────────────────────
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <AuthLoader />;

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}   // so LoginPage can redirect back after login
        replace
      />
    );
  }

  return children;
};

// ─────────────────────────────────────────────────────────────────────────────
// RoleGuard
// Wraps a route that requires one (or more) specific roles.
// Authenticated users with the wrong role are sent to /unauthorized.
// ─────────────────────────────────────────────────────────────────────────────
export const RoleGuard = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, hasRole } = useAuthStore();
  const location = useLocation();

  if (isLoading) return <AuthLoader />;

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !hasRole(...allowedRoles)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return children;
};

// ─────────────────────────────────────────────────────────────────────────────
// GuestRoute
// Auth pages (Login, Register…). Redirects already-logged-in users away.
// ─────────────────────────────────────────────────────────────────────────────
export const GuestRoute = ({ children }) => {
  const { isAuthenticated, isLoading, getHome } = useAuthStore();

  if (isLoading) return <AuthLoader />;

  if (isAuthenticated) {
    return <Navigate to={getHome()} replace />;
  }

  return children;
};
