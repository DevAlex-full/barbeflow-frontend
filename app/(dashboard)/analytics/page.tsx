'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Loader2, RefreshCw } from 'lucide-react';
import api from '@/lib/api';
import { HeatmapChart } from '@/components/analytics/HeatmapChart';
import { KPIsPanel } from '@/components/analytics/KPIsPanel';
import { InsightsPanel } from '@/components/analytics/InsightsPanel';
import { CustomersAnalysis } from '@/components/analytics/CustomersAnalysis';
import { BarberPerformanceChart } from '@/components/analytics/BarberPerformanceChart';
import { ConversionFunnel } from '@/components/analytics/ConversionFunnel';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analytics/overview');
      setData(response.data);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
      alert('Erro ao carregar dados de analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
        <p className="text-sm font-semibold text-gray-600">Carregando analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-800 mb-2">Sem dados disponíveis</h3>
        <p className="text-sm text-gray-500">Nenhum dado de analytics encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header — igual ao padrão das outras páginas do dashboard */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
            <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">Analytics Avançados</h1>
            <p className="text-xs md:text-sm text-gray-600 mt-0.5">
              Insights inteligentes e análises em tempo real
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-white border-2 border-purple-200 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition disabled:opacity-50 text-sm"
        >
          <RefreshCw className={`w-4 h-4 md:w-5 md:h-5 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Atualizar</span>
        </button>
      </div>

      {/* KPIs */}
      <KPIsPanel data={data.kpis} />

      {/* Insights */}
      {data.insights && data.insights.length > 0 && (
        <InsightsPanel insights={data.insights} />
      )}

      {/* Mapa de Calor — largura total */}
      <HeatmapChart data={data.heatmap} />

      {/* Performance por Barbeiro — largura total */}
      <BarberPerformanceChart data={data.barberPerformance} />

      {/* Análise de Clientes + Funil — lado a lado no desktop, empilhados no mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomersAnalysis data={data.customers} />
        <ConversionFunnel data={data.conversionFunnel} />
      </div>

      {/* Footer */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg md:text-2xl">🤖</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm md:text-base">Analytics Inteligentes</h4>
              <p className="text-xs md:text-sm text-gray-600">
                Dados atualizados automaticamente com base nos seus registros
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Última atualização</p>
            <p className="text-xs md:text-sm font-semibold text-gray-800">
              {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}