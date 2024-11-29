import React from 'react';
import BaseDashboard from './BaseDashboard';
import { DollarSign, Users, TrendingUp, BarChart } from 'lucide-react';

export default function ManagerDashboard() {
  const stats = [
    { label: 'Chiffre d\'affaires', value: '45,678€', icon: DollarSign },
    { label: 'Nouveaux clients', value: '+234', icon: Users },
    { label: 'Croissance', value: '+23%', icon: TrendingUp },
  ];

  const performanceData = [
    { agent: 'Agent 1', performance: 92 },
    { agent: 'Agent 2', performance: 88 },
    { agent: 'Agent 3', performance: 95 },
  ];

  return (
    <BaseDashboard title="Tableau de bord Manager">
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
          <h2 className="text-lg font-semibold mb-4">Performance des Agents</h2>
          <div className="space-y-4">
            {performanceData.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{item.agent}</span>
                  <span className="text-blue-600">{item.performance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.performance}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Rapports</h2>
          <div className="space-y-4">
            {['Quotidien', 'Hebdomadaire', 'Mensuel'].map((period, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <BarChart className="w-5 h-5 text-blue-600" />
                    <span>Rapport {period}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700">
                    Télécharger
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