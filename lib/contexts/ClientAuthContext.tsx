'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface ClientAuthContextData {
  client: Client | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

const ClientAuthContext = createContext<ClientAuthContextData>({} as ClientAuthContextData);

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // ✅ Adicionar pathname para detectar mudanças de rota

  // ✅ FIX: Função para carregar cliente do sessionStorage
  const loadClientFromStorage = () => {
    try {
      const token = sessionStorage.getItem('@barberFlow:client:token');
      const storedClient = sessionStorage.getItem('@barberFlow:client:user');

      console.log('🔍 [CLIENT] Verificando autenticação...', {
        hasToken: !!token,
        hasClient: !!storedClient,
        pathname
      });

      if (token && storedClient) {
        const clientData = JSON.parse(storedClient);
        setClient(clientData);
        console.log('✅ [CLIENT] Cliente autenticado:', clientData.email);
      } else {
        setClient(null);
        console.log('⚠️ [CLIENT] Nenhum cliente autenticado');
      }
    } catch (error) {
      console.error('❌ [CLIENT] Erro ao carregar dados:', error);
      sessionStorage.removeItem('@barberFlow:client:token');
      sessionStorage.removeItem('@barberFlow:client:user');
      setClient(null);
    }
  };

  // ✅ FIX: Carregar na montagem inicial
  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    loadClientFromStorage();
    setLoading(false);
  }, []);

  // ✅ FIX: Recarregar quando a rota mudar (SPA navigation)
  useEffect(() => {
    if (typeof window !== 'undefined' && !loading) {
      console.log('🔄 [CLIENT] Rota mudou, verificando autenticação...', pathname);
      loadClientFromStorage();
    }
  }, [pathname]); // ✅ Dispara quando muda de página

  // ✅ FIX: Listener para mudanças no sessionStorage (entre abas)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === '@barberFlow:client:token' || e.key === '@barberFlow:client:user') {
        console.log('🔄 [CLIENT] SessionStorage mudou, recarregando...');
        loadClientFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  async function signIn(email: string, password: string) {
    try {
      console.log('🔐 [CLIENT] Tentando fazer login:', email);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://barberflow-api-v2.onrender.com/api';
      const response = await fetch(`${API_URL}/client/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao fazer login');
      }

      const { token, client: clientData } = await response.json();

      console.log('✅ [CLIENT] Login bem-sucedido:', clientData.email);

      sessionStorage.setItem('@barberFlow:client:token', token);
      sessionStorage.setItem('@barberFlow:client:user', JSON.stringify(clientData));

      setClient(clientData);
    } catch (error: any) {
      console.error('❌ [CLIENT] Erro no login:', error);
      throw error;
    }
  }

  async function signUp(data: SignUpData) {
    try {
      console.log('🔐 [CLIENT] Tentando criar conta:', data.email);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://barberflow-api-v2.onrender.com/api';
      const response = await fetch(`${API_URL}/client/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar conta');
      }

      const { token, client: clientData } = await response.json();

      console.log('✅ [CLIENT] Cadastro bem-sucedido:', clientData.email);

      sessionStorage.setItem('@barberFlow:client:token', token);
      sessionStorage.setItem('@barberFlow:client:user', JSON.stringify(clientData));

      setClient(clientData);
    } catch (error: any) {
      console.error('❌ [CLIENT] Erro no cadastro:', error);
      throw error;
    }
  }

  function signOut() {
    console.log('👋 [CLIENT] Fazendo logout...');

    sessionStorage.removeItem('@barberFlow:client:token');
    sessionStorage.removeItem('@barberFlow:client:user');

    setClient(null);
  }

  return (
    <ClientAuthContext.Provider
      value={{
        client,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!client
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  );
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext);
  if (!context) {
    throw new Error('useClientAuth must be used within a ClientAuthProvider');
  }
  return context;
}