import axios, { InternalAxiosRequestConfig } from 'axios';

// ✅ DETECÇÃO INTELIGENTE DE AMBIENTE
const getApiBaseUrl = (): string => {
  // 1. Prioridade: variável de ambiente explícita
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log('📌 [CLIENT-API] Usando NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. Se estiver em localhost, use porta 4000
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.log('🏠 [CLIENT-API] Detectado localhost, usando porta 4000');
      return 'http://localhost:4000/api';
    }
  }

  // 3. Fallback para produção
  console.log('☁️ [CLIENT-API] Usando URL de produção (fallback)');
  return 'https://barberflow-api-v2.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('👤 CLIENT API Configuration:');
console.log('   Base URL:', API_BASE_URL);
console.log('   Environment:', process.env.NODE_ENV);
console.log('   Storage: sessionStorage');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const clientApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Interceptor de requisição - USA SESSIONSTORAGE
clientApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ✅ BUSCA O TOKEN DO SESSIONSTORAGE (não localStorage)
    const token = sessionStorage.getItem('@barberFlow:client:token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 [CLIENT-API] Token do cliente adicionado');
    } else {
      console.warn('⚠️ [CLIENT-API] Nenhum token de cliente encontrado');
    }
    
    // Log completo da URL
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('📡 [CLIENT-API] Request:', config.method?.toUpperCase(), fullUrl);
    
    return config;
  },
  (error) => {
    console.error('❌ [CLIENT-API] Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor de resposta
clientApi.interceptors.response.use(
  (response) => {
    console.log('✅ [CLIENT-API] Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Log detalhado de erro
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ [CLIENT-API] ERRO NA REQUISIÇÃO:');
    console.error('   Status:', error.response?.status);
    console.error('   URL:', error.config?.url);
    console.error('   Base URL:', error.config?.baseURL);
    console.error('   Full URL:', error.config?.baseURL + error.config?.url);
    console.error('   Message:', error.message);
    console.error('   Data:', error.response?.data);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Logout em caso de 401 - LIMPA SESSIONSTORAGE
    if (error.response?.status === 401) {
      console.log('🚪 [CLIENT-API] Token inválido - fazendo logout do cliente...');
      sessionStorage.removeItem('@barberFlow:client:token');
      sessionStorage.removeItem('@barberFlow:client:user');
      
      // Só redireciona se não estiver na página de login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/sou-cliente')) {
        window.location.href = '/sou-cliente';
      }
    }
    
    return Promise.reject(error);
  }
);

export default clientApi;