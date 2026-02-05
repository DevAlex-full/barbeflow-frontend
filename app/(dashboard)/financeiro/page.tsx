'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { transactionsApi, TransactionSummary } from '@/lib/api/transactions';
import { financeApi, CashflowResponse } from '@/lib/api/finance';
import { AddTransactionModal } from '@/components/financeiro/AddTransactionModal';

export default function FinanceiroPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [cashflow, setCashflow] = useState<CashflowResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadFinancialData();
  }, [selectedPeriod]);

  async function loadFinancialData() {
    try {
      setLoading(true);

      // Calcular datas do período
      const now = new Date();
      let startDate: string;
      let endDate: string;

      if (selectedPeriod === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
      } else {
        startDate = new Date(now.getFullYear(), 0, 1).toISOString();
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59).toISOString();
      }

      const [summaryData, cashflowData] = await Promise.all([
        transactionsApi.getSummary(startDate, endDate),
        financeApi.getCashflow(now.getFullYear(), 6)
      ]);

      setSummary(summaryData);
      setCashflow(cashflowData);
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleTransactionSuccess() {
    loadFinancialData(); // Recarregar dados após criar transação
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-sm text-gray-600">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  const stats = summary?.summary;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
            <p className="text-gray-600 mt-1">Gestão completa das suas finanças</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Seletor de Período */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setSelectedPeriod('month')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  selectedPeriod === 'month'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mês
              </button>
              <button
                onClick={() => setSelectedPeriod('year')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  selectedPeriod === 'year'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Ano
              </button>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Nova Transação</span>
            </button>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Saldo Atual */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Wallet className="w-6 h-6" />
              </div>
              <Calendar className="w-5 h-5 opacity-70" />
            </div>
            <p className="text-sm font-medium opacity-90">Saldo Atual</p>
            <p className="text-3xl font-bold mt-2">
              R$ {(stats?.currentBalance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs opacity-75 mt-2">
              {selectedPeriod === 'month' ? 'Este mês' : 'Este ano'}
            </p>
          </div>

          {/* Receitas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 font-medium">Receitas</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              R$ {(stats?.totalRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {summary?.transactions.income || 0} transações
            </p>
          </div>

          {/* Despesas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <ArrowDownRight className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-sm text-gray-600 font-medium">Despesas</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              R$ {(stats?.totalExpenses || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {summary?.transactions.expense || 0} transações
            </p>
          </div>

          {/* Lucro Líquido */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className={`text-sm font-semibold px-2 py-1 rounded ${
                (stats?.netProfit || 0) >= 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {stats?.profitMargin}%
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">Lucro Líquido</p>
            <p className={`text-3xl font-bold mt-2 ${
              (stats?.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              R$ {(stats?.netProfit || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Margem de lucro
            </p>
          </div>
        </div>

        {/* Gráfico de Fluxo de Caixa */}
        {cashflow && cashflow.cashflow.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Fluxo de Caixa</h2>
            <div className="space-y-3">
              {cashflow.cashflow.map((month) => (
                <div key={`${month.year}-${month.monthNumber}`} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-600 font-medium">
                    {month.month}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                        <div className="flex h-full">
                          <div 
                            className="bg-green-500 flex items-center justify-end px-2"
                            style={{ 
                              width: `${Math.max((month.revenue / (month.revenue + month.expenses)) * 100, 5)}%` 
                            }}
                          >
                            <span className="text-xs text-white font-medium">
                              R$ {month.revenue.toLocaleString('pt-BR')}
                            </span>
                          </div>
                          <div 
                            className="bg-red-500 flex items-center px-2"
                            style={{ 
                              width: `${Math.max((month.expenses / (month.revenue + month.expenses)) * 100, 5)}%` 
                            }}
                          >
                            <span className="text-xs text-white font-medium">
                              R$ {month.expenses.toLocaleString('pt-BR')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span className={month.netFlow >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                        {month.netFlow >= 0 ? '+' : ''}R$ {month.netFlow.toLocaleString('pt-BR')}
                      </span>
                      <span>•</span>
                      <span>{month.transactionCount} transações</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Breakdown por Categoria */}
        {summary && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Receitas por Categoria */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Receitas por Categoria</h3>
              <div className="space-y-3">
                {Object.entries(summary.breakdown.revenueByCategory).length > 0 ? (
                  Object.entries(summary.breakdown.revenueByCategory).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{category}</span>
                      <span className="text-sm font-semibold text-green-600">
                        R$ {Number(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Nenhuma receita registrada</p>
                )}
              </div>
            </div>

            {/* Despesas por Categoria */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Despesas por Categoria</h3>
              <div className="space-y-3">
                {Object.entries(summary.breakdown.expensesByCategory).length > 0 ? (
                  Object.entries(summary.breakdown.expensesByCategory).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{category}</span>
                      <span className="text-sm font-semibold text-red-600">
                        R$ {Number(amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Nenhuma despesa registrada</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Ações Rápidas - COM NAVEGAÇÃO */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => router.push('/financeiro/transacoes')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-purple-300 transition text-left"
          >
            <div className="text-purple-600 mb-2">📊</div>
            <p className="font-semibold text-gray-900">Transações</p>
            <p className="text-xs text-gray-500 mt-1">Ver todas</p>
          </button>

          <button 
            onClick={() => router.push('/financeiro/comissoes')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-purple-300 transition text-left"
          >
            <div className="text-blue-600 mb-2">💰</div>
            <p className="font-semibold text-gray-900">Comissões</p>
            <p className="text-xs text-gray-500 mt-1">Gerenciar</p>
          </button>

          <button 
            onClick={() => router.push('/financeiro/metas')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-purple-300 transition text-left"
          >
            <div className="text-green-600 mb-2">🎯</div>
            <p className="font-semibold text-gray-900">Metas</p>
            <p className="text-xs text-gray-500 mt-1">Acompanhar</p>
          </button>

          <button 
            onClick={() => router.push('/financeiro/relatorios')}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-purple-300 transition text-left"
          >
            <div className="text-orange-600 mb-2">📈</div>
            <p className="font-semibold text-gray-900">Relatórios</p>
            <p className="text-xs text-gray-500 mt-1">Visualizar</p>
          </button>
        </div>
      </div>

      {/* Modal de Nova Transação */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
    </>
  );
}