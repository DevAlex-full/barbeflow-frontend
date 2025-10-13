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

  // Adiciona estilos globais
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
    window.addEventListener('scroll', handleScroll);
    checkAuth();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('@barberFlow:client:token');
    const userData = localStorage.getItem('@barberFlow:client:user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      loadBarbershops();
    }
  };

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
      localStorage.setItem('@barberFlow:client:token', data.token);
      localStorage.setItem('@barberFlow:client:user', JSON.stringify(data.client));
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
      localStorage.setItem('@barberFlow:client:token', data.token);
      localStorage.setItem('@barberFlow:client:user', JSON.stringify(data.client));
      setUser(data.client);
      setIsAuthenticated(true);
      setShowAuthModal(false);
      loadBarbershops();
    } catch (error) {
      alert('Erro ao criar conta');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('@barberFlow:client:token');
    localStorage.removeItem('@barberFlow:client:user');
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

  const loadAvailableTimes = async () => {
    if (!selectedDate || !selectedService || !selectedBarber) return;

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

  useEffect(() => {
    if (selectedDate && selectedService && selectedBarber) {
      loadAvailableTimes();
    }
  }, [selectedDate, selectedService, selectedBarber]);

  const handleBooking = async () => {
    if (!selectedService || !selectedBarber || !selectedTime) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      const token = localStorage.getItem('@barberFlow:client:token');
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

      <section className="px-4 py-12 md:py-16 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Seja bem vindo(a)</h1>
          <p className="text-gray-400 text-sm mb-8">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>

          <div className="space-y-4">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Encontre um estabelecimento"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => !isAuthenticated && setShowAuthModal(true)}
                onKeyPress={(e) => e.key === 'Enter' && isAuthenticated && handleSearch()}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 focus:bg-gray-900 transition"
              />
            </div>

            {isAuthenticated && (
              <div className="max-w-2xl mx-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-xs text-gray-400 hover:text-gray-300 mb-3 underline"
                >
                  {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                </button>

                {showFilters && (
                  <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gray-700"
                      />
                      <input
                        type="text"
                        placeholder="Estado (ex: SP)"
                        value={stateFilter}
                        onChange={(e) => setStateFilter(e.target.value)}
                        className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gray-700"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSearch}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition text-sm"
                      >
                        Buscar
                      </button>
                      <button
                        onClick={clearFilters}
                        className="px-4 bg-gray-800 hover:bg-gray-700 text-white py-2.5 rounded-lg font-medium transition text-sm"
                      >
                        Limpar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 bg-gradient-to-b from-gray-950 to-black min-h-[60vh]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-gray-200">Empresas próximas</h2>

          {!isAuthenticated ? (
            <>
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-10 mb-6 text-center max-w-md mx-auto shadow-xl">
                <div className="mb-6">
                  <div className="mx-auto w-20 h-20 rounded-full bg-red-950/30 flex items-center justify-center border border-red-900/50">
                    <MapPin className="text-red-500" size={40} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Habilitar localização</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Habilite o acesso a localização para encontrarmos os estabelecimentos mais próximos a você =)
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-blue-900/50"
                >
                  Fazer login para habilitar
                </button>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-10 text-center max-w-md mx-auto shadow-xl">
                <div className="mb-6">
                  <div className="mx-auto w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center border border-gray-700">
                    <Search className="text-gray-600" size={40} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Nenhum estabelecimento encontrado</h3>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Tente encontrar um estabelecimento pelo nome ou pela cidade
                </p>
                <button onClick={() => setShowAuthModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-blue-900/50">
                  Pesquisar por nome ou cidade
                </button>
              </div>
            </>
          ) : (
            <>
              {!locationEnabled && (
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-10 mb-6 text-center max-w-md mx-auto shadow-xl">
                  <div className="mb-6">
                    <div className="mx-auto w-20 h-20 rounded-full bg-red-950/30 flex items-center justify-center border border-red-900/50">
                      <MapPin className="text-red-500" size={40} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Habilitar localização</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Habilite o acesso a localização para encontrarmos os estabelecimentos mais próximos a você =)
                  </p>
                  <button
                    onClick={handleEnableLocation}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-blue-900/50"
                  >
                    Habilitar localização
                  </button>
                </div>
              )}

              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-400 text-sm mt-4">Carregando...</p>
                </div>
              ) : filteredBarbershops.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredBarbershops.map((barbershop) => (
                    <div key={barbershop.id} className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => openBarbershopDetails(barbershop)}>
                      {barbershop.logo ? (
                        <div className="mb-4 relative overflow-hidden rounded-xl">
                          <img src={barbershop.logo} alt={barbershop.name} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-white">5.0</span>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 h-36 flex items-center justify-center border border-gray-700">
                          <div className="text-center">
                            <div className="text-4xl mb-2">✂️</div>
                            <p className="text-gray-500 text-xs font-medium">Sem logo</p>
                          </div>
                        </div>
                      )}
                      <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">{barbershop.name}</h3>
                      <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                        <MapPin size={14} className="text-gray-500" />
                        <span>{barbershop.city}, {barbershop.state}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                        <Phone size={14} />
                        <span>{barbershop.phone}</span>
                      </div>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition font-semibold text-sm shadow-lg hover:shadow-blue-900/50">
                        Ver detalhes e agendar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-10 text-center shadow-xl">
                  <div className="mb-6">
                    <div className="mx-auto w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center border border-gray-700">
                      <Search className="text-gray-600" size={40} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Nenhuma barbearia encontrada</h3>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                    Tente ajustar seus filtros ou buscar por outra região
                  </p>
                  <button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition shadow-lg hover:shadow-blue-900/50">
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
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#1a1f2e] rounded-3xl max-w-md w-full relative shadow-2xl border border-gray-800/50">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-5 right-5 text-gray-400 hover:text-white z-10 transition-colors">
              <X size={22} />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-bold mb-2 text-center">Acessar conta</h2>
              <p className="text-gray-400 text-xs text-center mb-6">Entre para agendar seus horários</p>

              <div className="space-y-3 mb-6">
                <button className="w-full bg-white text-gray-900 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-3 shadow-lg">
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">G</div>
                  <span>Google</span>
                </button>
                <button className="w-full bg-[#1877f2] text-white py-3.5 rounded-xl font-semibold hover:bg-[#166fe5] transition-all flex items-center justify-center gap-3 shadow-lg">
                  <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                    <span className="text-[#1877f2] text-lg font-bold leading-none">f</span>
                  </div>
                  <span>Facebook</span>
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700/50"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-[#1a1f2e] text-gray-500">ou</span>
                </div>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 font-medium">
                      Email ou telefone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                      <input
                        type="email"
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="Informe o email ou telefone"
                        className="w-full bg-[#252d3d] border border-gray-700/50 rounded-xl pl-10 pr-4 py-3.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-[#2a3347] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-2 font-medium">
                      Senha <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Informe sua senha"
                        className="w-full bg-[#252d3d] border border-gray-700/50 rounded-xl pl-4 pr-11 py-3.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-[#2a3347] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <a href="#" className="text-xs text-blue-400 hover:text-blue-300 font-medium">Recuperar senha</a>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-900/50 mt-2">
                    Entrar
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <input type="text" required value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} placeholder="Nome completo" className="w-full bg-[#252d3d] border border-gray-700/50 rounded-xl px-4 py-3.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-[#2a3347] transition-all" />
                  <input type="email" required value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} placeholder="Email" className="w-full bg-[#252d3d] border border-gray-700/50 rounded-xl px-4 py-3.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-[#2a3347] transition-all" />
                  <input type="tel" required value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} placeholder="Telefone" className="w-full bg-[#252d3d] border border-gray-700/50 rounded-xl px-4 py-3.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-[#2a3347] transition-all" />
                  <input type="password" required value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} placeholder="Senha (mínimo 6 caracteres)" className="w-full bg-[#252d3d] border border-gray-700/50 rounded-xl px-4 py-3.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-[#2a3347] transition-all" />
                  <input type="password" required value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} placeholder="Confirmar senha" className="w-full bg-[#252d3d] border border-gray-700/50 rounded-xl px-4 py-3.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-[#2a3347] transition-all" />
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-900/50">
                    Criar conta
                  </button>
                </form>
              )}

              <p className="text-center text-sm text-gray-400 mt-6">
                {authMode === 'login' ? 'Não possui uma conta?' : 'Já possui uma conta?'}{' '}
                <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-blue-400 hover:text-blue-300 font-semibold">
                  {authMode === 'login' ? 'Cadastre-se' : 'Faça login'}
                </button>
              </p>

              <p className="text-center text-xs text-gray-500 mt-4">
                Acessando você concorda com o{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300 underline">termo de uso</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {showBookingModal && selectedBarbershop && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-3xl max-w-2xl w-full p-8 relative my-8 shadow-2xl">
            <button onClick={() => { setShowBookingModal(false); resetBookingForm(); }} className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors">
              <X size={22} />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{selectedBarbershop.name}</h2>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={16} />
                <span>{selectedBarbershop.city}, {selectedBarbershop.state}</span>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2.5">Serviço <span className="text-red-500">*</span></label>
                <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer">
                  <option value="">Selecione um serviço</option>
                  {selectedBarbershop.services?.map((service: Service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - R$ {service.price.toFixed(2)} ({service.duration}min)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2.5">Barbeiro <span className="text-red-500">*</span></label>
                <select value={selectedBarber} onChange={(e) => setSelectedBarber(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer">
                  <option value="">Selecione um barbeiro</option>
                  {selectedBarbershop.users?.map((barber: Barber) => (
                    <option key={barber.id} value={barber.id}>
                      {barber.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2.5">Data <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              {availableTimes.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold mb-2.5">Horário disponível <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-4 gap-2.5 max-h-52 overflow-y-auto p-1">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                          selectedTime === time 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                            : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {new Date(time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={handleBooking} 
                disabled={!selectedService || !selectedBarber || !selectedTime} 
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700/50 disabled:cursor-not-allowed disabled:border disabled:border-gray-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-900/50 mt-6"
              >
                Confirmar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}

      {showScrollTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-full shadow-2xl transition-all hover:scale-110 z-40 border border-blue-500/30"
        >
          <ChevronUp size={22} />
        </button>
      )}
    </div>
  );
}