import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MatchCard from '../MatchCard';

const matches = [
  {
    homeTeam: "PSG",
    awayTeam: "Marseille",
    date: "20:45",
    odds: { home: 1.45, draw: 4.50, away: 6.75 },
    league: "Ligue 1"
  },
  {
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    date: "21:00",
    odds: { home: 2.10, draw: 3.40, away: 3.20 },
    league: "La Liga"
  },
  {
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    date: "18:30",
    odds: { home: 1.95, draw: 3.60, away: 3.80 },
    league: "Premier League"
  }
];

export default function LiveMatchesSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Matchs en Direct</h2>
        <Link
          to="/matches"
          className="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          Voir tout
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match, index) => (
          <MatchCard key={index} {...match} />
        ))}
      </div>
    </div>
  );
}