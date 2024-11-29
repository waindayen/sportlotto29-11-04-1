import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface BaseDashboardProps {
  title: string;
  children?: React.ReactNode;
}

export default function BaseDashboard({ title, children }: BaseDashboardProps) {
  const { userData } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          {userData?.role}
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}