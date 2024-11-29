import React, { useEffect, useState } from 'react';
import { Calendar, Clock, DollarSign, Ticket, AlertCircle, LogIn } from 'lucide-react';
import { LottoService, LottoEvent } from '../services/lotto';
import { useAuth } from '../contexts/AuthContext';
import LoadingState from '../components/LoadingState';
import ParticipationModal from '../components/lotto/ParticipationModal';
import { Link } from 'react-router-dom';
import { getStatusLabel, handleParticipationClick } from '../utils/lottoUtils';

export default function Lotto() {
  const { currentUser } = useAuth();
  const [lottos, setLottos] = useState<LottoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLotto, setSelectedLotto] = useState<LottoEvent | null>(null);
  const [participationError, setParticipationError] = useState<string | null>(null);

  useEffect(() => {
    fetchLottos();
  }, []);

  const fetchLottos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await LottoService.getAllLottos();
      setLottos(data);
    } catch (err) {
      setError('Erreur lors du chargement des lottos');
      console.error('Error fetching lottos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = async (selectedNumbers: number[]) => {
    if (!currentUser || !selectedLotto) {
      setParticipationError("Vous devez être connecté pour participer");
      return;
    }

    try {
      await LottoService.participate({
        lottoId: selectedLotto.id!,
        userId: currentUser.uid,
        selectedNumbers,
        ticketPrice: selectedLotto.ticketPrice,
        currency: selectedLotto.currency
      });
      
      setSelectedLotto(null);
      setParticipationError(null);
    } catch (err) {
      setParticipationError(err instanceof Error ? err.message : 'Erreur lors de la participation');
    }
  };

  const handleLottoClick = (lotto: LottoEvent) => {
    try {
      if (!currentUser) {
        setParticipationError("Vous devez être connecté pour participer");
        return;
      }

      if (handleParticipationClick(lotto)) {
        setSelectedLotto(lotto);
        setParticipationError(null);
      }
    } catch (err) {
      setParticipationError(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4">
        <LoadingState message="Chargement des lottos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lotto</h1>
          {participationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-600">{participationError}</p>
            </div>
          )}
        </div>

        {!currentUser && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <LogIn className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Connectez-vous pour participer</h3>
                  <p className="text-blue-700">Créez un compte ou connectez-vous pour participer aux tirages</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Inscription
                </Link>
              </div>
            </div>
          </div>
        )}

        {lottos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Aucun lotto disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lottos.map((lotto) => {
              const status = getStatusLabel(lotto);
              const StatusIcon = status.icon;
              
              return (
                <div key={lotto.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">{lotto.eventName}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.className} flex items-center gap-1`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Début: {formatDate(lotto.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Fin: {formatDate(lotto.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>Prix: {formatCurrency(lotto.ticketPrice, lotto.currency)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {lotto.gridsPerTicket} grille{lotto.gridsPerTicket > 1 ? 's' : ''} par ticket
                      </div>
                    </div>

                    <button 
                      onClick={() => handleLottoClick(lotto)}
                      className={`mt-6 w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2
                        ${status.label === 'En cours'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      <Ticket className="w-5 h-5" />
                      {status.label === 'En cours' ? 'Participer' : 'Voir les détails'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedLotto && (
          <ParticipationModal
            lotto={selectedLotto}
            onClose={() => setSelectedLotto(null)}
            onSubmit={handleParticipate}
          />
        )}
      </div>
    </div>
  );
}