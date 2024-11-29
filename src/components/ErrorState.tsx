import React from 'react';
import { AlertCircle, RefreshCw, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
  message: string;
  code?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, code, onRetry }: ErrorStateProps) {
  const renderAction = () => {
    if (code === 'SPORT_DISABLED') {
      return (
        <Link
          to="/dashboard/api/odds-config"
          className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Settings className="w-5 h-5" />
          Gérer les championnats
        </Link>
      );
    }

    if (onRetry) {
      return (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-5 h-5" />
          Réessayer
        </button>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <p className="text-gray-600 text-center mb-4">{message}</p>
      {renderAction()}
    </div>
  );
}