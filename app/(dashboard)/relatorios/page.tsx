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
      const endpoint = `/reports/${reportType}`;
      const response = await api.get(endpoint, { params: filters });
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
      const endpoint = `/reports/${reportType}`;
      const response = await api.get(endpoint, {
        params: { ...filters, format },
        responseType: 'blob'
      });

      const filename = format === 'pdf' 
        ? `relatorio-${reportType}-${Date.now()}.pdf`
        : `relatorio-${reportType}-${Date.now()}.xlsx`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('Erro ao exportar relatório');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Relatórios
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Gere relatórios detalhados em PDF ou Excel
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar - Filtros */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tipo de Relatório */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-600" />
                Tipo de Relatório
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => setReportType('appointments')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition ${
                    reportType === 'appointments'
                      ? 'bg-purple-50 border-2 border-purple-600'
                      : 'bg-gray-50 border-2 border-transparent hover:border-purple-300'
                  }`}
                >
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">Agendamentos</p>
                    <p className="text-xs text-gray-500">Histórico completo</p>
                  </div>
                </button>

                <button
                  onClick={() => setReportType('revenue')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition ${
                    reportType === 'revenue'
                      ? 'bg-purple-50 border-2 border-purple-600'
                      : 'bg-gray-50 border-2 border-transparent hover:border-purple-300'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">Receita</p>
                    <p className="text-xs text-gray-500">Faturamento detalhado</p>
                  </div>
                </button>

                <button
                  onClick={() => setReportType('customers')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition ${
                    reportType === 'customers'
                      ? 'bg-purple-50 border-2 border-purple-600'
                      : 'bg-gray-50 border-2 border-transparent hover:border-purple-300'
                  }`}
                >
                  <Users className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">Clientes</p>
                    <p className="text-xs text-gray-500">Análise de clientes</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Filtros</h3>

              <div className="space-y-4">
                {/* Data Início */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Data Início
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Data Fim */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Data Fim
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Barbeiro (só para agendamentos e receita) */}
                {(reportType === 'appointments' || reportType === 'revenue') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Barbeiro
                    </label>
                    <select
                      value={filters.barberId}
                      onChange={(e) => setFilters({ ...filters, barberId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Todos</option>
                      {barbers.map(barber => (
                        <option key={barber.id} value={barber.id}>{barber.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Status (só para agendamentos) */}
                {reportType === 'appointments' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Gerar Relatório
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Main - Resultado */}
          <div className="lg:col-span-2">
            {!reportData && !loading && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Nenhum relatório gerado
                </h3>
                <p className="text-gray-500">
                  Selecione os filtros e clique em "Gerar Relatório"
                </p>
              </div>
            )}

            {reportData && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Preview Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">Preview do Relatório</h3>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleExport('pdf')}
                      disabled={generating}
                      className="flex-1 bg-white text-purple-600 py-2 px-4 rounded-lg font-semibold hover:bg-purple-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Baixar PDF
                    </button>
                    <button
                      onClick={() => handleExport('excel')}
                      disabled={generating}
                      className="flex-1 bg-white text-purple-600 py-2 px-4 rounded-lg font-semibold hover:bg-purple-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <FileSpreadsheet className="w-5 h-5" />
                      Baixar Excel
                    </button>
                  </div>
                </div>

                {/* Preview Content */}
                <div className="p-6">
                  {/* Resumo */}
                  {reportData.summary && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {Object.entries(reportData.summary).map(([key, value]: [string, any]) => (
                        <div key={key} className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                          <p className="text-sm text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-2xl font-bold text-purple-600">
                            {typeof value === 'number' && key.includes('revenue') 
                              ? `R$ ${value.toFixed(2)}`
                              : value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Preview limitado */}
                  <p className="text-sm text-gray-500 text-center py-8">
                    Baixe o relatório completo em PDF ou Excel para visualizar todos os dados
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}