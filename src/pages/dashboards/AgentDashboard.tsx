import React from 'react';
import BaseDashboard from './BaseDashboard';
import { Users, Target, TrendingUp, AlertCircle } from 'lucide-react';

export default function AgentDashboard() {
  const stats = [
    { label: 'Clients actifs', value: '124', icon: Users },
    { label: 'Objectif mensuel', value: '85%', icon: Target },
    { label: 'Performance', value: '+12%', icon: TrendingUp },
  ];

  const alerts = [
    { message: 'Nouveau client à valider', type: 'warning' },
    { message: 'Mise importante détectée', type: 'alert' },
    { message: 'Document en attente', type: 'info' },
  ];

  return (
    <BaseDashboard title="Tableau de bord Agent">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Alertes</h2>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                <AlertCircle className={`w-5 h-5 ${
                  alert.type === 'warning' ? 'text-yellow-500' :
                  alert.type === 'alert' ? 'text-red-500' : 'text-blue-500'
                }`} />
                <span>{alert.message}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Clients Récents</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Client #{index + 1}</p>
                    <p className="text-sm text-gray-600">Inscrit le 01/03/2024</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700">
                    Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseDashboard>
  );
}