import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// ✅ URL dinâmica: usa localhost em dev, produção em build
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'development' 
    ? 'http://localhost:4000/api' 
    : 'https://barberflow-api-v2.onrender.com/api');

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🔧 Environment:', process.env.NODE_ENV);

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