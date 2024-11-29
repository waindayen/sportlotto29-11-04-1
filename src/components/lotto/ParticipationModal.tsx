import React, { useState } from 'react';
import { X, Ticket, AlertCircle } from 'lucide-react';
import { LottoEvent } from '../../services/lotto';
import LottoGrid from './LottoGrid';

interface ParticipationModalProps {
  lotto: LottoEvent;
  onClose: () => void;
  onSubmit: (numbers: number[]) => void;
}

export default function ParticipationModal({ lotto, onClose, onSubmit }: ParticipationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGridSubmit = async (selectedNumbers: number[]) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Vérifications supplémentaires
      if (selectedNumbers.length !== lotto.numbersToSelect) {
        throw new Error(`Veuillez sélectionner exactement ${lotto.numbersToSelect} numéros`);
      }

      // Vérifier que les numéros sont uniques
      const uniqueNumbers = new Set(selectedNumbers);
      if (uniqueNumbers.size !== selectedNumbers.length) {
        throw new Error('Les numéros doivent être uniques');
      }

      // Vérifier que les numéros sont dans la plage valide
      if (selectedNumbers.some(n => n < 1 || n > 49)) {
        throw new Error('Les numéros doivent être entre 1 et 49');
      }

      await onSubmit(selectedNumbers);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la validation');
      console.error('Error submitting numbers:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Ticket className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{lotto.eventName}</h2>
                <p className="text-sm text-gray-600">
                  Prix du ticket: {formatCurrency(lotto.ticketPrice, lotto.currency)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800">
              Sélectionnez {lotto.numbersToSelect} numéros différents entre 1 et 49 pour participer au tirage.
            </p>
          </div>

          <LottoGrid
            numbersToSelect={lotto.numbersToSelect}
            onSubmit={handleGridSubmit}
          />
        </div>
      </div>
    </div>
  );
}