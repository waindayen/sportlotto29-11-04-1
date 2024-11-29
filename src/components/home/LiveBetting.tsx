import React, { useState } from 'react';
import { Play, Clock, Filter, Settings, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLiveEvents } from '../../hooks/useOdds';
import { oddsApi } from '../../services/odds';
import LoadingState from '../LoadingState';
import ErrorState from '../ErrorState';

const FEATURED_LEAGUES = [
  { key: 'soccer_france_ligue_one', name: 'Ligue 1' },
  { key: 'soccer_epl', name: 'Premier League' },
  { key: 'soccer_uefa_champs_league', name: 'Champions League' }
].filter(league => {
  const config = oddsApi.getSportConfig(league.key);
  return config.enabled;
});

export default function LiveBetting() {
  const [selectedLeague, setSelectedLeague] = useState(FEATURED_LEAGUES[0]?.key || '');
  const { data: matches, isLoading, error, refetch } = useLiveEvents(selectedLeague);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Play className="w-6 h-6 text-red-500 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-900">En Direct</h2>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {!oddsApi.isConfigured() ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="max-w-md mx-auto">
            <Settings className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Configuration requise</h3>
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
      ) : FEATURED_LEAGUES.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <ErrorState 
            message="Les championnats sont actuellement désactivés."
            code="SPORT_DISABLED"
          />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium text-gray-700">Championnats</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {FEATURED_LEAGUES.map((league) => (
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

          {isLoading ? (
            <LoadingState message="Chargement des matchs en direct..." />
          ) : error ? (
            <ErrorState 
              message={error.message}
              code={error.code}
              onRetry={handleRefresh}
            />
          ) : !matches?.length ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
              Aucun match en direct pour le moment
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match) => {
                const mainMarket = match.bookmakers[0]?.markets[0];
                const homeOdds = mainMarket?.outcomes.find(o => o.name === match.home_team)?.price;
                const awayOdds = mainMarket?.outcomes.find(o => o.name === match.away_team)?.price;
                const drawOdds = mainMarket?.outcomes.find(o => o.name === 'Draw')?.price;

                return (
                  <div key={match.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-blue-600">{match.sport_title}</span>
                      <span className="flex items-center gap-1 text-red-500 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>En direct</span>
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
        </>
      )}
    </div>
  );
}