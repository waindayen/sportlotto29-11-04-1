export class OddsApiError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'OddsApiError';
  }
}

export const ERROR_MESSAGES = {
  API_KEY_REQUIRED: 'Clé API non configurée. Veuillez configurer votre clé API.',
  API_KEY_INVALID: 'Clé API invalide. Veuillez vérifier votre clé API.',
  API_RATE_LIMIT: 'Limite d\'API atteinte. Veuillez réessayer plus tard.',
  API_CONNECTION_ERROR: 'Erreur de connexion à l\'API. Veuillez vérifier votre connexion.',
  SPORT_DISABLED: 'Ce sport est actuellement désactivé.',
  RESOURCE_NOT_FOUND: 'La ressource demandée n\'est pas disponible.',
  INITIALIZATION_ERROR: 'Erreur lors de l\'initialisation de l\'API.'
};