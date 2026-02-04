'use client';

import { Trophy, DollarSign, Calendar, TrendingUp } from 'lucide-react';

interface BarberPerformance {
  name: string;
  appointments: number;
  revenue: number;
  averageTicket: number;
}

interface BarberPerformanceChartProps {
  data: BarberPerformance[];
}

export function BarberPerformanceChart({ data }: BarberPerformanceChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          📊 Performance por Barbeiro
        </h3>
        <p className="text-gray-500 text-center py-8">
          Nenhum dado disponível
        </p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(b => b.revenue));
  const topBarber = data[0];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          📊 Performance por Barbeiro
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Últimos 30 dias - Ordenado por receita
        </p>
      </div>

      {/* Podium do Top 1 */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl p-6 text-white mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-9xl opacity-10">
          🏆
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-6 h-6" />
            <span className="text-sm font-semibold">🥇 TOP PERFORMER</span>
          </div>
          <p className="text-2xl font-bold mb-1">{topBarber.name}</p>
          <p className="text-3xl font-extrabold mb-2">
            R$ {topBarber.revenue.toFixed(2)}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span>{topBarber.appointments} agendamentos</span>
            <span>•</span>
            <span>Ticket médio: R$ {topBarber.averageTicket.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Lista de todos os barbeiros */}
      <div className="space-y-4">
        {data.map((barber, index) => {
          const revenuePercentage = (barber.revenue / maxRevenue) * 100;
          const isTop = index === 0;
          const medals = ['🥇', '🥈', '🥉'];

          return (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                isTop 
                  ? 'bg-yellow-50 border-yellow-300' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{medals[index] || '👤'}</span>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{barber.name}</p>
                    <p className="text-sm text-gray-600">
                      {barber.appointments} agendamentos
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {barber.revenue.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Média: R$ {barber.averageTicket.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isTop 
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                  style={{ width: `${revenuePercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Estatísticas gerais */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
          <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-xs text-gray-600 mb-1">Receita Total</p>
          <p className="text-lg font-bold text-gray-900">
            R$ {data.reduce((sum, b) => sum + b.revenue, 0).toFixed(2)}
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
          <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-xs text-gray-600 mb-1">Total Agendamentos</p>
          <p className="text-lg font-bold text-gray-900">
            {data.reduce((sum, b) => sum + b.appointments, 0)}
          </p>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
          <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-xs text-gray-600 mb-1">Ticket Médio Geral</p>
          <p className="text-lg font-bold text-gray-900">
            R$ {(data.reduce((sum, b) => sum + b.revenue, 0) / data.reduce((sum, b) => sum + b.appointments, 0)).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}