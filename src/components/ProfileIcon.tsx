import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileIcon() {
  const { currentUser } = useAuth();
  const initials = currentUser?.email 
    ? currentUser.email.substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
      <span className="text-sm font-medium text-white">{initials}</span>
    </div>
  );
}