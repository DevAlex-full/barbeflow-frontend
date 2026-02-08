'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Target, Plus, Loader2, TrendingUp, Calendar, RefreshCw, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { goalsApi } from '@/lib/api/goals';

export default function MetasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const data = await goalsApi.getProgress();
      setProgress(data);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await goalsApi.create({
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        startDate: formData.startDate,
        endDate: formData.endDate
      });

      setFormData({ name: '', targetAmount: '', startDate: '', endDate: '' });
      setShowModal(false);
      loadProgress();
      alert('Meta criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      alert('Erro ao criar meta');
    }
  };

  const handleSync = async (id: string) => {
    try {
      await goalsApi.sync(id);
      loadProgress();
      alert('Progresso sincronizado com receitas reais!');
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      alert('Erro ao sincronizar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta meta?')) return;

    try {
      await goalsApi.delete(id);
      loadProgress();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir meta');
    }
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Metas Financeiras</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Acompanhe seus objetivos de receita
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nova Meta
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
          </div>
        ) : !progress || progress.goals.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 text-center">
            <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Nenhuma meta cadastrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Comece criando sua primeira meta financeira
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              Criar Primeira Meta
            </button>
          </div>
        ) : (
          <>
            {/* Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
                <p className="text-sm opacity-90 mb-1">Total de Metas</p>
                <p className="text-4xl font-bold">{progress.summary.total}</p>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
                <p className="text-sm opacity-90 mb-1">Atingidas</p>
                <p className="text-4xl font-bold">{progress.summary.completed}</p>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl shadow-lg p-6 text-white">
                <p className="text-sm opacity-90 mb-1">Em Andamento</p>
                <p className="text-4xl font-bold">{progress.summary.active}</p>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
                <p className="text-sm opacity-90 mb-1">Expiradas</p>
                <p className="text-4xl font-bold">{progress.summary.expired}</p>
              </div>
            </div>

            {/* Lista de Metas */}
            <div className="space-y-4">
              {progress.goals.map((goal: any) => {
                const percentage = parseFloat(goal.percentage);
                const isCompleted = goal.status === 'completed';
                const isExpired = goal.status === 'expired';

                return (
                  <div
                    key={goal.id}
                    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 p-6 ${
                      isCompleted ? 'border-green-300 dark:border-green-700' : isExpired ? 'border-red-300 dark:border-red-700' : 'border-gray-100 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{goal.name}</h3>
                          {isCompleted && (
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                              ✅ ATINGIDA
                            </span>
                          )}
                          {isExpired && (
                            <span className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">
                              ⏰ EXPIRADA
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(goal.startDate).toLocaleDateString('pt-BR')} até {new Date(goal.endDate).toLocaleDateString('pt-BR')}
                        </p>
                        {goal.daysRemaining >= 0 && !isCompleted && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            📅 {goal.daysRemaining} dias restantes
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSync(goal.id)}
                          className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition"
                          title="Sincronizar com receitas"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          title="Excluir meta"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Progresso */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          R$ {Number(goal.currentAmount).toFixed(2)} / R$ {Number(goal.targetAmount).toFixed(2)}
                        </span>
                        <span className={`font-bold ${
                          percentage >= 100 ? 'text-green-600 dark:text-green-400' : percentage >= 75 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
                        }`}>
                          {percentage.toFixed(1)}%
                        </span>
                      </div>

                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            percentage >= 100 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                              : percentage >= 75 
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                : 'bg-gradient-to-r from-orange-500 to-yellow-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>

                      {goal.remaining > 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Faltam <strong>R$ {goal.remaining.toFixed(2)}</strong> para atingir a meta
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Modal de Nova Meta */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nova Meta</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-500 dark:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome da Meta</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Receita de Janeiro"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor Alvo (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="0,00"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Início</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Fim</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                >
                  Criar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}