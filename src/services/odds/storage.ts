import { doc, getDoc, setDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { STORAGE_KEY, FIREBASE_COLLECTION, DEFAULT_SPORTS } from './constants';
import type { OddsConfig, SportConfig } from './types';

export class OddsStorage {
  private static SPORTS_COLLECTION = 'sports_config';

  static async loadFromLocalStorage(): Promise<OddsConfig | null> {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        const sports = await this.loadSportsConfig();
        return {
          ...parsed,
          sports: { ...DEFAULT_SPORTS, ...parsed.sports, ...sports }
        };
      }
      return null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  static async loadSportsConfig(): Promise<Record<string, SportConfig>> {
    try {
      const sportsRef = collection(db, this.SPORTS_COLLECTION);
      const snapshot = await getDocs(sportsRef);
      
      const sports: Record<string, SportConfig> = {};
      snapshot.forEach(doc => {
        sports[doc.id] = doc.data() as SportConfig;
      });
      
      return sports;
    } catch (error) {
      console.error('Error loading sports config:', error);
      return {};
    }
  }

  static async saveSportConfig(sportKey: string, config: SportConfig): Promise<void> {
    try {
      const sportRef = doc(db, this.SPORTS_COLLECTION, sportKey);
      await setDoc(sportRef, {
        ...config,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving sport config:', error);
    }
  }

  static async loadFromFirebase(): Promise<OddsConfig | null> {
    try {
      // Get the latest active configuration
      const configsRef = collection(db, FIREBASE_COLLECTION);
      const q = query(configsRef, orderBy('lastUpdated', 'desc'), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const latestConfig = querySnapshot.docs[0].data() as OddsConfig;
        const sports = await this.loadSportsConfig();
        return {
          ...latestConfig,
          sports: { ...DEFAULT_SPORTS, ...latestConfig.sports, ...sports }
        };
      }

      // If no configuration exists, create one with default settings
      const defaultConfig: OddsConfig = {
        apiKey: '',
        sports: DEFAULT_SPORTS,
        lastUpdated: new Date().toISOString(),
        isActive: true
      };

      await this.saveToFirebase(defaultConfig);
      return defaultConfig;
    } catch (error) {
      console.error('Error loading from Firebase:', error);
      return null;
    }
  }

  static async saveToLocalStorage(config: OddsConfig): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static async saveToFirebase(config: OddsConfig): Promise<void> {
    try {
      const configId = new Date().toISOString();
      const configRef = doc(db, FIREBASE_COLLECTION, configId);
      
      // Mark previous configurations as inactive
      const previousConfigs = await getDocs(
        query(collection(db, FIREBASE_COLLECTION), orderBy('lastUpdated', 'desc'), limit(5))
      );
      
      for (const doc of previousConfigs.docs) {
        await setDoc(doc.ref, { isActive: false }, { merge: true });
      }

      // Save new configuration
      await setDoc(configRef, {
        ...config,
        lastUpdated: new Date().toISOString(),
        isActive: true
      });

      // Save individual sport configurations
      for (const [sportKey, sportConfig] of Object.entries(config.sports)) {
        await this.saveSportConfig(sportKey, sportConfig);
      }
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  }

  static async getActiveConfiguration(): Promise<OddsConfig | null> {
    try {
      const configsRef = collection(db, FIREBASE_COLLECTION);
      const q = query(
        configsRef, 
        orderBy('lastUpdated', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const config = querySnapshot.docs[0].data() as OddsConfig;
        const sports = await this.loadSportsConfig();
        return {
          ...config,
          sports: { ...DEFAULT_SPORTS, ...config.sports, ...sports }
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting active configuration:', error);
      return null;
    }
  }
}