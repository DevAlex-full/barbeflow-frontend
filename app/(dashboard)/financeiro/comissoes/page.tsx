'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, Calculator, CheckCircle, Loader2, Calendar, Settings, Edit2, Save, X, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { commissionsApi } from '@/lib/api/commissions';
import api from '@/lib/api';

interface BarberConfig {
  id: string;
  name: string;
  role: string;
  commissionPercentage: number;
}

export default function ComissoesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingBarbers, setLoadingBarbers] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [barbers, setBarbers] = useState<BarberConfig[]>([]);
  const [editingBarber, setEditingBarber] = useState<string | null>(null);
  const [tempPercentage, setTempPercentage] = useState<number>(40);
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    loadBarbers();
    loadReport();
  }, [selectedMonth, selectedYear]);

  const loadBarbers = async () => {
    try {
      setLoadingBarbers(true);
      const response = await api.get('/users');
      
      // ✅ REMOVIDO FILTRO - MOSTRA TODOS USUÁRIOS
      const barbersList = response.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        role: user.role,
        commissionPercentage: user.commissionPercentage || 40
      }));
      
      console.log('✅ Usuários carregados:', barbersList);
      setBarbers(barbersList);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoadingBarbers(false);
    }
  };

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await commissionsApi.getReport(selectedMonth, selectedYear);
      setReport(data);
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    if (!confirm(`Calcular comissões para ${selectedMonth}/${selectedYear}?`)) return;

    try {
      setCalculating(true);
      await commissionsApi.calculate({ month: selectedMonth, year: selectedYear });
      loadReport();
      alert('Comissões calculadas com sucesso!');
    } catch (error) {
      console.error('Erro ao calcular:', error);
      alert('Erro ao calcular comissões');
    } finally {
      setCalculating(false);
    }
  };

  const handlePay = async (id: string, barberName: string) => {
    if (!confirm(`Confirmar pagamento da comissão de ${barberName}?`)) return;

    try {
      await commissionsApi.pay(id);
      loadReport();
      alert('Comissão paga com sucesso!');
    } catch (error) {
      console.error('Erro ao pagar:', error);
      alert('Erro ao pagar comissão');
    }
  };

  const handleEditPercentage = (barberId: string, currentPercentage: number) => {
    setEditingBarber(barberId);
    setTempPercentage(currentPercentage);
  };

  const handleCancelEdit = () => {
    setEditingBarber(null);
    setTempPercentage(40);
  };

  const handleSavePercentage = async (barberId: string) => {
    try {
      if (tempPercentage < 0 || tempPercentage > 100) {
        alert('O percentual deve estar entre 0 e 100');
        return;
      }

      await api.put(`/users/${barberId}`, {
        commissionPercentage: tempPercentage
      });
      
      setBarbers(barbers.map(b => 
        b.id === barberId ? { ...b, commissionPercentage: tempPercentage } : b
      ));
      setEditingBarber(null);
      alert('Percentual atualizado com sucesso!');
      loadBarbers(); // Recarregar para garantir
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar percentual');
    }
  };

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);

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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Comissões</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Gestão de comissões dos barbeiros
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {/* ✅ BOTÃO GRANDE E CHAMATIVO */}
              <button
                onClick={() => setShowConfigModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
              >
                <Settings className="w-5 h-5" />
                Configurar Percentuais
              </button>

              <button
                onClick={handleCalculate}
                disabled={calculating}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg disabled:opacity-50"
              >
                {calculating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    Calcular Comissões
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Seletor de Período */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Período</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mês</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ano</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 text-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
          </div>
        ) : !report || report.commissions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 text-center">
            <Calculator className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Nenhuma comissão calculada
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Clique em "Calcular Comissões" para gerar as comissões de {months[selectedMonth - 1]}/{selectedYear}
            </p>
          </div>
        ) : (
          <>
            {/* Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Comissões</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{report.summary.total}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pendentes</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{report.summary.pending}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  R$ {report.summary.totalPending.toFixed(2)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pagas</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{report.summary.paid}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  R$ {report.summary.totalPaid.toFixed(2)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Geral</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  R$ {report.summary.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Lista de Comissões */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Comissões dos Barbeiros</h3>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {report.commissions.map((commission: any) => (
                  <div key={commission.id} className="p-6 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          commission.status === 'paid' 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                            : 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        }`}>
                          <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-lg">
                            {commission.barber?.name || 'Barbeiro'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {commission.percentage}% de comissão
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            R$ {Number(commission.amount).toFixed(2)}
                          </p>
                          {commission.status === 'paid' && commission.paidAt && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Pago em {new Date(commission.paidAt).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                        </div>

                        {commission.status === 'pending' && (
                          <button
                            onClick={() => handlePay(commission.id, commission.barber?.name)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Pagar
                          </button>
                        )}

                        {commission.status === 'paid' && (
                          <span className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg font-semibold">
                            ✅ Paga
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ✅ MODAL DE CONFIGURAÇÃO */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                <Users className="w-6 h-6" />
                <div>
                  <h2 className="text-2xl font-bold">Configurar Percentuais de Comissão</h2>
                  <p className="text-sm text-purple-100 mt-1">Defina o percentual de cada barbeiro/funcionário</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6">
              {loadingBarbers ? (
                <div className="py-12 text-center">
                  <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Carregando usuários...</p>
                </div>
              ) : barbers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum usuário encontrado</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {barbers.map((barber) => (
                    <div key={barber.id} className="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-5 hover:border-purple-300 dark:hover:border-purple-500 transition">
                      <div className="flex items-center gap-2 mb-3">
                        <p className="font-bold text-gray-900 dark:text-white text-lg flex-1">{barber.name}</p>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs font-semibold rounded">
                          {barber.role === 'admin' ? 'Admin' : 'Barbeiro'}
                        </span>
                      </div>
                      
                      {editingBarber === barber.id ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              value={tempPercentage}
                              onChange={(e) => setTempPercentage(Number(e.target.value))}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold focus:ring-2 focus:ring-purple-500"
                              autoFocus
                            />
                            <span className="text-gray-600 dark:text-gray-400 font-bold text-lg">%</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSavePercentage(barber.id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                            >
                              <Save className="w-4 h-4" />
                              Salvar
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition font-semibold"
                            >
                              <X className="w-4 h-4" />
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                            {barber.commissionPercentage}%
                          </span>
                          <button
                            onClick={() => handleEditPercentage(barber.id, barber.commissionPercentage)}
                            className="p-2.5 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition"
                            title="Editar percentual"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <button
                onClick={() => setShowConfigModal(false)}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}