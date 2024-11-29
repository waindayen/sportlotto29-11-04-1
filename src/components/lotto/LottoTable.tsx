import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Filter,
  Calendar,
  Clock,
  DollarSign
} from 'lucide-react';
import { LottoEvent } from '../../services/lotto';
import { formatCurrency } from '../../utils/format';
import { getStatusLabel } from '../../utils/lottoUtils';

interface LottoTableProps {
  lottos: LottoEvent[];
  onView: (lotto: LottoEvent) => void;
  onEdit: (lotto: LottoEvent) => void;
  onDelete: (lotto: LottoEvent) => void;
}

export default function LottoTable({ lottos, onView, onEdit, onDelete }: LottoTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof LottoEvent>('startDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const itemsPerPage = 10;

  const handleSort = (field: keyof LottoEvent) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedLottos = useMemo(() => {
    return lottos
      .filter(lotto => {
        const matchesSearch = lotto.eventName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || getStatusLabel(lotto).label.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortField === 'ticketPrice') {
          return sortDirection === 'asc' 
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField];
        }
        return sortDirection === 'asc'
          ? String(a[sortField]).localeCompare(String(b[sortField]))
          : String(b[sortField]).localeCompare(String(a[sortField]));
      });
  }, [lottos, searchTerm, sortField, sortDirection, statusFilter]);

  const paginatedLottos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedLottos.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedLottos, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedLottos.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const SortIcon = ({ field }: { field: keyof LottoEvent }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Filtres et recherche */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-64 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="en attente">En attente</option>
              <option value="en cours">En cours</option>
              <option value="terminé">Terminé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table pour desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => handleSort('eventName')}
              >
                <div className="flex items-center gap-1">
                  Événement
                  <SortIcon field="eventName" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => handleSort('startDate')}
              >
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Début
                  <SortIcon field="startDate" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => handleSort('endDate')}
              >
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Fin
                  <SortIcon field="endDate" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => handleSort('ticketPrice')}
              >
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Prix
                  <SortIcon field="ticketPrice" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedLottos.map((lotto) => {
              const status = getStatusLabel(lotto);
              return (
                <tr key={lotto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {lotto.eventName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(lotto.startDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(lotto.endDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(lotto.ticketPrice, lotto.currency)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${status.className}`}>
                      <status.icon className="w-4 h-4" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => onView(lotto)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onEdit(lotto)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(lotto)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards pour mobile */}
      <div className="md:hidden divide-y divide-gray-200">
        {paginatedLottos.map((lotto) => {
          const status = getStatusLabel(lotto);
          return (
            <div key={lotto.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{lotto.eventName}</h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${status.className}`}>
                  <status.icon className="w-4 h-4" />
                  {status.label}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Début: {formatDate(lotto.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Fin: {formatDate(lotto.endDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Prix: {formatCurrency(lotto.ticketPrice, lotto.currency)}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => onView(lotto)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onEdit(lotto)}
                  className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(lotto)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {((currentPage - 1) * itemsPerPage) + 1} à{' '}
              {Math.min(currentPage * itemsPerPage, filteredAndSortedLottos.length)} sur{' '}
              {filteredAndSortedLottos.length} résultats
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-700">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}