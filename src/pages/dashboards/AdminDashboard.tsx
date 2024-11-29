import React from 'react';
import BaseDashboard from './BaseDashboard';
import { Shield, Users, Settings, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Utilisateurs actifs', value: '1,234', icon: Users },
    { label: 'Rôles système', value: '8', icon: Shield },
    { label: 'Alertes système', value: '3', icon: AlertTriangle },
  ];

  const systemHealth = [
    { name: 'Base de données', status: 'healthy', uptime: '99.99%' },
    { name: 'Serveur API', status: 'healthy', uptime: '99.95%' },
    { name: 'Cache System', status: 'warning', uptime: '98.50%' },
  ];

  return (
    <BaseDashboard title="Tableau de bord Administrateur">
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
          <h2 className="text-lg font-semibold mb-4">État du Système</h2>
          <div className="space-y-4">
            {systemHealth.map((system, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      system.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="font-medium">{system.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      Uptime: {system.uptime}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700">
                      Configurer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Actions Système</h2>
          <div className="space-y-4">
            {[
              { label: 'Gestion des utilisateurs', icon: Users },
              { label: 'Configuration système', icon: Settings },
              { label: 'Gestion des permissions', icon: Shield },
            ].map((action, index) => (
              <button
                key={index}
                className="w-full bg-white p-4 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span className="font-medium">{action.label}</span>
                <action.icon className="w-5 h-5 text-blue-600" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </BaseDashboard>
  );
}