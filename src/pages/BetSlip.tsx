import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useBetSlip } from '../contexts/BetSlipContext';
import { formatCurrency } from '../utils/format';

export default function BetSlip() {
  const navigate = useNavigate();
  const { bets, removeBet, clearBets, updateStake } = useBetSlip();
  const [betType, setBetType] = useState<'simple' | 'combine'>('simple');
  const [combinedStake, setCombinedStake] = useState<string>('');

  const totalOdds = bets.reduce((acc, bet) => acc * bet.odds, 1);
  const potentialWin = betType === 'combine' 
    ? parseFloat(combinedStake || '0') * totalOdds
    : bets.reduce((acc, bet) => acc + (bet.stake || 0) * bet.odds, 0);

  const handleStakeChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setCombinedStake(value);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            <h1 className="text-lg font-bold">Panier de Paris</h1>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-20">
        {/* Bet Type Selector */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
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
        {bets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Aucun pari sélectionné</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{bet.match}</h3>
                    <p className="text-sm text-gray-600">
                      {bet.selection === '1' ? 'Victoire 1' : 
                       bet.selection === '2' ? 'Victoire 2' : 'Match Nul'}
                    </p>
                  </div>
                  <button
                    onClick={() => removeBet(bet.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-600">Cote: {bet.odds}</span>
                  {betType === 'simple' && (
                    <input
                      type="text"
                      placeholder="Mise"
                      value={bet.stake || ''}
                      onChange={(e) => {
                        if (/^\d*\.?\d*$/.test(e.target.value)) {
                          updateStake(bet.id, parseFloat(e.target.value) || 0);
                        }
                      }}
                      className="w-32 px-3 py-1 rounded border border-gray-200 text-right"
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Combined Stake Input */}
            {betType === 'combine' && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium">Cote totale</span>
                  <span className="font-bold text-blue-600">{totalOdds.toFixed(2)}</span>
                </div>
                <input
                  type="text"
                  placeholder="Mise totale"
                  value={combinedStake}
                  onChange={(e) => handleStakeChange(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-gray-200"
                />
              </div>
            )}

            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Gain potentiel</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(potentialWin)}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clearBets}
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
    </div>
  );
}