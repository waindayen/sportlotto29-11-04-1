import React from 'react';
import BaseDashboard from './BaseDashboard';
import { Trophy, TrendingUp, Clock } from 'lucide-react';

export default function ExternalDashboard() {
  const stats = [
    { label: 'Paris en cours', value: '12', icon: Clock },
    { label: 'Paris gagnés', value: '45', icon: Trophy },
    { label: 'Taux de réussite', value: '67%', icon: TrendingUp },
  ];

  return (
    <BaseDashboard title="Tableau de bord Externe">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <stat.icon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Mes Paris Récents</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">PSG vs Marseille</p>
                  <p className="text-sm text-gray-600">Mise: 50€</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Gagné
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseDashboard>
  );
}