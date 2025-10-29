'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Calendar, Users, Scissors, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MobileCard, MobileCardItem } from '@/components/ui/MobileCard';

interface Customer {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface Barber {
  id: string;
  name: string;
}

interface Appointment {
  id: string;
  date: string;
  status: string;
  customer: Customer | null;
  service: Service | null;
  barber: Barber | null;
}

interface DashboardStats {
  totalCustomers: number;
  totalServices: number;
  todayAppointments: number;
  monthRevenue: number;
  monthAppointments: number;
  upcomingAppointments: Appointment[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const response = await api.get('/dashboard/stats');
      console.log('📊 Stats recebidas:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-sm text-gray-600">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  // ✅ FIX: Filtra agendamentos válidos (com customer, service e barber)
  const validAppointments = stats?.upcomingAppointments?.filter(
    (appointment) => 
      appointment?.customer && 
      appointment?.service && 
      appointment?.barber
  ) || [];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600 mt-1">Visão geral do seu negócio</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Clientes</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                {stats?.totalCustomers || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Serviços</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                {stats?.totalServices || 0}
              </p>
            </div>
            <div className="bg-purple-100 p-2 md:p-3 rounded-lg">
              <Scissors className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Hoje</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                {stats?.todayAppointments || 0}
              </p>
            </div>
            <div className="bg-green-100 p-2 md:p-3 rounded-lg">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 font-medium truncate">Receita/Mês</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                R$ {Number(stats?.monthRevenue || 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-yellow-100 p-2 md:p-3 rounded-lg">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Próximos Agendamentos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Próximos Agendamentos</h2>
          {validAppointments.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {validAppointments.length} agendamento{validAppointments.length !== 1 ? 's' : ''} próximo{validAppointments.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="p-4 md:p-6">
          {validAppointments.length > 0 ? (
            <>
              {/* Desktop: Lista tradicional */}
              <div className="hidden md:block space-y-4">
                {validAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        {/* ✅ FIX: Acesso seguro com ! operator (já validado no filter) */}
                        <p className="font-semibold text-gray-900">{appointment.customer!.name}</p>
                        <p className="text-sm text-gray-600">{appointment.service!.name}</p>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{appointment.service!.duration} min</span>
                          <span>•</span>
                          <span>{appointment.barber!.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {format(new Date(appointment.date), "dd 'de' MMM", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(appointment.date), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile: Cards */}
              <div className="md:hidden space-y-3">
                {validAppointments.map((appointment) => (
                  <MobileCard key={appointment.id}>
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {/* ✅ FIX: Acesso seguro */}
                        {appointment.customer!.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{appointment.customer!.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{appointment.service!.name}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <MobileCardItem
                        icon={<Calendar className="w-4 h-4" />}
                        label="Data"
                        value={format(new Date(appointment.date), "dd/MM 'às' HH:mm")}
                      />
                      <MobileCardItem
                        icon={<Clock className="w-4 h-4" />}
                        label="Duração"
                        value={`${appointment.service!.duration} min`}
                      />
                      <MobileCardItem
                        icon={<Scissors className="w-4 h-4" />}
                        label="Barbeiro"
                        value={appointment.barber!.name}
                      />
                    </div>
                  </MobileCard>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm md:text-base font-medium">Nenhum agendamento próximo</p>
              <p className="text-gray-400 text-xs md:text-sm mt-1">
                Os próximos agendamentos aparecerão aqui
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}