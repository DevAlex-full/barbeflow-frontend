'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Bell, 
  Globe, 
  Shield, 
  Moon, 
  Sun,
  Trash2,
  ChevronRight 
} from 'lucide-react';
import { useClientAuth } from '@/lib/contexts/ClientAuthContext';

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { client, isAuthenticated, loading } = useClientAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/sou-cliente');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const savedTheme = sessionStorage.getItem('@barberFlow:theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    sessionStorage.setItem('@barberFlow:theme', newTheme);

    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  const handleDeleteAccount = () => {
    if (confirm('⚠️ Tem certeza que deseja excluir sua conta? Esta ação é irreversível!')) {
      // TODO: Implementar exclusão de conta
      alert('Funcionalidade em desenvolvimento');
    }
  };

  if (loading || !client) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Configurações</h1>
            <p className="text-sm text-gray-400">Gerencie suas preferências</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Notificações */}
        <div className="bg-[#151b23] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Bell size={20} className="text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold">Notificações</h3>
                <p className="text-sm text-gray-400">Como você quer ser notificado</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-800">
            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por Email</p>
                <p className="text-sm text-gray-400">Receba lembretes por email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por SMS</p>
                <p className="text-sm text-gray-400">Receba lembretes por SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="p-6 flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações Push</p>
                <p className="text-sm text-gray-400">Receba notificações no navegador</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Aparência */}
        <div className="bg-[#151b23] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                {theme === 'dark' ? (
                  <Moon size={20} className="text-purple-400" />
                ) : (
                  <Sun size={20} className="text-yellow-400" />
                )}
              </div>
              <div>
                <h3 className="font-bold">Aparência</h3>
                <p className="text-sm text-gray-400">Personalize a interface</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 bg-[#1f2937] hover:bg-[#374151] rounded-lg transition"
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <>
                    <Moon size={20} className="text-blue-400" />
                    <span>Tema Escuro</span>
                  </>
                ) : (
                  <>
                    <Sun size={20} className="text-yellow-400" />
                    <span>Tema Claro</span>
                  </>
                )}
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Idioma */}
        <div className="bg-[#151b23] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Globe size={20} className="text-green-400" />
              </div>
              <div>
                <h3 className="font-bold">Idioma</h3>
                <p className="text-sm text-gray-400">Escolha seu idioma preferido</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <select className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
        </div>

        {/* Privacidade & Segurança */}
        <div className="bg-[#151b23] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Shield size={20} className="text-yellow-400" />
              </div>
              <div>
                <h3 className="font-bold">Privacidade & Segurança</h3>
                <p className="text-sm text-gray-400">Gerencie seus dados</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-800">
            <button
              onClick={() => router.push('/privacidade-cliente')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800/50 transition text-left"
            >
              <span>Política de Privacidade</span>
              <ChevronRight size={20} className="text-gray-400" />
            </button>

            <button
              onClick={() => router.push('/termos-cliente')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800/50 transition text-left"
            >
              <span>Termos de Uso</span>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Zona de Perigo */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-red-400">Zona de Perigo</h3>
                <p className="text-sm text-gray-400">Ações irreversíveis</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 py-3 rounded-lg font-medium transition"
            >
              Excluir minha conta
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Esta ação não pode ser desfeita
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}