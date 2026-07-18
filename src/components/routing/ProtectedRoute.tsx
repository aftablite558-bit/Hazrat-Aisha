import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Spinner } from '../ui/spinner';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  requireVerified?: boolean;
}

export function ProtectedRoute({ allowedRoles, requireVerified = false }: ProtectedRouteProps) {
  const { user, loading, firebaseUser } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute: loading:", loading, "user:", user?.uid, "path:", location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Email verification required
  if (requireVerified && firebaseUser && !firebaseUser.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Role check
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
