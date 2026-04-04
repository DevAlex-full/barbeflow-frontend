'use client';

import { useState, useEffect } from 'react';
import {
  Package, Plus, Search, AlertTriangle, TrendingUp, TrendingDown,
  BarChart3, Edit2, Trash2, ArrowUpCircle, ArrowDownCircle,
  SlidersHorizontal, X, Save, Loader2, History, RefreshCw
} from 'lucide-react';
import api from '@/lib/api';

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  costPrice: number | null;
  salePrice: number | null;
  supplier: string | null;
  notes: string | null;
  movements: any[];
}

const CATEGORIES: Record<string, string> = {
  product:   'Produto',
  supply:    'Insumo',
  equipment: 'Equipamento',
  other:     'Outro'
};

const UNITS = ['un', 'ml', 'l', 'g', 'kg', 'cx', 'fr'];

const BR = (n: number | null) => n != null ? `R$ ${Number(n).toFixed(2).replace('.', ',')}` : '-';

export default function EstoquePage() {
  const [items, setItems]           = useState<StockItem[]>([]);
  const [summary, setSummary]       = useState<any>(null);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showLowStock, setShowLowStock]     = useState(false);

  // Modals
  const [showAddModal, setShowAddModal]           = useState(false);
  const [showEditModal, setShowEditModal]         = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal]   = useState(false);
  const [selectedItem, setSelectedItem]           = useState<StockItem | null>(null);
  const [movements, setMovements]                 = useState<any[]>([]);

  // Forms
  const [form, setForm] = useState({
    name: '', category: 'product', quantity: 0, minQuantity: 5,
    unit: 'un', costPrice: '', salePrice: '', supplier: '', notes: ''
  });
  const [movForm, setMovForm] = useState({ type: 'in', quantity: 1, reason: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsRes, summaryRes] = await Promise.all([
        api.get('/stock'),
        api.get('/stock/summary')
      ]);
      setItems(itemsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return alert('Nome é obrigatório');
    try {
      setSaving(true);
      await api.post('/stock', {
        ...form,
        quantity:    Number(form.quantity),
        minQuantity: Number(form.minQuantity),
        costPrice: form.costPrice ? Number(form.costPrice) : null,
        salePrice: form.salePrice ? Number(form.salePrice) : null
      });
      setShowAddModal(false);
      resetForm();
      loadData();
    } catch { alert('Erro ao criar item'); }
    finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!selectedItem || !form.name.trim()) return;
    try {
      setSaving(true);
      await api.put(`/stock/${selectedItem.id}`, {
        ...form,
        minQuantity: Number(form.minQuantity),
        costPrice: form.costPrice ? Number(form.costPrice) : null,
        salePrice: form.salePrice ? Number(form.salePrice) : null
      });
      setShowEditModal(false);
      loadData();
    } catch { alert('Erro ao atualizar item'); }
    finally { setSaving(false); }
  };

  const handleMovement = async () => {
    if (!selectedItem) return;
    try {
      setSaving(true);
      await api.post(`/stock/${selectedItem.id}/movement`, {
        type:     movForm.type,
        quantity: Number(movForm.quantity),
        reason:   movForm.reason
      });
      setShowMovementModal(false);
      setMovForm({ type: 'in', quantity: 1, reason: '' });
      loadData();
      alert('Movimento registrado!');
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Erro ao registrar movimento');
    }
    finally { setSaving(false); }
  };

  const handleDelete = async (item: StockItem) => {
    if (!confirm(`Remover "${item.name}" do estoque?`)) return;
    try {
      await api.delete(`/stock/${item.id}`);
      loadData();
    } catch { alert('Erro ao remover item'); }
  };

  const openHistory = async (item: StockItem) => {
    setSelectedItem(item);
    try {
      const res = await api.get(`/stock/${item.id}/movements`);
      setMovements(res.data);
    } catch { setMovements([]); }
    setShowHistoryModal(true);
  };

  const openEdit = (item: StockItem) => {
    setSelectedItem(item);
    setForm({
      name: item.name, category: item.category,
      quantity: item.quantity, minQuantity: item.minQuantity,
      unit: item.unit,
      costPrice: item.costPrice != null ? String(item.costPrice) : '',
      salePrice: item.salePrice != null ? String(item.salePrice) : '',
      supplier: item.supplier || '', notes: item.notes || ''
    });
    setShowEditModal(true);
  };

  const openMovement = (item: StockItem) => {
    setSelectedItem(item);
    setMovForm({ type: 'in', quantity: 1, reason: '' });
    setShowMovementModal(true);
  };

  const resetForm = () => setForm({ name: '', category: 'product', quantity: 0, minQuantity: 5, unit: 'un', costPrice: '', salePrice: '', supplier: '', notes: '' });

  const filtered = items.filter(item => {
    const matchSearch   = !search       || item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat      = !filterCategory || item.category === filterCategory;
    const matchLowStock = !showLowStock  || item.quantity <= item.minQuantity;
    return matchSearch && matchCat && matchLowStock;
  });

  const stockStatus = (item: StockItem) => {
    if (item.quantity === 0)              return { label: 'Sem estoque', color: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' };
    if (item.quantity <= item.minQuantity) return { label: 'Estoque baixo', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' };
    return { label: 'Ok', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' };
  };

  return (
    <>
      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl shadow-md shadow-teal-200 dark:shadow-teal-900/30">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Controle de Estoque</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Gerencie produtos, insumos e equipamentos</p>
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Novo Item
        </button>
      </div>

      {/* ── Summary KPIs ── */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total de Itens',    value: String(summary.totalItems),    icon: Package,        color: 'text-teal-600'   },
            { label: 'Estoque Baixo',     value: String(summary.lowStockItems), icon: AlertTriangle,  color: 'text-orange-500' },
            { label: 'Sem Estoque',       value: String(summary.outOfStock),    icon: X,              color: 'text-red-500'    },
            { label: 'Valor Total (custo)', value: BR(summary.totalValue),      icon: BarChart3,      color: 'text-indigo-600' }
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Filters ── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" placeholder="Buscar item..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 transition"
          />
        </div>
        <select
          value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500"
        >
          <option value="">Todas categorias</option>
          {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button
          onClick={() => setShowLowStock(!showLowStock)}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-xl border-2 transition font-medium ${
            showLowStock
              ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
              : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> Estoque baixo
        </button>
        <button onClick={loadData} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition text-gray-400">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* ── Table ── */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-20">
          <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {items.length === 0 ? 'Nenhum item cadastrado' : 'Nenhum item encontrado'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50">
                  {['Nome', 'Categoria', 'Quantidade', 'Mín.', 'Custo', 'Venda', 'Fornecedor', 'Status', 'Ações'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {filtered.map(item => {
                  const status = stockStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition">
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white text-sm">{item.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">{CATEGORIES[item.category] || item.category}</td>
                      <td className="px-5 py-3">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                        <span className="text-xs text-gray-400 ml-1">{item.unit}</span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">{item.minQuantity} {item.unit}</td>
                      <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">{BR(item.costPrice)}</td>
                      <td className="px-5 py-3 text-sm text-gray-700 dark:text-gray-300">{BR(item.salePrice)}</td>
                      <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">{item.supplier || '-'}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openMovement(item)} title="Entrada/Saída"
                            className="p-1.5 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition">
                            <SlidersHorizontal className="w-4 h-4" />
                          </button>
                          <button onClick={() => openHistory(item)} title="Histórico"
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition">
                            <History className="w-4 h-4" />
                          </button>
                          <button onClick={() => openEdit(item)} title="Editar"
                            className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(item)} title="Remover"
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: Adicionar / Editar ── */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                {showAddModal ? 'Novo Item' : 'Editar Item'}
              </h2>
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Nome *</label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Categoria</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500">
                    {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Unidade</label>
                  <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500">
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                {showAddModal && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Quantidade inicial</label>
                    <input type="number" min="0" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: Number(e.target.value) }))}
                      className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500" />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Qtd. mínima (alerta)</label>
                  <input type="number" min="0" value={form.minQuantity} onChange={e => setForm(p => ({ ...p, minQuantity: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Preço de custo (R$)</label>
                  <input type="number" step="0.01" min="0" value={form.costPrice} onChange={e => setForm(p => ({ ...p, costPrice: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500" placeholder="0,00" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Preço de venda (R$)</label>
                  <input type="number" step="0.01" min="0" value={form.salePrice} onChange={e => setForm(p => ({ ...p, salePrice: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500" placeholder="0,00" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Fornecedor</label>
                  <input type="text" value={form.supplier} onChange={e => setForm(p => ({ ...p, supplier: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Observações</label>
                  <textarea rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 resize-none" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Cancelar
              </button>
              <button onClick={showAddModal ? handleCreate : handleEdit} disabled={saving}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {showAddModal ? 'Criar Item' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Movimento ── */}
      {showMovementModal && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Registrar Movimentação</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selectedItem.name} — estoque atual: <strong>{selectedItem.quantity} {selectedItem.unit}</strong></p>
              </div>
              <button onClick={() => setShowMovementModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Tipo de Movimento</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'in',         label: 'Entrada',  icon: ArrowUpCircle,   color: 'text-emerald-600' },
                    { key: 'out',        label: 'Saída',    icon: ArrowDownCircle, color: 'text-red-500'     },
                    { key: 'adjustment', label: 'Ajuste',   icon: SlidersHorizontal, color: 'text-indigo-600' }
                  ].map(({ key, label, icon: Icon, color }) => (
                    <button key={key} onClick={() => setMovForm(p => ({ ...p, type: key }))}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition text-sm font-medium ${
                        movForm.type === key
                          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                          : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/40'
                      }`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                      <span className="text-gray-700 dark:text-gray-300">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Quantidade ({selectedItem.unit})
                  {movForm.type === 'adjustment' && <span className="ml-1 text-indigo-500">— será o novo total</span>}
                </label>
                <input type="number" min="0" value={movForm.quantity} onChange={e => setMovForm(p => ({ ...p, quantity: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Motivo (opcional)</label>
                <input type="text" value={movForm.reason} onChange={e => setMovForm(p => ({ ...p, reason: e.target.value }))}
                  placeholder="Ex: Compra fornecedor, uso no serviço..."
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500" />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => setShowMovementModal(false)}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                Cancelar
              </button>
              <button onClick={handleMovement} disabled={saving}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Histórico ── */}
      {showHistoryModal && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Histórico de Movimentos</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selectedItem.name}</p>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 space-y-2">
              {movements.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-8">Nenhum movimento registrado</p>
              ) : movements.map((m: any) => {
                const icons: Record<string, React.ReactNode> = {
                  in:         <ArrowUpCircle className="w-4 h-4 text-emerald-500" />,
                  out:        <ArrowDownCircle className="w-4 h-4 text-red-500" />,
                  adjustment: <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                };
                const labels: Record<string, string> = { in: 'Entrada', out: 'Saída', adjustment: 'Ajuste' };
                return (
                  <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                    {icons[m.type]}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {labels[m.type]} — <span className="font-bold">{m.quantity} {selectedItem.unit}</span>
                      </p>
                      {m.reason && <p className="text-xs text-gray-400">{m.reason}</p>}
                    </div>
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(m.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}