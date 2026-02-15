'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, Calendar, Heart, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useClientAuth } from '@/lib/contexts/ClientAuthContext';

export default function ClientUserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { client, signOut } = useClientAuth();
  const [userName, setUserName] = useState('Usuário');

  // ✅ FORÇA atualização do nome IMEDIATAMENTE ao montar o componente
  useEffect(() => {
    const updateUserName = () => {
      // Prioridade 1: Do contexto
      if (client?.name) {
        setUserName(client.name.split(' ')[0]);
        return;
      }
      
      // Prioridade 2: Do sessionStorage (caso o contexto não tenha atualizado ainda)
      try {
        const storedUser = sessionStorage.getItem('@barberFlow:client:user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData?.name) {
            setUserName(userData.name.split(' ')[0]);
            return;
          }
        }
      } catch (e) {
        console.error('Erro ao ler usuário:', e);
      }
      
      // Fallback
      setUserName('Usuário');
    };

    // Atualiza imediatamente
    updateUserName();

    // Cria um intervalo para verificar mudanças (útil após OAuth redirect)
    const interval = setInterval(updateUserName, 500);

    // Limpa após 3 segundos (tempo suficiente para pegar o nome)
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [client]);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut();
    setIsOpen(false);
    router.push('/sou-cliente');
    // ✅ Força reload da página para limpar o estado
    setTimeout(() => {
      window.location.href = '/sou-cliente';
    }, 100);
  };

  const menuItems = [
    {
      icon: User,
      label: 'Perfil',
      href: '/meu-perfil',
      description: 'Meus dados pessoais'
    },
    {
      icon: Heart,
      label: 'Favoritos',
      href: '/meus-favoritos',
      description: 'Barbearias salvas'
    },
    {
      icon: Calendar,
      label: 'Meus Agendamentos',
      href: '/meus-agendamentos',
      description: 'Histórico de cortes'
    },
    {
      icon: Settings,
      label: 'Configurações',
      href: '/minhas-configuracoes',
      description: 'Preferências da conta'
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão do Menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          {client?.avatar ? (
            <img
              src={client.avatar}
              alt={client.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User size={16} className="text-white" />
          )}
        </div>

        {/* Nome (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <div className="text-left">
            <p className="text-sm font-medium text-white">
              {userName}
            </p>
            <p className="text-xs text-gray-400">Ver perfil</p>
          </div>
          <ChevronDown 
            size={16} 
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1f2e] rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50 animate-fadeIn">
          {/* Header do Menu */}
          <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
            <p className="text-sm font-semibold text-white">{client?.name || userName}</p>
            <p className="text-xs text-gray-400 mt-1">{client?.email || ''}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs text-gray-400 truncate">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Logout */}
          <div className="border-t border-gray-700 p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors rounded-lg text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <LogOut size={16} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-400">Sair</p>
                <p className="text-xs text-gray-400">Encerrar sessão</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}