import React, { useEffect } from 'react';
import { X, Calculator, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface Bet {
  id: string;
  match: string;
  selection: string;
  odds: number;
  stake?: number;
}

interface BetSlipProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function BetSlip({ isOpen, onToggle }: BetSlipProps) {
  const [betType, setBetType] = React.useState<'simple' | 'combine'>('simple');
  const [stake, setStake] = React.useState<string>('');
  const [bets, setBets] = React.useState<Bet[]>([
    {
      id: '1',
      match: 'PSG vs Manchester City',
      selection: '1',
      odds: 2.45,
    },
    {
      id: '2',
      match: 'Real Madrid vs Liverpool',
      selection: 'X',
      odds: 3.20,
    }
  ]);

  useEffect(() => {
    const handleToggleBetslip = () => {
      onToggle();
    };

    window.addEventListener('toggle-betslip', handleToggleBetslip);
    return () => window.removeEventListener('toggle-betslip', handleToggleBetslip);
  }, [onToggle]);

  const totalOdds = bets.reduce((acc, bet) => acc * bet.odds, 1);
  const potentialWin = parseFloat(stake) * (betType === 'combine' ? totalOdds : 1);

  const handleRemoveBet = (id: string) => {
    setBets(bets.filter(bet => bet.id !== id));
  };

  const handleClearSlip = () => {
    setBets([]);
    setStake('');
  };

  const handleStakeChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setStake(value);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-4 bottom-20 md:bottom-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 md:block hidden"
      >
        <Calculator className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-[4rem] bottom-16 md:bottom-0 w-80 bg-white shadow-lg flex flex-col z-40">
      {/* Rest of the BetSlip component remains the same */}
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-bold">Panier de Paris</h2>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Bet Type Selector */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          <button
            onClick={() => setBetType('simple')}
            className={`flex-1 py-2 text-sm font-medium ${
              betType === 'simple'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Paris Simple
          </button>
          <button
            onClick={() => setBetType('combine')}
            className={`flex-1 py-2 text-sm font-medium ${
              betType === 'combine'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Paris Combiné
          </button>
        </div>
      </div>

      {/* Bets List */}
      <div className="flex-1 overflow-auto p-4">
        {bets.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Aucun pari sélectionné
          </div>
        ) : (
          <div className="space-y-4">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className="bg-gray-50 rounded-lg p-3 relative"
              >
                <button
                  onClick={() => handleRemoveBet(bet.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="text-sm font-medium mb-1">{bet.match}</div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {bet.selection === '1' ? 'Victoire 1' : 
                     bet.selection === '2' ? 'Victoire 2' : 'Match Nul'}
                  </span>
                  <span className="font-bold text-blue-600">{bet.odds}</span>
                </div>
                {betType === 'simple' && (
                  <input
                    type="text"
                    placeholder="Mise"
                    value={bet.stake || ''}
                    onChange={(e) => {
                      if (/^\d*\.?\d*$/.test(e.target.value)) {
                        const updatedBets = bets.map(b =>
                          b.id === bet.id ? { ...b, stake: parseFloat(e.target.value) } : b
                        );
                        setBets(updatedBets);
                      }
                    }}
                    className="mt-2 w-full px-3 py-1 rounded border border-gray-200 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {bets.length > 0 && (
        <div className="border-t border-gray-200 p-4">
          <div className="space-y-4">
            {betType === 'combine' && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Cote totale</span>
                  <span className="font-bold">{totalOdds.toFixed(2)}</span>
                </div>
                <input
                  type="text"
                  placeholder="Mise totale"
                  value={stake}
                  onChange={(e) => handleStakeChange(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-gray-200"
                />
              </>
            )}
            <div className="flex justify-between text-sm">
              <span>Gain potentiel</span>
              <span className="font-bold text-green-600">
                {formatCurrency(potentialWin)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClearSlip}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Vider</span>
              </button>
              <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Valider le pari
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}