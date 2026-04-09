'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Calendar,
  ArrowUpRight, ArrowDownRight, Plus, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { financeApi } from '@/lib/api/finance';
import { transactionsApi } from '@/lib/api/transactions';
import { AddTransactionModal } from '@/components/financeiro/AddTransactionModal';

const BR = (n: number) => `R$ ${Number(n || 0).toFixed(2).replace('.', ',')}`;

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
];

const CATEGORY_LABELS: Record<string, string> = {
  salary:     '💼 Salários',
  commission: '💰 Comissões',
  rent:       '🏢 Aluguel',
  utilities:  '💡 Contas',
  supplies:   '📦 Materiais',
  service:    '✂️ Serviços',
  product:    '🛒 Produtos',
  other:      '📌 Outros',
};

export default function FinanceiroPage() {
  const now = new Date();

  // ✅ Seletor de período
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());

  const [loading,  setLoading]  = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [summary,  setSummary]  = useState<any>(null);
  const [cashflow, setCashflow] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  // Gera startDate/endDate para o período selecionado (UTC seguro)
  const periodDates = () => {
    const start = new Date(Date.UTC(selectedYear, selectedMonth, 1));
    const end   = new Date(Date.UTC(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999));
    return {
      startDate: start.toISOString(),
      endDate:   end.toISOString()
    };
  };

  useEffect(() => { loadData(); }, [selectedMonth, selectedYear]);

  const loadData = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = periodDates();

      const [summaryRes, cashflowRes, transactionsRes] = await Promise.all([
        financeApi.getSummary(startDate, endDate),
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

  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
    else setSelectedMonth(m => m - 1);
  };

  const nextMonth = () => {
    const isCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();
    if (isCurrentMonth) return;
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
    else setSelectedMonth(m => m + 1);
  };

  const isCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const s        = summary?.summary || {};
  const isProfit = (s.netProfit || 0) >= 0;

  const incomeCount = summary?.transactions?.income ?? 0;
  const expenseCount = summary?.transactions?.expense ?? 0;
  const aptCount = summary?.transactions?.appointments ?? 0;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl shadow-md shadow-emerald-200 dark:shadow-emerald-900/30">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Financeiro</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Controle completo das suas finanças</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nova Transação
        </button>
      </div>

      {/* ✅ Seletor de período */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-5 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition text-gray-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <p className="text-base font-bold text-gray-900 dark:text-white">
            {MONTHS[selectedMonth]} {selectedYear}
          </p>
          {isCurrentMonth && (
            <span className="text-xs text-emerald-600 font-medium">Mês atual</span>
          )}
        </div>

        <button
          onClick={nextMonth}
          disabled={isCurrentMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Saldo Acumulado */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <DollarSign className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Saldo Atual</p>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{BR(s.currentBalance)}</p>
          <p className="text-xs text-gray-400 mt-1">Acumulado até o período</p>
        </div>

        {/* Receitas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Receitas</p>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{BR(s.totalRevenue)}</p>
          <p className="text-xs text-gray-400 mt-1">
            {aptCount} agend. + {incomeCount} transações
          </p>
        </div>

        {/* Despesas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <ArrowDownRight className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Despesas</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{BR(s.totalExpenses)}</p>
          <p className="text-xs text-gray-400 mt-1">{expenseCount} transações</p>
        </div>

        {/* Lucro */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-2 rounded-lg ${isProfit ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
              {isProfit
                ? <TrendingUp className="w-4 h-4 text-purple-600" />
                : <TrendingDown className="w-4 h-4 text-orange-500" />
              }
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Lucro Líquido</p>
          </div>
          <p className={`text-2xl font-bold ${isProfit ? 'text-purple-600' : 'text-orange-500'}`}>
            {BR(s.netProfit)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Margem: {s.profitMargin || 0}%</p>
        </div>
      </div>

      {/* ✅ Breakdown receitas se houver */}
      {(s.appointmentsRevenue > 0 || s.manualIncome > 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Composição das Receitas</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3">
              <p className="text-xs text-emerald-600 font-medium mb-1">✂️ Agendamentos</p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{BR(s.appointmentsRevenue || 0)}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
              <p className="text-xs text-blue-600 font-medium mb-1">💳 Transações manuais</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{BR(s.manualIncome || 0)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu rápido */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { href: '/financeiro/transacoes', label: 'Transações',  sub: 'Ver todas',          icon: Calendar,      gradient: 'from-blue-500 to-cyan-500'    },
          { href: '/financeiro/comissoes',  label: 'Comissões',   sub: 'Gestão de comissões',icon: DollarSign,    gradient: 'from-purple-500 to-pink-500'  },
          { href: '/financeiro/metas',      label: 'Metas',       sub: 'Acompanhar objetivos',icon: TrendingUp,   gradient: 'from-orange-500 to-red-500'   },
          { href: '/financeiro/relatorios', label: 'Relatórios',  sub: 'DRE, Fluxo, Balanço',icon: TrendingDown, gradient: 'from-indigo-500 to-blue-500'  },
        ].map(({ href, label, sub, icon: Icon, gradient }) => (
          <Link key={href} href={href} className="group">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
              <div className={`p-2.5 bg-gradient-to-br ${gradient} rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Fluxo de Caixa */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-5">
        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-5">
          📊 Fluxo de Caixa — Últimos 6 Meses
        </h3>

        {cashflow?.cashflow?.length > 0 ? (
          <div className="space-y-4">
            {cashflow.cashflow.map((month: any, index: number) => {
              const maxVal = Math.max(...cashflow.cashflow.map((m: any) => Math.max(m.revenue, m.expenses, 1)));
              const revW  = (month.revenue  / maxVal) * 100;
              const expW  = (month.expenses / maxVal) * 100;

              return (
                <div key={index}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-20 shrink-0">{month.month}</span>
                    <span className={`text-xs font-bold ml-auto ${month.netFlow >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {month.netFlow >= 0 ? '+' : ''}{BR(month.netFlow)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-16">Receitas</span>
                      <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-end px-2 transition-all"
                          style={{ width: `${revW}%` }}>
                          {revW > 25 && <span className="text-[10px] font-bold text-white">{BR(month.revenue)}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-400 w-16">Despesas</span>
                      <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-400 to-orange-400 flex items-center justify-end px-2 transition-all"
                          style={{ width: `${expW}%` }}>
                          {expW > 25 && <span className="text-[10px] font-bold text-white">{BR(month.expenses)}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm py-8">Nenhum dado disponível</p>
        )}
      </div>

      {/* Despesas por Categoria */}
      {summary?.breakdown?.expensesByCategory && Object.keys(summary.breakdown.expensesByCategory).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 mb-5">
          <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">
            📋 Despesas por Categoria
          </h3>
          <div className="space-y-3">
            {Object.entries(summary.breakdown.expensesByCategory).map(([cat, amount]: [string, any]) => {
              const pct = s.totalExpenses > 0 ? (amount / s.totalExpenses) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {CATEGORY_LABELS[cat] || `📌 ${cat}`}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{pct.toFixed(1)}%</span>
                      <span className="text-sm font-bold text-gray-800 dark:text-white">{BR(amount)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-400 to-orange-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transações Recentes */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800 dark:text-white">🕐 Transações Recentes</h3>
          <Link href="/financeiro/transacoes" className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold">
            Ver todas →
          </Link>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-2">
            {recentTransactions.map((tx) => (
              <div key={tx.id}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 transition">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}>
                    {tx.type === 'income'
                      ? <ArrowUpRight className="w-4 h-4" />
                      : <ArrowDownRight className="w-4 h-4" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{tx.description}</p>
                    <p className="text-xs text-gray-400 capitalize">{CATEGORY_LABELS[tx.category] || tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}{BR(Number(tx.amount))}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.date).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm py-8">Nenhuma transação registrada</p>
        )}
      </div>

      <AddTransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={loadData}
      />
    </>
  );
}