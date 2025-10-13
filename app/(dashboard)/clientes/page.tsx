'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Search, Edit, Trash2, Phone, Mail, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MobileCard, MobileCardItem, MobileCardActions } from '@/components/ui/MobileCard';
import { ResponsiveModal, ModalActions } from '@/components/ui/ResponsiveModal';
import { cn, formatPhone } from '@/lib/utils/cn';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  birthDate?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  _count?: {
    appointments: number;
  };
}

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    notes: ''
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error: any) {
      if (error.response?.data?.code === 'CUSTOMER_LIMIT_REACHED') {
        alert('Limite de clientes atingido! Faça upgrade do seu plano.');
      } else {
        console.error('Erro ao carregar clientes:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  function openModal(customer?: Customer) {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone,
        birthDate: customer.birthDate ? format(new Date(customer.birthDate), 'yyyy-MM-dd') : '',
        notes: customer.notes || ''
      });
    } else {
      setEditingCustomer(null);
      setFormData({ name: '', email: '', phone: '', birthDate: '', notes: '' });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '', birthDate: '', notes: '' });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, formData);
        alert('Cliente atualizado com sucesso!');
      } else {
        await api.post('/customers', formData);
        alert('Cliente cadastrado com sucesso!');
      }
      closeModal();
      loadCustomers();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao salvar cliente');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      await api.delete(`/customers/${id}`);
      alert('Cliente excluído com sucesso!');
      loadCustomers();
    } catch (error) {
      alert('Erro ao excluir cliente');
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Gerencie seus clientes</p>
        </div>
        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 md:px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="md:inline">Novo Cliente</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm md:text-base"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Total</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{customers.length}</p>
            </div>
            <div className="bg-blue-100 p-2 md:p-3 rounded-lg">
              <User className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Ativos</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {customers.filter(c => c.active).length}
              </p>
            </div>
            <div className="bg-green-100 p-2 md:p-3 rounded-lg">
              <User className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Novos Este Mês</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {customers.filter(c => {
                  const created = new Date(c.createdAt);
                  const now = new Date();
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="bg-purple-100 p-2 md:p-3 rounded-lg">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 text-center">
          <User className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-base md:text-lg">
            {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          </p>
          <button
            onClick={() => openModal()}
            className="mt-4 text-purple-600 hover:text-purple-700 font-semibold text-sm md:text-base"
          >
            Cadastrar primeiro cliente
          </button>
        </div>
      ) : (
        <>
          {/* Desktop: Tabela */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Nascimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agendamentos
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            {customer.notes && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">{customer.notes}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {formatPhone(customer.phone)}
                          </div>
                          {customer.email && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              {customer.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.birthDate ? format(new Date(customer.birthDate), 'dd/MM/yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {customer._count?.appointments || 0} agendamentos
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                          customer.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        )}>
                          {customer.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openModal(customer)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile: Cards */}
          <div className="md:hidden space-y-3">
            {filteredCustomers.map((customer) => (
              <MobileCard key={customer.id}>
                {/* Header do Card */}
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{customer.name}</h3>
                    <span className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1',
                      customer.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    )}>
                      {customer.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>

                {/* Informações */}
                <div className="space-y-2">
                  <MobileCardItem
                    icon={<Phone className="w-4 h-4" />}
                    label="Telefone"
                    value={formatPhone(customer.phone)}
                  />
                  
                  {customer.email && (
                    <MobileCardItem
                      icon={<Mail className="w-4 h-4" />}
                      label="Email"
                      value={customer.email}
                    />
                  )}
                  
                  {customer.birthDate && (
                    <MobileCardItem
                      icon={<Calendar className="w-4 h-4" />}
                      label="Nascimento"
                      value={format(new Date(customer.birthDate), 'dd/MM/yyyy')}
                    />
                  )}
                  
                  <MobileCardItem
                    label="Agendamentos"
                    value={
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        {customer._count?.appointments || 0}
                      </span>
                    }
                  />
                </div>

                {/* Ações */}
                <MobileCardActions>
                  <button
                    onClick={() => openModal(customer)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition active:scale-95"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </MobileCardActions>
              </MobileCard>
            ))}
          </div>
        </>
      )}

      {/* Modal Responsivo */}
      <ResponsiveModal
        isOpen={showModal}
        onClose={closeModal}
        title={editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="João Silva"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="joao@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Nascimento
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              placeholder="Preferências, alergias, etc..."
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
              {editingCustomer ? 'Atualizar' : 'Cadastrar'}
            </button>
          </ModalActions>
        </form>
      </ResponsiveModal>
    </div>
  );
}