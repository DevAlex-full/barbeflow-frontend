'use client';

interface HeatmapData {
  day: string;
  hour: string;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapData[];
}

export function HeatmapChart({ data }: HeatmapChartProps) {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`); // 8h-19h

  const maxValue = Math.max(...data.map(d => d.value), 1);

  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-100';
    const intensity = Math.min(value / maxValue, 1);
    if (intensity < 0.25) return 'bg-blue-200';
    if (intensity < 0.5)  return 'bg-blue-400';
    if (intensity < 0.75) return 'bg-purple-500';
    return 'bg-purple-700';
  };

  const getValue = (day: string, hour: string) => {
    const item = data.find(d => d.day === day && d.hour === hour);
    return item?.value || 0;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
      <div className="flex items-start justify-between mb-4 md:mb-6 gap-3">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-800">
            🔥 Mapa de Calor - Horários de Pico
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Últimos 30 dias</p>
        </div>

        {/* Legenda — oculta no mobile para poupar espaço */}
        <div className="hidden sm:flex items-center gap-2 text-xs flex-shrink-0">
          <span className="text-gray-600">Menos</span>
          <div className="w-4 h-4 bg-blue-200 rounded" />
          <div className="w-4 h-4 bg-blue-400 rounded" />
          <div className="w-4 h-4 bg-purple-500 rounded" />
          <div className="w-4 h-4 bg-purple-700 rounded" />
          <span className="text-gray-600">Mais</span>
        </div>
      </div>

      {/* Legenda mobile */}
      <div className="flex sm:hidden items-center gap-2 text-xs mb-3">
        <span className="text-gray-500">Menos</span>
        <div className="w-3 h-3 bg-blue-200 rounded" />
        <div className="w-3 h-3 bg-blue-400 rounded" />
        <div className="w-3 h-3 bg-purple-500 rounded" />
        <div className="w-3 h-3 bg-purple-700 rounded" />
        <span className="text-gray-500">Mais</span>
      </div>

      {/* Scroll container — garante que o heatmap não quebre o layout */}
      <div className="overflow-x-auto">
        <div style={{ minWidth: '520px' }}>
          {/* Cabeçalho de horas */}
          <div className="flex mb-1">
            <div className="w-10 md:w-16 flex-shrink-0" />
            {hours.map(hour => (
              <div key={hour} className="flex-1 text-center text-xs text-gray-600 font-medium">
                {hour.split(':')[0]}h
              </div>
            ))}
          </div>

          {/* Linhas dos dias */}
          {days.map(day => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-10 md:w-16 text-xs md:text-sm font-semibold text-gray-700 flex-shrink-0">
                {day}
              </div>
              {hours.map(hour => {
                const value = getValue(day, hour);
                return (
                  <div
                    key={`${day}-${hour}`}
                    className={`flex-1 h-8 md:h-10 mx-px rounded ${getColor(value)} transition-all hover:scale-110 cursor-pointer group relative`}
                    title={`${day} ${hour}: ${value} agendamentos`}
                  >
                    {value > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {value}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 md:mt-6 p-3 md:p-4 bg-purple-50 rounded-xl border border-purple-200">
        <p className="text-xs md:text-sm text-purple-800">
          💡 <strong>Dica:</strong> Passe o mouse sobre os quadrados para ver detalhes
        </p>
      </div>
    </div>
  );
}