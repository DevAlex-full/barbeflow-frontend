'use client';

import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

interface ComparisonCardProps {
  comparison: {
    currentMonth: {
      revenue: number;
      appointments: number;
    };
    previousMonth: {
      revenue: number;
      appointments: number;
    };
    growth: {
      revenue: string;
      appointments: string;
    };
  };
}

export function ComparisonCard({ comparison }: ComparisonCardProps) {
  const revenueGrowth = parseFloat(comparison.growth.revenue);
  const appointmentsGrowth = parseFloat(comparison.growth.appointments);

  const revenueIsPositive = revenueGrowth >= 0;
  const appointmentsIsPositive = appointmentsGrowth >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Comparativo Mensal</h3>
        <div className="bg-blue-100 p-2 rounded-lg">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Receita */}
        <div className="border-l-4 border-purple-500 pl-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Receita</span>
            </div>
            <div className={`flex items-center space-x-1 ${revenueIsPositive ? 'text-green-600' : 'text-red-600'}`}>
              {revenueIsPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-bold">
                {revenueIsPositive ? '+' : ''}{comparison.growth.revenue}%
              </span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            R$ {comparison.currentMonth.revenue.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Anterior: R$ {comparison.previousMonth.revenue.toFixed(2)}
          </p>
        </div>

        {/* Agendamentos */}
        <div className="border-l-4 border-blue-500 pl-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">Agendamentos</span>
            </div>
            <div className={`flex items-center space-x-1 ${appointmentsIsPositive ? 'text-green-600' : 'text-red-600'}`}>
              {appointmentsIsPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-bold">
                {appointmentsIsPositive ? '+' : ''}{comparison.growth.appointments}%
              </span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {comparison.currentMonth.appointments}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Anterior: {comparison.previousMonth.appointments}
          </p>
        </div>
      </div>
    </div>
  );
}