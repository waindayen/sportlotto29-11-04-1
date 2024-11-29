import React from 'react';
import BaseDashboard from './BaseDashboard';
import { FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function UcierDashboard() {
  const stats = [
    { label: 'Dossiers en cours', value: '45', icon: FileText },
    { label: 'Dossiers traités', value: '128', icon: CheckCircle },
    { label: 'Temps moyen', value: '48h', icon: Clock },
  ];

  const recentCases = [
    { id: 'UC-001', status: 'pending', priority: 'high', subject: 'Vérification KYC' },
    { id: 'UC-002', status: 'review', priority: 'medium', subject: 'Mise suspecte' },
    { id: 'UC-003', status: 'pending', priority: 'low', subject: 'Contrôle routine' },
  ];

  return (
    <BaseDashboard title="Tableau de bord UCIER">
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
          <h2 className="text-lg font-semibold mb-4">Dossiers à Traiter</h2>
          <div className="space-y-4">
            {recentCases.map((case_, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-5 h-5 ${
                      case_.priority === 'high' ? 'text-red-500' :
                      case_.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <div>
                      <p className="font-medium">{case_.subject}</p>
                      <p className="text-sm text-gray-600">Dossier {case_.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      case_.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {case_.status === 'pending' ? 'En attente' : 'En révision'}
                    </span>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Examiner
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Rapports de Conformité</h2>
          <div className="space-y-4">
            {['Quotidien', 'Hebdomadaire', 'Mensuel'].map((period, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Rapport {period}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700">
                    Générer
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