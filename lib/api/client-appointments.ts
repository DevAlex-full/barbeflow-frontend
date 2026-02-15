import clientApi from '@/lib/client-api';

// ==================== TYPES ====================
export interface ClientAppointment {
  id: string;
  date: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
  barbershop: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    logo?: string;
  };
  barber: {
    name: string;
    avatar?: string;
  };
  service: {
    name: string;
    description?: string;
    duration: number;
    price: number;
  };
}

export interface CreateAppointmentData {
  barbershopId: string;
  barberId: string;
  serviceId: string;
  date: string;
  notes?: string;
}

// ==================== API CALLS ====================

export const clientAppointmentsApi = {
  /**
   * Buscar todos os agendamentos do cliente autenticado
   */
  getMyAppointments: async (status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled') => {
    try {
      console.log('🔍 [CLIENT-APPOINTMENTS] Buscando agendamentos...', { status });
      
      const response = await clientApi.get<ClientAppointment[]>('/client/appointments/my-appointments', {
        params: status ? { status } : undefined
      });
      
      console.log('✅ [CLIENT-APPOINTMENTS] Agendamentos carregados:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ [CLIENT-APPOINTMENTS] Erro ao buscar agendamentos:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Buscar detalhes de um agendamento específico
   */
  getAppointmentById: async (id: string) => {
    try {
      console.log('🔍 [CLIENT-APPOINTMENTS] Buscando agendamento:', id);
      
      const response = await clientApi.get<ClientAppointment>(`/client/appointments/${id}`);
      
      console.log('✅ [CLIENT-APPOINTMENTS] Agendamento encontrado');
      return response.data;
    } catch (error: any) {
      console.error('❌ [CLIENT-APPOINTMENTS] Erro ao buscar agendamento:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Criar novo agendamento
   */
  createAppointment: async (data: CreateAppointmentData) => {
    try {
      console.log('📝 [CLIENT-APPOINTMENTS] Criando agendamento...', data);
      
      const response = await clientApi.post<ClientAppointment>('/client/appointments', data);
      
      console.log('✅ [CLIENT-APPOINTMENTS] Agendamento criado:', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ [CLIENT-APPOINTMENTS] Erro ao criar agendamento:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Cancelar agendamento
   */
  cancelAppointment: async (id: string) => {
    try {
      console.log('🚫 [CLIENT-APPOINTMENTS] Cancelando agendamento:', id);
      
      const response = await clientApi.patch<ClientAppointment>(`/client/appointments/${id}/cancel`);
      
      console.log('✅ [CLIENT-APPOINTMENTS] Agendamento cancelado');
      return response.data;
    } catch (error: any) {
      console.error('❌ [CLIENT-APPOINTMENTS] Erro ao cancelar agendamento:', error.response?.data || error.message);
      
      // Retorna mensagem de erro do backend se disponível
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      throw error;
    }
  }
};