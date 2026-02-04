'use client';

import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useState } from 'react';

interface Insight {
  type: 'success' | 'warning' | 'info';
  icon: string;
  message: string;
}

interface InsightsPanelProps {
  insights: Insight[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const [dismissed, setDismissed] = useState<number[]>([]);

  const handleDismiss = (index: number) => {
    setDismissed([...dismissed, index]);
  };

  const visibleInsights = insights.filter((_, index) => !dismissed.includes(index));

  if (visibleInsights.length === 0) {
    return null;
  }

  const getTypeStyles = (type: Insight['type']) => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          textColor: 'text-green-800'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-800'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: Info,
          iconColor: 'text-blue-600',
          textColor: 'text-blue-800'
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        🤖 Insights Automáticos
      </h3>

      <div className="space-y-3">
        {visibleInsights.map((insight, index) => {
          const styles = getTypeStyles(insight.type);
          const IconComponent = styles.icon;
          const originalIndex = insights.indexOf(insight);

          return (
            <div
              key={originalIndex}
              className={`flex items-start gap-3 p-4 rounded-xl border ${styles.container} transition-all hover:shadow-md`}
            >
              {/* Emoji do insight */}
              <span className="text-2xl flex-shrink-0">
                {insight.icon}
              </span>

              {/* Ícone do tipo */}
              <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${styles.iconColor}`} />

              {/* Mensagem */}
              <p className={`flex-1 text-sm font-medium ${styles.textColor}`}>
                {insight.message}
              </p>

              {/* Botão de dismiss */}
              <button
                onClick={() => handleDismiss(originalIndex)}
                className={`flex-shrink-0 p-1 rounded-lg hover:bg-white/50 transition ${styles.iconColor}`}
                aria-label="Dispensar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Os insights são atualizados automaticamente com base nos seus dados
        </p>
      </div>
    </div>
  );
}