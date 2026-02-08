'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, TrendingUp, PieChart, Loader2, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { financeApi } from '@/lib/api/finance';

export default function RelatoriosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dre' | 'cashflow' | 'balance'>('dre');
  const [dreData, setDreData] = useState<any>(null);
  const [cashflowData, setCashflowData] = useState<any>(null);
  const [balanceData, setBalanceData] = useState<any>(null);
  
  const [period, setPeriod] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'dre') {
        const data = await financeApi.getDRE(period.startDate, period.endDate);
        setDreData(data);
      } else if (activeTab === 'cashflow') {
        const data = await financeApi.getCashflow(new Date().getFullYear(), 6);
        setCashflowData(data);
      } else if (activeTab === 'balance') {
        const data = await financeApi.getBalance(period.endDate);
        setBalanceData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Relatórios Financeiros</h1>
                <p className="text-gray-600 text-sm mt-1">
                  DRE, Fluxo de Caixa e Balanço Patrimonial
                </p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition shadow-lg"
            >
              <Download className="w-5 h-5" />
              Imprimir
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('dre')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition ${
                activeTab === 'dre'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tl-2xl'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-5 h-5" />
              DRE
            </button>

            <button
              onClick={() => setActiveTab('cashflow')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition ${
                activeTab === 'cashflow'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Fluxo de Caixa
            </button>

            <button
              onClick={() => setActiveTab('balance')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition ${
                activeTab === 'balance'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tr-2xl'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <PieChart className="w-5 h-5" />
              Balanço
            </button>
          </div>

          {/* Seletor de Período (só para DRE e Balanço) */}
          {(activeTab === 'dre' || activeTab === 'balance') && (
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
                  <input
                    type="date"
                    value={period.startDate}
                    onChange={(e) => setPeriod({ ...period, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
                  <input
                    type="date"
                    value={period.endDate}
                    onChange={(e) => setPeriod({ ...period, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <button
                onClick={loadData}
                className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                Atualizar Relatório
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto" />
          </div>
        ) : (
          <>
            {/* DRE */}
            {activeTab === 'dre' && dreData && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Demonstrativo de Resultados do Exercício (DRE)
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Período: {new Date(dreData.period.start).toLocaleDateString('pt-BR')} até {new Date(dreData.period.end).toLocaleDateString('pt-BR')}
                </p>

                <div className="space-y-6">
                  {/* Receitas */}
                  <div>
                    <h3 className="text-lg font-bold text-green-700 mb-3 pb-2 border-b-2 border-green-200">
                      (+) RECEITAS
                    </h3>
                    <div className="space-y-2 pl-4">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Serviços</span>
                        <span className="font-semibold text-green-600">
                          R$ {dreData.dre.revenue.services.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Produtos</span>
                        <span className="font-semibold text-green-600">
                          R$ {dreData.dre.revenue.products.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Outros</span>
                        <span className="font-semibold text-green-600">
                          R$ {dreData.dre.revenue.others.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-bold text-gray-900">TOTAL DE RECEITAS</span>
                        <span className="font-bold text-green-700 text-lg">
                          R$ {dreData.dre.revenue.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Despesas */}
                  <div>
                    <h3 className="text-lg font-bold text-red-700 mb-3 pb-2 border-b-2 border-red-200">
                      (-) DESPESAS OPERACIONAIS
                    </h3>
                    <div className="space-y-2 pl-4">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Salários</span>
                        <span className="font-semibold text-red-600">
                          R$ {dreData.dre.expenses.salaries.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Comissões</span>
                        <span className="font-semibold text-red-600">
                          R$ {dreData.dre.expenses.commissions.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Aluguel</span>
                        <span className="font-semibold text-red-600">
                          R$ {dreData.dre.expenses.rent.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Contas (água, luz, etc)</span>
                        <span className="font-semibold text-red-600">
                          R$ {dreData.dre.expenses.utilities.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Materiais</span>
                        <span className="font-semibold text-red-600">
                          R$ {dreData.dre.expenses.supplies.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Outros</span>
                        <span className="font-semibold text-red-600">
                          R$ {dreData.dre.expenses.others.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-bold text-gray-900">TOTAL DE DESPESAS</span>
                        <span className="font-bold text-red-700 text-lg">
                          R$ {dreData.dre.expenses.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Resultados */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-300">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">LUCRO OPERACIONAL</span>
                        <span className={`font-bold text-xl ${
                          dreData.dre.results.operatingProfit >= 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                          R$ {dreData.dre.results.operatingProfit.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-3 border-t-2 border-purple-300">
                        <span className="font-bold text-gray-900 text-lg">LUCRO LÍQUIDO</span>
                        <span className={`font-bold text-2xl ${
                          dreData.dre.results.netProfit >= 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                          R$ {dreData.dre.results.netProfit.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-700">Margem de Lucro</span>
                        <span className="text-sm font-semibold text-purple-700">
                          {dreData.dre.results.profitMargin}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fluxo de Caixa */}
            {activeTab === 'cashflow' && cashflowData && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Fluxo de Caixa - Últimos 6 Meses
                </h2>

                <div className="space-y-4 mb-8">
                  {cashflowData.cashflow.map((month: any, index: number) => {
                    const maxValue = Math.max(...cashflowData.cashflow.map((m: any) => Math.max(m.revenue, m.expenses)));
                    const revenueWidth = (month.revenue / maxValue) * 100;
                    const expenseWidth = (month.expenses / maxValue) * 100;

                    return (
                      <div key={index} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-bold text-gray-900">{month.month}</span>
                          <span className={`font-bold ${month.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {month.netFlow >= 0 ? '+' : ''}R$ {month.netFlow.toFixed(2)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Receitas</p>
                            <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-end px-2"
                                style={{ width: `${revenueWidth}%` }}
                              >
                                <span className="text-xs font-bold text-white">
                                  R$ {month.revenue.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-gray-600 mb-1">Despesas</p>
                            <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-end px-2"
                                style={{ width: `${expenseWidth}%` }}
                              >
                                <span className="text-xs font-bold text-white">
                                  R$ {month.expenses.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Resumo */}
                <div className="grid grid-cols-2 gap-4 bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Receita Média Mensal</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {cashflowData.summary.averageMonthlyRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Despesa Média Mensal</p>
                    <p className="text-2xl font-bold text-red-600">
                      R$ {cashflowData.summary.averageMonthlyExpenses.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Balanço Patrimonial */}
            {activeTab === 'balance' && balanceData && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Balanço Patrimonial Simplificado
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                  Data de Referência: {new Date(balanceData.referenceDate).toLocaleDateString('pt-BR')}
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Ativos */}
                  <div>
                    <h3 className="text-lg font-bold text-blue-700 mb-4 pb-2 border-b-2 border-blue-200">
                      ATIVO
                    </h3>
                    <div className="space-y-3 pl-4">
                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Ativo Circulante</p>
                        <div className="pl-4 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Caixa</span>
                            <span className="font-semibold">
                              R$ {balanceData.balance.assets.current.cash.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between pt-3 border-t-2 border-blue-200">
                        <span className="font-bold text-gray-900 text-lg">TOTAL DO ATIVO</span>
                        <span className="font-bold text-blue-700 text-lg">
                          R$ {balanceData.balance.assets.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Passivos + PL */}
                  <div>
                    <h3 className="text-lg font-bold text-orange-700 mb-4 pb-2 border-b-2 border-orange-200">
                      PASSIVO + PATRIMÔNIO LÍQUIDO
                    </h3>
                    <div className="space-y-3 pl-4">
                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Passivo Circulante</p>
                        <div className="pl-4 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Comissões a Pagar</span>
                            <span className="font-semibold text-red-600">
                              R$ {balanceData.balance.liabilities.current.commissionsPayable.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-700">Total do Passivo</span>
                        <span className="font-semibold text-orange-700">
                          R$ {balanceData.balance.liabilities.total.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between pt-3 border-t-2 border-gray-300">
                        <span className="font-bold text-gray-900">Patrimônio Líquido</span>
                        <span className={`font-bold ${
                          balanceData.balance.equity.total >= 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                          R$ {balanceData.balance.equity.total.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between pt-3 border-t-2 border-orange-200">
                        <span className="font-bold text-gray-900 text-lg">TOTAL</span>
                        <span className="font-bold text-orange-700 text-lg">
                          R$ {(balanceData.balance.liabilities.total + balanceData.balance.equity.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verificação */}
                <div className={`mt-6 p-4 rounded-xl ${
                  balanceData.verification.balanced 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`text-sm font-semibold ${
                    balanceData.verification.balanced ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {balanceData.verification.balanced 
                      ? '✅ Balanço está balanceado (Ativo = Passivo + PL)'
                      : `⚠️ Diferença: R$ ${Math.abs(balanceData.verification.difference).toFixed(2)}`
                    }
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}