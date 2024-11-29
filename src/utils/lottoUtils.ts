import { LottoEvent } from '../services/lotto';
import { Timer, Play, CheckCircle } from 'lucide-react';

export const getStatusLabel = (lotto: LottoEvent) => {
  const now = new Date();
  const startDate = new Date(lotto.startDate);
  const endDate = new Date(lotto.endDate);

  if (now < startDate) {
    return {
      label: 'En attente',
      className: 'bg-yellow-100 text-yellow-800',
      icon: Timer
    };
  }

  if (now >= startDate && now < endDate) {
    return {
      label: 'En cours',
      className: 'bg-green-100 text-green-800',
      icon: Play
    };
  }

  return {
    label: 'Terminé',
    className: 'bg-gray-100 text-gray-800',
    icon: CheckCircle
  };
};

export const canParticipate = (lotto: LottoEvent): boolean => {
  const now = new Date();
  const startDate = new Date(lotto.startDate);
  const endDate = new Date(lotto.endDate);

  return now >= startDate && now < endDate;
};

export const validateParticipation = (lotto: LottoEvent): string | null => {
  const now = new Date();
  const startDate = new Date(lotto.startDate);
  const endDate = new Date(lotto.endDate);

  if (now < startDate) {
    return "Ce lotto n'a pas encore commencé";
  }

  if (now >= endDate) {
    return "Ce lotto est terminé";
  }

  return null;
};

export const handleParticipationClick = (lotto: LottoEvent): boolean => {
  const now = new Date();
  const startDate = new Date(lotto.startDate);
  const endDate = new Date(lotto.endDate);

  if (now < startDate) {
    throw new Error("Ce lotto n'a pas encore commencé");
  }

  if (now >= endDate) {
    throw new Error("Ce lotto est terminé");
  }

  return true;
};