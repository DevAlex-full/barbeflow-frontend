'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface PlanStats {
  active: number;
  expired: number;
  trial: number;
  expiringSoon: number;
}

export function BarbershopsStatsChart() {
  const [stats, setStats] = useState<PlanStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await api.get('/admin/plan-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const data = [
    { name: 'Ativas', value: stats.active, color: '#10b981' },
    { name: 'Expiradas', value: stats.expired, color: '#ef4444' },
    { name: 'Trial', value: stats.trial, color: '#3b82f6' },
    { name: 'Expirando', value: stats.expiringSoon, color: '#f59e0b' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Status das Barbearias</h3>
          <p className="text-sm text-gray-600 mt-1">Distribuição por status de plano</p>
        </div>
        <button
          onClick={fetchStats}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          Atualizar
        </button>
      </div>

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            formatter={(value) => [value, 'Barbearias']}
          />
          <Bar 
            dataKey="value" 
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legendas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-xs font-medium text-gray-600">{item.name}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}