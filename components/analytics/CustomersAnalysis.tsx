'use client';

interface CustomersAnalysisProps {
  data: {
    new: number;
    recurring: number;
    oneTime: number;
    total: number;
  };
}

export function CustomersAnalysis({ data }: CustomersAnalysisProps) {
  const segments = [
    {
      label: 'Novos',
      value: data.new,
      percentage: (data.new / data.total) * 100,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      icon: '🆕'
    },
    {
      label: 'Recorrentes',
      value: data.recurring,
      percentage: (data.recurring / data.total) * 100,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      icon: '🔄'
    },
    {
      label: 'Uma Visita',
      value: data.oneTime,
      percentage: (data.oneTime / data.total) * 100,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      icon: '1️⃣'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          👥 Análise de Clientes
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Segmentação por comportamento
        </p>
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white mb-6">
        <p className="text-sm opacity-90 mb-1">Total de Clientes</p>
        <p className="text-4xl font-bold">{data.total}</p>
      </div>

      {/* Segmentos */}
      <div className="space-y-4">
        {segments.map((segment, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{segment.icon}</span>
                <span className="font-semibold text-gray-800">{segment.label}</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{segment.value}</p>
                <p className="text-sm text-gray-500">{segment.percentage.toFixed(1)}%</p>
              </div>
            </div>

            {/* Barra de progresso */}
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${segment.color} transition-all duration-500`}
                style={{ width: `${segment.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
        {data.recurring > data.oneTime ? (
          <p className="text-sm text-purple-800">
            ✅ <strong>Ótimo!</strong> Você tem mais clientes recorrentes que ocasionais
          </p>
        ) : (
          <p className="text-sm text-orange-800">
            ⚠️ <strong>Atenção:</strong> Foque em fidelização para aumentar clientes recorrentes
          </p>
        )}
      </div>
    </div>
  );
}