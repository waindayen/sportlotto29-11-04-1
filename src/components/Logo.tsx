import React from 'react';
import { Trophy } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Trophy className="w-8 h-8 text-blue-600" />
      <span className="text-xl font-bold text-gray-900">BetSport</span>
    </div>
  );
}