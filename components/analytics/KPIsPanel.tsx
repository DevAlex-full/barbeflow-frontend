'use client';

import { TrendingUp, TrendingDown, DollarSign, Clock, Users, BarChart3 } from 'lucide-react';

interface KPIsProps {
  data: {
    avgRevenuePerDay: number;
    avgDaysBetweenVisits: number;
    growthRate: number;
    returnRate: number;
    totalRevenueLast30: number;
    totalAppointmentsLast30: number;
  };
}

export function KPIsPanel({ data }: KPIsProps) {
  const kpis = [
    {
      icon: DollarSign,
      label: 'Receita Média/Dia',
      value: `R$ ${data.avgRevenuePerDay.toFixed(2)}`,
      change: data.growthRate,
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Clock,
      label: 'Tempo Médio Entre Visitas',
      value: `${Math.round(data.avgDaysBetweenVisits)} dias`,
      subtitle: 'Clientes recorrentes',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: TrendingUp,
      label: 'Crescimento',
      value: `${data.growthRate > 0 ? '+' : ''}${data.growthRate.toFixed(1)}%`,
      subtitle: 'vs mês anterior',
      change: data.growthRate,
      color: data.growthRate >= 0 ? 'from-purple-500 to-pink-600' : 'from-red-500 to-orange-600'
    },
    {
      icon: Users,
      label: 'Taxa de Retorno',
      value: `${data.returnRate.toFixed(1)}%`,
      subtitle: 'Clientes que voltam',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: BarChart3,
      label: 'Receita Total (30d)',
      value: `R$ ${data.totalRevenueLast30.toFixed(2)}`,
      subtitle: `${data.totalAppointmentsLast30} agendamentos`,
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        const isPositive = kpi.change !== undefined && kpi.change > 0;
        const isNegative = kpi.change !== undefined && kpi.change < 0;

        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            {/* Ícone */}
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${kpi.color} mb-4`}>
              <Icon className="w-6 h-6 text-white" />
            </div>

            {/* Label */}
            <p className="text-sm font-medium text-gray-600 mb-2">
              {kpi.label}
            </p>

            {/* Valor */}
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {kpi.value}
            </p>

            {/* Subtitle ou Change */}
            {kpi.subtitle && (
              <p className="text-xs text-gray-500">
                {kpi.subtitle}
              </p>
            )}

            {kpi.change !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {isPositive && (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">
                      +{kpi.change.toFixed(1)}%
                    </span>
                  </>
                )}
                {isNegative && (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-red-600">
                      {kpi.change.toFixed(1)}%
                    </span>
                  </>
                )}
                {!isPositive && !isNegative && (
                  <span className="text-sm text-gray-500">
                    Estável
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}