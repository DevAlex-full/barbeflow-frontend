'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Facebook, Instagram, Youtube, Twitter, ChevronUp, X, Eye, EyeOff, User } from 'lucide-react';

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
      let url = 'http://localhost:4000/api/public/barbershops';
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
      const response = await fetch('http://localhost:4000/api/client/auth/login', {
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
      const response = await fetch('http://localhost:4000/api/client/auth/register', {
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
      const response = await fetch(`http://localhost:4000/api/public/barbershops/${barbershop.id}`);
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
        `http://localhost:4000/api/public/barbershops/${selectedBarbershop.id}/available-times?date=${selectedDate}&serviceId=${selectedService}&barberId=${selectedBarber}`
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
      const response = await fetch('http://localhost:4000/api/client/appointments', {
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

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
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
      <header className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg px-3 py-1.5 font-bold text-sm">
              BarberFlow
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="/buscar" className="hover:text-blue-400 transition">Início</a>
            {isAuthenticated && (
              <>
                <a href="/buscar" className="hover:text-blue-400 transition">Buscar</a>
                <a href="/meus-agendamentos" className="hover:text-blue-400 transition">Meus Agendamentos</a>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-800 transition text-sm">
              🇧🇷 BR
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300">Olá, {user?.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">
                  Sair
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                Entrar
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Seja bem vindo(a)</h1>
          <p className="text-gray-400 mb-8">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Encontre um estabelecimento"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => !isAuthenticated && setShowAuthModal(true)}
                onKeyPress={(e) => e.key === 'Enter' && isAuthenticated && handleSearch()}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Filters */}
            {isAuthenticated && (
              <div className="max-w-2xl mx-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-sm text-blue-400 hover:text-blue-300 mb-3"
                >
                  {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                </button>
                
                {showFilters && (
                  <div className="bg-gray-900 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Estado (ex: SP)"
                        value={stateFilter}
                        onChange={(e) => setStateFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSearch}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                      >
                        Buscar
                      </button>
                      <button
                        onClick={clearFilters}
                        className="px-4 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition"
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

      <section className="px-4 py-12 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Empresas próximas</h2>
          
          {!isAuthenticated ? (
            <>
              <div className="bg-gray-900 rounded-xl p-8 mb-8 text-center max-w-md mx-auto">
                <div className="mb-6">
                  <MapPin className="mx-auto text-red-500" size={64} />
                </div>
                <h3 className="text-xl font-bold mb-3">Habilitar localização</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Habilite o acesso a localização para encontrarmos os estabelecimentos mais próximos a você =)
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
                >
                  Fazer login para habilitar
                </button>
              </div>

              <div className="bg-gray-900 rounded-xl p-8 text-center max-w-md mx-auto">
                <div className="mb-6">
                  <div className="mx-auto w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                    <Search className="text-gray-600" size={40} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Nenhum estabelecimento encontrado</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Tente encontrar um estabelecimento pelo nome ou pela cidade
                </p>
                <button onClick={() => setShowAuthModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition">
                  Pesquisar por nome ou cidade
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Location Enable Card */}
              {!locationEnabled && (
                <div className="bg-gray-900 rounded-xl p-8 mb-8 text-center max-w-md mx-auto">
                  <div className="mb-6">
                    <MapPin className="mx-auto text-red-500" size={64} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Habilitar localização</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Habilite o acesso a localização para encontrarmos os estabelecimentos mais próximos a você =)
                  </p>
                  <button
                    onClick={handleEnableLocation}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBarbershops.map((barbershop) => (
                    <div key={barbershop.id} className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition cursor-pointer" onClick={() => openBarbershopDetails(barbershop)}>
                      {barbershop.logo && (
                        <div className="mb-4">
                          <img src={barbershop.logo} alt={barbershop.name} className="w-full h-32 object-cover rounded-lg" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold mb-2">{barbershop.name}</h3>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <MapPin size={16} />
                        <span>{barbershop.city}, {barbershop.state}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <Phone size={16} />
                        <span>{barbershop.phone}</span>
                      </div>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-medium">
                        Ver detalhes e agendar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900 rounded-xl p-8 text-center">
                  <div className="mb-6">
                    <div className="mx-auto w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                      <Search className="text-gray-600" size={40} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Nenhuma barbearia encontrada</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Tente ajustar seus filtros ou buscar por outra região
                  </p>
                  <button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition">
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
              <div className="bg-blue-600 rounded-lg px-3 py-1.5 font-bold text-sm inline-block mb-4">BarberFlow</div>
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl max-w-md w-full relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">
              <X size={24} />
            </button>

            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Acessar conta</h2>

              <div className="space-y-3 mb-6">
                <button className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2">
                  <span className="text-xl">🔵</span>
                  <span>Google</span>
                </button>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2">
                  <span className="text-xl">📘</span>
                  <span>Facebook</span>
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">ou</span>
                </div>
              </div>

              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Email ou telefone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="email"
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="Informe o email ou telefone"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Senha <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Informe sua senha"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <a href="#" className="text-sm text-blue-400 hover:text-blue-300">Recuperar senha</a>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                    Entrar
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <input type="text" required value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} placeholder="Nome completo" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  <input type="email" required value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} placeholder="Email" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  <input type="tel" required value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} placeholder="Telefone" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  <input type="password" required value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} placeholder="Senha (mínimo 6 caracteres)" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  <input type="password" required value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} placeholder="Confirmar senha" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500" />
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition">
                    Criar conta
                  </button>
                </form>
              )}

              <p className="text-center text-sm text-gray-400 mt-6">
                {authMode === 'login' ? 'Não possui uma conta?' : 'Já possui uma conta?'}{' '}
                <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-blue-400 hover:text-blue-300 font-medium">
                  {authMode === 'login' ? 'Cadastre-se' : 'Faça login'}
                </button>
              </p>

              <p className="text-center text-xs text-gray-500 mt-4">
                Acessando você concorda com o{' '}
                <a href="#" className="text-blue-400 hover:text-blue-300">termo de uso</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {showBookingModal && selectedBarbershop && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full p-8 relative my-8">
            <button onClick={() => { setShowBookingModal(false); resetBookingForm(); }} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-2">{selectedBarbershop.name}</h2>
            <p className="text-gray-400 mb-6">{selectedBarbershop.city}, {selectedBarbershop.state}</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Serviço *</label>
                <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
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
                <select value={selectedBarber} onChange={(e) => setSelectedBarber(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
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
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
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
                        className={`py-2 rounded-lg text-sm transition ${
                          selectedTime === time ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        {new Date(time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={handleBooking} disabled={!selectedService || !selectedBarber || !selectedTime} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition">
                Confirmar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}

      {showScrollTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition">
          <ChevronUp size={24} />
        </button>
      )}
    </div>
  );
}