'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  Settings, 
  LogOut,
  Menu,
  X,
  Globe,
  MapPin,
  CreditCard
} from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { cn } from '@/lib/utils/cn';
import { FileText } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, barbershop, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      console.log('⚠️ Usuário não autenticado - redirecionando para login');
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // ✅ CORRIGIDO: Menu items com Configurações adicionado
  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/agendamentos', icon: Calendar, label: 'Agendamentos' },
    { href: '/clientes', icon: Users, label: 'Clientes' },
    { href: '/servicos', icon: Scissors, label: 'Serviços' },
    { href: '/localizacao', icon: MapPin, label: 'Localização' },
    { href: '/landing-page', icon: Globe, label: 'Landing Page' },
    { href: '/planos', icon: CreditCard, label: 'Planos' },
    { href: '/configuracoes', icon: Settings, label: 'Configurações' },
    { href: '/relatorios', icon: FileText, label: 'Relatórios' },
  ];

  const bottomNavItems = [
    menuItems[0], // Dashboard
    menuItems[1], // Agendamentos
    menuItems[2], // Clientes
    menuItems[5], // Landing Page
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-white border-r border-gray-200 z-30">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 truncate">
                {barbershop?.name || 'Barbearia'}
              </h2>
              <p className="text-xs text-gray-500 truncate">{user.name}</p>
            </div>
          </div>

          {/* Menu Desktop */}
          <nav className="flex-1 px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition',
                    isActive
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
                  )}
                >
                  <Icon className={cn(
                    'mr-3 h-5 w-5 transition',
                    isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-purple-600'
                  )} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout Desktop */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4">
            <button
              onClick={signOut}
              className="group flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg flex-shrink-0">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-gray-900 truncate">
                {barbershop?.name || 'Barbearia'}
              </h2>
              <p className="text-xs text-gray-500 truncate">{user.name}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white shadow-lg">
            <nav className="px-2 py-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-3 text-sm font-medium rounded-lg transition active:scale-95',
                      isActive ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={signOut}
                className="flex items-center w-full px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition active:scale-95"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sair
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 pt-16 md:pt-0 pb-20 md:pb-0">
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation (só mobile) */}
      <BottomNav items={bottomNavItems} />
    </div>
  );
}