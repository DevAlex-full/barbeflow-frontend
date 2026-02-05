import api from '@/lib/api';

// ==================== TYPES ====================
export interface Goal {
  id: string;
  barbershopId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface GoalProgress {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  percentage: string;
  remaining: number;
  daysRemaining: number;
  status: 'active' | 'completed' | 'expired';
  startDate: string;
  endDate: string;
}

export interface GoalsProgressResponse {
  goals: GoalProgress[];
  summary: {
    total: number;
    completed: number;
    active: number;
    expired: number;
  };
}

export interface CreateGoalData {
  name: string;
  targetAmount: number;
  startDate: string;
  endDate: string;
}

export interface UpdateGoalData {
  name?: string;
  targetAmount?: number;
  startDate?: string;
  endDate?: string;
  status?: 'active' | 'completed' | 'cancelled';
}

// ==================== API CALLS ====================

export const goalsApi = {
  // Listar metas
  list: async (status?: 'active' | 'completed' | 'cancelled') => {
    const response = await api.get<Goal[]>('/goals', {
      params: status ? { status } : undefined
    });
    return response.data;
  },

  // Buscar progresso das metas
  getProgress: async () => {
    const response = await api.get<GoalsProgressResponse>('/goals/progress');
    return response.data;
  },

  // Criar meta
  create: async (data: CreateGoalData) => {
    const response = await api.post<Goal>('/goals', data);
    return response.data;
  },

  // Atualizar meta
  update: async (id: string, data: UpdateGoalData) => {
    const response = await api.put<Goal>(`/goals/${id}`, data);
    return response.data;
  },

  // Atualizar progresso manual
  updateProgress: async (id: string, amount: number) => {
    const response = await api.put<Goal>(`/goals/${id}/update-progress`, { amount });
    return response.data;
  },

  // Sincronizar com receitas reais
  sync: async (id: string) => {
    const response = await api.put(`/goals/${id}/sync`);
    return response.data;
  },

  // Excluir meta
  delete: async (id: string) => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};