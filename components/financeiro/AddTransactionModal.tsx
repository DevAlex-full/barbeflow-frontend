'use client';

import { useState, useEffect } from 'react';
import { X, Search, UserPlus, ChevronDown } from 'lucide-react';
import { transactionsApi } from '@/lib/api/transactions';
import api from '@/lib/api';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Barber { id: string; name: string; commissionPercentage: number; }
interface Customer { id: string; name: string; phone: string; }
interface Service { id: string; name: string; price: number; }

export function AddTransactionModal({ isOpen, onClose, onSuccess }: AddTransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash'
  });

  // ── Barbeiro ─────────────────────────────────────────────
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarberId, setSelectedBarberId] = useState('');

  // ── Cliente ──────────────────────────────────────────────
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  // ── Serviço ──────────────────────────────────────────────
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceResults, setServiceResults] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isFreeService, setIsFreeService] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const categories = {
    income: ['service', 'product', 'other'],
    expense: ['salary', 'commission', 'rent', 'utilities', 'supplies', 'other']
  };

  const paymentMethods = [
    { value: 'cash', label: 'Dinheiro' },
    { value: 'pix', label: 'PIX' },
    { value: 'credit', label: 'Cartão de Crédito' },
    { value: 'debit', label: 'Cartão de Débito' }
  ];

  // Carregar barbeiros ao abrir
  useEffect(() => {
    if (isOpen) loadBarbers();
  }, [isOpen]);

  async function loadBarbers() {
    try {
      const res = await api.get('/users?role=barber&active=true');
      setBarbers(res.data || []);
    } catch {
      setBarbers([]);
    }
  }

  // Buscar clientes ao digitar
  useEffect(() => {
    if (customerSearch.length < 2) { setCustomerResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/customers?search=${customerSearch}`);
        setCustomerResults(res.data?.customers || res.data || []);
        setShowCustomerDropdown(true);
      } catch { setCustomerResults([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  // Buscar serviços ao digitar
  useEffect(() => {
    if (serviceSearch.length < 2) { setServiceResults([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(`/services?search=${serviceSearch}&active=true`);
        setServiceResults(res.data || []);
        setShowServiceDropdown(true);
      } catch { setServiceResults([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [serviceSearch]);

  function resetForm() {
    setFormData({ type: 'income', category: '', description: '', amount: '', date: new Date().toISOString().split('T')[0], paymentMethod: 'cash' });
    setSelectedBarberId('');
    setCustomerSearch(''); setCustomerResults([]); setSelectedCustomer(null);
    setIsNewCustomer(false); setNewCustomerName(''); setNewCustomerPhone('');
    setServiceSearch(''); setServiceResults([]); setSelectedService(null);
    setIsFreeService(false);
  }

  function handleSelectCustomer(c: Customer) {
    setSelectedCustomer(c);
    setCustomerSearch(c.name);
    setIsNewCustomer(false);
    setShowCustomerDropdown(false);
  }

  function handleNewCustomer() {
    setSelectedCustomer(null);
    setIsNewCustomer(true);
    setCustomerSearch('');
    setShowCustomerDropdown(false);
  }

  function handleSelectService(s: Service) {
    setSelectedService(s);
    setServiceSearch(s.name);
    setIsFreeService(false);
    setShowServiceDropdown(false);
    // Auto-preenche o valor
    setFormData(prev => ({ ...prev, amount: String(s.price), description: s.name }));
  }

  function handleFreeService() {
    setSelectedService(null);
    setIsFreeService(true);
    setShowServiceDropdown(false);
    setFormData(prev => ({ ...prev, amount: '', description: serviceSearch }));
  }

  const isIncomeWithBarber = formData.type === 'income';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validações extras para receita
    if (isIncomeWithBarber) {
      if (!selectedBarberId) { alert('Selecione um barbeiro'); return; }
      if (!selectedCustomer && !isNewCustomer) { alert('Selecione ou cadastre um cliente'); return; }
      if (isNewCustomer && !newCustomerName.trim()) { alert('Digite o nome do cliente'); return; }
      if (!selectedService && !isFreeService) { alert('Selecione ou digite um serviço'); return; }
      if (isFreeService && !serviceSearch.trim()) { alert('Digite o nome do serviço'); return; }
    }

    try {
      setLoading(true);
      await transactionsApi.create({
        type: formData.type,
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date + 'T12:00:00').toISOString(),
        paymentMethod: formData.paymentMethod,
        // Campos de receita manual
        barberId: isIncomeWithBarber ? selectedBarberId : undefined,
        customerId: selectedCustomer?.id,
        customerName: isNewCustomer ? newCustomerName.trim() : undefined,
        customerPhone: isNewCustomer ? newCustomerPhone : undefined,
        serviceName: selectedService?.name || (isFreeService ? serviceSearch.trim() : undefined)
      });

      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      alert('Erro ao criar transação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nova Transação</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button"
                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                className={`p-3 rounded-lg border-2 font-medium transition ${formData.type === 'income' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                💰 Receita
              </button>
              <button type="button"
                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                className={`p-3 rounded-lg border-2 font-medium transition ${formData.type === 'expense' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>
                💸 Despesa
              </button>
            </div>
          </div>

          {/* ── CAMPOS EXCLUSIVOS DE RECEITA ── */}
          {isIncomeWithBarber && (
            <div className="space-y-4 bg-green-50 dark:bg-green-900/10 rounded-xl p-4 border border-green-200 dark:border-green-800">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">Detalhes do Atendimento</p>

              {/* Barbeiro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Barbeiro *</label>
                <select
                  value={selectedBarberId}
                  onChange={e => setSelectedBarberId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  required>
                  <option value="">Selecione o barbeiro...</option>
                  {barbers.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.commissionPercentage}%)</option>
                  ))}
                </select>
              </div>

              {/* Cliente */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente *</label>
                {!isNewCustomer ? (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={customerSearch}
                      onChange={e => { setCustomerSearch(e.target.value); setSelectedCustomer(null); }}
                      placeholder="Buscar cliente pelo nome..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    />
                    {showCustomerDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {customerResults.map(c => (
                          <button key={c.id} type="button" onClick={() => handleSelectCustomer(c)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm text-gray-900 dark:text-white">
                            {c.name} {c.phone && <span className="text-gray-400 text-xs">· {c.phone}</span>}
                          </button>
                        ))}
                        <button type="button" onClick={handleNewCustomer}
                          className="w-full text-left px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-sm text-green-600 font-semibold flex items-center gap-2 border-t border-gray-100 dark:border-gray-600">
                          <UserPlus className="w-4 h-4" /> Novo cliente
                        </button>
                      </div>
                    )}
                    {customerSearch.length >= 2 && customerResults.length === 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 rounded-lg shadow-lg z-10">
                        <button type="button" onClick={handleNewCustomer}
                          className="w-full text-left px-4 py-2 text-sm text-green-600 font-semibold flex items-center gap-2">
                          <UserPlus className="w-4 h-4" /> Cadastrar "{customerSearch}" como novo cliente
                        </button>
                      </div>
                    )}
                    {selectedCustomer && (
                      <p className="text-xs text-green-600 mt-1">✓ {selectedCustomer.name} selecionado</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-green-600 font-semibold">+ Novo cliente</span>
                      <button type="button" onClick={() => { setIsNewCustomer(false); setNewCustomerName(''); setNewCustomerPhone(''); }}
                        className="text-xs text-gray-400 underline">Cancelar</button>
                    </div>
                    <input type="text" value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)}
                      placeholder="Nome do cliente *"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500" />
                    <input type="tel" value={newCustomerPhone} onChange={e => setNewCustomerPhone(e.target.value)}
                      placeholder="Telefone (opcional)"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500" />
                  </div>
                )}
              </div>

              {/* Serviço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Serviço *</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={serviceSearch}
                    onChange={e => { setServiceSearch(e.target.value); setSelectedService(null); setIsFreeService(false); }}
                    placeholder="Buscar serviço ou digitar livremente..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  />
                  {showServiceDropdown && serviceResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {serviceResults.map(s => (
                        <button key={s.id} type="button" onClick={() => handleSelectService(s)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm text-gray-900 dark:text-white flex justify-between">
                          <span>{s.name}</span>
                          <span className="text-green-600 font-semibold">R$ {Number(s.price).toFixed(2)}</span>
                        </button>
                      ))}
                      {serviceSearch.length >= 2 && (
                        <button type="button" onClick={handleFreeService}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 text-sm text-gray-500 border-t border-gray-100 dark:border-gray-600 italic">
                          Usar "{serviceSearch}" como texto livre
                        </button>
                      )}
                    </div>
                  )}
                  {selectedService && (
                    <p className="text-xs text-green-600 mt-1">✓ {selectedService.name} — R$ {Number(selectedService.price).toFixed(2)} (valor preenchido automaticamente)</p>
                  )}
                  {isFreeService && (
                    <p className="text-xs text-gray-500 mt-1">Serviço livre — digite o valor manualmente</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              required>
              <option value="">Selecione...</option>
              {categories[formData.type].map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'service' && 'Serviço'}
                  {cat === 'product' && 'Produto'}
                  {cat === 'salary' && 'Salário'}
                  {cat === 'commission' && 'Comissão'}
                  {cat === 'rent' && 'Aluguel'}
                  {cat === 'utilities' && 'Contas (água, luz, etc)'}
                  {cat === 'supplies' && 'Materiais'}
                  {cat === 'other' && 'Outro'}
                </option>
              ))}
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
            <input type="text" value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: Corte de cabelo" required />
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor (R$)
              {selectedService && <span className="text-xs text-green-500 ml-2">— preenchido pelo serviço</span>}
            </label>
            <input type="number" step="0.01" min="0"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              placeholder="0,00" required />
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data</label>
            <input type="date" value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              required />
          </div>

          {/* Método de Pagamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Método de Pagamento</label>
            <select value={formData.paymentMethod}
              onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500">
              {paymentMethods.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50">
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}