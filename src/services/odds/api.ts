import axios from 'axios';
import { BASE_URL, DEFAULT_SPORTS } from './constants';
import { OddsStorage } from './storage';
import { OddsApiError, ERROR_MESSAGES } from './errors';
import type { Sport, Event, OddsConfig, SportConfig } from './types';

export class OddsApi {
  private config: OddsConfig;
  private isInitialized: boolean;
  private initPromise: Promise<void> | null = null;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private CACHE_TTL = 30000; // 30 seconds

  constructor() {
    this.config = {
      apiKey: '',
      sports: DEFAULT_SPORTS,
      lastUpdated: new Date().toISOString(),
      isActive: false
    };
    this.isInitialized = false;
    this.initPromise = this.initialize();
  }

  private async initialize() {
    try {
      // Try to load active configuration from Firebase first
      const activeConfig = await OddsStorage.getActiveConfiguration();
      if (activeConfig && activeConfig.isActive) {
        this.config = activeConfig;
        if (this.config.apiKey && this.config.apiKey !== '') {
          await this.testConnection(this.config.apiKey);
          this.isInitialized = true;
        }
        return;
      }

      // Fallback to local storage if no active configuration exists
      const localConfig = await OddsStorage.loadFromLocalStorage();
      if (localConfig) {
        this.config = localConfig;
        if (this.config.apiKey && this.config.apiKey !== '') {
          await this.testConnection(this.config.apiKey);
          this.isInitialized = true;
        }
      }
    } catch (error) {
      console.error('Error initializing OddsApi:', error);
      this.isInitialized = false;
    }
  }

  private getCacheKey(endpoint: string, params: any = {}): string {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private async ensureInitialized() {
    if (this.initPromise) {
      await this.initPromise;
      this.initPromise = null;
    }
  }

  async setApiKey(key: string) {
    await this.ensureInitialized();
    try {
      await this.testConnection(key);
      this.config.apiKey = key;
      this.isInitialized = true;
      this.config.isActive = true;
      await this.saveConfig(true);
      this.cache.clear();
    } catch (error) {
      throw new OddsApiError(ERROR_MESSAGES.API_KEY_INVALID, 'API_KEY_INVALID');
    }
  }

  getApiKey(): string {
    return this.config.apiKey;
  }

  async setSportConfig(sportKey: string, enabled: boolean, refreshInterval: number) {
    await this.ensureInitialized();
    
    const sportConfig: SportConfig = {
      enabled,
      refreshInterval,
      lastUpdated: new Date().toISOString()
    };

    this.config.sports[sportKey] = sportConfig;
    this.config.isActive = true;

    // Save sport config independently
    await OddsStorage.saveSportConfig(sportKey, sportConfig);
    
    // Save global config
    await this.saveConfig(true);

    // Clear cache for this sport
    this.cache.forEach((_, key) => {
      if (key.includes(sportKey)) {
        this.cache.delete(key);
      }
    });
  }

  getSportConfig(sportKey: string): SportConfig {
    return this.config.sports[sportKey] || DEFAULT_SPORTS[sportKey] || { enabled: false, refreshInterval: 30 };
  }

  getAllSportsConfig() {
    return this.config.sports;
  }

  private async saveConfig(updateFirebase = true) {
    await OddsStorage.saveToLocalStorage(this.config);
    if (updateFirebase) {
      await OddsStorage.saveToFirebase(this.config);
    }
  }

  isConfigured(): boolean {
    return this.isInitialized && this.config.apiKey !== '' && this.config.isActive;
  }

  async testConnection(apiKey: string): Promise<boolean> {
    try {
      const response = await axios.get(BASE_URL, { 
        params: { apiKey },
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new OddsApiError(ERROR_MESSAGES.API_KEY_INVALID, 'API_KEY_INVALID');
        }
        if (error.response?.status === 429) {
          throw new OddsApiError(ERROR_MESSAGES.API_RATE_LIMIT, 'API_RATE_LIMIT');
        }
      }
      throw new OddsApiError(ERROR_MESSAGES.API_CONNECTION_ERROR, 'API_CONNECTION_ERROR');
    }
  }

  private async validateApiKey() {
    if (!this.config.apiKey) {
      throw new OddsApiError(ERROR_MESSAGES.API_KEY_REQUIRED, 'API_KEY_REQUIRED');
    }
    await this.ensureInitialized();
  }

  private async request<T>(endpoint: string, params = {}): Promise<T> {
    await this.validateApiKey();

    const cacheKey = this.getCacheKey(endpoint, params);
    const cachedData = this.getFromCache<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        params: {
          apiKey: this.config.apiKey,
          ...params
        },
        timeout: 10000
      });
      
      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new OddsApiError(ERROR_MESSAGES.API_KEY_INVALID, 'API_KEY_INVALID');
        }
        if (error.response?.status === 429) {
          throw new OddsApiError(ERROR_MESSAGES.API_RATE_LIMIT, 'API_RATE_LIMIT');
        }
        if (error.response?.status === 404) {
          const emptyData = [] as unknown as T;
          this.setCache(cacheKey, emptyData);
          return emptyData;
        }
      }
      throw new OddsApiError(ERROR_MESSAGES.API_CONNECTION_ERROR, 'API_CONNECTION_ERROR');
    }
  }

  async getSports(): Promise<Sport[]> {
    return this.request<Sport[]>('/');
  }

  async getOdds(sportKey: string, regions = 'eu'): Promise<Event[]> {
    const config = this.getSportConfig(sportKey);
    if (!config.enabled) {
      throw new OddsApiError(ERROR_MESSAGES.SPORT_DISABLED, 'SPORT_DISABLED');
    }
    return this.request<Event[]>(`/${sportKey}/odds`, {
      regions,
      markets: 'h2h'
    });
  }

  async getLiveEvents(sportKey: string): Promise<Event[]> {
    const config = this.getSportConfig(sportKey);
    if (!config.enabled) {
      throw new OddsApiError(ERROR_MESSAGES.SPORT_DISABLED, 'SPORT_DISABLED');
    }
    return this.request<Event[]>(`/${sportKey}/odds-live`, {
      markets: 'h2h'
    });
  }

  async getScores(sportKey: string, daysFrom = 1): Promise<Event[]> {
    const config = this.getSportConfig(sportKey);
    if (!config.enabled) {
      throw new OddsApiError(ERROR_MESSAGES.SPORT_DISABLED, 'SPORT_DISABLED');
    }
    return this.request<Event[]>(`/${sportKey}/scores`, {
      daysFrom
    });
  }
}