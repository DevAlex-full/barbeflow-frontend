'use client';

import { Activity } from 'lucide-react';

interface OccupancyCardProps {
  rate: number;
}

export function OccupancyCard({ rate }: OccupancyCardProps) {
  // Determinar cor baseado na taxa
  const getColor = (rate: number) => {
    if (rate >= 80) return { bg: 'bg-green-100', text: 'text-green-600', bar: 'bg-green-500' };
    if (rate >= 50) return { bg: 'bg-yellow-100', text: 'text-yellow-600', bar: 'bg-yellow-500' };
    return { bg: 'bg-red-100', text: 'text-red-600', bar: 'bg-red-500' };
  };

  const color = getColor(rate);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Taxa de Ocupação</h3>
        <div className={`${color.bg} p-2 rounded-lg`}>
          <Activity className={`w-5 h-5 ${color.text}`} />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">{rate}%</p>
            <p className="text-sm text-gray-600 mt-1">Últimos 30 dias</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`${color.bar} h-full rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(rate, 100)}%` }}
          />
        </div>

        {/* Status */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Capacidade</span>
          <span className={`font-semibold ${color.text}`}>
            {rate >= 80 ? 'Excelente' : rate >= 50 ? 'Bom' : 'Baixa'}
          </span>
        </div>
      </div>
    </div>
  );
}