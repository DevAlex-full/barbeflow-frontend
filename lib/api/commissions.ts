import api from '@/lib/api';

// ==================== TYPES ====================
export interface Commission {
  id: string;
  barberId: string;
  barbershopId: string;
  percentage: number;
  amount: number;
  referenceMonth: string;
  status: 'pending' | 'paid';
  paidAt?: string;
  createdAt: string;
  barber?: {
    name: string;
    email: string;
  };
}

export interface CommissionReport {
  commissions: Commission[];
  summary: {
    total: number;
    pending: number;
    paid: number;
    totalPending: number;
    totalPaid: number;
    totalAmount: number;
  };
}

export interface CalculateCommissionsData {
  month: number;
  year: number;
}

export interface UpdateCommissionData {
  percentage?: number;
  amount?: number;
}

// ==================== API CALLS ====================

export const commissionsApi = {
  // Listar comissões
  list: async (params?: {
    barberId?: string;
    month?: number;
    year?: number;
    status?: 'pending' | 'paid';
  }) => {
    const response = await api.get<Commission[]>('/commissions', { params });
    return response.data;
  },

  // Calcular comissões do mês
  calculate: async (data: CalculateCommissionsData) => {
    const response = await api.post('/commissions/calculate', data);
    return response.data;
  },

  // Marcar comissão como paga
  pay: async (id: string) => {
    const response = await api.put<Commission>(`/commissions/${id}/pay`);
    return response.data;
  },

  // Buscar relatório de comissões
  getReport: async (month: number, year: number) => {
    const response = await api.get<CommissionReport>('/commissions/report', {
      params: { month, year }
    });
    return response.data;
  },

  // Atualizar comissão
  update: async (id: string, data: UpdateCommissionData) => {
    const response = await api.put<Commission>(`/commissions/${id}`, data);
    return response.data;
  },

  // Excluir comissão
  delete: async (id: string) => {
    const response = await api.delete(`/commissions/${id}`);
    return response.data;
  }
};