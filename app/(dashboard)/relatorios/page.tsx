'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, Filter, Loader2, FileSpreadsheet, TrendingUp, Users } from 'lucide-react';
import api from '@/lib/api';

type ReportType = 'appointments' | 'revenue' | 'customers';
type ExportFormat = 'pdf' | 'excel';

export default function RelatoriosPage() {
  const [reportType, setReportType] = useState<ReportType>('appointments');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    barberId: '',
    status: '',
    serviceId: ''
  });

  const [reportData, setReportData] = useState<any>(null);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    loadFiltersData();
  }, []);

  const loadFiltersData = async () => {
    try {
      const [barbersRes, servicesRes] = await Promise.all([
        api.get('/users'),
        api.get('/services')
      ]);
      setBarbers(barbersRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error('Erro ao carregar filtros:', error);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setReportData(null);
    try {
      const response = await api.get(`/reports/${reportType}`, { params: filters });
      setReportData(response.data);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: ExportFormat) => {
    setGenerating(true);
    try {
      const response = await api.get(`/reports/${reportType}`, {
        params: { ...filters, format },
        responseType: 'blob'
      });

      const ext = format === 'pdf' ? 'pdf' : 'xlsx';
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio-${reportType}-${Date.now()}.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar relatório');
    } finally {
      setGenerating(false);
    }
  };

  const formatSummaryValue = (key: string, value: any): string => {
    if (typeof value !== 'number') return String(value);
    if (key.toLowerCase().includes('revenue') || key.toLowerCase().includes('ticket')) {
      return `R$ ${value.toFixed(2).replace('.', ',')}`;
    }
    return String(value);
  };

  return (
    <div>
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
            Gere relatórios detalhados em PDF ou Excel
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sidebar — Filtros */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tipo de Relatório */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-purple-600" />
              Tipo de Relatório
            </h3>

            <div className="space-y-3">
              {[
                { key: 'appointments', icon: Calendar, label: 'Agendamentos', sub: 'Histórico completo', color: 'text-purple-600' },
                { key: 'revenue', icon: TrendingUp, label: 'Receita', sub: 'Faturamento detalhado', color: 'text-green-600' },
                { key: 'customers', icon: Users, label: 'Clientes', sub: 'Análise de clientes', color: 'text-blue-600' },
              ].map(({ key, icon: Icon, label, sub, color }) => (
                <button
                  key={key}
                  onClick={() => setReportType(key as ReportType)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition ${
                    reportType === key
                      ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-600'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-purple-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${color}`} />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800 dark:text-white">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Filtros</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Data Início</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Data Fim</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {(reportType === 'appointments' || reportType === 'revenue') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Barbeiro</label>
                  <select
                    value={filters.barberId}
                    onChange={(e) => setFilters({ ...filters, barberId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    {barbers.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {reportType === 'appointments' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Gerando...</>
              ) : (
                <><FileText className="w-5 h-5" />Gerar Relatório</>
              )}
            </button>
          </div>
        </div>

        {/* Main — Resultado */}
        <div className="lg:col-span-2">
          {!reportData && !loading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Nenhum relatório gerado
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Selecione os filtros e clique em "Gerar Relatório"
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 text-center">
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Gerando relatório...</p>
            </div>
          )}

          {reportData && !loading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Preview Header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Preview do Relatório</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleExport('pdf')}
                    disabled={generating}
                    className="flex-1 bg-white text-purple-600 py-2 px-4 rounded-lg font-semibold hover:bg-purple-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-5 h-5" />}
                    Baixar PDF
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    disabled={generating}
                    className="flex-1 bg-white text-purple-600 py-2 px-4 rounded-lg font-semibold hover:bg-purple-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
                    Baixar Excel
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6">
                {reportData.summary && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {Object.entries(reportData.summary).map(([key, value]: [string, any]) => (
                      <div key={key} className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                          {formatSummaryValue(key, value)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Baixe o relatório completo em PDF ou Excel para visualizar todos os dados
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}