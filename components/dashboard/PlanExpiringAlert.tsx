'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PlanExpiringAlertProps {
  daysRemaining: number;
  planName: string;
  expiresAt: string;
}

export function PlanExpiringAlert({ daysRemaining, planName, expiresAt }: PlanExpiringAlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  if (!isVisible || daysRemaining > 7 || daysRemaining <= 0) {
    return null;
  }

  const urgencyLevel = daysRemaining <= 3 ? 'high' : 'medium';
  
  const config = {
    high: {
      bg: 'bg-gradient-to-r from-red-500 to-orange-500',
      text: 'text-white',
      icon: 'text-white'
    },
    medium: {
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      text: 'text-white',
      icon: 'text-white'
    }
  };

  const style = config[urgencyLevel];

  return (
    <div className={`${style.bg} ${style.text} rounded-xl shadow-lg mb-6 animate-in slide-in-from-top duration-500`}>
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Ícone */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <AlertTriangle size={24} className={style.icon} />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold mb-1">
              {daysRemaining <= 3 ? '⚠️ Urgente!' : '⏰ Atenção'} Seu plano está expirando
            </h3>
            <p className="text-sm opacity-90 mb-3">
              Seu plano <strong>{planName}</strong> expira em{' '}
              <strong className="text-xl">{daysRemaining}</strong>{' '}
              {daysRemaining === 1 ? 'dia' : 'dias'} (
              {new Date(expiresAt).toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'short' 
              })})
            </p>
            
            <button
              onClick={() => router.push('/planos')}
              className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105"
            >
              Renovar Agora
            </button>
          </div>

          {/* Botão fechar */}
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}