'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Calendar as CalendarIcon, Clock, User, Scissors, ChevronLeft, ChevronRight, Edit, Trash2, Check, X, Bell } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: string;
  date: string;
  status: string;
  notes?: string;
  price: number;
  customer: {
    id: string;
    name: string;
    phone: string;
  };
  barber: {
    id: string;
    name: string;
  };
  service: {
    id: string;
    name: string;
    duration: number;
  };
}

interface Customer {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  active?: boolean;
}

interface Barber {
  id: string;
  name: string;
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
    customerId: '',
    serviceId: '',
    barberId: '',
    date: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  async function loadInitialData() {
    try {
      const [customersRes, servicesRes, barbershopRes] = await Promise.all([
        api.get('/customers'),
        api.get('/services'),
        api.get('/barbershops')
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
      setFormData({
        customerId: appointment.customer.id,
        serviceId: appointment.service.id,
        barberId: appointment.barber.id,
        date: format(appointmentDate, 'yyyy-MM-dd'),
        time: format(appointmentDate, 'HH:mm'),
        notes: appointment.notes || ''
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        customerId: '',
        serviceId: '',
        barberId: '',
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: '',
        notes: ''
      });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingAppointment(null);
    setFormData({
      customerId: '',
      serviceId: '',
      barberId: '',
      date: '',
      time: '',
      notes: ''
    });
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
        alert('Agendamento atualizado com sucesso!');
      } else {
        await api.post('/appointments', payload);
        alert('Agendamento criado com sucesso!');
      }
      closeModal();
      loadAppointments();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao salvar agendamento');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return;

    try {
      await api.delete(`/appointments/${id}`);
      alert('Agendamento excluído com sucesso!');
      loadAppointments();
    } catch (error) {
      alert('Erro ao excluir agendamento');
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      await api.put(`/appointments/${id}`, { status });
      loadAppointments();
    } catch (error) {
      alert('Erro ao atualizar status');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600 mt-1">Gerencie sua agenda</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Agendamento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Hoje</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {todayAppointments.length}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Confirmados</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {todayAppointments.filter(a => a.status === 'confirmed').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Concluídos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {todayAppointments.filter(a => a.status === 'completed').length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Scissors className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Receita Hoje</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                R$ {todayAppointments
                  .filter(a => a.status === 'completed')
                  .reduce((acc, a) => acc + Number(a.price), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Calendário Semanal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {format(currentWeek, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentWeek(new Date())}
              className="px-4 py-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 rounded-lg transition"
            >
              Hoje
            </button>
            <button
              onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

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
                className={`p-4 rounded-xl border-2 transition ${isSelected
                  ? 'border-purple-600 bg-purple-50'
                  : isToday
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">
                    {format(day, 'EEE', { locale: ptBR })}
                  </div>
                  <div className={`text-2xl font-bold ${isSelected ? 'text-purple-600' : isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
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

      {/* Lista de Agendamentos do Dia */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Agendamentos de {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h2>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nenhum agendamento para este dia</p>
            <button
              onClick={() => openModal()}
              className="mt-4 text-purple-600 hover:text-purple-700 font-semibold"
            >
              Criar agendamento
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {todayAppointments.map((appointment) => {
              const statusConfig = statusColors[appointment.status];

              return (
                <div
                  key={appointment.id}
                  className="border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gradient-to-br from-purple-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {appointment.customer.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">
                            {appointment.customer.name}
                          </h3>
                          <p className="text-sm text-gray-600">{appointment.customer.phone}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
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
                          title="Enviar Lembrete"
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
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cliente *
                </label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="">Selecione um cliente</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serviço *
                </label>
                <select
                  required
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="">Selecione um serviço</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - R$ {Number(service.price).toFixed(2)} ({service.duration}min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barbeiro *
                </label>
                <select
                  required
                  value={formData.barberId}
                  onChange={(e) => setFormData({ ...formData, barberId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="">Selecione um barbeiro</option>
                  {barbers.map((barber) => (
                    <option key={barber.id} value={barber.id}>
                      {barber.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Observações sobre o agendamento..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
                >
                  {editingAppointment ? 'Atualizar' : 'Agendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}