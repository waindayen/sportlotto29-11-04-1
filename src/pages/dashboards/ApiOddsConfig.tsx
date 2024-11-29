import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Check, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useSports } from '../../hooks/useOdds';
import { useOddsConfig } from '../../hooks/useOddsConfig';
import { oddsApi } from '../../services/oddsApi';
import BaseDashboard from './BaseDashboard';

interface SportConfig {
  key: string;
  enabled: boolean;
  refreshInterval: number;
}

export default function ApiOddsConfig() {
  const { data: sports, isLoading, error } = useSports();
  const { isConnected, isChecking, error: connectionError, checkConnection } = useOddsConfig();
  const [configs, setConfigs] = useState<Record<string, SportConfig>>({});
  const [apiKey, setApiKey] = useState(oddsApi.getApiKey() || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (apiKey) {
      checkConnection(apiKey);
    }
  }, []);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    if (value) {
      checkConnection(value);
    }
  };

  const handleToggleSport = (sportKey: string) => {
    setConfigs(prev => ({
      ...prev,
      [sportKey]: {
        ...prev[sportKey],
        enabled: !prev[sportKey]?.enabled
      }
    }));
  };

  const handleIntervalChange = (sportKey: string, value: string) => {
    const interval = parseInt(value);
    if (!isNaN(interval) && interval >= 0) {
      setConfigs(prev => ({
        ...prev,
        [sportKey]: {
          ...prev[sportKey],
          refreshInterval: interval
        }
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Sauvegarder la clé API
      oddsApi.setApiKey(apiKey);
      
      // Simuler la sauvegarde des configurations
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  if (isLoading) {
    return (
      <BaseDashboard title="Configuration des Cotes">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </BaseDashboard>
    );
  }

  if (error) {
    return (
      <BaseDashboard title="Configuration des Cotes">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-6 h-6" />
          <span>Erreur de chargement des sports</span>
        </div>
      </BaseDashboard>
    );
  }

  return (
    <BaseDashboard title="Configuration des Cotes">
      <div className="space-y-6">
        {/* Configuration API */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Configuration API</h2>
            </div>
            <div className="flex items-center gap-2">
              {isChecking ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              ) : isConnected ? (
                <div className="flex items-center gap-1 text-green-600">
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm">Connecté</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-500">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm">Déconnecté</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                Clé API
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Entrez votre clé API"
              />
              {connectionError && (
                <p className="mt-1 text-sm text-red-500">{connectionError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Configuration des Sports */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Sports Disponibles</h2>
          <div className="space-y-4">
            {sports?.map((sport) => (
              <div key={sport.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{sport.title}</h3>
                  <p className="text-sm text-gray-600">{sport.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mr-2">Intervalle (s)</label>
                    <input
                      type="number"
                      min="0"
                      value={configs[sport.key]?.refreshInterval || 30}
                      onChange={(e) => handleIntervalChange(sport.key, e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                  <button
                    onClick={() => handleToggleSport(sport.key)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      configs[sport.key]?.enabled
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {configs[sport.key]?.enabled ? 'Activé' : 'Désactivé'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setConfigs({})}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Réinitialiser
          </button>
          <button
            onClick={handleSave}
            disabled={!isConnected}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isConnected
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-5 h-5" />
                Sauvegardé
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </div>
    </BaseDashboard>
  );
}