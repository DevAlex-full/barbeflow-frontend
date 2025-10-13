'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Edit, Trash2, Scissors, Clock, DollarSign } from 'lucide-react';
import { ResponsiveModal, ModalActions } from '@/components/ui/ResponsiveModal';

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  active: boolean;
}

export default function ServicosPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  }

  function openModal(service?: Service) {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description || '',
        price: service.price.toString(),
        duration: service.duration.toString()
      });
    } else {
      setEditingService(null);
      setFormData({ name: '', description: '', price: '', duration: '' });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingService(null);
    setFormData({ name: '', description: '', price: '', duration: '' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingService) {
        await api.put(`/services/${editingService.id}`, formData);
        alert('Serviço atualizado!');
      } else {
        await api.post('/services', formData);
        alert('Serviço cadastrado!');
      }
      closeModal();
      loadServices();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao salvar');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este serviço?')) return;

    try {
      await api.delete(`/services/${id}`);
      alert('Serviço excluído!');
      loadServices();
    } catch (error) {
      alert('Erro ao excluir');
    }
  }

  async function toggleActive(id: string, active: boolean) {
    try {
      await api.put(`/services/${id}`, { active: !active });
      loadServices();
    } catch (error) {
      alert('Erro ao atualizar');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const totalRevenue = services.reduce((acc, s) => acc + Number(s.price), 0);
  const avgDuration = services.length > 0 
    ? Math.round(services.reduce((acc, s) => acc + s.duration, 0) / services.length)
    : 0;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Serviços</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Gerencie os serviços</p>
        </div>
        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 md:px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Serviço</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Total</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{services.length}</p>
            </div>
            <div className="bg-purple-100 p-2 md:p-3 rounded-lg">
              <Scissors className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Tempo</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{avgDuration}min</p>
            </div>
            <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 font-medium truncate">Ticket</p>
              <p className="text-xl md:text-3xl font-bold text-gray-900 mt-1">
                R$ {services.length > 0 ? (totalRevenue / services.length).toFixed(2) : '0'}
              </p>
            </div>
            <div className="bg-green-100 p-2 md:p-3 rounded-lg">
              <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Serviços */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {services.length === 0 ? (
          <div className="text-center py-12">
            <Scissors className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base md:text-lg">Nenhum serviço cadastrado</p>
            <button
              onClick={() => openModal()}
              className="mt-4 text-purple-600 hover:text-purple-700 font-semibold text-sm md:text-base"
            >
              Cadastrar primeiro serviço
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
            {services.map((service) => (
              <div
                key={service.id}
                className={`border-2 rounded-xl p-4 md:p-6 transition hover:shadow-lg ${
                  service.active ? 'border-gray-200' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 md:p-3 rounded-lg">
                    <Scissors className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(service)}
                      className="text-blue-600 hover:text-blue-700 p-2 active:scale-95"
                    >
                      <Edit className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-700 p-2 active:scale-95"
                    >
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                
                {service.description && (
                  <p className="text-gray-600 text-xs md:text-sm mb-4 line-clamp-2">{service.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-600" />
                    <span className="font-semibold text-base md:text-lg">R$ {Number(service.price).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
                    <span className="text-sm md:text-base">{service.duration} minutos</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className={`px-2 md:px-3 py-1 text-xs font-semibold rounded-full ${
                    service.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <button
                    onClick={() => toggleActive(service.id, service.active)}
                    className="text-xs md:text-sm text-purple-600 hover:text-purple-700 font-semibold active:scale-95"
                  >
                    {service.active ? 'Desativar' : 'Ativar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Responsivo */}
      <ResponsiveModal
        isOpen={showModal}
        onClose={closeModal}
        title={editingService ? 'Editar Serviço' : 'Novo Serviço'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Serviço *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="Ex: Corte + Barba"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              placeholder="Descreva o serviço..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preço (R$) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="50.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duração (minutos) *
              </label>
              <input
                type="number"
                required
                min="5"
                step="5"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="30"
              />
            </div>
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
              {editingService ? 'Atualizar' : 'Cadastrar'}
            </button>
          </ModalActions>
        </form>
      </ResponsiveModal>
    </div>
  );
}