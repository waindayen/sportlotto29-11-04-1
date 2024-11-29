import React, { useState } from 'react';
import { useOdds } from '../hooks/useOdds';
import { Trophy, Calendar, Filter, AlertCircle, Settings, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { oddsApi } from '../services/odds';

const FOOTBALL_LEAGUES = [
  { key: 'soccer_uefa_champs_league', name: 'Champions League' },
  { key: 'soccer_epl', name: 'Premier League' },
  { key: 'soccer_spain_la_liga', name: 'La Liga' },
  { key: 'soccer_france_ligue_one', name: 'Ligue 1' },
  { key: 'soccer_italy_serie_a', name: 'Serie A' },
  { key: 'soccer_germany_bundesliga', name: 'Bundesliga' }
].filter(league => {
  const config = oddsApi.getSportConfig(league.key);
  return config.enabled;
});

export default function Football() {
  const [selectedLeague, setSelectedLeague] = useState(FOOTBALL_LEAGUES[0]?.key || '');

  const { 
    data: matches, 
    isLoading,
    error,
    refetch
  } = useOdds(selectedLeague);

  const handleRefresh = () => {
    refetch();
  };

  // Si aucun championnat n'est activé
  if (FOOTBALL_LEAGUES.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 px-4 pb-20">
        <div className="max-w-7xl mx-auto py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Aucun championnat disponible</h2>
            <p className="text-gray-600 mb-4">
              Tous les championnats sont actuellement désactivés.
            </p>
            <Link
              to="/dashboard/api/odds-config"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Settings className="w-5 h-5" />
              Configurer les championnats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Si l'API n'est pas configurée
  if (!oddsApi.isConfigured()) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 px-4 pb-20">
        <div className="max-w-7xl mx-auto py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Configuration requise</h2>
            <p className="text-gray-600 mb-4">
              L'API des cotes n'est pas configurée. Veuillez configurer votre clé API pour accéder aux données des matchs.
            </p>
            <Link
              to="/dashboard/api/odds-config"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Settings className="w-5 h-5" />
              Configurer l'API
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderError = () => {
    let message = "Une erreur est survenue lors du chargement des données.";
    let action = null;

    if (error?.code === "SPORT_DISABLED") {
      message = "Ce championnat est temporairement désactivé.";
      action = (
        <Link
          to="/dashboard/api/odds-config"
          className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Settings className="w-5 h-5" />
          Gérer les championnats
        </Link>
      );
    } else if (error?.code === "RESOURCE_NOT_FOUND") {
      message = "Aucune donnée disponible pour ce championnat actuellement.";
      action = (
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="w-5 h-5" />
          Actualiser
        </button>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-600 text-center">{message}</p>
        {action}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 px-4 pb-20">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Football</h1>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {/* League Selector */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="font-medium text-gray-700">Championnats</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {FOOTBALL_LEAGUES.map((league) => (
              <button
                key={league.key}
                onClick={() => setSelectedLeague(league.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedLeague === league.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {league.name}
              </button>
            ))}
          </div>
        </div>

        {/* Matches Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          renderError()
        ) : matches?.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Aucun match disponible pour le moment
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches?.map((match) => {
              const mainMarket = match.bookmakers[0]?.markets[0];
              const homeOdds = mainMarket?.outcomes.find(o => o.name === match.home_team)?.price;
              const awayOdds = mainMarket?.outcomes.find(o => o.name === match.away_team)?.price;
              const drawOdds = mainMarket?.outcomes.find(o => o.name === 'Draw')?.price;

              return (
                <div key={match.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-blue-600">{match.sport_title}</span>
                    <span className="flex items-center gap-1 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4" />
                      {new Date(match.commence_time).toLocaleString('fr-FR', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div className="flex-1 text-center">
                      <h3 className="font-semibold text-lg">{match.home_team}</h3>
                    </div>
                    <div className="px-4 text-gray-500">VS</div>
                    <div className="flex-1 text-center">
                      <h3 className="font-semibold text-lg">{match.away_team}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {homeOdds && (
                      <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <div className="text-sm text-gray-600 mb-1">1</div>
                        <div className="text-xl font-bold text-blue-600">{homeOdds.toFixed(2)}</div>
                      </button>
                    )}
                    {drawOdds && (
                      <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <div className="text-sm text-gray-600 mb-1">X</div>
                        <div className="text-xl font-bold text-blue-600">{drawOdds.toFixed(2)}</div>
                      </button>
                    )}
                    {awayOdds && (
                      <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                        <div className="text-sm text-gray-600 mb-1">2</div>
                        <div className="text-xl font-bold text-blue-600">{awayOdds.toFixed(2)}</div>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}