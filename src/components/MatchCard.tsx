import React from 'react';
import { Clock } from 'lucide-react';

interface MatchCardProps {
  homeTeam: string;
  awayTeam: string;
  date: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  league: string;
}

export default function MatchCard({ homeTeam, awayTeam, date, odds, league }: MatchCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-600">{league}</span>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 mr-1" />
          <span>{date}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-center flex-1">
          <h3 className="font-semibold">{homeTeam}</h3>
        </div>
        <div className="text-center text-gray-500 px-4">VS</div>
        <div className="text-center flex-1">
          <h3 className="font-semibold">{awayTeam}</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <button className="bg-gray-50 hover:bg-gray-100 rounded-lg p-2 text-center transition-colors">
          <div className="text-sm font-medium">1</div>
          <div className="text-lg font-bold text-blue-600">{odds.home}</div>
        </button>
        <button className="bg-gray-50 hover:bg-gray-100 rounded-lg p-2 text-center transition-colors">
          <div className="text-sm font-medium">X</div>
          <div className="text-lg font-bold text-blue-600">{odds.draw}</div>
        </button>
        <button className="bg-gray-50 hover:bg-gray-100 rounded-lg p-2 text-center transition-colors">
          <div className="text-sm font-medium">2</div>
          <div className="text-lg font-bold text-blue-600">{odds.away}</div>
        </button>
      </div>
    </div>
  );
}