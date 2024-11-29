import React from 'react';
import { Trophy, Target, Dumbbell, Table } from 'lucide-react';

const sports = [
  {
    icon: Trophy,
    name: "Football",
    count: 245,
    popular: ["Champions League", "Premier League", "La Liga"]
  },
  {
    icon: Target,
    name: "Tennis",
    count: 89,
    popular: ["Roland Garros", "Wimbledon", "US Open"]
  },
  {
    icon: Dumbbell,
    name: "Basketball",
    count: 56,
    popular: ["NBA", "Euroleague", "Liga ACB"]
  },
  {
    icon: Table,
    name: "Tennis de Table",
    count: 34,
    popular: ["World Tour", "European Circuit", "Asian Games"]
  }
];

export default function PopularSports() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Sports Populaires</h2>
      <div className="space-y-6">
        {sports.map((sport, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <sport.icon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{sport.name}</h3>
                <span className="text-sm text-gray-600">{sport.count} matchs</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sport.popular.map((league, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-sm bg-gray-50 rounded-full text-gray-700"
                  >
                    {league}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}