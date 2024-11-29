import React from 'react';
import BaseDashboard from './BaseDashboard';
import { DollarSign, TrendingUp, Users, Target } from 'lucide-react';

export default function DirectDashboard() {
  const stats = [
    { label: 'Revenu total', value: '234,567€', icon: DollarSign },
    { label: 'Croissance annuelle', value: '+45%', icon: TrendingUp },
    { label: 'Objectifs atteints', value: '92%', icon: Target },
  ];

  const kpis = [
    { label: 'Acquisition', current: 2345, target: 3000, growth: '+15%' },
    { label: 'Rétention', current: 87, target: 90, growth: '+5%' },
    { label: 'Revenue moyen', current: 156, target: 200, growth: '+12%' },
  ];

  return (
    <BaseDashboard title="Tableau de bord Directeur">
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

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">KPIs Stratégiques</h2>
          <div className="space-y-6">
            {kpis.map((kpi, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{kpi.label}</h3>
                    <p className="text-sm text-gray-600">
                      Objectif: {kpi.target}
                    </p>
                  </div>
                  <span className="text-green-600 font-medium">
                    {kpi.growth}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(kpi.current / kpi.target) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {kpi.current} / {kpi.target}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseDashboard>
  );
}