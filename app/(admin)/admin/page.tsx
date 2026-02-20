'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { BarbershopsStatsChart } from '@/components/admin/BarbershopsStatsChart';

interface DashboardStats {
  barbershops: {
    total: number;
    active: number;
    expired: number; // ✅ NOVO
    newThisMonth: number;
  };
  users: {
    total: number;
  };
  customers: {
    total: number;
  };
  subscriptions: {
    active: number;
    pending: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    mrr: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-sm md:text-base">Erro ao carregar estatísticas</p>
        <button
          onClick={fetchStats}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition active:scale-95"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">Visão geral do sistema BarberFlow</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Barbearias Ativas */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-green-600 text-xs md:text-sm font-semibold">Ativas</span>
          </div>
          <p className="text-gray-600 text-xs md:text-sm mb-1">Barbearias Ativas</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.barbershops.active}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-2">Total: {stats.barbershops.total}</p>
        </div>

        {/* Barbearias Expiradas - NOVO */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-red-600 text-xs md:text-sm font-semibold">Expiradas</span>
          </div>
          <p className="text-gray-600 text-xs md:text-sm mb-1">Barbearias Expiradas</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.barbershops.expired}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-2">Sem acesso ao sistema</p>
        </div>

        {/* MRR */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-xs md:text-sm mb-1">MRR</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{formatCurrency(stats.revenue.mrr)}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-2 truncate">Mês: {formatCurrency(stats.revenue.thisMonth)}</p>
        </div>

        {/* Assinaturas */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {stats.subscriptions.pending > 0 && (
              <span className="text-orange-600 text-xs md:text-sm font-semibold">{stats.subscriptions.pending}</span>
            )}
          </div>
          <p className="text-gray-600 text-xs md:text-sm mb-1">Assinaturas</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.subscriptions.active}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-2">Ativas</p>
        </div>
      </div>

      {/* Gráfico de Status das Barbearias - NOVO */}
      <div className="mb-6 md:mb-8">
        <BarbershopsStatsChart />
      </div>

      {/* Receita Total */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg shadow-lg p-6 md:p-8 text-white mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-purple-200 text-xs md:text-sm mb-2">Receita Total Acumulada</p>
            <p className="text-3xl md:text-5xl font-bold">{formatCurrency(stats.revenue.total)}</p>
          </div>
          <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Link
          href="/admin/barbershops"
          className="bg-white rounded-lg shadow p-4 md:p-6 hover:shadow-lg transition cursor-pointer block active:scale-95"
        >
          <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Ver Todas as Barbearias</h3>
          <p className="text-gray-600 text-xs md:text-sm">Gerencie e visualize todas</p>
        </Link>

        <Link
          href="/admin/payments"
          className="bg-white rounded-lg shadow p-4 md:p-6 hover:shadow-lg transition cursor-pointer block active:scale-95"
        >
          <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Ver Pagamentos</h3>
          <p className="text-gray-600 text-xs md:text-sm">Acompanhe os pagamentos</p>
        </Link>

        <button
          onClick={fetchStats}
          className="bg-white rounded-lg shadow p-4 md:p-6 hover:shadow-lg transition text-left active:scale-95"
        >
          <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Atualizar Dados</h3>
          <p className="text-gray-600 text-xs md:text-sm">Recarregar estatísticas</p>
        </button>
      </div>
    </div>
  );
}