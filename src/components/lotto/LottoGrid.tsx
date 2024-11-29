import React, { useState, useCallback } from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';

interface LottoGridProps {
  numbersToSelect: number;
  onSubmit: (selectedNumbers: number[]) => void;
}

export default function LottoGrid({ numbersToSelect, onSubmit }: LottoGridProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleNumberClick = useCallback((number: number) => {
    setError(null);
    
    setSelectedNumbers(prev => {
      // Si le numéro est déjà sélectionné, le retirer
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      }
      
      // Si on a déjà sélectionné le nombre maximum de numéros
      if (prev.length >= numbersToSelect) {
        setError(`Vous ne pouvez sélectionner que ${numbersToSelect} numéros`);
        return prev;
      }
      
      // Ajouter le nouveau numéro
      return [...prev, number];
    });
  }, [numbersToSelect]);

  const handleFlash = useCallback(() => {
    setError(null);
    const numbers = Array.from({ length: 49 }, (_, i) => i + 1);
    const flashNumbers: number[] = [];

    for (let i = 0; i < numbersToSelect; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      flashNumbers.push(...numbers.splice(randomIndex, 1));
    }

    setSelectedNumbers(flashNumbers);
  }, [numbersToSelect]);

  const handleValidate = useCallback(() => {
    try {
      if (selectedNumbers.length !== numbersToSelect) {
        throw new Error(`Veuillez sélectionner exactement ${numbersToSelect} numéros`);
      }

      // Vérifier que tous les numéros sont valides (entre 1 et 49)
      if (selectedNumbers.some(n => n < 1 || n > 49)) {
        throw new Error('Les numéros doivent être entre 1 et 49');
      }

      // Vérifier que les numéros sont uniques
      const uniqueNumbers = new Set(selectedNumbers);
      if (uniqueNumbers.size !== selectedNumbers.length) {
        throw new Error('Les numéros doivent être uniques');
      }

      onSubmit(selectedNumbers);
      setSelectedNumbers([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la validation');
    }
  }, [selectedNumbers, numbersToSelect, onSubmit]);

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Sélections actuelles */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Vos sélections</h3>
        <div className="flex flex-wrap gap-2">
          {selectedNumbers.length === 0 ? (
            <p className="text-gray-500">Aucun numéro sélectionné</p>
          ) : (
            selectedNumbers.map((num, index) => (
              <div key={`${num}-${index}`} className="relative">
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center z-10">
                  {index + 1}
                </span>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold">
                  {num}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Grille de sélection */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {Array.from({ length: 49 }, (_, i) => i + 1).map(number => {
          const isSelected = selectedNumbers.includes(number);
          const selectionIndex = selectedNumbers.indexOf(number);
          
          return (
            <button
              key={number}
              onClick={() => handleNumberClick(number)}
              className={`
                relative w-full aspect-square rounded-lg flex items-center justify-center text-lg font-medium
                transition-all transform hover:scale-105 active:scale-95
                ${isSelected 
                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }
              `}
            >
              {number}
              {isSelected && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                  {selectionIndex + 1}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={handleFlash}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          <Sparkles className="w-5 h-5" />
          Flash
        </button>
        
        <button
          onClick={handleValidate}
          disabled={selectedNumbers.length !== numbersToSelect}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all transform
            ${selectedNumbers.length === numbersToSelect
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Valider la grille
          {selectedNumbers.length > 0 && (
            <span className="ml-2">
              ({selectedNumbers.length}/{numbersToSelect})
            </span>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>Sélectionnez {numbersToSelect} numéros ou utilisez le bouton Flash pour une sélection aléatoire</p>
        <p className="mt-1">L'ordre de sélection est conservé et affiché sur chaque numéro</p>
      </div>
    </div>
  );
}