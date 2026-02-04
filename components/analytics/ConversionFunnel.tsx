'use client';

import { ChevronDown } from 'lucide-react';

interface ConversionFunnelProps {
  data: {
    scheduled: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    total: number;
    conversionRate: number;
    cancellationRate: number;
  };
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  const stages = [
    {
      label: 'Agendados',
      value: data.scheduled,
      percentage: (data.scheduled / data.total) * 100,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300'
    },
    {
      label: 'Confirmados',
      value: data.confirmed,
      percentage: (data.confirmed / data.total) * 100,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300'
    },
    {
      label: 'Concluídos',
      value: data.completed,
      percentage: (data.completed / data.total) * 100,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          🎯 Funil de Conversão
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Últimos 30 dias
        </p>
      </div>

      {/* Funil Visual */}
      <div className="space-y-2 mb-6">
        {stages.map((stage, index) => {
          const width = 100 - (index * 15); // Diminui 15% a cada estágio

          return (
            <div key={index}>
              <div
                className={`mx-auto p-4 rounded-xl border-2 ${stage.bgColor} ${stage.borderColor} transition-all hover:shadow-md`}
                style={{ width: `${width}%` }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{stage.label}</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stage.value}</p>
                    <p className="text-sm text-gray-600">{stage.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {index < stages.length - 1 && (
                <div className="flex justify-center my-1">
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cancelados */}
      <div className="mb-6 p-4 bg-red-50 rounded-xl border-2 border-red-200">
        <div className="flex items-center justify-between">
          <span className="font-bold text-red-900">❌ Cancelados</span>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-900">{data.cancelled}</p>
            <p className="text-sm text-red-700">{data.cancellationRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Taxa de Conversão</p>
          <p className="text-4xl font-bold">{data.conversionRate.toFixed(1)}%</p>
          <p className="text-xs opacity-80 mt-2">
            Agendamentos concluídos
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Taxa de Cancelamento</p>
          <p className="text-4xl font-bold">{data.cancellationRate.toFixed(1)}%</p>
          <p className="text-xs opacity-80 mt-2">
            Agendamentos cancelados
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        {data.conversionRate >= 80 ? (
          <p className="text-sm text-blue-800">
            ✅ <strong>Excelente!</strong> Taxa de conversão acima de 80%
          </p>
        ) : data.conversionRate >= 60 ? (
          <p className="text-sm text-blue-800">
            👍 <strong>Bom!</strong> Taxa de conversão saudável
          </p>
        ) : (
          <p className="text-sm text-orange-800">
            ⚠️ <strong>Atenção:</strong> Taxa de conversão baixa. Considere melhorar confirmações
          </p>
        )}
      </div>
    </div>
  );
}