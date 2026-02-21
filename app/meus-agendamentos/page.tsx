'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Phone, X, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useClientAuth } from '@/lib/contexts/ClientAuthContext';
import { clientAppointmentsApi, ClientAppointment } from '@/lib/api/client-appointments';

export default function MeusAgendamentosPage() {
  const router = useRouter();
  const { client, isAuthenticated, loading: authLoading } = useClientAuth(); // ✅ USA O CONTEXTO
  const [appointments, setAppointments] = useState<ClientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<ClientAppointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // ✅ Verifica autenticação usando o contexto
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log('⚠️ Cliente não autenticado, redirecionando...');
      router.push('/sou-cliente');
    }
  }, [authLoading, isAuthenticated, router]);

  // ✅ Carrega agendamentos quando o cliente estiver autenticado
  useEffect(() => {
    if (isAuthenticated && client) {
      loadAppointments();
    }
  }, [isAuthenticated, client]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      console.log('📅 Carregando agendamentos do cliente:', client?.email);
      
      // ✅ USA A API TIPADA
      const data = await clientAppointmentsApi.getMyAppointments();
      setAppointments(data);
      
      console.log('✅ Agendamentos carregados:', data.length);
    } catch (error: any) {
      console.error('❌ Erro ao carregar agendamentos:', error);
      
      // Mensagem de erro mais amigável
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao carregar agendamentos';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      setCancelLoading(true);
      console.log('🚫 Cancelando agendamento:', selectedAppointment.id);
      
      // ✅ USA A API TIPADA
      await clientAppointmentsApi.cancelAppointment(selectedAppointment.id);
      
      alert('✅ Agendamento cancelado com sucesso!');
      setShowCancelModal(false);
      setSelectedAppointment(null);
      
      // Recarrega a lista
      await loadAppointments();
    } catch (error: any) {
      console.error('❌ Erro ao cancelar:', error);
      
      // Mostra mensagem de erro do backend
      const errorMessage = error.message || 'Erro ao cancelar agendamento';
      alert(errorMessage);
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const upcomingAppointments = filteredAppointments.filter(apt => 
    new Date(apt.date) >= new Date() && apt.status !== 'cancelled' && apt.status !== 'completed'
  );

  const pastAppointments = filteredAppointments.filter(apt => 
    new Date(apt.date) < new Date() || apt.status === 'cancelled' || apt.status === 'completed'
  );

  // ✅ Loading enquanto autentica OU carrega dados
  if (authLoading || (loading && appointments.length === 0)) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando seus agendamentos...</p>
        </div>
      </div>
    );
  }

  // ✅ Se não estiver autenticado, não renderiza nada (vai redirecionar)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg px-3 py-1.5 font-bold text-sm">
              BarberFlow
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="/sou-cliente" className="hover:text-blue-400 transition">Início</a>
            <a href="/sou-cliente" className="hover:text-blue-400 transition">Buscar</a>
            <a href="/meus-agendamentos" className="text-blue-400">Meus Agendamentos</a>
          </nav>

          <button
            onClick={() => router.push('/sou-cliente')}
            className="text-sm text-gray-400 hover:text-white"
          >
            Voltar
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meus Agendamentos</h1>
            {client && (
              <p className="text-gray-400">Olá, {client.name}! 👋</p>
            )}
          </div>
          
          {/* Botão de recarregar */}
          <button
            onClick={loadAppointments}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Calendar size={18} />
            )}
            <span className="hidden sm:inline">Atualizar</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Todos ({appointments.length})
          </button>
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Agendados ({appointments.filter(a => a.status === 'scheduled').length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Confirmados ({appointments.filter(a => a.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Concluídos ({appointments.filter(a => a.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === 'cancelled' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Cancelados ({appointments.filter(a => a.status === 'cancelled').length})
          </button>
        </div>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar size={24} className="text-blue-400" />
              Próximos Agendamentos
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-blue-600 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{appointment.barbershop.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                    {appointment.barbershop.logo && (
                      <img 
                        src={appointment.barbershop.logo} 
                        alt={appointment.barbershop.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Calendar size={18} className="text-blue-400" />
                      <span>{format(new Date(appointment.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-300">
                      <Clock size={18} className="text-blue-400" />
                      <span>{format(new Date(appointment.date), 'HH:mm')} ({appointment.service.duration}min)</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-300">
                      <MapPin size={18} className="text-blue-400" />
                      <span>{appointment.barbershop.city}, {appointment.barbershop.state}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-300">
                      <Phone size={18} className="text-blue-400" />
                      <span>{appointment.barbershop.phone}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-4 mb-4">
                    <p className="text-sm text-gray-400 mb-1">Serviço</p>
                    <p className="font-medium">{appointment.service.name}</p>
                    <p className="text-sm text-gray-400 mt-1">Barbeiro: {appointment.barber.name}</p>
                  </div>

                  {appointment.notes && (
                    <div className="bg-gray-800 rounded-lg p-3 mb-4">
                      <p className="text-sm text-gray-400 mb-1">Observações</p>
                      <p className="text-sm">{appointment.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-400">
                      R$ {Number(appointment.price).toFixed(2)}
                    </span>
                    {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowCancelModal(true);
                        }}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock size={24} className="text-gray-400" />
              Histórico
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {pastAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800 opacity-75">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{appointment.barbershop.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                    {appointment.barbershop.logo && (
                      <img 
                        src={appointment.barbershop.logo} 
                        alt={appointment.barbershop.name}
                        className="w-12 h-12 rounded-lg object-cover opacity-60"
                      />
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Calendar size={18} />
                      <span>{format(new Date(appointment.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-400">
                      <Clock size={18} />
                      <span>{format(new Date(appointment.date), 'HH:mm')}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-4">
                    <p className="text-sm text-gray-400 mb-1">Serviço</p>
                    <p className="font-medium">{appointment.service.name}</p>
                    <p className="text-sm text-gray-400 mt-1">Barbeiro: {appointment.barber.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
            <Calendar size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'all' 
                ? 'Você ainda não tem agendamentos.' 
                : `Você não tem agendamentos ${getStatusText(filter).toLowerCase()}.`}
            </p>
            <button
              onClick={() => router.push('/sou-cliente')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Buscar Barbearias
            </button>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full p-8 relative border border-gray-800">
            <button
              onClick={() => {
                setShowCancelModal(false);
                setSelectedAppointment(null);
              }}
              disabled={cancelLoading}
              className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <AlertCircle size={48} className="text-red-500" />
              <div>
                <h2 className="text-2xl font-bold">Cancelar Agendamento</h2>
                <p className="text-gray-400 text-sm">Esta ação não pode ser desfeita</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-400 mb-2">Você está cancelando:</p>
              <p className="font-bold">{selectedAppointment.service.name}</p>
              <p className="text-sm text-gray-400 mt-1">
                {format(new Date(selectedAppointment.date), "dd/MM/yyyy 'às' HH:mm")}
              </p>
              <p className="text-sm text-gray-400">
                {selectedAppointment.barbershop.name}
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-200">
                ⚠️ <strong>Atenção:</strong> Cancelamentos com menos de 2 horas de antecedência não são permitidos.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedAppointment(null);
                }}
                disabled={cancelLoading}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                onClick={handleCancelAppointment}
                disabled={cancelLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Cancelando...
                  </>
                ) : (
                  'Confirmar Cancelamento'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}