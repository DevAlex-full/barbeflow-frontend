'use client';

import { Users, Scissors, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      icon: Users,
      label: 'Adicionar Cliente',
      description: 'Cadastrar novo cliente',
      onClick: () => router.push('/clientes'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: Scissors,
      label: 'Novo Serviço',
      description: 'Adicionar serviço',
      onClick: () => router.push('/servicos'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      icon: FileText,
      label: 'Ver Relatórios',
      description: 'Análises e exportação',
      onClick: () => {
        // Será implementado na Fase 4
        alert('Relatórios serão implementados em breve!');
      },
      color: 'bg-green-500 hover:bg-green-600'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} text-white p-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <action.icon className="w-8 h-8" />
              <div>
                <p className="font-bold text-sm">{action.label}</p>
                <p className="text-xs opacity-90">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}