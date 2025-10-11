'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface DashboardStats {
  barbershops: {
    total: number;
    active: number;
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
        <p className="text-gray-600">Erro ao carregar estatísticas</p>
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">Visão geral do sistema BarberFlow</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Barbearias */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-green-600 text-sm font-semibold">+{stats.barbershops.newThisMonth} este mês</span>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total de Barbearias</p>
          <p className="text-3xl font-bold text-gray-900">{stats.barbershops.total}</p>
          <p className="text-sm text-gray-500 mt-2">{stats.barbershops.active} ativas</p>
        </div>

        {/* MRR */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">MRR (Receita Mensal Recorrente)</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.revenue.mrr)}</p>
          <p className="text-sm text-gray-500 mt-2">Este mês: {formatCurrency(stats.revenue.thisMonth)}</p>
        </div>

        {/* Assinaturas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {stats.subscriptions.pending > 0 && (
              <span className="text-orange-600 text-sm font-semibold">{stats.subscriptions.pending} pendentes</span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-1">Assinaturas Ativas</p>
          <p className="text-3xl font-bold text-gray-900">{stats.subscriptions.active}</p>
        </div>

        {/* Usuários */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Total de Usuários</p>
          <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
          <p className="text-sm text-gray-500 mt-2">{stats.customers.total} clientes cadastrados</p>
        </div>
      </div>

      {/* Receita Total */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg shadow-lg p-8 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-sm mb-2">Receita Total Acumulada</p>
            <p className="text-5xl font-bold">{formatCurrency(stats.revenue.total)}</p>
          </div>
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/barbershops"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer block"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Ver Todas as Barbearias</h3>
          <p className="text-gray-600 text-sm">Gerencie e visualize todas as barbearias cadastradas</p>
        </Link>

        <Link
          href="/admin/payments"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer block"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Ver Pagamentos</h3>
          <p className="text-gray-600 text-sm">Acompanhe todos os pagamentos realizados</p>
        </Link>

        <button
          onClick={fetchStats}
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-left"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Atualizar Dados</h3>
          <p className="text-gray-600 text-sm">Recarregar estatísticas em tempo real</p>
        </button>
      </div>
    </div>
  );
}