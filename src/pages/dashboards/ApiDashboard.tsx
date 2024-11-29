import React from 'react';
import BaseDashboard from './BaseDashboard';
import { Activity, Clock, AlertCircle, Server } from 'lucide-react';

export default function ApiDashboard() {
  const stats = [
    { label: 'Requêtes/min', value: '1,234', icon: Activity },
    { label: 'Temps moyen', value: '45ms', icon: Clock },
    { label: 'Disponibilité', value: '99.9%', icon: Server },
  ];

  const endpoints = [
    { name: '/api/bets', status: 'healthy', latency: '35ms' },
    { name: '/api/users', status: 'healthy', latency: '42ms' },
    { name: '/api/stats', status: 'warning', latency: '128ms' },
  ];

  return (
    <BaseDashboard title="Tableau de bord API">
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
        <h2 className="text-lg font-semibold mb-4">Statut des Endpoints</h2>
        <div className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    endpoint.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="font-mono">{endpoint.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {endpoint.latency}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700">
                    Détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Logs Récents</h2>
        <div className="space-y-2">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-sm font-mono text-sm">
              <span className="text-gray-500">[2024-03-01 14:2{index}:00]</span>{' '}
              <span className="text-blue-600">INFO</span>{' '}
              <span>Request processed successfully</span>
            </div>
          ))}
        </div>
      </div>
    </BaseDashboard>
  );
}