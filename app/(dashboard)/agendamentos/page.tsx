'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Calendar as CalendarIcon, Clock, User, Scissors, ChevronLeft, ChevronRight, Edit, Trash2, Check, X, Bell } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MobileCard, MobileCardItem, MobileCardActions } from '@/components/ui/MobileCard';
import { ResponsiveModal, ModalActions } from '@/components/ui/ResponsiveModal';
import { cn } from '@/lib/utils/cn';

// ✅ FIX: Interface atualizada para suportar customer OU client
interface Appointment {
  id: string;
  date: string;
  status: string;
  notes?: string;
  price: number;
  customer?: { id: string; name: string; phone: string } | null;
  client?: { id: string; name: string; phone: string } | null;
  barber: { id: string; name: string };
  service: { id: string; name: string; duration: number };
}

interface Customer { id: string; name: string; }
interface Service { id: string; name: string; price: number; duration: number; active?: boolean; }
interface Barber { id: string; name: string; }

// ✅ FIX: Helper para obter o cliente (customer ou client)
function getClient(appointment: Appointment) {
  return appointment.customer || appointment.client || { id: '', name: 'Cliente não identificado', phone: '' };
}

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    customerId: '', serviceId: '', barberId: '', date: '', time: '', notes: ''
  });

  useEffect(() => { loadInitialData(); }, []);
  useEffect(() => { loadAppointments(); }, [selectedDate]);

  async function loadInitialData() {
    try {
      const [customersRes, servicesRes, barbershopRes] = await Promise.all([
        api.get('/customers'), api.get('/services'), api.get('/barbershop')
      ]);
      setCustomers(customersRes.data);
      setServices(servicesRes.data.filter((s: Service) => s.active !== false));
      setBarbers(barbershopRes.data.users || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadAppointments() {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await api.get(`/appointments?date=${dateStr}`);
      setAppointments(response.data);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  }

  async function sendNotification(appointmentId: string) {
    try {
      await api.post(`/notifications/send-email-reminder/${appointmentId}`);
      alert('Lembrete enviado com sucesso!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao enviar lembrete');
    }
  }

  function openModal(appointment?: Appointment) {
    if (appointment) {
      setEditingAppointment(appointment);
      const appointmentDate = new Date(appointment.date);
      const client = getClient(appointment);
      setFormData({
        customerId: client.id,
        serviceId: appointment.service.id,
        barberId: appointment.barber.id,
        date: format(appointmentDate, 'yyyy-MM-dd'),
        time: format(appointmentDate, 'HH:mm'),
        notes: appointment.notes || ''
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        customerId: '', serviceId: '', barberId: '',
        date: format(selectedDate, 'yyyy-MM-dd'), time: '', notes: ''
      });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingAppointment(null);
    setFormData({ customerId: '', serviceId: '', barberId: '', date: '', time: '', notes: '' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const dateTime = new Date(`${formData.date}T${formData.time}:00`);

    try {
      const payload = {
        customerId: formData.customerId,
        serviceId: formData.serviceId,
        barberId: formData.barberId,
        date: dateTime.toISOString(),
        notes: formData.notes
      };

      if (editingAppointment) {
        await api.put(`/appointments/${editingAppointment.id}`, payload);
        alert('Agendamento atualizado!');
      } else {
        await api.post('/appointments', payload);
        alert('Agendamento criado!');
      }
      closeModal();
      loadAppointments();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao salvar');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir agendamento?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      alert('Excluído!');
      loadAppointments();
    } catch (error) {
      alert('Erro ao excluir');
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await api.put(`/appointments/${id}`, { status });
      loadAppointments();
    } catch (error) {
      alert('Erro ao atualizar');
    }
  }

  function getWeekDays() {
    const start = startOfWeek(currentWeek, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }

  const weekDays = getWeekDays();
  const todayAppointments = appointments.filter(apt =>
    isSameDay(new Date(apt.date), selectedDate)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Agendado' },
    confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmado' },
    completed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Concluído' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Gerencie sua agenda</p>
        </div>
        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 md:px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Novo</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Hoje</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{todayAppointments.length}</p>
            </div>
            <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
              <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Confirmados</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {todayAppointments.filter(a => a.status === 'confirmed').length}
              </p>
            </div>
            <div className="bg-green-100 p-2 md:p-3 rounded-lg">
              <Check className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Concluídos</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {todayAppointments.filter(a => a.status === 'completed').length}
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
              <p className="text-xs md:text-sm text-gray-600 font-medium truncate">Receita</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                R$ {todayAppointments
                  .filter(a => a.status === 'completed')
                  .reduce((acc, a) => acc + Number(a.price), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="bg-yellow-100 p-2 md:p-3 rounded-lg">
              <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Calendário Semanal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            {format(currentWeek, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={() => setCurrentWeek(new Date())}
              className="px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition active:scale-95"
            >
              Hoje
            </button>
            <button
              onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition active:scale-95"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          <div className="min-w-[640px] md:min-w-0">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const isToday = isSameDay(day, new Date());
                const isSelected = isSameDay(day, selectedDate);
                const dayAppointments = appointments.filter(apt =>
                  isSameDay(new Date(apt.date), day)
                );

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      'p-3 md:p-4 rounded-xl border-2 transition active:scale-95',
                      isSelected
                        ? 'border-purple-600 bg-purple-50'
                        : isToday
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="text-center">
                      <div className="text-xs text-gray-600 mb-1">
                        {format(day, 'EEE', { locale: ptBR })}
                      </div>
                      <div className={cn(
                        'text-xl md:text-2xl font-bold',
                        isSelected ? 'text-purple-600' : isToday ? 'text-blue-600' : 'text-gray-900'
                      )}>
                        {format(day, 'd')}
                      </div>
                      {dayAppointments.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                            {dayAppointments.length}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Agendamentos de {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h2>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base md:text-lg">Nenhum agendamento</p>
            <button
              onClick={() => openModal()}
              className="mt-4 text-purple-600 hover:text-purple-700 font-semibold text-sm md:text-base"
            >
              Criar agendamento
            </button>
          </div>
        ) : (
          <div className="p-4 md:p-6 space-y-3 md:space-y-4">
            {/* Desktop: Cards expandidos */}
            <div className="hidden md:block space-y-4">
              {todayAppointments.map((appointment) => {
                const statusConfig = statusColors[appointment.status];
                const client = getClient(appointment);
                
                return (
                  <div
                    key={appointment.id}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {client.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{client.name}</h3>
                            <p className="text-sm text-gray-600">{client.phone}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="flex items-center text-gray-700">
                            <Clock className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="text-sm">
                              {format(new Date(appointment.date), 'HH:mm')} ({appointment.service.duration}min)
                            </span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Scissors className="w-4 h-4 mr-2 text-purple-600" />
                            <span className="text-sm">{appointment.service.name}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <User className="w-4 h-4 mr-2 text-green-600" />
                            <span className="text-sm">{appointment.barber.name}</span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <p className="mt-2 text-sm text-gray-600 italic">&quot;{appointment.notes}&quot;</p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <span className={cn('px-3 py-1 text-xs font-semibold rounded-full', statusConfig.bg, statusConfig.text)}>
                          {statusConfig.label}
                        </span>

                        <div className="flex items-center gap-2">
                          {appointment.status === 'scheduled' && (
                            <button
                              onClick={() => updateStatus(appointment.id, 'confirmed')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Confirmar"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          )}
                          {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                            <button
                              onClick={() => updateStatus(appointment.id, 'completed')}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                              title="Concluir"
                            >
                              <Scissors className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => sendNotification(appointment.id)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition"
                            title="Lembrete"
                          >
                            <Bell className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openModal(appointment)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => updateStatus(appointment.id, 'cancelled')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Cancelar"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(appointment.id)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                            title="Excluir"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile: Cards compactos */}
            <div className="md:hidden space-y-3">
              {todayAppointments.map((appointment) => {
                const statusConfig = statusColors[appointment.status];
                const client = getClient(appointment);
                
                return (
                  <MobileCard key={appointment.id}>
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {client.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{client.name}</h3>
                        <span className={cn('inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1', statusConfig.bg, statusConfig.text)}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <MobileCardItem
                        icon={<Clock className="w-4 h-4" />}
                        label="Horário"
                        value={`${format(new Date(appointment.date), 'HH:mm')} (${appointment.service.duration}min)`}
                      />
                      <MobileCardItem
                        icon={<Scissors className="w-4 h-4" />}
                        label="Serviço"
                        value={appointment.service.name}
                      />
                      <MobileCardItem
                        icon={<User className="w-4 h-4" />}
                        label="Barbeiro"
                        value={appointment.barber.name}
                      />
                    </div>

                    <MobileCardActions>
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => updateStatus(appointment.id, 'confirmed')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition active:scale-95 text-sm"
                        >
                          <Check className="w-4 h-4" />
                          Confirmar
                        </button>
                      )}
                      {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                        <button
                          onClick={() => updateStatus(appointment.id, 'completed')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition active:scale-95 text-sm"
                        >
                          <Scissors className="w-4 h-4" />
                          Concluir
                        </button>
                      )}
                      <button
                        onClick={() => openModal(appointment)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition active:scale-95 text-sm"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => sendNotification(appointment.id)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-yellow-50 text-yellow-600 rounded-lg font-medium hover:bg-yellow-100 transition active:scale-95 text-sm"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    </MobileCardActions>
                  </MobileCard>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal Responsivo */}
      <ResponsiveModal
        isOpen={showModal}
        onClose={closeModal}
        title={editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
            <select
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white"
            >
              <option value="">Selecione</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Serviço *</label>
            <select
              required
              value={formData.serviceId}
              onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white"
            >
              <option value="">Selecione</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - R$ {Number(s.price).toFixed(2)} ({s.duration}min)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Barbeiro *</label>
            <select
              required
              value={formData.barberId}
              onChange={(e) => setFormData({ ...formData, barberId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white"
            >
              <option value="">Selecione</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Horário *</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none text-gray-900 bg-white"
              placeholder="Observações..."
            />
          </div>

          <ModalActions>
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition active:scale-95"
            >
              {editingAppointment ? 'Atualizar' : 'Agendar'}
            </button>
          </ModalActions>
        </form>
      </ResponsiveModal>
    </div>
  );
}