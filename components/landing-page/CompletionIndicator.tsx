'use client';

import { CheckCircle, AlertCircle } from 'lucide-react';

interface CompletionIndicatorProps {
  percentage: number;
  missingFields: string[];
}

export function CompletionIndicator({ percentage, missingFields }: CompletionIndicatorProps) {
  const getColor = (pct: number) => {
    if (pct >= 80) return 'green';
    if (pct >= 50) return 'yellow';
    return 'red';
  };

  const color = getColor(percentage);

  const colors = {
    green: {
      bg: 'bg-green-100',
      bar: 'bg-green-500',
      text: 'text-green-700',
      icon: CheckCircle
    },
    yellow: {
      bg: 'bg-yellow-100',
      bar: 'bg-yellow-500',
      text: 'text-yellow-700',
      icon: AlertCircle
    },
    red: {
      bg: 'bg-red-100',
      bar: 'bg-red-500',
      text: 'text-red-700',
      icon: AlertCircle
    }
  };

  const currentColor = colors[color];
  const Icon = currentColor.icon;

  return (
    <div className={`${currentColor.bg} rounded-xl p-4 border border-${color}-200`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${currentColor.text}`} />
          <span className={`text-sm font-bold ${currentColor.text}`}>
            Completude: {percentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className={`${currentColor.bar} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Missing Fields */}
      {missingFields.length > 0 && (
        <div className="text-xs text-gray-600 mt-2">
          <p className="font-semibold mb-1">Campos pendentes:</p>
          <ul className="list-disc list-inside space-y-1">
            {missingFields.slice(0, 3).map((field, i) => (
              <li key={i}>{field}</li>
            ))}
            {missingFields.length > 3 && (
              <li className="text-gray-500">+{missingFields.length - 3} outros</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}