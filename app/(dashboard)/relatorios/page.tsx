'use client';

import { useState, useEffect } from 'react';
import {
  FileText, Download, Calendar, Filter, Loader2, FileSpreadsheet,
  TrendingUp, Users, X, Eye, ChevronDown, ChevronUp
} from 'lucide-react';
import api from '@/lib/api';

type ReportType = 'appointments' | 'revenue' | 'customers';
type ExportFormat = 'pdf' | 'excel';

const BR = (n: number) => `R$ ${Number(n || 0).toFixed(2).replace('.', ',')}`;
const DT = (d: any) => { try { return new Date(d).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }); } catch { return '-'; } };
const DTH = (d: any) => {
  try {
    return new Date(d).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit',
      year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch { return '-'; }
};

// ─── Helpers ─────────────────────────────────────────────────
function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    scheduled: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-yellow-100 text-yellow-700',
    paid:      'bg-green-100 text-green-700',
    pending:   'bg-orange-100 text-orange-700',
  };
  const labels: Record<string, string> = {
    completed: 'Concluído', cancelled: 'Cancelado', scheduled: 'Agendado',
    confirmed: 'Confirmado', paid: 'Pago', pending: 'Pendente'
  };
  return <Badge color={map[status] || 'bg-gray-100 text-gray-600'}>{labels[status] || status}</Badge>;
}

function SummaryCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
      >
        <span className="font-semibold text-gray-800 dark:text-white text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {open && <div className="overflow-x-auto">{children}</div>}
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-purple-600 text-white">
          {headers.map((h, i) => (
            <th key={i} className="px-4 py-2 text-left text-xs font-semibold whitespace-nowrap">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-purple-50/50 dark:bg-purple-900/10'}>
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-2 text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">{cell}</td>
            ))}
          </tr>
        ))}
        {rows.length === 0 && (
          <tr><td colSpan={headers.length} className="px-4 py-6 text-center text-gray-400 text-xs">Nenhum dado encontrado</td></tr>
        )}
      </tbody>
    </table>
  );
}

// ─── Viewers ─────────────────────────────────────────────────
function AppointmentsViewer({ data }: { data: any }) {
  const s = data.summary || {};
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        <SummaryCard label="Total"        value={String(s.total || 0)} />
        <SummaryCard label="Concluídos"   value={String(s.completed || 0)} />
        <SummaryCard label="Cancelados"   value={String(s.cancelled || 0)} />
        <SummaryCard label="Receita"      value={BR(s.totalRevenue || 0)} />
        <SummaryCard label="Ticket Médio" value={BR(s.averageTicket || 0)} />
      </div>

      {data.byBarber?.length > 0 && (
        <Section title="📊 Resumo por Barbeiro">
          <Table
            headers={['Barbeiro', 'Total', 'Concluídos', 'Receita']}
            rows={data.byBarber.map((b: any) => [b.name, b.total, b.completed, BR(b.revenue)])}
          />
        </Section>
      )}

      {data.byService?.length > 0 && (
        <Section title="✂️ Resumo por Serviço">
          <Table
            headers={['Serviço', 'Quantidade', 'Receita']}
            rows={data.byService.map((s: any) => [s.name, s.count, BR(s.revenue)])}
          />
        </Section>
      )}

      <Section title="📅 Todos os Agendamentos">
        <Table
          headers={['Data/Hora', 'Cliente', 'Telefone', 'Barbeiro', 'Serviço', 'Status', 'Valor']}
          rows={(data.appointments || []).map((a: any, i: number) => [
            DTH(a.date),
            a.customerName || '-',
            a.customerPhone || '-',
            a.barberName,
            a.serviceName,
            <StatusBadge key={`apt-status-${i}`} status={a.status} />,
            BR(a.price)
          ])}
        />
      </Section>
    </div>
  );
}

function RevenueViewer({ data }: { data: any }) {
  const s = data.summary || {};
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        <SummaryCard label="Receita Total"  value={BR(s.totalRevenue || 0)} />
        <SummaryCard label="Lucro Líquido"  value={BR(s.netProfit || 0)} />
        <SummaryCard label="Despesas"       value={BR(s.totalExpenses || 0)} />
        <SummaryCard label="Margem"         value={`${s.profitMargin || 0}%`} />
        <SummaryCard label="Ticket Médio"   value={BR(s.averageTicket || 0)}
          sub={`${s.totalAppointments || 0} agendamentos`} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <SummaryCard label="Receita de Agendamentos" value={BR(s.appointmentsRevenue || 0)} />
        <SummaryCard label="Transações Manuais"      value={BR(s.manualTransactionsRevenue || 0)} />
      </div>

      {data.byBarber?.length > 0 && (
        <Section title="👤 Faturamento por Barbeiro">
          <Table
            headers={['Barbeiro', 'Agendamentos', 'Rec. Agend.', 'Rec. Manual', 'Total']}
            rows={data.byBarber.map((b: any, i: number) => [
              b.name,
              b.appointments,
              BR(b.appointmentsRevenue),
              BR(b.manualRevenue),
              <strong key={`barber-total-${i}`}>{BR(b.totalRevenue)}</strong>
            ])}
          />
        </Section>
      )}

      {data.byService?.length > 0 && (
        <Section title="✂️ Faturamento por Serviço">
          <Table
            headers={['Serviço', 'Quantidade', 'Receita']}
            rows={data.byService.map((s: any) => [s.name, s.count, BR(s.revenue)])}
          />
        </Section>
      )}

      {data.transactions?.length > 0 && (
        <Section title="💳 Transações Financeiras">
          <Table
            headers={['Data', 'Tipo', 'Categoria', 'Descrição', 'Barbeiro', 'Valor']}
            rows={data.transactions.map((t: any, i: number) => [
              DT(t.date),
              <Badge
                key={`tx-type-${i}`}
                color={t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
              >
                {t.typeLabel}
              </Badge>,
              t.categoryLabel,
              t.description,
              t.barberName || '-',
              <span
                key={`tx-amt-${i}`}
                className={t.type === 'income' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}
              >
                {BR(t.amount)}
              </span>
            ])}
          />
        </Section>
      )}

      {data.commissions?.length > 0 && (
        <Section title="💰 Comissões dos Barbeiros">
          <Table
            headers={['Barbeiro', 'Mês Ref.', '% Comissão', 'Valor', 'Status']}
            rows={data.commissions.map((c: any, i: number) => [
              c.barberName,
              DT(c.referenceMonth),
              `${c.percentage}%`,
              BR(c.amount),
              <StatusBadge key={`comm-status-${i}`} status={c.status} />
            ])}
          />
        </Section>
      )}

      {Object.keys(data.expensesByCategory || {}).length > 0 && (
        <Section title="📉 Despesas por Categoria" defaultOpen={false}>
          <Table
            headers={['Categoria', 'Total']}
            rows={Object.entries(data.expensesByCategory).map(([cat, val]: any) => [cat, BR(val)])}
          />
        </Section>
      )}
    </div>
  );
}

function CustomersViewer({ data }: { data: any }) {
  const s = data.summary || {};
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <SummaryCard label="Total"         value={String(s.totalCustomers || 0)} />
        <SummaryCard label="Ativos"        value={String(s.activeCustomers || 0)} />
        <SummaryCard label="Novos"         value={String(s.newCustomers || 0)} />
        <SummaryCard label="Inativos"      value={String(s.inactiveCustomers || 0)} />
        <SummaryCard label="Receita Total" value={BR(s.totalRevenue || 0)} />
        <SummaryCard label="Receita Média" value={BR(s.averageRevenuePerCustomer || 0)} />
      </div>

      <Section title="👥 Lista de Clientes">
        <Table
          headers={['Nome', 'Telefone', 'E-mail', 'Visitas', 'Receita', 'Ticket Méd.', 'Serviço Favorito', 'Última Visita']}
          rows={(data.customers || []).map((c: any, i: number) => [
            <span
              key={`cust-name-${i}`}
              className={c.isNew ? 'font-bold text-green-600' : ''}
            >
              {c.name}{c.isNew ? ' 🆕' : ''}
            </span>,
            c.phone,
            c.email,
            c.totalVisits,
            BR(c.totalRevenue),
            BR(c.averageTicket),
            c.favoriteService || '-',
            c.lastVisit ? DT(c.lastVisit) : '-'
          ])}
        />
      </Section>
    </div>
  );
}

// ─── Online Viewer Modal ──────────────────────────────────────
function OnlineViewer({ data, reportType, onClose }: { data: any; reportType: ReportType; onClose: () => void }) {
  const titles: Record<ReportType, string> = {
    appointments: '📅 Relatório de Agendamentos',
    revenue:      '💰 Relatório de Faturamento',
    customers:    '👥 Análise de Clientes'
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-6xl rounded-2xl shadow-2xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{titles[reportType]}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {reportType === 'appointments' && <AppointmentsViewer data={data} />}
          {reportType === 'revenue'      && <RevenueViewer data={data} />}
          {reportType === 'customers'    && <CustomersViewer data={data} />}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function RelatoriosPage() {
  const [reportType, setReportType] = useState<ReportType>('appointments');
  const [loading, setLoading]       = useState(false);
  const [generating, setGenerating] = useState<ExportFormat | 'view' | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [barbers, setBarbers]       = useState<any[]>([]);
  const [filters, setFilters]       = useState({
    startDate: '', endDate: '', barberId: '', status: '', serviceId: ''
  });

  useEffect(() => {
    api.get('/users').then(r => setBarbers(r.data)).catch(() => {});
  }, []);

  const handleTypeChange = (type: ReportType) => {
    setReportType(type);
    setReportData(null);
    setShowViewer(false);
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setReportData(null);
    setShowViewer(false);
    try {
      const res = await api.get(`/reports/${reportType}`, { params: filters });
      setReportData(res.data);
    } catch {
      alert('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: ExportFormat) => {
    setGenerating(format);
    try {
      const res = await api.get(`/reports/${reportType}`, {
        params: { ...filters, format },
        responseType: 'blob'
      });
      const ext = format === 'pdf' ? 'pdf' : 'xlsx';
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement('a');
      a.href    = url;
      a.setAttribute('download', `relatorio-${reportType}-${Date.now()}.${ext}`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Erro ao exportar relatório');
    } finally {
      setGenerating(null);
    }
  };

  const reportTypes = [
    { key: 'appointments', icon: Calendar,   label: 'Agendamentos', sub: 'Histórico completo',    color: 'text-purple-600' },
    { key: 'revenue',      icon: TrendingUp, label: 'Receita',      sub: 'Faturamento detalhado', color: 'text-green-600'  },
    { key: 'customers',    icon: Users,      label: 'Clientes',     sub: 'Análise de clientes',   color: 'text-blue-600'   }
  ];

  return (
    <>
      {showViewer && reportData && (
        <OnlineViewer
          data={reportData}
          reportType={reportType}
          onClose={() => setShowViewer(false)}
        />
      )}

      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Relatórios
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Gere e exporte relatórios completos do seu negócio
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tipo */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-purple-600" /> Tipo de Relatório
            </h3>
            <div className="space-y-2">
              {reportTypes.map(({ key, icon: Icon, label, sub, color }) => (
                <button
                  key={key}
                  onClick={() => handleTypeChange(key as ReportType)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
                    reportType === key
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-600'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-purple-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${color}`} />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 dark:text-white text-sm">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-base font-bold text-gray-800 dark:text-white mb-4">Filtros</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Data Início
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={e => setFilters(p => ({ ...p, startDate: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={e => setFilters(p => ({ ...p, endDate: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              {(reportType === 'appointments' || reportType === 'revenue') && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Barbeiro
                  </label>
                  <select
                    value={filters.barberId}
                    onChange={e => setFilters(p => ({ ...p, barberId: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              )}
              {reportType === 'appointments' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="scheduled">Agendado</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              )}
            </div>
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full mt-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Gerando...</>
                : <><FileText className="w-4 h-4" />Gerar Relatório</>
              }
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-2">
          {!reportData && !loading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 text-center">
              <FileText className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                Nenhum relatório gerado
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Configure os filtros e clique em "Gerar Relatório"
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 text-center">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">Carregando dados...</p>
            </div>
          )}

          {reportData && !loading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Botões de export */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-5 text-white">
                <h3 className="text-lg font-bold mb-1">Relatório Pronto ✓</h3>
                <p className="text-purple-200 text-sm mb-4">Escolha como deseja ver os dados:</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setShowViewer(true)}
                    className="flex flex-col items-center gap-1 bg-white/20 hover:bg-white/30 text-white py-3 px-2 rounded-xl transition"
                  >
                    <Eye className="w-5 h-5" />
                    <span className="text-xs font-semibold">Ver Online</span>
                    <span className="text-xs text-purple-200">Mais fácil</span>
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    disabled={generating === 'pdf'}
                    className="flex flex-col items-center gap-1 bg-white/20 hover:bg-white/30 text-white py-3 px-2 rounded-xl transition disabled:opacity-60"
                  >
                    {generating === 'pdf'
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : <Download className="w-5 h-5" />
                    }
                    <span className="text-xs font-semibold">Baixar PDF</span>
                    <span className="text-xs text-purple-200">Imprimir</span>
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    disabled={generating === 'excel'}
                    className="flex flex-col items-center gap-1 bg-white/20 hover:bg-white/30 text-white py-3 px-2 rounded-xl transition disabled:opacity-60"
                  >
                    {generating === 'excel'
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : <FileSpreadsheet className="w-5 h-5" />
                    }
                    <span className="text-xs font-semibold">Baixar Excel</span>
                    <span className="text-xs text-purple-200">Planilha</span>
                  </button>
                </div>
              </div>

              {/* Resumo rápido */}
              <div className="p-5">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide mb-3">
                  Resumo Rápido
                </p>
                {reportData.summary && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(reportData.summary).slice(0, 4).map(([key, value]: [string, any]) => (
                      <div key={key} className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-base font-bold text-purple-600 dark:text-purple-400">
                          {typeof value === 'number' && (
                            key.toLowerCase().includes('revenue') ||
                            key.toLowerCase().includes('ticket') ||
                            key.toLowerCase().includes('profit') ||
                            key.toLowerCase().includes('expenses')
                          ) ? BR(value) : String(value)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 text-center">
                  Clique em <strong className="text-gray-600 dark:text-gray-300">"Ver Online"</strong> para
                  visualizar o relatório completo sem precisar baixar nada
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}