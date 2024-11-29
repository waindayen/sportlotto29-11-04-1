import React from 'react';
import BaseDashboard from './BaseDashboard';
import { FileText, Users, AlertCircle, Clock } from 'lucide-react';

export default function StaffDashboard() {
  const stats = [
    { label: 'Tickets ouverts', value: '23', icon: FileText },
    { label: 'Clients assistés', value: '156', icon: Users },
    { label: 'Temps moyen', value: '15min', icon: Clock },
  ];

  const tickets = [
    { id: 'T-001', status: 'urgent', subject: 'Problème de paiement' },
    { id: 'T-002', status: 'normal', subject: 'Question sur les cotes' },
    { id: 'T-003', status: 'low', subject: 'Mise en attente' },
  ];

  return (
    <BaseDashboard title="Tableau de bord Staff">
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
        <h2 className="text-lg font-semibold mb-4">Tickets en cours</h2>
        <div className="space-y-4">
          {tickets.map((ticket, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <AlertCircle className={`w-5 h-5 ${
                    ticket.status === 'urgent' ? 'text-red-500' :
                    ticket.status === 'normal' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium">{ticket.subject}</p>
                    <p className="text-sm text-gray-600">Ticket {ticket.id}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Traiter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BaseDashboard>
  );
}