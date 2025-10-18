'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  barbershopId: string | null; // ✅ Permite null para super admin
  avatar?: string;
  isSuperAdmin?: boolean; // ✅ Novo campo
}

interface Barbershop {
  id: string;
  name: string;
  plan: string;
  logo?: string;
}

interface AuthContextData {
  user: User | null;
  barbershop: Barbershop | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => void;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone: string;
  barbershopName: string;
  barbershopPhone: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    console.log('🔍 Verificando autenticação...');
    
    try {
      const token = localStorage.getItem('@barberFlow:token');
      const storedUser = localStorage.getItem('@barberFlow:user');
      const storedBarbershop = localStorage.getItem('@barberFlow:barbershop');

      console.log('📦 Dados do localStorage:', {
        hasToken: !!token,
        hasUser: !!storedUser,
        hasBarbershop: !!storedBarbershop
      });

      if (token && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        if (storedBarbershop) {
          setBarbershop(JSON.parse(storedBarbershop));
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log('✅ Usuário autenticado:', userData);
      } else {
        console.log('⚠️ Nenhum token ou usuário encontrado');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar dados de autenticação:', error);
      localStorage.removeItem('@barberFlow:token');
      localStorage.removeItem('@barberFlow:user');
      localStorage.removeItem('@barberFlow:barbershop');
    } finally {
      setLoading(false);
    }
  }, []);

  async function signIn(email: string, password: string) {
    try {
      console.log('🔐 Tentando fazer login...');
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData, barbershop: barbershopData } = response.data;

      console.log('✅ Login bem-sucedido:', userData);

      // Salva no localStorage
      localStorage.setItem('@barberFlow:token', token);
      localStorage.setItem('@barberFlow:user', JSON.stringify(userData));
      
      if (barbershopData) {
        localStorage.setItem('@barberFlow:barbershop', JSON.stringify(barbershopData));
        setBarbershop(barbershopData);
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);

      // ✅ REDIRECIONAMENTO CORRETO
      setTimeout(() => {
        if (userData.isSuperAdmin) {
          console.log('🔑 Super Admin detectado - redirecionando para /admin');
          router.push('/admin');
        } else {
          console.log('👤 Usuário normal - redirecionando para /dashboard');
          router.push('/dashboard');
        }
      }, 100);
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      throw new Error(error.response?.data?.error || 'Erro ao fazer login');
    }
  }

  async function signUp(data: SignUpData) {
    try {
      console.log('📝 Tentando criar conta...');
      const response = await api.post('/auth/register', data);
      const { token, user: userData, barbershop: barbershopData } = response.data;

      console.log('✅ Cadastro bem-sucedido:', userData);

      localStorage.setItem('@barberFlow:token', token);
      localStorage.setItem('@barberFlow:user', JSON.stringify(userData));
      localStorage.setItem('@barberFlow:barbershop', JSON.stringify(barbershopData));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);
      setBarbershop(barbershopData);

      // ✅ Cadastro sempre vai para dashboard (nunca é super admin)
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    } catch (error: any) {
      console.error('❌ Erro no cadastro:', error);
      throw new Error(error.response?.data?.error || 'Erro ao criar conta');
    }
  }

  function signOut() {
    console.log('👋 Fazendo logout...');
    
    localStorage.removeItem('@barberFlow:token');
    localStorage.removeItem('@barberFlow:user');
    localStorage.removeItem('@barberFlow:barbershop');

    delete api.defaults.headers.common['Authorization'];

    setUser(null);
    setBarbershop(null);

    router.push('/login');
  }

  return (
    <AuthContext.Provider value={{ user, barbershop, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}