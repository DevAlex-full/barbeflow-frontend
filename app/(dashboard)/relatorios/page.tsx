'use client';

import { useState, useEffect } from 'react';
import {
  FileText, Download, Calendar, Loader2, FileSpreadsheet,
  TrendingUp, Users, X, Eye, ChevronDown, ChevronUp,
  CheckCircle2, SlidersHorizontal, ArrowDownToLine, LayoutGrid
} from 'lucide-react';
import api from '@/lib/api';

type ReportType = 'appointments' | 'revenue' | 'customers';
type ExportFormat = 'pdf' | 'excel';

const BR  = (n: number) => `R$ ${Number(n || 0).toFixed(2).replace('.', ',')}`;
const DT  = (d: any) => { try { return new Date(d).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }); } catch { return '-'; } };
const DTH = (d: any) => {
  try { return new Date(d).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }); }
  catch { return '-'; }
};

// ─── atoms ───────────────────────────────────────────────────
function Chip({ color, children }: { color: string; children: React.ReactNode }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${color}`}>{children}</span>;
}
function StatusChip({ status }: { status: string }) {
  const cfg: Record<string, [string, string]> = {
    completed: ['bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', 'Concluído'],
    cancelled:  ['bg-red-50 text-red-700 ring-1 ring-red-200',           'Cancelado'],
    scheduled:  ['bg-sky-50 text-sky-700 ring-1 ring-sky-200',           'Agendado'],
    confirmed:  ['bg-amber-50 text-amber-700 ring-1 ring-amber-200',     'Confirmado'],
    paid:       ['bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200','Pago'],
    pending:    ['bg-orange-50 text-orange-700 ring-1 ring-orange-200',  'Pendente'],
  };
  const [cls, label] = cfg[status] || ['bg-gray-50 text-gray-600 ring-1 ring-gray-200', status];
  return <Chip color={cls}>{label}</Chip>;
}

// ─── viewer sub-components ────────────────────────────────────
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      {open && <div className="overflow-x-auto bg-white dark:bg-gray-800/40">{children}</div>}
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="px-5 py-2.5 text-left text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap border-b border-gray-100 dark:border-gray-700">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
        {rows.map((row, i) => (
          <tr key={i} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition-colors">
            {row.map((cell, j) => (
              <td key={j} className="px-5 py-2.5 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{cell}</td>
            ))}
          </tr>
        ))}
        {rows.length === 0 && (
          <tr><td colSpan={headers.length} className="px-5 py-8 text-center text-gray-400 text-sm">Sem dados para exibir</td></tr>
        )}
      </tbody>
    </table>
  );
}

// ─── viewers ─────────────────────────────────────────────────
function AppointmentsViewer({ data }: { data: any }) {
  const s = data.summary || {};
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { l: 'Total',        v: String(s.total||0),          hi: true  },
          { l: 'Concluídos',   v: String(s.completed||0),      hi: false },
          { l: 'Cancelados',   v: String(s.cancelled||0),      hi: false },
          { l: 'Receita',      v: BR(s.totalRevenue||0),       hi: false },
          { l: 'Ticket Médio', v: BR(s.averageTicket||0),      hi: false },
        ].map(({ l, v, hi }) => (
          <div key={l} className={`rounded-xl p-4 ${hi ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'}`}>
            <p className={`text-[11px] uppercase tracking-wider font-medium mb-1 ${hi ? 'text-indigo-200' : 'text-gray-400'}`}>{l}</p>
            <p className={`text-xl font-bold ${hi ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{v}</p>
          </div>
        ))}
      </div>
      {data.byBarber?.length > 0 && (
        <Section title="Por Barbeiro">
          <DataTable headers={['Barbeiro','Total','Concluídos','Receita']}
            rows={data.byBarber.map((b: any) => [b.name, b.total, b.completed, BR(b.revenue)])} />
        </Section>
      )}
      {data.byService?.length > 0 && (
        <Section title="Por Serviço">
          <DataTable headers={['Serviço','Qtd','Receita']}
            rows={data.byService.map((s: any) => [s.name, s.count, BR(s.revenue)])} />
        </Section>
      )}
      <Section title="Detalhamento">
        <DataTable headers={['Data/Hora','Cliente','Tel.','Barbeiro','Serviço','Status','Valor']}
          rows={(data.appointments||[]).map((a: any, i: number) => [
            DTH(a.date), a.customerName||'-', a.customerPhone||'-', a.barberName, a.serviceName,
            <StatusChip key={i} status={a.status} />,
            <span key={i} className="font-medium tabular-nums">{BR(a.price)}</span>
          ])} />
      </Section>
    </div>
  );
}

function RevenueViewer({ data }: { data: any }) {
  const s = data.summary || {};
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { l: 'Receita Total',  v: BR(s.totalRevenue||0),     hi: true  },
          { l: 'Lucro Líquido',  v: BR(s.netProfit||0),        hi: false },
          { l: 'Despesas',       v: BR(s.totalExpenses||0),    hi: false },
          { l: 'Margem',         v: `${s.profitMargin||0}%`,   hi: false },
          { l: 'Ticket Médio',   v: BR(s.averageTicket||0),    hi: false },
        ].map(({ l, v, hi }) => (
          <div key={l} className={`rounded-xl p-4 ${hi ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'}`}>
            <p className={`text-[11px] uppercase tracking-wider font-medium mb-1 ${hi ? 'text-indigo-200' : 'text-gray-400'}`}>{l}</p>
            <p className={`text-xl font-bold ${hi ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{v}</p>
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">Agendamentos</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{BR(s.appointmentsRevenue||0)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">Transações Manuais</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{BR(s.manualTransactionsRevenue||0)}</p>
        </div>
      </div>
      {data.byBarber?.length > 0 && (
        <Section title="Por Barbeiro">
          <DataTable headers={['Barbeiro','Agend.','Rec. Agend.','Rec. Manual','Total']}
            rows={data.byBarber.map((b: any, i: number) => [
              b.name, b.appointments, BR(b.appointmentsRevenue), BR(b.manualRevenue),
              <strong key={i} className="text-indigo-600 tabular-nums">{BR(b.totalRevenue)}</strong>
            ])} />
        </Section>
      )}
      {data.byService?.length > 0 && (
        <Section title="Por Serviço">
          <DataTable headers={['Serviço','Qtd','Receita']}
            rows={data.byService.map((s: any) => [s.name, s.count, BR(s.revenue)])} />
        </Section>
      )}
      {data.transactions?.length > 0 && (
        <Section title="Transações Financeiras">
          <DataTable headers={['Data','Tipo','Categoria','Descrição','Barbeiro','Valor']}
            rows={data.transactions.map((t: any, i: number) => [
              DT(t.date),
              <Chip key={i} color={t.type==='income'?'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200':'bg-red-50 text-red-700 ring-1 ring-red-200'}>{t.typeLabel}</Chip>,
              t.categoryLabel, t.description, t.barberName||'-',
              <span key={i} className={`font-semibold tabular-nums ${t.type==='income'?'text-emerald-600':'text-red-500'}`}>{BR(t.amount)}</span>
            ])} />
        </Section>
      )}
      {data.commissions?.length > 0 && (
        <Section title="Comissões">
          <DataTable headers={['Barbeiro','Mês Ref.','%','Valor','Status']}
            rows={data.commissions.map((c: any, i: number) => [
              c.barberName, DT(c.referenceMonth), `${c.percentage}%`, BR(c.amount),
              <StatusChip key={i} status={c.status} />
            ])} />
        </Section>
      )}
      {Object.keys(data.expensesByCategory||{}).length > 0 && (
        <Section title="Despesas por Categoria" defaultOpen={false}>
          <DataTable headers={['Categoria','Total']}
            rows={Object.entries(data.expensesByCategory).map(([cat,val]:any)=>[cat, BR(val)])} />
        </Section>
      )}
    </div>
  );
}

function CustomersViewer({ data }: { data: any }) {
  const s = data.summary || {};
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        {[
          { l: 'Total',         v: String(s.totalCustomers||0),           hi: true  },
          { l: 'Ativos',        v: String(s.activeCustomers||0),          hi: false },
          { l: 'Novos',         v: String(s.newCustomers||0),             hi: false },
          { l: 'Inativos',      v: String(s.inactiveCustomers||0),        hi: false },
          { l: 'Receita Total', v: BR(s.totalRevenue||0),                 hi: false },
          { l: 'Rec. Média',    v: BR(s.averageRevenuePerCustomer||0),    hi: false },
        ].map(({ l, v, hi }) => (
          <div key={l} className={`rounded-xl p-4 ${hi ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700'}`}>
            <p className={`text-[11px] uppercase tracking-wider font-medium mb-1 ${hi ? 'text-indigo-200' : 'text-gray-400'}`}>{l}</p>
            <p className={`text-xl font-bold ${hi ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{v}</p>
          </div>
        ))}
      </div>
      <Section title="Clientes">
        <DataTable headers={['Nome','Tel.','E-mail','Visitas','Receita','Ticket','Serv. Favorito','Última Visita']}
          rows={(data.customers||[]).map((c: any, i: number) => [
            <span key={i} className={c.isNew?'font-semibold text-indigo-600':''}>{c.name}{c.isNew?' 🆕':''}</span>,
            c.phone, c.email||'-', c.totalVisits,
            BR(c.totalRevenue), BR(c.averageTicket),
            c.favoriteService||'-', c.lastVisit ? DT(c.lastVisit) : '-'
          ])} />
      </Section>
    </div>
  );
}

// ─── Modal viewer ─────────────────────────────────────────────
function ViewerModal({ data, type, onClose }: { data: any; type: ReportType; onClose: () => void }) {
  const cfg: Record<ReportType, { title: string; Icon: any }> = {
    appointments: { title: 'Agendamentos',       Icon: Calendar    },
    revenue:      { title: 'Faturamento',        Icon: TrendingUp  },
    customers:    { title: 'Análise de Clientes',Icon: Users       },
  };
  const { title, Icon } = cfg[type];
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative min-h-full flex items-start justify-center p-4">
        <div className="relative bg-white dark:bg-gray-900 w-full max-w-6xl rounded-2xl shadow-2xl my-6 ring-1 ring-black/5">
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">Relatório</p>
                <h2 className="text-base font-bold text-gray-900 dark:text-white leading-tight">{title}</h2>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6">
            {type === 'appointments' && <AppointmentsViewer data={data} />}
            {type === 'revenue'      && <RevenueViewer data={data} />}
            {type === 'customers'    && <CustomersViewer data={data} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function RelatoriosPage() {
  const [reportType, setReportType] = useState<ReportType>('appointments');
  const [loading, setLoading]       = useState(false);
  const [generating, setGenerating] = useState<ExportFormat | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [barbers, setBarbers]       = useState<any[]>([]);
  const [filters, setFilters]       = useState({ startDate:'', endDate:'', barberId:'', status:'', serviceId:'' });

  useEffect(() => { api.get('/users').then(r => setBarbers(r.data)).catch(() => {}); }, []);

  const changeType = (t: ReportType) => { setReportType(t); setReportData(null); setShowViewer(false); };

  const generate = async () => {
    setLoading(true); setReportData(null); setShowViewer(false);
    try { const r = await api.get(`/reports/${reportType}`, { params: filters }); setReportData(r.data); }
    catch { alert('Erro ao gerar relatório'); }
    finally { setLoading(false); }
  };

  const exportFile = async (format: ExportFormat) => {
    setGenerating(format);
    try {
      const r = await api.get(`/reports/${reportType}`, { params: { ...filters, format }, responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const a = document.createElement('a');
      a.href = url; a.download = `relatorio-${reportType}-${Date.now()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url);
    } catch { alert('Erro ao exportar'); }
    finally { setGenerating(null); }
  };

  const fmtVal = (key: string, val: any) => {
    if (typeof val !== 'number') return String(val);
    const k = key.toLowerCase();
    if (k.includes('revenue')||k.includes('ticket')||k.includes('profit')||k.includes('expenses')) return BR(val);
    if (k.includes('margin')) return `${val}%`;
    return String(val);
  };

  const TYPES = [
    { key: 'appointments' as ReportType, Icon: Calendar,   label: 'Agendamentos', sub: 'Histórico de atendimentos' },
    { key: 'revenue'      as ReportType, Icon: TrendingUp, label: 'Faturamento',  sub: 'Receitas, despesas e lucro' },
    { key: 'customers'    as ReportType, Icon: Users,      label: 'Clientes',     sub: 'Comportamento e retenção'  },
  ];

  return (
    <>
      {showViewer && reportData && <ViewerModal data={reportData} type={reportType} onClose={() => setShowViewer(false)} />}

      {/* ── Page header ── */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">Relatórios</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Central de Relatórios</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Analise, exporte e compartilhe dados do seu negócio</p>
      </div>

      {/* ── Report type tabs ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {TYPES.map(({ key, Icon, label, sub }) => {
          const active = reportType === key;
          return (
            <button key={key} onClick={() => changeType(key)}
              className={`relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                active
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                  : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-indigo-600' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold leading-tight ${active ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-white'}`}>{label}</p>
                <p className={`text-xs mt-0.5 leading-tight ${active ? 'text-indigo-500' : 'text-gray-400'}`}>{sub}</p>
              </div>
              {active && <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-indigo-600 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* ── Filters bar ── */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Filtros</span>
        </div>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Data início</label>
            <input type="date" value={filters.startDate}
              onChange={e => setFilters(p => ({ ...p, startDate: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Data fim</label>
            <input type="date" value={filters.endDate}
              onChange={e => setFilters(p => ({ ...p, endDate: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          {(reportType === 'appointments' || reportType === 'revenue') && (
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Barbeiro</label>
              <select value={filters.barberId} onChange={e => setFilters(p => ({ ...p, barberId: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="">Todos</option>
                {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          )}
          {reportType === 'appointments' && (
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
              <select value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="">Todos</option>
                <option value="scheduled">Agendado</option>
                <option value="confirmed">Confirmado</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          )}
          <button onClick={generate} disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-indigo-200 dark:shadow-none whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {loading ? 'Gerando...' : 'Gerar Relatório'}
          </button>
        </div>
      </div>

      {/* ── Result area ── */}
      {!reportData && !loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-3">
            <LayoutGrid className="w-5 h-5 text-gray-300 dark:text-gray-500" />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Selecione o tipo e período para gerar o relatório</p>
        </div>
      )}

      {loading && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center py-20">
          <div className="relative mb-3">
            <div className="w-10 h-10 rounded-full border-[3px] border-indigo-100 dark:border-indigo-900/30" />
            <div className="absolute inset-0 w-10 h-10 rounded-full border-[3px] border-indigo-600 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-gray-400">Processando...</p>
        </div>
      )}

      {reportData && !loading && (
        <div className="space-y-4">
          {/* Result header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Relatório gerado com sucesso</span>
              </div>
              <div className="flex items-center gap-2">
                {/* View online */}
                <button onClick={() => setShowViewer(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ver completo
                </button>
                {/* PDF */}
                <button onClick={() => exportFile('pdf')} disabled={generating === 'pdf'}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  {generating === 'pdf' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  PDF
                </button>
                {/* Excel */}
                <button onClick={() => exportFile('excel')} disabled={generating === 'excel'}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  {generating === 'excel' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
                  Excel
                </button>
              </div>
            </div>

            {/* KPIs inline */}
            {reportData.summary && (
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 dark:divide-gray-700">
                {Object.entries(reportData.summary).slice(0, 4).map(([key, value]: [string, any]) => (
                  <div key={key} className="px-5 py-4">
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest font-medium mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white tabular-nums">
                      {fmtVal(key, value)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hint */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
            <ArrowDownToLine className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <p className="text-xs text-indigo-600 dark:text-indigo-400">
              Clique em <strong>"Ver completo"</strong> para visualizar todas as tabelas e seções do relatório diretamente no navegador
            </p>
          </div>
        </div>
      )}
    </>
  );
}