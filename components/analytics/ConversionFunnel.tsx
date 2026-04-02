'use client';

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
  // ✅ FIX: evita NaN% quando total é 0
  const safeTotal = data.total || 1;

  const stages = [
    {
      label: 'Agendados',
      value: data.scheduled,
      percentage: (data.scheduled / safeTotal) * 100,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      icon: '📅'
    },
    {
      label: 'Confirmados',
      value: data.confirmed,
      percentage: (data.confirmed / safeTotal) * 100,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      icon: '✅'
    },
    {
      label: 'Concluídos',
      value: data.completed,
      percentage: (data.completed / safeTotal) * 100,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      icon: '🏁'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-800">
          🎯 Funil de Conversão
        </h3>
        <p className="text-xs md:text-sm text-gray-500 mt-1">Últimos 30 dias</p>
      </div>

      {/* ✅ FIX: substituído o width% no container por barra de progresso interna
          O container agora tem largura 100% em todas as telas */}
      <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
        {stages.map((stage, index) => (
          <div
            key={index}
            className={`w-full p-3 md:p-4 rounded-xl border-2 ${stage.bgColor} ${stage.borderColor} transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-base md:text-lg">{stage.icon}</span>
                <span className="font-bold text-gray-900 text-sm md:text-base">{stage.label}</span>
              </div>
              <div className="text-right">
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stage.value}</p>
                <p className="text-xs md:text-sm text-gray-600">{stage.percentage.toFixed(1)}%</p>
              </div>
            </div>
            {/* Barra de progresso dentro do card */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${stage.color} transition-all duration-500`}
                style={{ width: `${stage.percentage}%` }}
              />
            </div>
          </div>
        ))}

        {/* Cancelados */}
        <div className="w-full p-3 md:p-4 bg-red-50 rounded-xl border-2 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base md:text-lg">❌</span>
              <span className="font-bold text-red-900 text-sm md:text-base">Cancelados</span>
            </div>
            <div className="text-right">
              <p className="text-xl md:text-2xl font-bold text-red-900">{data.cancelled}</p>
              <p className="text-xs md:text-sm text-red-700">{data.cancellationRate.toFixed(1)}%</p>
            </div>
          </div>
          <div className="h-2 bg-red-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
              style={{ width: `${data.cancellationRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 md:p-6 text-white">
          <p className="text-xs opacity-90 mb-1">Taxa de Conversão</p>
          <p className="text-2xl md:text-4xl font-bold">{data.conversionRate.toFixed(1)}%</p>
          <p className="text-xs opacity-80 mt-1 md:mt-2">Agendamentos concluídos</p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-3 md:p-6 text-white">
          <p className="text-xs opacity-90 mb-1">Taxa de Cancelamento</p>
          <p className="text-2xl md:text-4xl font-bold">{data.cancellationRate.toFixed(1)}%</p>
          <p className="text-xs opacity-80 mt-1 md:mt-2">Agendamentos cancelados</p>
        </div>
      </div>

      {/* Insight */}
      <div className="mt-3 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-200">
        {data.conversionRate >= 80 ? (
          <p className="text-xs md:text-sm text-blue-800">
            ✅ <strong>Excelente!</strong> Taxa de conversão acima de 80%
          </p>
        ) : data.conversionRate >= 60 ? (
          <p className="text-xs md:text-sm text-blue-800">
            👍 <strong>Bom!</strong> Taxa de conversão saudável
          </p>
        ) : (
          <p className="text-xs md:text-sm text-orange-800">
            ⚠️ <strong>Atenção:</strong> Taxa de conversão baixa. Considere melhorar confirmações
          </p>
        )}
      </div>
    </div>
  );
}