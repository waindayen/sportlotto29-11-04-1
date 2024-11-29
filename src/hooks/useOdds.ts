import { useQuery } from 'react-query';
import { oddsApi } from '../services/odds';
import type { Sport, Event } from '../services/odds/types';
import { OddsApiError } from '../services/odds/errors';

const STALE_TIME = 30000; // 30 seconds
const CACHE_TIME = 60000; // 1 minute
const RETRY_DELAY = 2000; // 2 seconds

export function useSports() {
  return useQuery<Sport[], OddsApiError>(
    'sports',
    () => oddsApi.getSports(),
    {
      retry: 2,
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retryDelay: RETRY_DELAY,
      enabled: oddsApi.isConfigured(),
      onError: (error) => {
        console.error('Failed to fetch sports:', error.message);
      }
    }
  );
}

export function useOdds(sportKey: string) {
  return useQuery<Event[], OddsApiError>(
    ['odds', sportKey],
    async () => {
      if (!sportKey) return [];
      return await oddsApi.getOdds(sportKey);
    },
    {
      retry: (failureCount, error) => {
        return failureCount < 2 && error.code !== 'SPORT_DISABLED';
      },
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retryDelay: RETRY_DELAY,
      enabled: oddsApi.isConfigured() && !!sportKey,
      onError: (error) => {
        console.error(`Failed to fetch odds for ${sportKey}:`, error.message);
      }
    }
  );
}

export function useLiveEvents(sportKey: string) {
  return useQuery<Event[], OddsApiError>(
    ['live-events', sportKey],
    async () => {
      if (!sportKey) return [];
      return await oddsApi.getLiveEvents(sportKey);
    },
    {
      retry: (failureCount, error) => {
        return failureCount < 2 && error.code !== 'SPORT_DISABLED';
      },
      refetchInterval: 15000, // Refresh every 15 seconds for live data
      staleTime: 5000, // Consider data stale after 5 seconds
      cacheTime: CACHE_TIME,
      retryDelay: RETRY_DELAY,
      enabled: oddsApi.isConfigured() && !!sportKey,
      onError: (error) => {
        console.error(`Failed to fetch live events for ${sportKey}:`, error.message);
      }
    }
  );
}

export function useScores(sportKey: string) {
  return useQuery<Event[], OddsApiError>(
    ['scores', sportKey],
    async () => {
      if (!sportKey) return [];
      return await oddsApi.getScores(sportKey);
    },
    {
      retry: (failureCount, error) => {
        return failureCount < 2 && error.code !== 'SPORT_DISABLED';
      },
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retryDelay: RETRY_DELAY,
      enabled: oddsApi.isConfigured() && !!sportKey,
      onError: (error) => {
        console.error(`Failed to fetch scores for ${sportKey}:`, error.message);
      }
    }
  );
}