import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Repeat, Grid, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BaseDashboard from './BaseDashboard';
import { LottoService } from '../../services/lotto';

const CURRENCIES = [
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'USD', label: 'Dollar ($)', symbol: '$' },
  { value: 'XOF', label: 'CFA', symbol: 'CFA' }
];

const FREQUENCIES = [
  { value: 'once', label: 'Une fois' },
  { value: 'daily', label: 'Chaque jour' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'yearly', label: 'Annuel' }
];

const NUMBERS_TO_SELECT = [3, 4, 5, 6];
const GRIDS_PER_TICKET = [1, 2, 3, 4, 5];

export default function SetupLotto() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    eventName: '',
    startDate: '',
    endDate: '',
    ticketPrice: '',
    currency: 'EUR',
    frequency: 'once',
    numbersToSelect: 6,
    gridsPerTicket: 1
  });

  const validateDates = () => {
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const now = new Date();

    if (startDate < now) {
      throw new Error("La date de début doit être dans le futur");
    }

    if (endDate <= startDate) {
      throw new Error("La date de fin doit être après la date de début");
    }

    // Validation supplémentaire selon la fréquence
    switch (formData.frequency) {
      case 'daily':
        if (startDate.getDate() !== endDate.getDate() ||
            startDate.getMonth() !== endDate.getMonth() ||
            startDate.getFullYear() !== endDate.getFullYear()) {
          throw new Error("Pour un événement quotidien, le début et la fin doivent être le même jour");
        }
        break;

      case 'weekly':
        const diffDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays !== 6) {
          throw new Error("Pour un événement hebdomadaire, la durée doit être exactement d'une semaine");
        }
        break;

      case 'yearly':
        const diffYears = endDate.getFullYear() - startDate.getFullYear();
        const sameDay = endDate.getDate() === startDate.getDate() - 1 &&
                       endDate.getMonth() === startDate.getMonth();
        if (diffYears !== 1 || !sameDay) {
          throw new Error("Pour un événement annuel, la durée doit être exactement d'une année");
        }
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      validateDates();

      const lottoData = {
        ...formData,
        ticketPrice: parseFloat(formData.ticketPrice),
        numbersToSelect: parseInt(formData.numbersToSelect.toString()),
        gridsPerTicket: parseInt(formData.gridsPerTicket.toString())
      };

      await LottoService.createLotto(lottoData);
      navigate('/dashboard/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getDateConstraints = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    const min = now.toISOString().slice(0, 16);

    return {
      startMin: min,
      startMax: null,
      endMin: formData.startDate || min
    };
  };

  const dateConstraints = getDateConstraints();

  return (
    <BaseDashboard title="Configuration du Lotto">
      <div className="max-w-2xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom de l'événement */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'événement
            </label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Super Lotto 2024"
              required
            />
          </div>

          {/* Fréquence */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4" />
                <span>Fréquence</span>
              </div>
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {FREQUENCIES.map(freq => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-sm text-gray-500">
              {formData.frequency === 'daily' && "L'événement se répétera chaque jour"}
              {formData.frequency === 'weekly' && "L'événement se répétera chaque semaine"}
              {formData.frequency === 'yearly' && "L'événement se répétera chaque année"}
              {formData.frequency === 'once' && "L'événement n'aura lieu qu'une seule fois"}
            </p>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Date de début</span>
                  </div>
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={dateConstraints.startMin}
                  max={dateConstraints.startMax}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Date de fin</span>
                  </div>
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={dateConstraints.endMin}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              La date de fin doit respecter la fréquence sélectionnée :
              {formData.frequency === 'daily' && " même jour que la date de début"}
              {formData.frequency === 'weekly' && " exactement une semaine après la date de début"}
              {formData.frequency === 'yearly' && " exactement un an après la date de début"}
              {formData.frequency === 'once' && " après la date de début"}
            </p>
          </div>

          {/* Prix et Devise */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Prix du ticket</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Devise
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {CURRENCIES.map(currency => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Configuration du jeu */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4" />
                    <span>Nombres à sélectionner</span>
                  </div>
                </label>
                <select
                  name="numbersToSelect"
                  value={formData.numbersToSelect}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {NUMBERS_TO_SELECT.map(num => (
                    <option key={num} value={num}>
                      {num} nombres
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4" />
                    <span>Grilles par ticket</span>
                  </div>
                </label>
                <select
                  name="gridsPerTicket"
                  value={formData.gridsPerTicket}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {GRIDS_PER_TICKET.map(num => (
                    <option key={num} value={num}>
                      {num} grille{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Création...' : 'Créer le lotto'}
            </button>
          </div>
        </form>
      </div>
    </BaseDashboard>
  );
}