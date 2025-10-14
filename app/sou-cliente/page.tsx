'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Facebook, Instagram, Youtube, Twitter, ChevronUp, X, Eye, EyeOff, User, Phone } from 'lucide-react';

interface Barbershop {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  logo?: string;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
}

interface Barber {
  id: string;
  name: string;
  avatar?: string;
}

export default function ClientPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBarbershop, setSelectedBarbershop] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [cityFilter, setCityFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  const handleGoogleLogin = () => {
    try {
      setOauthLoading(true);
      window.location.href = 'https://barberflow-back-end.onrender.com/api/client/auth/google';
    } catch (error) {
      console.error('Erro ao iniciar login Google:', error);
      alert('Erro ao conectar com Google. Tente novamente.');
      setOauthLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    try {
      setOauthLoading(true);
      window.location.href = 'https://barberflow-back-end.onrender.com/api/client/auth/facebook';
    } catch (error) {
      console.error('Erro ao iniciar login Facebook:', error);
      alert('Erro ao conectar com Facebook. Tente novamente.');
      setOauthLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userData = urlParams.get('user');
    const error = urlParams.get('error');
    
    if (error) {
      console.error('Erro OAuth:', error);
      alert(`Erro ao autenticar: ${decodeURIComponent(error)}`);
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        sessionStorage.setItem('@barberFlow:client:token', token);
        sessionStorage.setItem('@barberFlow:client:user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        setShowAuthModal(false);
        window.history.replaceState({}, document.title, window.location.pathname);
        loadBarbershops();
        alert(`Bem-vindo(a), ${user.name}! 🎉`);
      } catch (error) {
        console.error('Erro ao processar autenticação OAuth:', error);
        alert('Erro ao processar dados de login. Tente novamente.');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
      }
      input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
      }
      select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
        background-position: right 0.75rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
      }
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: #1f2937;
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb {
        background: #4b5563;
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #6b7280;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    
    const checkAuth = () => {
      const token = sessionStorage.getItem('@barberFlow:client:token');
      const userData = sessionStorage.getItem('@barberFlow:client:user');
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
        loadBarbershops();
      }
    };

    window.addEventListener('scroll', handleScroll);
    checkAuth();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const loadBarbershops = async () => {
    try {
      setLoading(true);
      let url = 'https://barberflow-back-end.onrender.com/api/public/barbershops';
      const params = new URLSearchParams();

      if (searchTerm) params.append('search', searchTerm);
      if (cityFilter) params.append('city', cityFilter);
      if (stateFilter) params.append('state', stateFilter);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      setBarbershops(data);
    } catch (error) {
      console.error('Erro ao carregar barbearias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://barberflow-back-end.onrender.com/api/client/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao fazer login');
        return;
      }

      const data = await response.json();
      sessionStorage.setItem('@barberFlow:client:token', data.token);
      sessionStorage.setItem('@barberFlow:client:user', JSON.stringify(data.client));
      setUser(data.client);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      loadBarbershops();
    } catch (error) {
      alert('Erro ao fazer login');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    try {
      const response = await fetch('https://barberflow-back-end.onrender.com/api/client/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          phone: registerData.phone,
          password: registerData.password
        })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao criar conta');
        return;
      }

      const data = await response.json();
      sessionStorage.setItem('@barberFlow:client:token', data.token);
      sessionStorage.setItem('@barberFlow:client:user', JSON.stringify(data.client));
      setUser(data.client);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      loadBarbershops();
    } catch (error) {
      alert('Erro ao criar conta');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('@barberFlow:client:token');
    sessionStorage.removeItem('@barberFlow:client:user');
    setIsAuthenticated(false);
    setUser(null);
    setBarbershops([]);
  };

  const openBarbershopDetails = async (barbershop: Barbershop) => {
    try {
      const response = await fetch(`https://barberflow-back-end.onrender.com/api/public/barbershops/${barbershop.id}`);
      const data = await response.json();
      setSelectedBarbershop(data);
      setShowBookingModal(true);
    } catch (error) {
      alert('Erro ao carregar detalhes da barbearia');
    }
  };

  useEffect(() => {
    const loadAvailableTimes = async () => {
      if (!selectedDate || !selectedService || !selectedBarber || !selectedBarbershop) return;

      try {
        const response = await fetch(
          `https://barberflow-back-end.onrender.com/api/public/barbershops/${selectedBarbershop.id}/available-times?date=${selectedDate}&serviceId=${selectedService}&barberId=${selectedBarber}`
        );
        const times = await response.json();
        setAvailableTimes(times);
      } catch (error) {
        alert('Erro ao carregar horários disponíveis');
      }
    };

    if (selectedDate && selectedService && selectedBarber && selectedBarbershop) {
      loadAvailableTimes();
    }
  }, [selectedDate, selectedService, selectedBarber, selectedBarbershop]);

  const handleBooking = async () => {
    if (!selectedService || !selectedBarber || !selectedTime) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      const token = sessionStorage.getItem('@barberFlow:client:token');
      const response = await fetch('https://barberflow-back-end.onrender.com/api/client/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          barbershopId: selectedBarbershop.id,
          barberId: selectedBarber,
          serviceId: selectedService,
          date: selectedTime
        })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao criar agendamento');
        return;
      }

      alert('Agendamento realizado com sucesso!');
      setShowBookingModal(false);
      resetBookingForm();
    } catch (error) {
      alert('Erro ao criar agendamento');
    }
  };

  const resetBookingForm = () => {
    setSelectedService('');
    setSelectedBarber('');
    setSelectedDate('');
    setSelectedTime('');
    setAvailableTimes([]);
  };

  const handleEnableLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationEnabled(true);
          setLoading(false);
          alert('Localização habilitada! Mostrando barbearias próximas.');
        },
        (error) => {
          setLoading(false);
          alert('Não foi possível obter sua localização. Verifique as permissões do navegador.');
          console.error('Erro de geolocalização:', error);
        }
      );
    } else {
      alert('Seu navegador não suporta geolocalização.');
    }
  };

  const handleSearch = () => {
    loadBarbershops();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCityFilter('');
    setStateFilter('');
    loadBarbershops();
  };

  const filteredBarbershops = barbershops.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 px-4 py-3 bg-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer">
              <img
                src="/Logo.png"
                alt="BarberFlow Logo"
                className="h-18 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden bg-blue-600 rounded-lg px-3 py-1.5 font-bold text-sm">
                appbarber
              </div>
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="/sou-cliente" className="text-gray-300 hover:text-white transition">Início</a>
            {isAuthenticated && (
              <>
                <a href="/sou-cliente" className="text-gray-300 hover:text-white transition">Buscar</a>
                <a href="/meus-agendamentos" className="text-gray-300 hover:text-white transition">Meus Agendamentos</a>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 text-gray-300 hover:text-white transition text-sm">
              <span>🌙</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-900 transition text-sm border border-gray-800">
              🇧🇷 <span className="font-medium">BR</span>
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition">
                  <User size={16} className="text-gray-400" />
                </button>
                <span className="hidden md:inline text-sm text-gray-300">Olá, {user?.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="hidden md:inline text-sm text-red-400 hover:text-red-300">
                  Sair
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-gray-900 border border-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2">
                <User size={16} />
                <span>Entrar</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-semibold mb-3">Seja bem vindo(a)</h1>
          <p className="text-gray-500 text-sm mb-8">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Encontre um estabelecimento"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => !isAuthenticated && setShowAuthModal(true)}
              onKeyPress={(e) => e.key === 'Enter' && isAuthenticated && handleSearch()}
              className="w-full bg-[#0f1419] border border-gray-800 rounded-lg pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-gray-700 transition text-sm"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-8 bg-[#0a0d11]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Empresas próximas</h2>

          {!isAuthenticated ? (
            <>
              <div className="bg-[#151b23] rounded-2xl p-10 mb-6 text-center max-w-lg mx-auto">
                <div className="mb-8">
                  <MapPin className="mx-auto text-red-500" size={72} />
                </div>
                <h3 className="text-xl font-semibold mb-3">Habilitar localização</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  Habilite o acesso a localização para encontrarmos os estabelecimentos mais próximos a você =)
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-[#2463eb] hover:bg-[#1d4fd8] text-white px-8 py-3 rounded-lg font-medium transition"
                >
                  Fazer login para habilitar
                </button>
              </div>

              <div className="bg-[#151b23] rounded-2xl p-10 text-center max-w-lg mx-auto">
                <div className="mb-8">
                  <div className="mx-auto w-24 h-24 rounded-full bg-[#1f2937] flex items-center justify-center">
                    <Search className="text-gray-600" size={48} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Nenhum estabelecimento encontrado</h3>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  Tente encontrar um estabelecimento pelo nome ou pela cidade
                </p>
                <button onClick={() => setShowAuthModal(true)} className="bg-[#2463eb] hover:bg-[#1d4fd8] text-white px-8 py-3 rounded-lg font-medium transition">
                  Pesquisar por nome ou cidade
                </button>
              </div>
            </>
          ) : (
            <>
              {!locationEnabled && (
                <div className="bg-[#151b23] rounded-2xl p-10 mb-8 text-center max-w-lg mx-auto">
                  <div className="mb-8">
                    <MapPin className="mx-auto text-red-500" size={72} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Habilitar localização</h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    Habilite o acesso a localização para encontrarmos os estabelecimentos mais próximos a você =)
                  </p>
                  <button
                    onClick={handleEnableLocation}
                    className="bg-[#2463eb] hover:bg-[#1d4fd8] text-white px-8 py-3 rounded-lg font-medium transition"
                  >
                    Habilitar localização
                  </button>
                </div>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : filteredBarbershops.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBarbershops.map((barbershop) => (
                    <div key={barbershop.id} className="bg-[#151b23] rounded-xl overflow-hidden hover:bg-[#1a2029] transition cursor-pointer" onClick={() => openBarbershopDetails(barbershop)}>
                      {barbershop.logo && (
                        <div className="w-full h-40 bg-[#1f2937]">
                          <img src={barbershop.logo} alt={barbershop.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold mb-3">{barbershop.name}</h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <MapPin size={16} />
                          <span>{barbershop.city}, {barbershop.state}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                          <Phone size={16} />
                          <span>{barbershop.phone}</span>
                        </div>
                        <button className="w-full bg-[#2463eb] hover:bg-[#1d4fd8] text-white py-2.5 rounded-lg transition font-medium text-sm">
                          Ver detalhes e agendar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#151b23] rounded-2xl p-10 text-center max-w-lg mx-auto">
                  <div className="mb-8">
                    <div className="mx-auto w-24 h-24 rounded-full bg-[#1f2937] flex items-center justify-center">
                      <Search className="text-gray-600" size={48} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Nenhuma barbearia encontrada</h3>
                  <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    Tente ajustar seus filtros ou buscar por outra região
                  </p>
                  <button onClick={clearFilters} className="bg-[#2463eb] hover:bg-[#1d4fd8] text-white px-8 py-3 rounded-lg font-medium transition">
                    Limpar filtros
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <footer className="bg-black border-t border-gray-800 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2">
                <a href="/" className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer">
                  <img
                    src="/Logo.png"
                    alt="BarberFlow Logo"
                    className="h-20 w-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden bg-blue-600 rounded-lg px-3 py-1.5 font-bold text-sm">
                    BarberFlow
                  </div>
                </a>
              </div>
              <p className="text-gray-400 text-sm mb-4">Uma nova experiência para uma antiga tradição.</p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition"><Facebook size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><Instagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><Youtube size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><Twitter size={20} /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Acesso rápido</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Início</a></li>
                <li><a href="#" className="hover:text-white transition">Encontrar estabelecimentos</a></li>
                <li><a href="#" className="hover:text-white transition">Meus agendamentos</a></li>
                <li><a href="#" className="hover:text-white transition">Favoritos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Mais</h4>
              <ul className="space-y-2 text-sm text-gray-400 mb-6">
                <li><a href="#" className="hover:text-white transition">Termos de uso</a></li>
                <li><a href="#" className="hover:text-white transition">Preferências de cookies</a></li>
              </ul>

              <div className="border border-gray-800 rounded-lg p-4">
                <h5 className="font-bold mb-3">É um gestor?</h5>
                <p className="text-gray-400 text-xs mb-3">Cadastre seu estabelecimento e comece a receber agendamentos online.</p>
                <button className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition w-full">
                  Saiba mais
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            © 2025 BarberFlow. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#2a3441] rounded-2xl max-w-md w-full relative shadow-2xl animate-fadeIn" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowAuthModal(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white z-10 transition-colors">
              <X size={24} />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-8 text-center">Acessar conta</h2>

              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-4 text-center">Continuar com</p>
                <div className="space-y-3">
                  <button 
                    onClick={handleGoogleLogin}
                    disabled={oauthLoading}
                    type="button"
                    className="w-full bg-white text-gray-900 py-3.5 rounded-lg font-medium hover:bg-gray-100 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {oauthLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                        <span>Conectando...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span>Google</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleFacebookLogin}
                    disabled={oauthLoading}
                    type="button"
                    className="w-full bg-[#1877f2] text-white py-3.5 rounded-lg font-medium hover:bg-[#166fe5] transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {oauthLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Conectando...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>Facebook</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-[#2a3441] text-gray-400">ou</span>
                </div>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Email ou telefone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="text"
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="Informe o email ou telefone"
                        className="w-full bg-[#374151] border border-gray-600 rounded-lg pl-11 pr-4 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#2463eb] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      Senha <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Informe sua senha"
                        className="w-full bg-[#374151] border border-gray-600 rounded-lg pl-4 pr-12 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#2463eb] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <a href="#" className="text-sm text-[#2463eb] hover:text-[#1d4fd8] font-medium">Recuperar senha</a>
                  </div>

                  <button type="submit" className="w-full bg-[#2463eb] hover:bg-[#1d4fd8] text-white py-3.5 rounded-lg font-semibold transition-all shadow-lg">
                    Entrar
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <input 
                    type="text" 
                    required 
                    value={registerData.name} 
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} 
                    placeholder="Nome completo" 
                    className="w-full bg-[#374151] border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#2463eb] transition-all" 
                  />
                  <input 
                    type="email" 
                    required 
                    value={registerData.email} 
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} 
                    placeholder="Email" 
                    className="w-full bg-[#374151] border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#2463eb] transition-all" 
                  />
                  <input 
                    type="tel" 
                    required 
                    value={registerData.phone} 
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} 
                    placeholder="Telefone" 
                    className="w-full bg-[#374151] border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#2463eb] transition-all" 
                  />
                  <input 
                    type="password" 
                    required 
                    value={registerData.password} 
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} 
                    placeholder="Senha (mínimo 6 caracteres)" 
                    className="w-full bg-[#374151] border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#2463eb] transition-all" 
                  />
                  <input 
                    type="password" 
                    required 
                    value={registerData.confirmPassword} 
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} 
                    placeholder="Confirmar senha" 
                    className="w-full bg-[#374151] border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#2463eb] transition-all" 
                  />
                  <button type="submit" className="w-full bg-[#2463eb] hover:bg-[#1d4fd8] text-white py-3.5 rounded-lg font-semibold transition-all shadow-lg">
                    Criar conta
                  </button>
                </form>
              )}

              <p className="text-center text-sm text-gray-400 mt-6">
                {authMode === 'login' ? 'Não possui uma conta?' : 'Já possui uma conta?'}{' '}
                <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-[#2463eb] hover:text-[#1d4fd8] font-medium">
                  {authMode === 'login' ? 'Cadastre-se' : 'Faça login'}
                </button>
              </p>

              <p className="text-center text-xs text-gray-500 mt-4">
                Acessando você concorda com o{' '}
                <a href="#" className="text-[#2463eb] hover:text-[#1d4fd8]">termo de uso</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {showBookingModal && selectedBarbershop && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#151b23] rounded-2xl max-w-2xl w-full p-8 relative my-8 shadow-2xl">
            <button onClick={() => { setShowBookingModal(false); resetBookingForm(); }} className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-semibold mb-2">{selectedBarbershop.name}</h2>
            <p className="text-gray-400 mb-6">{selectedBarbershop.city}, {selectedBarbershop.state}</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Serviço *</label>
                <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2463eb]">
                  <option value="">Selecione um serviço</option>
                  {selectedBarbershop.services?.map((service: Service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - R$ {service.price} ({service.duration}min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Barbeiro *</label>
                <select value={selectedBarber} onChange={(e) => setSelectedBarber(e.target.value)} className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2463eb]">
                  <option value="">Selecione um barbeiro</option>
                  {selectedBarbershop.users?.map((barber: Barber) => (
                    <option key={barber.id} value={barber.id}>
                      {barber.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data *</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#2463eb]"
                />
              </div>

              {availableTimes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Horário *</label>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 rounded-lg text-sm transition ${selectedTime === time ? 'bg-[#2463eb] text-white' : 'bg-[#1f2937] text-gray-300 hover:bg-[#374151]'}`}
                      >
                        {new Date(time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={handleBooking} disabled={!selectedService || !selectedBarber || !selectedTime} className="w-full bg-[#2463eb] hover:bg-[#1d4fd8] disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition">
                Confirmar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}

      {showScrollTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 bg-[#2463eb] hover:bg-[#1d4fd8] text-white p-3 rounded-full shadow-lg transition">
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
}