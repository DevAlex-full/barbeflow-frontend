'use client';

import { useState, useEffect } from 'react';
import { Settings, Loader2 } from 'lucide-react';
import { ConfiguracoesConta } from '@/components/configuracoes/ConfiguracoesConta';
import { AlterarSenha } from '@/components/configuracoes/AlterarSenha';
import { Preferencias } from '@/components/configuracoes/Preferencias';
import { PlanoAtual } from '@/components/configuracoes/PlanoAtual';
import { ExcluirConta } from '@/components/configuracoes/ExcluirConta';

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

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
          </div>
        </div>
      </div>
    </div>
  );
}