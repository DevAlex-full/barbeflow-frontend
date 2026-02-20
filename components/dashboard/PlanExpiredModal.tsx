'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PlanExpiredModalProps {
  isOpen: boolean;
  planName: string;
  expiredDate: string;
}

export function PlanExpiredModal({ isOpen, planName, expiredDate }: PlanExpiredModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleRenew = () => {
    router.push('/planos');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-md">
        {/* Efeito de brilho vermelho */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 blur-3xl rounded-3xl animate-pulse"></div>
        
        {/* Card principal */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-red-700/50 overflow-hidden">
          <div className="p-8">
            {/* Ícone de alerta com animação */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/30 blur-2xl rounded-full animate-pulse"></div>
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <AlertTriangle size={40} className="text-white" />
                </div>
              </div>
            </div>

            {/* Título */}
            <h2 className="text-2xl font-bold text-center mb-2 text-white">
              Seu Plano Expirou
            </h2>
            <p className="text-center text-gray-400 mb-6">
              O acesso ao sistema foi bloqueado
            </p>

            {/* Detalhes */}
            <div className="space-y-3 mb-8">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-red-700/30">
                <p className="text-xs text-gray-400 mb-1">Plano</p>
                <p className="text-white font-semibold">{planName}</p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-red-700/30">
                <p className="text-xs text-gray-400 mb-1">Data de Expiração</p>
                <p className="text-white font-semibold">
                  {new Date(expiredDate).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Aviso */}
            <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-200 text-center">
                <strong>⚠️ Atenção:</strong> Para continuar usando o sistema, você precisa renovar seu plano agora.
              </p>
            </div>

            {/* Botão */}
            <button
              onClick={handleRenew}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:shadow-red-500/20 transform hover:scale-[1.02]"
            >
              Renovar Agora
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              💡 Escolha um novo plano e volte a usar todas as funcionalidades
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}