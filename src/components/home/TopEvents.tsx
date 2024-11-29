import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, AlertCircle, Settings, RefreshCw } from 'lucide-react';
import { useOdds } from '../../hooks/useOdds';
import { oddsApi } from '../../services/odds';

const FEATURED_LEAGUES = [
  { key: 'soccer_uefa_champs_league', name: 'Champions League' },
  { key: 'soccer_epl', name: 'Premier League' }
].filter(league => {
  const config = oddsApi.getSportConfig(league.key);
  return config.enabled;
});

export default function TopEvents() {
  const { data: matches, isLoading, error, refetch } = useOdds(FEATURED_LEAGUES[0]?.key || '');

  const handleRefresh = () => {
    refetch();
  };

  // Si aucun championnat n'est activé
  if (FEATURED_LEAGUES.length === 0) {
    return (
      <div className="py-8">
        <div className="flex items-center gap-2 mb-6">
          <Star className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">Événements Populaires</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Aucun championnat disponible</h3>
          <p className="text-gray-600 mb-4">
            Les championnats sont actuellement désactivés.
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
    );
  }

  // Si l'API n'est pas configurée
  if (!oddsApi.isConfigured()) {
    return (
      <div className="py-8">
        <div className="flex items-center gap-2 mb-6">
          <Star className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">Événements Populaires</h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Configuration requise</h3>
          <p className="text-gray-600 mb-4">
            L'API des cotes n'est pas configurée.
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
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-600 text-center">{message}</p>
        {action}
      </div>
    );
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">Événements Populaires</h2>
        </div>
        <Link
          to="/football"
          className="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          Voir tout
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        renderError()
      ) : matches?.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun match disponible pour le moment
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches?.slice(0, 3).map((match) => {
            const mainMarket = match.bookmakers[0]?.markets[0];
            const homeOdds = mainMarket?.outcomes.find(o => o.name === match.home_team)?.price;
            const awayOdds = mainMarket?.outcomes.find(o => o.name === match.away_team)?.price;
            const drawOdds = mainMarket?.outcomes.find(o => o.name === 'Draw')?.price;

            return (
              <div key={match.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-blue-600">{match.sport_title}</span>
                  <span className="text-sm text-gray-600">
                    {new Date(match.commence_time).toLocaleString('fr-FR', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex-1 text-center">
                    <h3 className="font-semibold">{match.home_team}</h3>
                  </div>
                  <div className="px-4 text-gray-500">VS</div>
                  <div className="flex-1 text-center">
                    <h3 className="font-semibold">{match.away_team}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {homeOdds && (
                    <button className="py-2 px-3 text-center rounded bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="text-sm text-gray-600">1</div>
                      <div className="font-bold text-blue-600">{homeOdds.toFixed(2)}</div>
                    </button>
                  )}
                  {drawOdds && (
                    <button className="py-2 px-3 text-center rounded bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="text-sm text-gray-600">X</div>
                      <div className="font-bold text-blue-600">{drawOdds.toFixed(2)}</div>
                    </button>
                  )}
                  {awayOdds && (
                    <button className="py-2 px-3 text-center rounded bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="text-sm text-gray-600">2</div>
                      <div className="font-bold text-blue-600">{awayOdds.toFixed(2)}</div>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}