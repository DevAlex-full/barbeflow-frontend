import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// ✅ URL com fallback seguro
const getApiUrl = () => {
  // Em desenvolvimento, use localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:4000/api';
  }
  
  // Em produção, use a URL do .env ou fallback para Render
  return process.env.NEXT_PUBLIC_API_URL || 'https://barberflow-api-v2.onrender.com/api';
};

const API_BASE_URL = getApiUrl();

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🔧 Environment:', process.env.NODE_ENV);
console.log('🏠 Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('@barberFlow:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Token adicionado na requisição');
  } else {
    console.log('⚠️ Nenhum token encontrado');
  }
  
  // ✅ LOG para debug
  if (config.baseURL && config.url) {
    console.log('📡 Request URL:', config.baseURL + config.url);
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta recebida:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error.response?.status, error.message);
    console.error('❌ URL que falhou:', error.config?.url);
    
    if (error.response?.status === 401) {
      console.log('🚪 Token inválido ou expirado, fazendo logout...');
      localStorage.removeItem('@barberFlow:token');
      localStorage.removeItem('@barberFlow:user');
      localStorage.removeItem('@barberFlow:barbershop');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;