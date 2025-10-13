'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { MobileCard, MobileCardItem } from '@/components/ui/MobileCard';
import { cn } from '@/lib/utils/cn';

interface Payment {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  paidAt: string | null;
  createdAt: string;
  barbershop: {
    id: string;
    name: string;
    email: string;
  };
  plan: string;
}

interface PaginatedResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  payments: Payment[];
}

export default function PaymentsPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPayments();
  }, [currentPage, statusFilter]);

  async function fetchPayments() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '50'
      });

      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await api.get(`/admin/payments?${params}`);
      setData(response.data);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      paid: 'Pago',
      pending: 'Pendente',
      failed: 'Falhou',
      refunded: 'Reembolsado'
    };
    return texts[status] || status;
  };

  const getPlanBadgeColor = (plan: string) => {
    const colors: Record<string, string> = {
      trial: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      standard: 'bg-green-100 text-green-800',
      premium: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-orange-100 text-orange-800'
    };
    return colors[plan] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodIcon = (method: string) => {
    if (method.includes('credit') || method === 'credit_card') {
      return (
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    }
    if (method === 'pix') {
      return (
        <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 10.18l7 3.5v7.14l-7-3.5v-7.14zm16 0v7.14l-7 3.5v-7.14l7-3.5z"/>
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const totalPaid = data?.payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0) || 0;

  const totalPending = data?.payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0) || 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pagamentos</h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">
          Acompanhe todos os pagamentos
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs md:text-sm text-gray-600">Total Recebido</p>
            <svg className="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {data?.payments.filter(p => p.status === 'paid').length || 0} transação(ões)
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs md:text-sm text-gray-600">Pendente</p>
            <svg className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{formatCurrency(totalPending)}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {data?.payments.filter(p => p.status === 'pending').length || 0} transação(ões)
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs md:text-sm text-gray-600">Total</p>
            <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">{data?.total || 0}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Transações</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="paid">Pagos</option>
              <option value="pending">Pendentes</option>
              <option value="failed">Falharam</option>
              <option value="refunded">Reembolsados</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchPayments}
              className="w-full sm:w-auto px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition active:scale-95"
            >
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      )}

      {/* Conteúdo */}
      {!loading && data && (
        <>
          {/* Desktop: Tabela */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Barbearia</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plano</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {payment.id.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.barbershop.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.barbershop.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn('px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full', getPlanBadgeColor(payment.plan))}>
                          {payment.plan.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <span className="ml-2 capitalize">
                            {payment.paymentMethod.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn('px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full', getStatusBadgeColor(payment.status))}>
                          {getStatusText(payment.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile: Cards */}
          <div className="md:hidden space-y-3">
            {data.payments.map((payment) => (
              <MobileCard key={payment.id}>
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">{payment.barbershop.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{payment.barbershop.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={cn('px-2 py-1 text-xs font-semibold rounded-full', getPlanBadgeColor(payment.plan))}>
                      {payment.plan.toUpperCase()}
                    </span>
                    <span className={cn('px-2 py-1 text-xs font-semibold rounded-full', getStatusBadgeColor(payment.status))}>
                      {getStatusText(payment.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <MobileCardItem
                    label="Data"
                    value={payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}
                  />
                  <MobileCardItem
                    icon={getPaymentMethodIcon(payment.paymentMethod)}
                    label="Método"
                    value={<span className="capitalize">{payment.paymentMethod.replace('_', ' ')}</span>}
                  />
                  <MobileCardItem
                    label="Valor"
                    value={<span className="text-green-600 font-bold">{formatCurrency(payment.amount)}</span>}
                  />
                  <MobileCardItem
                    label="ID"
                    value={payment.id.substring(0, 12) + '...'}
                  />
                </div>
              </MobileCard>
            ))}
          </div>

          {/* Paginação */}
          {data.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6 rounded-lg shadow">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(data.totalPages, currentPage + 1))}
                  disabled={currentPage === data.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Próximo
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(currentPage - 1) * 50 + 1}</span> a{' '}
                    <span className="font-medium">{Math.min(currentPage * 50, data.total)}</span> de{' '}
                    <span className="font-medium">{data.total}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(data.totalPages, currentPage + 1))}
                      disabled={currentPage === data.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Próximo
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && data && data.payments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum pagamento encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">Ajuste os filtros.</p>
        </div>
      )}
    </div>
  );
}