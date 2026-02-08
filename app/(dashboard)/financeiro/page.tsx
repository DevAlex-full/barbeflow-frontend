'use client';

import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { transactionsApi } from '@/lib/api/transactions';
import { financeApi } from '@/lib/api/finance';
import { AddTransactionModal } from '@/components/financeiro/AddTransactionModal';

export default function FinanceiroPage() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [cashflow, setCashflow] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryRes, cashflowRes, transactionsRes] = await Promise.all([
        transactionsApi.getSummary(),
        financeApi.getCashflow(undefined, 6),
        transactionsApi.list()
      ]);

      setSummary(summaryRes);
      setCashflow(cashflowRes);
      setRecentTransactions(transactionsRes.slice(0, 10));
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionAdded = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
      </div>
    );
  }

  const isProfit = summary?.summary.netProfit >= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Financeiro
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Controle completo das suas finanças
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Nova Transação
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Saldo Atual */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Saldo Atual</p>
            <p className="text-3xl font-bold text-gray-900">
              R$ {summary?.summary.currentBalance?.toFixed(2) || '0,00'}
            </p>
          </div>

          {/* Receitas */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Receitas do Mês</p>
            <p className="text-3xl font-bold text-green-600">
              R$ {summary?.summary.totalRevenue?.toFixed(2) || '0,00'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {summary?.summary.incomeCount || 0} transações
            </p>
          </div>

          {/* Despesas */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
                <ArrowDownRight className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Despesas do Mês</p>
            <p className="text-3xl font-bold text-red-600">
              R$ {summary?.summary.totalExpenses?.toFixed(2) || '0,00'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {summary?.summary.expenseCount || 0} transações
            </p>
          </div>

          {/* Lucro Líquido */}
          <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-br ${isProfit ? 'from-purple-500 to-pink-500' : 'from-orange-500 to-red-500'} rounded-xl`}>
                {isProfit ? <TrendingUp className="w-6 h-6 text-white" /> : <TrendingDown className="w-6 h-6 text-white" />}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Lucro Líquido</p>
            <p className={`text-3xl font-bold ${isProfit ? 'text-purple-600' : 'text-orange-600'}`}>
              R$ {summary?.summary.netProfit?.toFixed(2) || '0,00'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Margem: {summary?.summary.profitMargin || 0}%
            </p>
          </div>
        </div>

        {/* Menu Rápido */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/financeiro/transacoes" className="group">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl group-hover:scale-110 transition">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Transações</h3>
                  <p className="text-sm text-gray-500">Ver todas</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/financeiro/comissoes" className="group">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl group-hover:scale-110 transition">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Comissões</h3>
                  <p className="text-sm text-gray-500">Gestão de comissões</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/financeiro/metas" className="group">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl group-hover:scale-110 transition">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Metas</h3>
                  <p className="text-sm text-gray-500">Acompanhar objetivos</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/financeiro/relatorios" className="group">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all hover:scale-105">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl group-hover:scale-110 transition">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Relatórios</h3>
                  <p className="text-sm text-gray-500">DRE, Fluxo, Balanço</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Gráfico de Fluxo de Caixa */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            📊 Fluxo de Caixa - Últimos 6 Meses
          </h3>

          {cashflow && cashflow.cashflow.length > 0 ? (
            <div className="space-y-4">
              {cashflow.cashflow.map((month: any, index: number) => {
                const maxValue = Math.max(...cashflow.cashflow.map((m: any) => Math.max(m.revenue, m.expenses)));
                const revenueWidth = (month.revenue / maxValue) * 100;
                const expenseWidth = (month.expenses / maxValue) * 100;

                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 w-24">
                        {month.month}
                      </span>
                      <div className="flex-1 flex items-center gap-4">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Receitas</div>
                          <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
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
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Despesas</div>
                          <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
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
                      <div className="w-32 text-right">
                        <span className={`text-sm font-bold ${month.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {month.netFlow >= 0 ? '+' : ''}R$ {month.netFlow.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhum dado disponível</p>
          )}
        </div>

        {/* Despesas por Categoria */}
        {summary?.breakdown?.expensesByCategory && Object.keys(summary.breakdown.expensesByCategory).length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              📋 Despesas por Categoria (Mês Atual)
            </h3>
            
            <div className="space-y-4">
              {Object.entries(summary.breakdown.expensesByCategory).map(([category, amount]: [string, any]) => {
                const percentage = (amount / summary.summary.totalExpenses) * 100;
                
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 capitalize">
                        {category === 'salary' && '💼 Salários'}
                        {category === 'commission' && '💰 Comissões'}
                        {category === 'rent' && '🏢 Aluguel'}
                        {category === 'utilities' && '💡 Contas'}
                        {category === 'supplies' && '📦 Materiais'}
                        {category === 'other' && '📌 Outros'}
                        {!['salary', 'commission', 'rent', 'utilities', 'supplies', 'other'].includes(category) && `📌 ${category}`}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                        <span className="text-sm font-bold text-gray-900">R$ {amount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Transações Recentes */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              🕐 Transações Recentes
            </h3>
            <Link 
              href="/financeiro/transacoes"
              className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
            >
              Ver todas →
            </Link>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-purple-300 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500 capitalize">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}R$ {Number(transaction.amount).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhuma transação registrada</p>
          )}
        </div>
      </div>

      {/* Modal */}
      <AddTransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleTransactionAdded}
      />
    </div>
  );
}