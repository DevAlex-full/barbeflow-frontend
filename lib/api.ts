import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://barberflow-back-end.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  // ✅ CORRIGIDO: Mesma chave do AuthContext
  const token = localStorage.getItem('@barberFlow:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Token adicionado na requisição');
  } else {
    console.log('⚠️ Nenhum token encontrado');
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
      // ✅ CORRIGIDO: Mesmas chaves do AuthContext
      localStorage.removeItem('@barberFlow:token');
      localStorage.removeItem('@barberFlow:user');
      localStorage.removeItem('@barberFlow:barbershop');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;