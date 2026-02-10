'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Download, ArrowUpRight, ArrowDownRight, Edit2, Trash2, Filter, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { transactionsApi } from '@/lib/api/transactions';
import { AddTransactionModal } from '@/components/financeiro/AddTransactionModal';

export default function TransacoesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    type: '' as '' | 'income' | 'expense',
    category: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      
      const data = await transactionsApi.list(params);
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    loadTransactions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta transação?')) return;

    try {
      await transactionsApi.delete(id);
      loadTransactions();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir transação');
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      service: '✂️ Serviço',
      product: '🛍️ Produto',
      salary: '💼 Salário',
      commission: '💰 Comissão',
      rent: '🏢 Aluguel',
      utilities: '💡 Contas',
      supplies: '📦 Materiais',
      other: '📌 Outro'
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-900 dark:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transações</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Histórico completo de receitas e despesas
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nova Transação
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value as '' | 'income' | 'expense' })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Todos</option>
                <option value="income">Receitas</option>
                <option value="expense">Despesas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Todas</option>
                <option value="service">Serviço</option>
                <option value="product">Produto</option>
                <option value="salary">Salário</option>
                <option value="commission">Comissão</option>
                <option value="rent">Aluguel</option>
                <option value="utilities">Contas</option>
                <option value="supplies">Materiais</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Início</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Fim</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            onClick={handleFilter}
            className="mt-4 w-full md:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Aplicar Filtros
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">Nenhuma transação encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Data</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Descrição</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Categoria</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Pagamento</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Valor</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-purple-50 dark:hover:bg-purple-900/10 transition">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {transaction.type === 'income' ? (
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {transaction.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {getCategoryLabel(transaction.category)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {transaction.paymentMethod || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-sm font-bold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}R$ {Number(transaction.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AddTransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadTransactions}
      />
    </div>
  );
}