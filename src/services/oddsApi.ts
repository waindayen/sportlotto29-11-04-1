import axios from 'axios';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const BASE_URL = 'https://api.the-odds-api.com/v4/sports';
const STORAGE_KEY = 'odds_api_config';
const FIREBASE_COLLECTION = 'odds_config';

// Sports par défaut activés
const DEFAULT_SPORTS = {
  'soccer_france_ligue_one': { enabled: true, refreshInterval: 30 },
  'soccer_uefa_champs_league': { enabled: true, refreshInterval: 30 },
  'soccer_epl': { enabled: true, refreshInterval: 30 },
  'soccer_spain_la_liga': { enabled: true, refreshInterval: 30 },
  'soccer_italy_serie_a': { enabled: true, refreshInterval: 30 },
  'soccer_germany_bundesliga': { enabled: true, refreshInterval: 30 }
};

export interface Sport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Market {
  key: string;
  outcomes: Outcome[];
}

export interface Outcome {
  name: string;
  price: number;
}

export interface Event {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

interface OddsConfig {
  apiKey: string;
  sports: Record<string, {
    enabled: boolean;
    refreshInterval: number;
  }>;
  lastUpdated?: string;
}

class OddsApi {
  private config: OddsConfig;
  private isInitialized: boolean;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.config = {
      apiKey: '',
      sports: DEFAULT_SPORTS,
      lastUpdated: new Date().toISOString()
    };
    this.isInitialized = false;
    this.initPromise = this.initialize();
  }

  private async initialize() {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        this.config = {
          ...parsed,
          sports: { ...DEFAULT_SPORTS, ...parsed.sports }
        };
      }
      await this.loadFirebaseConfig();
      this.isInitialized = !!this.config.apiKey;
    } catch (error) {
      console.error('Error initializing OddsApi:', error);
    }
  }

  private async loadFirebaseConfig() {
    try {
      const configDoc = await getDoc(doc(db, FIREBASE_COLLECTION, 'settings'));
      if (configDoc.exists()) {
        const firebaseConfig = configDoc.data() as OddsConfig;
        // Merge with default sports for new sports
        firebaseConfig.sports = {
          ...DEFAULT_SPORTS,
          ...firebaseConfig.sports
        };
        // Use the most recent configuration
        if (!this.config.lastUpdated || 
            (firebaseConfig.lastUpdated && firebaseConfig.lastUpdated > this.config.lastUpdated)) {
          this.config = firebaseConfig;
          await this.saveConfig(false);
        }
      }
    } catch (error) {
      console.error('Error loading Firebase config:', error);
    }
  }

  private async saveToFirebase() {
    try {
      await setDoc(doc(db, FIREBASE_COLLECTION, 'settings'), {
        ...this.config,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  }

  private async ensureInitialized() {
    if (this.initPromise) {
      await this.initPromise;
      this.initPromise = null;
    }
  }

  async setApiKey(key: string) {
    await this.ensureInitialized();
    this.config.apiKey = key;
    this.isInitialized = true;
    await this.saveConfig(true);
  }

  getApiKey(): string {
    return this.config.apiKey;
  }

  async setSportConfig(sportKey: string, enabled: boolean, refreshInterval: number) {
    await this.ensureInitialized();
    this.config.sports[sportKey] = { enabled, refreshInterval };
    await this.saveConfig(true);
  }

  getSportConfig(sportKey: string) {
    return this.config.sports[sportKey] || DEFAULT_SPORTS[sportKey] || { enabled: false, refreshInterval: 30 };
  }

  getAllSportsConfig() {
    return this.config.sports;
  }

  private async saveConfig(updateFirebase = true) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    if (updateFirebase) {
      await this.saveToFirebase();
    }
  }

  isConfigured(): boolean {
    return this.isInitialized && !!this.config.apiKey;
  }

  async testConnection(apiKey: string): Promise<boolean> {
    try {
      const response = await axios.get(`${BASE_URL}`, {
        params: { apiKey }
      });
      return response.status === 200;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Clé API invalide');
        }
        if (error.response?.status === 429) {
          throw new Error('Limite d\'API dépassée');
        }
      }
      throw new Error('Erreur de connexion à l\'API');
    }
  }

  private async validateApiKey() {
    if (!this.config.apiKey) {
      throw new Error('API_KEY_REQUIRED');
    }
    await this.ensureInitialized();
  }

  private async request<T>(endpoint: string, params = {}): Promise<T> {
    await this.validateApiKey();

    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        params: {
          apiKey: this.config.apiKey,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('API_KEY_INVALID');
        }
        if (error.response?.status === 429) {
          throw new Error('API_RATE_LIMIT');
        }
        if (error.response?.status === 404) {
          throw new Error('RESOURCE_NOT_FOUND');
        }
      }
      throw new Error('API_CONNECTION_ERROR');
    }
  }

  async getSports(): Promise<Sport[]> {
    return this.request<Sport[]>('/');
  }

  async getOdds(sportKey: string, regions = 'eu'): Promise<Event[]> {
    const config = this.getSportConfig(sportKey);
    if (!config.enabled) {
      throw new Error('SPORT_DISABLED');
    }
    return this.request<Event[]>(`/${sportKey}/odds`, {
      regions,
      markets: 'h2h'
    });
  }

  async getLiveEvents(sportKey: string): Promise<Event[]> {
    const config = this.getSportConfig(sportKey);
    if (!config.enabled) {
      throw new Error('SPORT_DISABLED');
    }
    return this.request<Event[]>(`/${sportKey}/odds-live`, {
      markets: 'h2h'
    });
  }

  async getScores(sportKey: string, daysFrom = 1): Promise<Event[]> {
    const config = this.getSportConfig(sportKey);
    if (!config.enabled) {
      throw new Error('SPORT_DISABLED');
    }
    return this.request<Event[]>(`/${sportKey}/scores`, {
      daysFrom
    });
  }
}

export const oddsApi = new OddsApi();