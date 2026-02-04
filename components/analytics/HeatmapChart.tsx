'use client';

import { useEffect, useState } from 'react';

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

  // Encontrar valor máximo para normalizar cores
  const maxValue = Math.max(...data.map(d => d.value), 1);

  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-100';
    const intensity = Math.min(value / maxValue, 1);
    
    if (intensity < 0.25) return 'bg-blue-200';
    if (intensity < 0.5) return 'bg-blue-400';
    if (intensity < 0.75) return 'bg-purple-500';
    return 'bg-purple-700';
  };

  const getValue = (day: string, hour: string) => {
    const item = data.find(d => d.day === day && d.hour === hour);
    return item?.value || 0;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🔥 Mapa de Calor - Horários de Pico
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Últimos 30 dias
          </p>
        </div>
        
        {/* Legenda */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-600">Menos</span>
          <div className="w-4 h-4 bg-blue-200 rounded"></div>
          <div className="w-4 h-4 bg-blue-400 rounded"></div>
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <div className="w-4 h-4 bg-purple-700 rounded"></div>
          <span className="text-gray-600">Mais</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Cabeçalho de horas */}
          <div className="flex mb-2">
            <div className="w-16"></div>
            {hours.map(hour => (
              <div key={hour} className="w-12 text-center text-xs text-gray-600 font-medium">
                {hour.split(':')[0]}h
              </div>
            ))}
          </div>

          {/* Linhas dos dias */}
          {days.map(day => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-16 text-sm font-semibold text-gray-700">
                {day}
              </div>
              {hours.map(hour => {
                const value = getValue(day, hour);
                return (
                  <div
                    key={`${day}-${hour}`}
                    className={`w-12 h-10 m-0.5 rounded ${getColor(value)} transition-all hover:scale-110 cursor-pointer group relative`}
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

      {/* Insights */}
      <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
        <p className="text-sm text-purple-800">
          💡 <strong>Dica:</strong> Passe o mouse sobre os quadrados para ver detalhes
        </p>
      </div>
    </div>
  );
}