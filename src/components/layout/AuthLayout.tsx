import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthLayout() {
  const { currentUser } = useAuth();

  // Rediriger vers le dashboard si déjà connecté
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <Outlet />
      </div>
    </div>
  );
}