import axios, { InternalAxiosRequestConfig } from 'axios';

// ✅ DETECÇÃO INTELIGENTE DE AMBIENTE
const getApiBaseUrl = (): string => {
  // 1. Prioridade: variável de ambiente explícita
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log('📌 Usando NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. Se estiver em localhost, use porta 4000
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.log('🏠 Detectado localhost, usando porta 4000');
      return 'http://localhost:4000/api';
    }
  }

  // 3. Fallback para produção
  console.log('☁️ Usando URL de produção (fallback)');
  return 'https://barberflow-back-end-19nv.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🌐 API Configuration:');
console.log('   Base URL:', API_BASE_URL);
console.log('   Environment:', process.env.NODE_ENV);
console.log('   Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'SSR');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Interceptor de requisição
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('@barberFlow:token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token adicionado');
    }
    
    // Log completo da URL
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('📡 Request:', config.method?.toUpperCase(), fullUrl);
    
    return config;
  },
  (error) => {
    console.error('❌ Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor de resposta
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Log detalhado de erro
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERRO NA REQUISIÇÃO:');
    console.error('   Status:', error.response?.status);
    console.error('   URL:', error.config?.url);
    console.error('   Base URL:', error.config?.baseURL);
    console.error('   Full URL:', error.config?.baseURL + error.config?.url);
    console.error('   Message:', error.message);
    console.error('   Data:', error.response?.data);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Logout em caso de 401
    if (error.response?.status === 401) {
      console.log('🚪 Token inválido - fazendo logout...');
      localStorage.removeItem('@barberFlow:token');
      localStorage.removeItem('@barberFlow:user');
      localStorage.removeItem('@barberFlow:barbershop');
      
      // Só redireciona se não estiver na página de login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;