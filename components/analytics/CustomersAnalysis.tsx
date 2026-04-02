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
  // ✅ FIX: evita NaN% quando total é 0
  const safeTotal = data.total || 1;

  const segments = [
    {
      label: 'Novos',
      value: data.new,
      percentage: (data.new / safeTotal) * 100,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      icon: '🆕'
    },
    {
      label: 'Recorrentes',
      value: data.recurring,
      percentage: (data.recurring / safeTotal) * 100,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      icon: '🔄'
    },
    {
      label: 'Uma Visita',
      value: data.oneTime,
      percentage: (data.oneTime / safeTotal) * 100,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
      icon: '1️⃣'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-800">
          👥 Análise de Clientes
        </h3>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Segmentação por comportamento
        </p>
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 md:p-6 text-white mb-4 md:mb-6">
        <p className="text-xs md:text-sm opacity-90 mb-1">Total de Clientes</p>
        <p className="text-3xl md:text-4xl font-bold">{data.total}</p>
      </div>

      {/* Segmentos */}
      <div className="space-y-3 md:space-y-4">
        {segments.map((segment, index) => (
          <div key={index} className="space-y-1.5 md:space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl">{segment.icon}</span>
                <span className="font-semibold text-gray-800 text-sm md:text-base">{segment.label}</span>
              </div>
              <div className="text-right">
                <p className="text-xl md:text-2xl font-bold text-gray-900">{segment.value}</p>
                <p className="text-xs md:text-sm text-gray-500">{segment.percentage.toFixed(1)}%</p>
              </div>
            </div>

            {/* Barra de progresso */}
            <div className="h-2.5 md:h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${segment.color} transition-all duration-500`}
                style={{ width: `${segment.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="mt-4 md:mt-6 p-3 md:p-4 bg-purple-50 rounded-xl border border-purple-200">
        {data.recurring > data.oneTime ? (
          <p className="text-xs md:text-sm text-purple-800">
            ✅ <strong>Ótimo!</strong> Você tem mais clientes recorrentes que ocasionais
          </p>
        ) : (
          <p className="text-xs md:text-sm text-orange-800">
            ⚠️ <strong>Atenção:</strong> Foque em fidelização para aumentar clientes recorrentes
          </p>
        )}
      </div>
    </div>
  );
}