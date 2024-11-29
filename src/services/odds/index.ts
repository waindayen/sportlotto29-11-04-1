import { OddsApi } from './api';
import { ERROR_MESSAGES } from './errors';
import { DEFAULT_SPORTS } from './constants';

// Create and export a singleton instance
const oddsApi = new OddsApi();

export { oddsApi, OddsApi, ERROR_MESSAGES, DEFAULT_SPORTS };
export * from './types';
export * from './errors';
export * from './constants';