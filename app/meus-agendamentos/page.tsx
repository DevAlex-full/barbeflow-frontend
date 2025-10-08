'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, Phone, X, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: string;
  date: string;
  status: string;
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
    duration: number;
    price: number;
  };
}

export default function MeusAgendamentosPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    checkAuth();
    loadAppointments();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('@barberFlow:client:token');
    if (!token) {
      router.push('/sou-cliente');
    }
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('@barberFlow:client:token');
      const response = await fetch('https://barberflow-back-end.onrender.com/api/client/appointments/my-appointments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erro ao carregar agendamentos');

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      const token = localStorage.getItem('@barberFlow:client:token');
      const response = await fetch(`https://barberflow-back-end.onrender.com/api/client/appointments/${selectedAppointment.id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao cancelar agendamento');
        return;
      }

      alert('Agendamento cancelado com sucesso!');
      setShowCancelModal(false);
      setSelectedAppointment(null);
      loadAppointments();
    } catch (error) {
      alert('Erro ao cancelar agendamento');
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
    new Date(apt.date) >= new Date() && apt.status !== 'cancelled'
  );

  const pastAppointments = filteredAppointments.filter(apt => 
    new Date(apt.date) < new Date() || apt.status === 'cancelled'
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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
        <h1 className="text-3xl font-bold mb-8">Meus Agendamentos</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Agendados
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Concluídos
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
              filter === 'cancelled' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Cancelados
          </button>
        </div>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Próximos Agendamentos</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-gray-900 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{appointment.barbershop.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
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

                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-400">
                      R$ {appointment.price.toFixed(2)}
                    </span>
                    {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowCancelModal(true);
                        }}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
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
            <h2 className="text-xl font-bold mb-4">Histórico</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {pastAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-gray-900 rounded-xl p-6 opacity-75">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{appointment.barbershop.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
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
          <div className="bg-gray-900 rounded-xl p-12 text-center">
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
          <div className="bg-gray-900 rounded-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => {
                setShowCancelModal(false);
                setSelectedAppointment(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
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

            <p className="text-sm text-gray-400 mb-6">
              Ao cancelar, você libera o horário para outros clientes. Certifique-se antes de confirmar.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedAppointment(null);
                }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Voltar
              </button>
              <button
                onClick={handleCancelAppointment}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}