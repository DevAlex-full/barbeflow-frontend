'use client';

import { useState, useEffect } from 'react';
import { Settings, Loader2 } from 'lucide-react';
import { useTutorial } from '@/lib/hooks/useTutorial'; // ✅ IMPORTAR HOOK
import { ConfiguracoesConta } from '@/components/configuracoes/ConfiguracoesConta';
import { AlterarSenha } from '@/components/configuracoes/AlterarSenha';
import { Preferencias } from '@/components/configuracoes/Preferencias';
import { PlanoAtual } from '@/components/configuracoes/PlanoAtual';
import { ExcluirConta } from '@/components/configuracoes/ExcluirConta';

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const { startTutorial } = useTutorial(); // ✅ HOOK DO TUTORIAL

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('@barberFlow:token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Buscar dados do usuário logado
      const userResponse = await fetch('https://barberflow-api-v2.onrender.com/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (userResponse.ok) {
        const data = await userResponse.json();
        setUserData(data);
      } else {
        throw new Error('Erro ao carregar dados');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar:', error);
      alert('❌ Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDadosPessoais = async (data: any) => {
    const token = localStorage.getItem('@barberFlow:token');
    const response = await fetch('https://barberflow-api-v2.onrender.com/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar dados pessoais');
    }

    // Atualizar dados locais
    setUserData({ ...userData, ...data });
  };

  const handleSaveSenha = async (data: { currentPassword: string; newPassword: string }) => {
    const token = localStorage.getItem('@barberFlow:token');
    const response = await fetch('https://barberflow-api-v2.onrender.com/api/users/change-password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao alterar senha');
    }
  };

  const handleSavePreferencias = async (data: any) => {
    const token = localStorage.getItem('@barberFlow:token');
    const response = await fetch('https://barberflow-api-v2.onrender.com/api/users/preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar preferências');
    }

    // Atualizar dados locais
    setUserData({ ...userData, preferences: data });
  };

  const handleDeleteAccount = async (password: string) => {
    const token = localStorage.getItem('@barberFlow:token');
    const response = await fetch('https://barberflow-api-v2.onrender.com/api/barbershop', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao excluir conta');
    }

    // Limpar localStorage
    localStorage.removeItem('@barberFlow:token');
    localStorage.removeItem('@barberFlow:user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Carregando configurações...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-lg transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Configurações
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                Gerencie sua conta e preferências
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Dados Pessoais */}
            <ConfiguracoesConta
              initialData={{
                name: userData?.name || '',
                email: userData?.email || '',
                phone: userData?.phone || '',
              }}
              onSave={handleSaveDadosPessoais}
            />

            {/* Alterar Senha */}
            <AlterarSenha onSave={handleSaveSenha} />
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Preferências */}
            <Preferencias
              initialData={{
                emailNotifications: userData?.preferences?.emailNotifications ?? true,
                smsNotifications: userData?.preferences?.smsNotifications ?? false,
                whatsappNotifications: userData?.preferences?.whatsappNotifications ?? true,
                theme: userData?.preferences?.theme || 'light',
              }}
              onSave={handleSavePreferencias}
            />

            {/* Plano Atual */}
            <PlanoAtual currentPlanId={userData?.barbershop?.plan || 'trial'} />

            {/* Excluir Conta */}
            <ExcluirConta onDelete={handleDeleteAccount} />

            {/* ✅ TUTORIAL GUIADO */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ajuda e Tutorial</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aprenda a usar o BarberFlow</p>
                </div>
              </div>

              <button
                onClick={startTutorial}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-600 rounded-lg group-hover:scale-110 transition">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white">Tutorial Guiado</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Faça um tour completo pelo sistema (20 passos)
                    </p>
                  </div>
                </div>
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}