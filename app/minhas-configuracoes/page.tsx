'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, User, Shield, Settings2, Trash2,
} from 'lucide-react';
import { useClientAuth } from '@/lib/contexts/ClientAuthContext';
import clientApi from '@/lib/client-api';
import { ConfiguracoesConta } from '@/components/configuracoes/ConfiguracoesConta';
import { AlterarSenha } from '@/components/configuracoes/AlterarSenha';
import { Preferencias } from '@/components/configuracoes/Preferencias';
import { ExcluirConta } from '@/components/configuracoes/ExcluirConta';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────
type Tab = 'conta' | 'senha' | 'preferencias' | 'excluir';

interface TabConfig {
  id: Tab;
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
}

const TABS: TabConfig[] = [
  { id: 'conta', label: 'Conta', icon: <User size={16} /> },
  { id: 'senha', label: 'Segurança', icon: <Shield size={16} /> },
  { id: 'preferencias', label: 'Preferências', icon: <Settings2 size={16} /> },
  { id: 'excluir', label: 'Excluir', icon: <Trash2 size={16} />, danger: true },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function MinhasConfiguracoesPage() {
  const router = useRouter();
  const { client: user, loading: authLoading } = useClientAuth();

  const [activeTab, setActiveTab] = useState<Tab>('conta');
  const [userData, setUserData] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // ─────────────────────────────────────────────────────────────────────────
  // Redirecionar se não autenticado
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) router.push('/sou-cliente');
  }, [authLoading, user, router]);

  // ─────────────────────────────────────────────────────────────────────────
  // Carregar dados do cliente
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await clientApi.get('/client/auth/me');
        setUserData(res.data);
      } catch (e) {
        console.error('Erro ao carregar usuário:', e);
      } finally {
        setPageLoading(false);
      }
    }
    load();
  }, [user]);

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────

  async function handleSaveConta(data: { name: string; email: string; phone: string }) {
    try {
      const res = await clientApi.put('/client/auth/profile', data);
      setUserData((prev: any) => ({ ...prev, ...res.data }));

      const stored = sessionStorage.getItem('@barberFlow:client:user');
      if (stored) {
        const parsed = JSON.parse(stored);
        sessionStorage.setItem('@barberFlow:client:user', JSON.stringify({ ...parsed, ...data }));
      }
    } catch (e: any) {
      throw new Error(e.response?.data?.error || 'Erro ao salvar dados');
    }
  }

  async function handleAlterarSenha(data: { currentPassword: string; newPassword: string }) {
    try {
      await clientApi.put('/client/auth/change-password', data);
    } catch (e: any) {
      throw new Error(e.response?.data?.error || 'Erro ao alterar senha');
    }
  }

  async function handleSavePreferencias(data: any) {
    try {
      await clientApi.put('/client/auth/preferences', data);
      setUserData((prev: any) => ({ ...prev, preferences: data }));
    } catch (e: any) {
      throw new Error(e.response?.data?.error || 'Erro ao salvar preferências');
    }
  }

  async function handleExcluirConta(password: string) {
    try {
      await clientApi.delete('/client/auth/account', { data: { password } });
      sessionStorage.removeItem('@barberFlow:client:token');
      sessionStorage.removeItem('@barberFlow:client:user');
      router.push('/sou-cliente');
    } catch (e: any) {
      throw new Error(e.response?.data?.error || 'Erro ao excluir conta');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Loading / Guard
  // ─────────────────────────────────────────────────────────────────────────
  if (authLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user || !userData) return null;

  const preferences = userData.preferences || {
    emailNotifications: true,
    smsNotifications: false,
    whatsappNotifications: true,
    theme: 'light',
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Header ── */}
      <header className="border-b border-gray-800 px-4 py-4 sticky top-0 bg-black z-10">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Configurações</h1>
            <p className="text-sm text-gray-400">Gerencie suas preferências</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar de Tabs ── */}
          <aside className="lg:w-56 flex-shrink-0">
            <nav className="bg-[#151b23] rounded-2xl border border-gray-800 overflow-hidden">
              {TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-sm font-medium text-left transition
                    ${i < TABS.length - 1 ? 'border-b border-gray-800' : ''}
                    ${activeTab === tab.id
                      ? tab.danger
                        ? 'bg-red-900/20 text-red-400'
                        : 'bg-blue-900/20 text-blue-400'
                      : tab.danger
                        ? 'text-red-500 hover:bg-red-900/10'
                        : 'text-gray-300 hover:bg-gray-800/50'
                    }
                  `}
                >
                  <span className={activeTab === tab.id ? '' : 'opacity-60'}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Info do cliente na sidebar */}
            <div className="mt-4 bg-[#151b23] rounded-2xl p-4 border border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {(userData.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{userData.name}</p>
                  <p className="text-xs text-gray-500 truncate">Cliente</p>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Conteúdo da Tab ── */}
          <main className="flex-1 min-w-0">

            {activeTab === 'conta' && (
              <ConfiguracoesConta
                initialData={{
                  name: userData.name || '',
                  email: userData.email || '',
                  phone: (userData.phone && !userData.phone.includes('@')) ? userData.phone : '',
                }}
                onSave={handleSaveConta}
              />
            )}

            {activeTab === 'senha' && (
              <AlterarSenha onSave={handleAlterarSenha} />
            )}

            {activeTab === 'preferencias' && (
              <Preferencias
                initialData={{
                  emailNotifications: preferences.emailNotifications ?? true,
                  smsNotifications: preferences.smsNotifications ?? false,
                  whatsappNotifications: preferences.whatsappNotifications ?? true,
                  theme: preferences.theme ?? 'light',
                }}
                onSave={handleSavePreferencias}
              />
            )}

            {activeTab === 'excluir' && (
              <div className="space-y-4">
                <div className="bg-red-900/20 border border-red-800 rounded-2xl p-5">
                  <h3 className="font-bold text-red-300 mb-1 flex items-center gap-2">
                    <Trash2 size={18} />
                    Zona de Perigo
                  </h3>
                  <p className="text-sm text-red-400">
                    As ações abaixo são irreversíveis. Prossiga com cautela.
                  </p>
                </div>
                <ExcluirConta onDelete={handleExcluirConta} />
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}