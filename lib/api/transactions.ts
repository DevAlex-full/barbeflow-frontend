import api from '@/lib/api';

// ==================== TYPES ====================
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod?: string;
  status: string;
  createdAt: string;
}

export interface TransactionSummary {
  period: { start: string; end: string };
  summary: {
    currentBalance: number;
    previousBalance: number;
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: string;
  };
  breakdown: {
    expensesByCategory: Record<string, number>;
    revenueByCategory: Record<string, number>;
  };
  transactions: {
    total: number;
    income: number;
    expense: number;
  };
}

export interface CreateTransactionData {
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod?: string;
}

export interface UpdateTransactionData {
  type?: 'income' | 'expense';
  category?: string;
  description?: string;
  amount?: number;
  date?: string;
  paymentMethod?: string;
  status?: string;
}

// ==================== API CALLS ====================

export const transactionsApi = {
  // Listar transações com filtros
  list: async (params?: {
    type?: 'income' | 'expense';
    category?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }) => {
    const response = await api.get<Transaction[]>('/transactions', { params });
    return response.data;
  },

  // Buscar resumo financeiro
  getSummary: async (startDate?: string, endDate?: string) => {
    const response = await api.get<TransactionSummary>('/finance/summary', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  // Criar transação
  create: async (data: CreateTransactionData) => {
    const response = await api.post<Transaction>('/transactions', data);
    return response.data;
  },

  // Atualizar transação
  update: async (id: string, data: UpdateTransactionData) => {
    const response = await api.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  // Excluir transação
  delete: async (id: string) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  }
};