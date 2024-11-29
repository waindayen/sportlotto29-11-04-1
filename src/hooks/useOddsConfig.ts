import { useState, useEffect } from 'react';
import { oddsApi } from '../services/oddsApi';

export function useOddsConfig() {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedApiKey = oddsApi.getApiKey();
    if (savedApiKey) {
      checkConnection(savedApiKey);
    }
  }, []);

  const checkConnection = async (apiKey: string) => {
    setIsChecking(true);
    setError(null);
    try {
      await oddsApi.testConnection(apiKey);
      setIsConnected(true);
      return true;
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    isConnected,
    isChecking,
    error,
    checkConnection
  };
}