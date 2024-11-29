import React from 'react';
import { Trophy } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-blue-600 p-2 rounded-lg">
        <Trophy className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-gray-900">BetSport</span>
        <span className="text-xs text-gray-500">Paris Sportifs</span>
      </div>
    </div>
  );
}