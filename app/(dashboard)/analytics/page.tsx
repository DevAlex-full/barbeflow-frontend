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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
          <p className="text-lg font-semibold text-gray-700">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Sem dados disponíveis
          </h3>
          <p className="text-gray-500">
            Nenhum dado de analytics encontrado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Analytics Avançados
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Insights inteligentes e análises em tempo real
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-purple-200 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPIs */}
        <KPIsPanel data={data.kpis} />

        {/* Insights */}
        {data.insights && data.insights.length > 0 && (
          <InsightsPanel insights={data.insights} />
        )}

        {/* Grid Principal */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mapa de Calor */}
          <div className="lg:col-span-2">
            <HeatmapChart data={data.heatmap} />
          </div>

          {/* Performance por Barbeiro */}
          <div className="lg:col-span-2">
            <BarberPerformanceChart data={data.barberPerformance} />
          </div>

          {/* Análise de Clientes */}
          <CustomersAnalysis data={data.customers} />

          {/* Funil de Conversão */}
          <ConversionFunnel data={data.conversionFunnel} />
        </div>

        {/* Footer Info */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Analytics Inteligentes</h4>
                <p className="text-sm text-gray-600">
                  Dados atualizados automaticamente a cada 30 dias
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Última atualização</p>
              <p className="text-sm font-semibold text-gray-800">
                {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}