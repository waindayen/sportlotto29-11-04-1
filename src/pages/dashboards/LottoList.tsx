import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LottoService, LottoEvent } from '../../services/lotto';
import BaseDashboard from './BaseDashboard';
import LottoTable from '../../components/lotto/LottoTable';
import LoadingState from '../../components/LoadingState';
import { AlertCircle } from 'lucide-react';

export default function LottoList() {
  const navigate = useNavigate();
  const [lottos, setLottos] = useState<LottoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleView = (lotto: LottoEvent) => {
    // Implémenter la vue détaillée
    console.log('View lotto:', lotto);
  };

  const handleEdit = (lotto: LottoEvent) => {
    navigate(`/dashboard/admin/setup-lotto/${lotto.id}`);
  };

  const handleDelete = async (lotto: LottoEvent) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    try {
      await LottoService.deleteLotto(lotto.id!);
      await fetchLottos();
    } catch (err) {
      console.error('Error deleting lotto:', err);
      setError('Erreur lors de la suppression du lotto');
    }
  };

  if (loading) {
    return (
      <BaseDashboard title="Liste des Lottos">
        <LoadingState message="Chargement des lottos..." />
      </BaseDashboard>
    );
  }

  return (
    <BaseDashboard title="Liste des Lottos">
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <LottoTable
        lottos={lottos}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </BaseDashboard>
  );
}