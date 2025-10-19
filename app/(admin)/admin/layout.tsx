'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false); // ✅ NOVO

  const ADMIN_EMAILS = [
    'alex.zila@hotmail.com',
    'appbarberflow@gmail.com'
  ];

  useEffect(() => {
    // ✅ Verificação mais rigorosa
    if (!loading) {
      if (!user) {
        router.replace('/login'); // ✅ replace ao invés de push
        return;
      }

      if (!ADMIN_EMAILS.includes(user.email)) {
        router.replace('/dashboard'); // ✅ replace ao invés de push
        return;
      }

      // ✅ Só autoriza se passou em todas as verificações
      setIsAuthorized(true);
    }
  }, [user, loading, router]);

  // Fecha menu ao navegar
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // ✅ Loading state
  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // ✅ Não renderiza nada se não for admin
  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return null;
  }

  const menuItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      href: '/admin/barbershops',
      label: 'Barbearias',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      href: '/admin/payments',
      label: 'Pagamentos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:block fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-30">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-purple-400">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">BarberFlow</p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center px-6 py-3 transition',
                  isActive
                    ? 'bg-gray-800 text-white border-l-4 border-purple-500'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            );
          })}

          <div className="border-t border-gray-800 mt-6 pt-6">
            <Link
              href="/dashboard"
              className="flex items-center px-6 py-3 text-gray-400 hover:bg-gray-800 hover:text-white transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="ml-3">Voltar ao Dashboard</span>
            </Link>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.email}</p>
              <p className="text-xs text-gray-400">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white z-40 safe-area-top">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-bold text-purple-400">Admin Panel</h1>
            <p className="text-xs text-gray-400">BarberFlow</p>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-800 bg-gray-900">
            <nav className="px-2 py-3 space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center px-4 py-3 rounded-lg transition active:scale-95',
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    )}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                );
              })}

              <Link
                href="/dashboard"
                className="flex items-center px-4 py-3 text-gray-400 hover:bg-gray-800 rounded-lg transition active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="ml-3">Voltar ao Dashboard</span>
              </Link>
            </nav>

            <div className="border-t border-gray-800 p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                  <p className="text-xs text-gray-400">Administrador</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="md:ml-64 pt-20 md:pt-0 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}