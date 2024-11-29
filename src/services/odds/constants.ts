export const BASE_URL = 'https://api.the-odds-api.com/v4/sports';
export const STORAGE_KEY = 'odds_api_config';
export const FIREBASE_COLLECTION = 'odds_config';

export const DEFAULT_SPORTS = {
  'soccer_france_ligue_one': { enabled: true, refreshInterval: 30 },
  'soccer_uefa_champs_league': { enabled: true, refreshInterval: 30 },
  'soccer_epl': { enabled: true, refreshInterval: 30 },
  'soccer_spain_la_liga': { enabled: true, refreshInterval: 30 },
  'soccer_italy_serie_a': { enabled: true, refreshInterval: 30 },
  'soccer_germany_bundesliga': { enabled: true, refreshInterval: 30 }
};