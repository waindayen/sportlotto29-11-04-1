import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute() {
  const { currentUser, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si nous sommes à la racine du dashboard ou si le rôle ne correspond pas au chemin
  if (userData?.role) {
    const rolePath = userData.role.replace('user', '');
    const currentPath = location.pathname.split('/')[2]; // Obtient la partie du rôle dans l'URL

    if (location.pathname === '/dashboard' || (currentPath && currentPath !== rolePath)) {
      return <Navigate to={`/dashboard/${rolePath}`} replace />;
    }
  }

  return <Outlet />;
}