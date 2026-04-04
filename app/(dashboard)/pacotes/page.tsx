'use client';

import { useState, useEffect } from 'react';
import {
  Gift, Plus, Search, Scissors, Calendar, Clock,
  CheckCircle2, XCircle, AlertCircle, ChevronRight,
  X, Save, Loader2, Users, RefreshCw, TrendingUp
} from 'lucide-react';
import api from '@/lib/api';

interface CustomerPackage {
  id: string;
  name: string;
  totalCuts: number;
  usedCuts: number;
  price: number;
  startDate: string;
  expirationDate: string;
  lastCutAt: string | null;
  status: string;
  notes: string | null;
  customer: { name: string; phone: string } | null;
  client:   { name: string; phone: string } | null;
  usages: any[];
}

const BR = (n: number) => `R$ ${Number(n).toFixed(2).replace('.', ',')}`;
const DT = (d: string) => new Date(d + (d.includes('T') ? '' : 'T12:00:00')).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

const STATUS_CFG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active:    { label: 'Ativo',      color: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', icon: CheckCircle2  },
  expired:   { label: 'Expirado',   color: 'bg-red-50 text-red-700 ring-1 ring-red-200',             icon: XCircle       },
  completed: { label: 'Concluído',  color: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',          icon: CheckCircle2  },
  cancelled: { label: 'Cancelado',  color: 'bg-gray-50 text-gray-500 ring-1 ring-gray-200',          icon: XCircle       },
};

export default function PacotesPage() {
  const [packages, setPackages] = useState<CustomerPackage[]>([]);
  const [summary, setSummary]   = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filterStatus, setFilterStatus] = useState('active');

  // Modals
  const [showAddModal, setShowAddModal]     = useState(false);
  const [showUseModal, setShowUseModal]     = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPkg, setSelectedPkg]       = useState<CustomerPackage | null>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [form, setForm] = useState({
    customerId: '', name: 'Pacote 4 Cortes', description: '',
    totalCuts: 4, price: '', startDate: '', expirationDate: '', notes: ''
  });
  const [useForm, setUseForm] = useState({ notes: '' });

  useEffect(() => {
    loadData();
    api.get('/customers').then(r => setCustomers(r.data)).catch(() => {});
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pkgRes, sumRes] = await Promise.all([
        api.get('/packages'),
        api.get('/packages/summary')
      ]);
      setPackages(pkgRes.data);
      setSummary(sumRes.data);
    } catch { console.error('Erro ao carregar pacotes'); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!form.name || !form.totalCuts || !form.price || !form.startDate || !form.expirationDate) {
      return alert('Preencha todos os campos obrigatórios');
    }
    try {
      setSaving(true);
      await api.post('/packages', {
        customerId:    form.customerId || null,
        name:          form.name,
        description:   form.description,
        totalCuts:     Number(form.totalCuts),
        price:         Number(form.price),
        startDate:     form.startDate + 'T12:00:00',
        expirationDate: form.expirationDate + 'T23:59:59',
        notes:         form.notes
      });
      setShowAddModal(false);
      resetForm();
      loadData();
    } catch { alert('Erro ao criar pacote'); }
    finally { setSaving(false); }
  };

  const handleUse = async () => {
    if (!selectedPkg) return;
    try {
      setSaving(true);
      const res = await api.post(`/packages/${selectedPkg.id}/use`, { notes: useForm.notes });
      setShowUseModal(false);
      setUseForm({ notes: '' });
      loadData();
      if (res.data.completed) {
        alert(`✅ Último corte registrado! Pacote "${selectedPkg.name}" concluído.`);
      } else {
        alert(`✂️ Corte registrado! Restam ${res.data.remaining} corte(s).`);
      }
    } catch (err: any) {
      alert(err?.response?.data?.error || 'Erro ao registrar uso');
    }
    finally { setSaving(false); }
  };

  const handleCancel = async (pkg: CustomerPackage) => {
    if (!confirm(`Cancelar pacote "${pkg.name}" de ${pkg.customer?.name || pkg.client?.name}?`)) return;
    try {
      await api.delete(`/packages/${pkg.id}`);
      loadData();
    } catch { alert('Erro ao cancelar pacote'); }
  };

  const resetForm = () => setForm({
    customerId: '', name: 'Pacote 4 Cortes', description: '',
    totalCuts: 4, price: '', startDate: '', expirationDate: '', notes: ''
  });

  const filtered = packages.filter(p => {
    const name    = (p.customer?.name || p.client?.name || '').toLowerCase();
    const pkgName = p.name.toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || pkgName.includes(search.toLowerCase());
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const progressPct = (pkg: CustomerPackage) =>
    pkg.totalCuts > 0 ? Math.round((pkg.usedCuts / pkg.totalCuts) * 100) : 0;

  return (
    <>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl shadow-md shadow-violet-200 dark:shadow-violet-900/30">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Pacotes de Clientes</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">Gerencie pacotes de cortes e serviços</p>
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Novo Pacote
        </button>
      </div>

      {/* ── KPIs ── */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Ativos',          value: String(summary.active),      color: 'text-emerald-600' },
            { label: 'Expirados',       value: String(summary.expired),     color: 'text-red-500'     },
            { label: 'Concluídos',      value: String(summary.completed),   color: 'text-blue-600'    },
            { label: 'Receita Total',   value: BR(summary.totalRevenue),    color: 'text-violet-600'  }
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {summary && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Cortes utilizados vs contratados</span>
            <span className="text-sm font-bold text-violet-600">{summary.usedCuts} / {summary.totalCuts}</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${summary.totalCuts > 0 ? (summary.usedCuts / summary.totalCuts) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{summary.remainingCuts} corte(s) restantes</p>
        </div>
      )}

      {/* ── Filters ── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar cliente ou pacote..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 transition"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: '', label: 'Todos' },
            { key: 'active', label: 'Ativos' },
            { key: 'expired', label: 'Expirados' },
            { key: 'completed', label: 'Concluídos' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFilterStatus(key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                filterStatus === key
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}>
              {label}
            </button>
          ))}
        </div>
        <button onClick={loadData} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition text-gray-400">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* ── Cards ── */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-20">
          <Gift className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {packages.length === 0 ? 'Nenhum pacote cadastrado' : 'Nenhum pacote encontrado'}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(pkg => {
            const clientName = pkg.customer?.name || pkg.client?.name || 'Sem cliente';
            const clientPhone = pkg.customer?.phone || pkg.client?.phone || '';
            const { label: sLabel, color: sColor, icon: SIcon } = STATUS_CFG[pkg.status] || STATUS_CFG.active;
            const pct = progressPct(pkg);
            const remaining = pkg.totalCuts - pkg.usedCuts;
            const isExpiringSoon = pkg.status === 'active' &&
              new Date(pkg.expirationDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

            return (
              <div key={pkg.id} className={`bg-white dark:bg-gray-800 rounded-2xl border ${
                isExpiringSoon ? 'border-orange-300 dark:border-orange-700' : 'border-gray-100 dark:border-gray-700'
              } overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
                {/* Card header */}
                <div className="p-5 pb-3">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white truncate">{clientName}</p>
                      {clientPhone && <p className="text-xs text-gray-400">{clientPhone}</p>}
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ml-2 ${sColor}`}>
                      <SIcon className="w-3 h-3" />
                      {sLabel}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 mt-1">{pkg.name}</p>
                </div>

                {/* Progress */}
                <div className="px-5 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">Cortes utilizados</span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{pkg.usedCuts}/{pkg.totalCuts}</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        pct >= 100 ? 'bg-blue-500' : pct >= 75 ? 'bg-orange-500' : 'bg-violet-500'
                      }`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-gray-400">
                      {remaining > 0 ? `${remaining} restante(s)` : 'Concluído'}
                    </span>
                    <span className="text-[11px] font-semibold text-violet-600">{BR(pkg.price)}</span>
                  </div>
                </div>

                {/* Dates */}
                <div className="px-5 pb-4 grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-400 mb-0.5">Início</p>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{DT(pkg.startDate)}</p>
                  </div>
                  <div className={`rounded-xl p-2.5 ${isExpiringSoon ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                    <p className={`text-[10px] mb-0.5 ${isExpiringSoon ? 'text-orange-500' : 'text-gray-400'}`}>
                      Expira{isExpiringSoon ? ' em breve ⚠️' : ''}
                    </p>
                    <p className={`text-xs font-medium ${isExpiringSoon ? 'text-orange-700 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'}`}>
                      {DT(pkg.expirationDate)}
                    </p>
                  </div>
                </div>

                {pkg.lastCutAt && (
                  <div className="px-5 pb-3">
                    <p className="text-[11px] text-gray-400">
                      Último corte: <span className="font-medium">{DT(pkg.lastCutAt)}</span>
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="px-4 pb-4 flex gap-2">
                  {pkg.status === 'active' && remaining > 0 && (
                    <button
                      onClick={() => { setSelectedPkg(pkg); setShowUseModal(true); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-xl transition"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      Registrar Corte
                    </button>
                  )}
                  <button
                    onClick={() => { setSelectedPkg(pkg); setShowDetailModal(true); }}
                    className="p-2 border border-gray-200 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {pkg.status === 'active' && (
                    <button
                      onClick={() => handleCancel(pkg)}
                      className="p-2 border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL: Novo Pacote ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Novo Pacote</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Cliente</label>
                <select value={form.customerId} onChange={e => setForm(p => ({ ...p, customerId: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500">
                  <option value="">Selecionar cliente...</option>
                  {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Nome do Pacote *</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Total de Cortes *</label>
                  <input type="number" min="1" value={form.totalCuts} onChange={e => setForm(p => ({ ...p, totalCuts: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Valor (R$) *</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                    placeholder="0,00"
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Data Início *</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Data de Expiração *</label>
                  <input type="date" value={form.expirationDate} onChange={e => setForm(p => ({ ...p, expirationDate: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Observações</label>
                <textarea rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 resize-none" />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancelar</button>
              <button onClick={handleCreate} disabled={saving} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Criar Pacote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Registrar Corte ── */}
      {showUseModal && selectedPkg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Registrar Corte</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedPkg.customer?.name || selectedPkg.client?.name} —
                  <span className="font-semibold text-violet-600 ml-1">{selectedPkg.usedCuts}/{selectedPkg.totalCuts} cortes</span>
                </p>
              </div>
              <button onClick={() => setShowUseModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Progress visual */}
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 border border-violet-100 dark:border-violet-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-violet-700 dark:text-violet-300">{selectedPkg.name}</span>
                  <span className="text-sm font-bold text-violet-700 dark:text-violet-300">
                    {selectedPkg.totalCuts - selectedPkg.usedCuts - 1 >= 0
                      ? `${selectedPkg.totalCuts - selectedPkg.usedCuts - 1} restante(s) após este`
                      : 'Último corte!'
                    }
                  </span>
                </div>
                <div className="w-full bg-violet-200 dark:bg-violet-900 rounded-full h-2">
                  <div
                    className="bg-violet-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(((selectedPkg.usedCuts + 1) / selectedPkg.totalCuts) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Observações (opcional)</label>
                <input type="text" value={useForm.notes} onChange={e => setUseForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Ex: Corte social + barba"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => setShowUseModal(false)} className="flex-1 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancelar</button>
              <button onClick={handleUse} disabled={saving} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scissors className="w-4 h-4" />}
                Confirmar Corte
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Detalhes ── */}
      {showDetailModal && selectedPkg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">{selectedPkg.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selectedPkg.customer?.name || selectedPkg.client?.name}</p>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: 'Status',      v: STATUS_CFG[selectedPkg.status]?.label || selectedPkg.status },
                  { l: 'Valor pago',  v: BR(selectedPkg.price) },
                  { l: 'Início',      v: DT(selectedPkg.startDate) },
                  { l: 'Expiração',   v: DT(selectedPkg.expirationDate) },
                  { l: 'Cortes',      v: `${selectedPkg.usedCuts} / ${selectedPkg.totalCuts}` },
                  { l: 'Último corte', v: selectedPkg.lastCutAt ? DT(selectedPkg.lastCutAt) : 'Nenhum' }
                ].map(({ l, v }) => (
                  <div key={l} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{l}</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{v}</p>
                  </div>
                ))}
              </div>
              {selectedPkg.notes && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Observações</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedPkg.notes}</p>
                </div>
              )}
              {/* Histórico de uso */}
              {selectedPkg.usages.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Histórico de Cortes</p>
                  <div className="space-y-2">
                    {selectedPkg.usages.map((u: any, i: number) => (
                      <div key={u.id} className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                        <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {new Date(u.usedAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                          </p>
                          {u.notes && <p className="text-[11px] text-gray-400">{u.notes}</p>}
                        </div>
                        <Scissors className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}