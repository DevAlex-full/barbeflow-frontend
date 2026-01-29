'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, Phone, Clock, Star, Calendar, Scissors, ArrowLeft, Share2,
  Heart, Users, X, CheckCircle, AlertCircle, Sparkles, TrendingUp,
  Instagram, Facebook, MessageCircle, Youtube, Globe, ChevronRight,
  Award, Zap, Shield, Crown
} from 'lucide-react';

import { useClientAuth } from '@/lib/contexts/ClientAuthContext';

interface BarbershopConfig {
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  description?: string;
  galleryImages?: string[];
  businessHours?: Record<string, string>;
  instagramUrl?: string;
  facebookUrl?: string;
  whatsappNumber?: string;
  youtubeUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  showTeam?: boolean;
  showGallery?: boolean;
  showReviews?: boolean;
  allowOnlineBooking?: boolean;
}

interface Barbershop {
  id: string;
  name: string;
  logo: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  phone: string;
  plan: string;
  active: boolean;
  config?: BarbershopConfig;
  zipCode?: string | null;
  neighborhood?: string | null;
  number?: string | null;
  complement?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
}

interface Barber {
  id: string;
  name: string;
  avatar: string | null;
}

export default function BarbershopLanding() {
  const params = useParams();
  const router = useRouter();
  const barbershopId = params?.id as string;
  const { client, isAuthenticated, loading: authLoading } = useClientAuth();

  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log('🔍 [Landing] Estado de autenticação:', {
      isAuthenticated,
      hasClient: !!client,
      clientName: client?.name,
      authLoading
    });
  }, [isAuthenticated, client, authLoading]);

  useEffect(() => {
    const checkIfOpen = () => {
      const now = new Date();
      const dayMap: Record<number, string> = {
        0: 'sunday',
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday'
      };
      const today = dayMap[now.getDay()];

      const businessHours = barbershop?.config?.businessHours || {
        monday: '09:00-20:00',
        tuesday: '09:00-20:00',
        wednesday: '09:00-20:00',
        thursday: '09:00-20:00',
        friday: '09:00-20:00',
        saturday: '09:00-18:00',
        sunday: 'Fechado'
      };

      const hours = businessHours[today];

      if (!hours || hours.toLowerCase() === 'fechado') {
        setIsOpen(false);
        return;
      }

      const [start, end] = hours.split('-');
      if (start && end) {
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        setIsOpen(currentMinutes >= startMinutes && currentMinutes <= endMinutes);
      }
    };

    checkIfOpen();
    const interval = setInterval(checkIfOpen, 60000);
    return () => clearInterval(interval);
  }, [barbershop]);

  const config: BarbershopConfig = barbershop?.config || {
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    showTeam: true,
    showGallery: true,
    showReviews: true,
    allowOnlineBooking: true,
    businessHours: {
      monday: '09:00-20:00',
      tuesday: '09:00-20:00',
      wednesday: '09:00-20:00',
      thursday: '09:00-20:00',
      friday: '09:00-20:00',
      saturday: '09:00-18:00',
      sunday: 'Fechado'
    }
  };

  useEffect(() => {
    if (barbershopId) {
      fetchBarbershopData();
    }
  }, [barbershopId]);

  useEffect(() => {
    if (selectedDate && selectedService && selectedBarber) {
      loadAvailableTimes();
    }
  }, [selectedDate, selectedService, selectedBarber]);

  useEffect(() => {
    if (config.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', config.primaryColor);
    }
    if (config.secondaryColor) {
      document.documentElement.style.setProperty('--secondary-color', config.secondaryColor);
    }
  }, [config]);

  const fetchBarbershopData = async () => {
    try {
      const response = await fetch(`https://barberflow-api-v2.onrender.com/api/public/barbershops/${barbershopId}`);
      if (!response.ok) {
        router.push('/sou-cliente');
        return;
      }
      const shopData = await response.json();
      setBarbershop(shopData);
      setServices(shopData.services || []);
      setBarbers(shopData.users || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableTimes = async () => {
    setLoadingTimes(true);
    try {
      const response = await fetch(
        `https://barberflow-api-v2.onrender.com/api/public/barbershops/${barbershopId}/available-times?date=${selectedDate}&serviceId=${selectedService?.id}&barberId=${selectedBarber}`
      );
      if (response.ok) {
        const times = await response.json();
        setAvailableTimes(times);
      }
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      setAvailableTimes([]);
    } finally {
      setLoadingTimes(false);
    }
  };

  const handleBookService = (service: Service) => {
    if (!config.allowOnlineBooking) {
      alert('Entre em contato pelo telefone para agendar');
      return;
    }
    if (!isAuthenticated) {
      alert('Você precisa fazer login para agendar');
      router.push('/sou-cliente');
      return;
    }
    setSelectedService(service);
    setShowBookingModal(true);
    setBookingStep(1);
    setBookingError('');
  };

  const handleNextStep = () => {
    if (bookingStep === 1 && selectedBarber) {
      setBookingStep(2);
    } else if (bookingStep === 2 && selectedDate) {
      setBookingStep(3);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedBarber || !selectedTime) {
      setBookingError('Preencha todos os campos');
      return;
    }
    if (!isAuthenticated) {
      setBookingError('Você precisa estar logado');
      router.push('/sou-cliente');
      return;
    }
    try {
      const token = sessionStorage.getItem('@barberFlow:client:token');
      if (!token) {
        setBookingError('Token não encontrado. Faça login novamente.');
        router.push('/sou-cliente');
        return;
      }
      const response = await fetch('https://barberflow-api-v2.onrender.com/api/client/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          barbershopId: barbershopId,
          barberId: selectedBarber,
          serviceId: selectedService.id,
          date: selectedTime
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setBookingError(data.error || 'Erro ao criar agendamento');
        return;
      }
      setBookingSuccess(true);
      setBookingError('');
      setTimeout(() => {
        setShowBookingModal(false);
        resetBooking();
        router.push('/meus-agendamentos');
      }, 2500);
    } catch (error) {
      console.error('Erro:', error);
      setBookingError('Erro ao criar agendamento. Tente novamente.');
    }
  };

  const resetBooking = () => {
    setSelectedService(null);
    setSelectedBarber('');
    setSelectedDate('');
    setSelectedTime('');
    setAvailableTimes([]);
    setBookingStep(1);
    setBookingSuccess(false);
    setBookingError('');
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: barbershop?.name,
          text: `Confira ${barbershop?.name} no BarberFlow!`,
          url: url
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('✅ Link copiado!');
    }
  };

  const formatBusinessHours = (day: string) => {
    const days: Record<string, string> = {
      monday: 'Segunda',
      tuesday: 'Terça',
      wednesday: 'Quarta',
      thursday: 'Quinta',
      friday: 'Sexta',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };
    return days[day] || day;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500 mx-auto"></div>
            <Sparkles className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-white mt-6 text-lg font-medium animate-pulse">Carregando experiência...</p>
        </div>
      </div>
    );
  }

  if (!barbershop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-3">Barbearia não encontrada</h1>
          <p className="text-gray-400 mb-6">Esta página não existe ou foi removida</p>
          <Link href="/sou-cliente">
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-500/50">
              Voltar para lista
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Helper para formatar endereço
  const formatAddress = () => {
    if (barbershop.address) {
      const parts = [
        barbershop.address,
        barbershop.number,
        barbershop.neighborhood,
        barbershop.city,
        barbershop.state
      ].filter(Boolean);
      return parts.join(', ');
    }

    if (barbershop.city && barbershop.state) {
      return `${barbershop.city}, ${barbershop.state}`;
    }

    return 'Endereço não cadastrado';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      <style jsx global>{`
        :root {
          --primary-color: ${config.primaryColor};
          --secondary-color: ${config.secondaryColor};
        }
        .btn-primary {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px -10px var(--primary-color);
        }
        .text-primary {
          color: var(--primary-color);
        }
        .border-primary {
          border-color: var(--primary-color);
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes shine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shine {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 200% 100%;
          animation: shine 3s infinite;
        }
      `}</style>

      {/* Header Glassmorphism */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/sou-cliente">
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 hover:gap-3 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition">
                  <ArrowLeft className="w-5 h-5" />
                </div>
                <span className="font-medium">Voltar</span>
              </button>
            </Link>

            <div className="flex items-center gap-3">
              {!authLoading && isAuthenticated && client ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300 hidden sm:inline">
                    {client.name.split(' ')[0]}
                  </span>
                </div>
              ) : (
                <Link href="/sou-cliente">
                  <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-indigo-500/50">
                    Entrar
                  </button>
                </Link>
              )}
              <button
                onClick={handleShare}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110"
                title="Compartilhar"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Ultra Premium */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {config.heroImage ? (
            <>
              <img
                src={config.heroImage}
                alt={barbershop.name}
                className="w-full h-full object-cover scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />
          )}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
          <Scissors className="absolute top-1/4 left-10 w-16 h-16 text-indigo-500/20 animate-float" style={{ animationDelay: '0s' }} />
          <Star className="absolute top-1/3 right-20 w-12 h-12 text-purple-500/20 animate-float" style={{ animationDelay: '1s' }} />
          <Crown className="absolute bottom-1/4 left-1/4 w-14 h-14 text-pink-500/20 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 animate-float">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Experiência Premium</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-indigo-200">
              {config.heroTitle || barbershop.name}
            </span>
          </h1>

          <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-10 max-w-3xl mx-auto font-light">
            {config.heroSubtitle || 'Onde estilo encontra excelência'}
          </p>

          {config.allowOnlineBooking && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 inline-flex items-center gap-3 shadow-2xl hover:shadow-indigo-500/50"
              >
                <Calendar className="w-6 h-6" />
                Agendar Agora
                <ChevronRight className="w-5 h-5" />
              </button>
              <a
                href={`https://wa.me/${barbershop.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 bg-white/10 backdrop-blur-xl hover:bg-white/20 border border-white/20 rounded-2xl text-lg font-bold transition-all duration-300 inline-flex items-center gap-3"
              >
                <MessageCircle className="w-6 h-6" />
                WhatsApp
              </a>
            </div>
          )}

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16 pb-8 relative z-40">
            {[
              { icon: Users, value: '500+', label: 'Clientes' },
              { icon: Star, value: '5.0', label: 'Avaliação' },
              { icon: Award, value: '10+', label: 'Anos' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Info Cards Flutuantes */}
      <section className="-mt-16 relative z-30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: 'Localização',
                value: formatAddress(),
                color: 'from-blue-500 to-cyan-500',
                action: barbershop.address ? `https://maps.google.com/?q=${encodeURIComponent(formatAddress())}` : null
              },
              {
                icon: Phone,
                title: 'Contato',
                value: barbershop.phone,
                color: 'from-green-500 to-emerald-500',
                action: `https://wa.me/${barbershop.phone.replace(/\D/g, '')}`
              },
              {
                icon: Clock,
                title: 'Horário',
                value: 'Ver horários',
                color: 'from-purple-500 to-pink-500',
                action: null,
                onClick: () => document.getElementById('hours')?.scrollIntoView({ behavior: 'smooth' })
              }
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer"
                onClick={card.onClick || (() => card.action && window.open(card.action, '_blank'))}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="w-7 h-7" />
                </div>
                <p className="text-sm text-gray-400 mb-1">{card.title}</p>
                <p className="font-bold text-lg">{card.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre */}
      {config.description && (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium">Nossa História</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Tradição e Excelência
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              {config.description}
            </p>
          </div>
        </section>
      )}

      {/* Serviços - Cards Premium com LOGO */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-6">
              <Scissors className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium">Nossos Serviços</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Serviços Premium
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Escolha o serviço perfeito para o seu estilo
            </p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
              <Scissors className="w-20 h-20 text-gray-600 mx-auto mb-6 animate-pulse" />
              <p className="text-gray-400 text-lg">Serviços em breve...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, i) => (
                <div
                  key={service.id}
                  className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-indigo-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {service.description}
                        </p>
                      )}
                    </div>
                    {/* ✅ SUBSTITUIÇÃO: Ícone de tesoura → Logo */}
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center ml-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 flex-shrink-0 overflow-hidden">
                      {barbershop.logo ? (
                        <img
                          src={barbershop.logo}
                          alt="Logo"
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <img
                          src="/Logo1.png"
                          alt="BarberFlow"
                          className="w-full h-full object-contain p-2"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-gray-600" />
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>Garantia</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">A partir de</p>
                      <p className="text-3xl font-black text-indigo-400">
                        R$ {Number(service.price).toFixed(2)}
                      </p>
                    </div>
                    {config.allowOnlineBooking && (
                      <button
                        onClick={() => handleBookService(service)}
                        className="px-6 py-3 bg-gradient-primary rounded-xl font-bold hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-indigo-500/50 flex items-center gap-2"
                      >
                        Agendar
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Equipe - Design Circular com AVATARES */}
      {config.showTeam && barbers.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-6">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium">Profissionais</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Nossa Equipe de Elite
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Profissionais certificados e apaixonados pelo que fazem
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {barbers.map((barber, i) => (
                <div
                  key={barber.id}
                  className="group text-center"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="relative mb-6 mx-auto w-32 h-32 sm:w-40 sm:h-40">
                    <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 opacity-60" />
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 group-hover:border-indigo-500/50 transition-all duration-300 group-hover:scale-110">
                      {/* ✅ SUBSTITUIÇÃO: Emoji → Avatar ou Logo */}
                      {barber.avatar ? (
                        <img
                          src={barber.avatar}
                          alt={barber.name}
                          className="w-full h-full object-cover"
                        />
                      ) : barbershop.logo ? (
                        <img
                          src={barbershop.logo}
                          alt={barber.name}
                          className="w-full h-full object-contain p-4 bg-gradient-primary"
                        />
                      ) : (
                        <img
                          src="/Logo1.png"
                          alt={barber.name}
                          className="w-full h-full object-contain p-4 bg-gradient-primary"
                        />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-slate-950 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-400 transition-colors">
                    {barber.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">Especialista</p>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Galeria */}
      {config.showGallery && config.galleryImages && config.galleryImages.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-6">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium">Portfólio</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Nosso Trabalho
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Transformações que inspiram confiança
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {config.galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`Galeria ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white font-bold">Ver mais</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Horários - Design Tabela Premium com LOGO */}
      <section id="hours" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-6">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium">Horários</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Quando Estamos Abertos
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Prontos para te atender com excelência
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="space-y-4">
              {Object.entries(config.businessHours || {}).map(([day, hours]) => (
                <div
                  key={day}
                  className="flex items-center justify-between py-4 px-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    {/* ✅ SUBSTITUIÇÃO: Ícone de relógio → Logo */}
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                      {barbershop.logo ? (
                        <img
                          src={barbershop.logo}
                          alt="Logo"
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <img
                          src="/Logo1.png"
                          alt="BarberFlow"
                          className="w-full h-full object-contain p-2"
                        />
                      )}
                    </div>
                    <span className="font-bold text-lg">{formatBusinessHours(day)}</span>
                  </div>
                  <span className={`font-bold text-lg ${hours.toLowerCase() === 'fechado' ? 'text-red-400' : 'text-green-400'}`}>
                    {hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Redes Sociais */}
      {(config.instagramUrl || config.facebookUrl || config.whatsappNumber || config.youtubeUrl) && (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-6">
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium">Redes Sociais</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Conecte-se Conosco
            </h2>
            <p className="text-lg text-gray-400 mb-12">
              Siga-nos para novidades e promoções exclusivas
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {config.instagramUrl && (
                <a
                  href={config.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-60" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center hover:scale-110 transition-all duration-300">
                    <Instagram className="w-10 h-10" />
                  </div>
                </a>
              )}
              {config.facebookUrl && (
                <a
                  href={config.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-60" />
                  <div className="relative w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center hover:scale-110 transition-all duration-300">
                    <Facebook className="w-10 h-10" />
                  </div>
                </a>
              )}
              {config.whatsappNumber && (
                <a
                  href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-green-600 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-60" />
                  <div className="relative w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center hover:scale-110 transition-all duration-300">
                    <MessageCircle className="w-10 h-10" />
                  </div>
                </a>
              )}
              {config.youtubeUrl && (
                <a
                  href={config.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-red-600 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-60" />
                  <div className="relative w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center hover:scale-110 transition-all duration-300">
                    <Youtube className="w-10 h-10" />
                  </div>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      {config.allowOnlineBooking && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-20 animate-pulse" />
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
                <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-6 animate-float" />
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                  Pronto para uma Transformação?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Agende agora e experimente o melhor serviço da região
                </p>
                <button
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-primary px-12 py-5 rounded-2xl text-xl font-bold transition-all duration-300 inline-flex items-center gap-3 shadow-2xl hover:shadow-indigo-500/50"
                >
                  <Calendar className="w-6 h-6" />
                  Agendar Agora
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer Premium */}
      <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
              {/* ✅ SUBSTITUIÇÃO: Ícone de tesoura → Logo */}
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center overflow-hidden">
                {barbershop.logo ? (
                  <img
                    src={barbershop.logo}
                    alt={barbershop.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <img
                    src="/Logo1.png"
                    alt="BarberFlow"
                    className="w-full h-full object-contain p-2"
                  />
                )}
              </div>
              <div>
                <h3 className="font-bold text-xl">{barbershop.name}</h3>
                <p className="text-sm text-gray-400">Excelência em Barbearia</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href={`tel:${barbershop.phone}`} className="hover:text-white transition">
                {barbershop.phone}
              </a>
              <span>•</span>
              <p>{barbershop.city}, {barbershop.state}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">
                © 2025 {barbershop.name}. Todos os direitos reservados.
              </p>
              <p className="text-xs text-gray-500">
                Powered by <span className="text-indigo-400 font-bold">BarberFlow</span> 💜
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de Agendamento */}
      {showBookingModal && selectedService && config.allowOnlineBooking && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl my-4">
            {bookingSuccess ? (
              <div className="p-12 text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-green-500 blur-3xl opacity-30 animate-pulse" />
                  <CheckCircle className="relative w-24 h-24 text-green-400 mx-auto animate-bounce" />
                </div>
                <h2 className="text-4xl font-bold mb-4 text-green-400">Confirmado!</h2>
                <p className="text-gray-300 mb-6 text-lg">
                  Seu agendamento foi realizado com sucesso
                </p>
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <p className="text-sm text-gray-400 mb-4">Enviamos os detalhes por email</p>
                  <div className="animate-pulse text-indigo-400">Redirecionando...</div>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Novo Agendamento</h2>
                    <p className="text-gray-400">{selectedService.name}</p>
                  </div>
                  <button
                    onClick={() => { setShowBookingModal(false); resetBooking(); }}
                    className="p-3 hover:bg-white/10 rounded-xl transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {bookingError && (
                  <div className="mb-6 flex items-center gap-3 bg-red-900/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-2xl">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{bookingError}</span>
                  </div>
                )}

                <div className="flex items-center justify-center mb-10">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-300 ${bookingStep >= step
                        ? 'bg-gradient-primary scale-110'
                        : 'bg-white/5'
                        }`}>
                        {bookingStep > step ? <CheckCircle className="w-6 h-6" /> : step}
                      </div>
                      {step < 3 && (
                        <div className={`w-20 h-1 transition-all duration-300 ${bookingStep > step ? 'bg-gradient-primary' : 'bg-white/10'
                          }`} />
                      )}
                    </div>
                  ))}
                </div>

                {bookingStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-xl mb-4">Escolha o Profissional</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {barbers.map((barber) => (
                        <button
                          key={barber.id}
                          onClick={() => setSelectedBarber(barber.id)}
                          className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${selectedBarber === barber.id
                            ? 'border-indigo-500 bg-indigo-500/10 scale-105'
                            : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                              {barber.avatar ? (
                                <img src={barber.avatar} alt={barber.name} className="w-full h-full object-cover" />
                              ) : barbershop.logo ? (
                                <img src={barbershop.logo} alt={barber.name} className="w-full h-full object-contain p-2" />
                              ) : (
                                <img src="/Logo1.png" alt={barber.name} className="w-full h-full object-contain p-2" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-lg truncate">{barber.name}</p>
                              <p className="text-gray-400 text-sm">Especialista</p>
                              <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <Star key={s} className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleNextStep}
                      disabled={!selectedBarber}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold transition-all duration-300 text-lg"
                    >
                      Continuar
                    </button>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-xl mb-4">Escolha a Data</h3>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition text-lg"
                    />
                    <div className="flex gap-4">
                      <button
                        onClick={() => setBookingStep(1)}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold transition"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={handleNextStep}
                        disabled={!selectedDate}
                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold transition"
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="font-bold text-xl mb-4">Escolha o Horário</h3>

                    {loadingTimes ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Carregando horários...</p>
                      </div>
                    ) : availableTimes.length === 0 ? (
                      <div className="text-center py-12 bg-white/5 rounded-2xl">
                        <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">Nenhum horário disponível</p>
                        <button
                          onClick={() => setBookingStep(2)}
                          className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                        >
                          Escolher outra data
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-2">
                          {availableTimes.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-4 rounded-xl font-medium transition-all duration-300 ${selectedTime === time
                                ? 'bg-gradient-primary text-white scale-105'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                                }`}
                            >
                              {new Date(time).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </button>
                          ))}
                        </div>

                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                          <h4 className="font-bold mb-4 text-lg">Resumo</h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Serviço:</span>
                              <span className="font-bold">{selectedService.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Profissional:</span>
                              <span className="font-bold">
                                {barbers.find(b => b.id === selectedBarber)?.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Data:</span>
                              <span className="font-bold">
                                {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            {selectedTime && (
                              <div className="flex justify-between">
                                <span className="text-gray-400">Horário:</span>
                                <span className="font-bold">
                                  {new Date(selectedTime).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between pt-3 border-t border-white/10">
                              <span className="text-gray-400">Total:</span>
                              <span className="font-bold text-indigo-400 text-xl">
                                R$ {Number(selectedService.price).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => setBookingStep(2)}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-bold transition"
                          >
                            Voltar
                          </button>
                          <button
                            onClick={handleConfirmBooking}
                            disabled={!selectedTime}
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold transition shadow-lg shadow-green-500/50"
                          >
                            Confirmar
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox para Galeria */}
      {selectedImageIndex !== null && config.galleryImages && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImageIndex(null)}
        >
          <button
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
            onClick={() => setSelectedImageIndex(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={config.galleryImages[selectedImageIndex]}
            alt={`Galeria ${selectedImageIndex + 1}`}
            className="max-w-full max-h-[90vh] rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}