import React from 'react';
import { TrendingUp, Trophy, Users } from 'lucide-react';

const stats = [
  {
    icon: Trophy,
    label: "Gains du jour",
    value: "127,394€",
    trend: "+12.5%"
  },
  {
    icon: Users,
    label: "Parieurs actifs",
    value: "2,847",
    trend: "+5.2%"
  },
  {
    icon: TrendingUp,
    label: "Cote max du jour",
    value: "12.5",
    highlight: true
  }
];

export default function BettingStats() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Statistiques</h2>
      <div className="space-y-6">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <stat.icon className={`w-6 h-6 ${stat.highlight ? 'text-green-500' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                {stat.trend && (
                  <span className="text-sm text-green-500">{stat.trend}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}