import React, { createContext, useContext, useState } from 'react';

interface Bet {
  id: string;
  match: string;
  selection: string;
  odds: number;
  stake?: number;
}

interface BetSlipContextType {
  bets: Bet[];
  addBet: (bet: Bet) => void;
  removeBet: (id: string) => void;
  clearBets: () => void;
  updateStake: (id: string, stake: number) => void;
}

const BetSlipContext = createContext<BetSlipContextType | undefined>(undefined);

export function BetSlipProvider({ children }: { children: React.ReactNode }) {
  const [bets, setBets] = useState<Bet[]>([]);

  const addBet = (bet: Bet) => {
    setBets(prev => {
      if (!prev.find(b => b.id === bet.id)) {
        return [...prev, bet];
      }
      return prev;
    });
  };

  const removeBet = (id: string) => {
    setBets(prev => prev.filter(bet => bet.id !== id));
  };

  const clearBets = () => {
    setBets([]);
  };

  const updateStake = (id: string, stake: number) => {
    setBets(prev => prev.map(bet => 
      bet.id === id ? { ...bet, stake } : bet
    ));
  };

  return (
    <BetSlipContext.Provider value={{ bets, addBet, removeBet, clearBets, updateStake }}>
      {children}
    </BetSlipContext.Provider>
  );
}

export function useBetSlip() {
  const context = useContext(BetSlipContext);
  if (context === undefined) {
    throw new Error('useBetSlip must be used within a BetSlipProvider');
  }
  return context;
}