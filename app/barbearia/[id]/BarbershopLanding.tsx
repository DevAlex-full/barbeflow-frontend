'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, Phone, Clock, Star, Calendar, Scissors, ArrowLeft, Share2, 
  Heart, Users, X, CheckCircle, AlertCircle, Sparkles, TrendingUp,
  Instagram, Facebook, MessageCircle, Youtube, Globe
} from 'lucide-react';

// ✅ IMPORTAR O HOOK CORRETO PARA CLIENTES
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

  // ✅ USAR O HOOK DE CLIENTE (NÃO O AuthContext DAS BARBEARIAS)
  const { client, isAuthenticated } = useClientAuth();

  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const config: BarbershopConfig = barbershop?.config || {
    primaryColor: '#2563eb',
    secondaryColor: '#7c3aed',
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
      const response = await fetch(`https://barberflow-back-end.onrender.com/api/public/barbershops/${barbershopId}`);

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
        `https://barberflow-back-end.onrender.com/api/public/barbershops/${barbershopId}/available-times?date=${selectedDate}&serviceId=${selectedService?.id}&barberId=${selectedBarber}`
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

    // ✅ VERIFICAR SE ESTÁ AUTENTICADO
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
      // ✅ PEGAR O TOKEN DO SESSIONSTORAGE (não localStorage)
      const token = sessionStorage.getItem('@barberFlow:client:token');

      if (!token) {
        setBookingError('Token não encontrado. Faça login novamente.');
        router.push('/sou-cliente');
        return;
      }

      console.log('📤 [BOOKING] Enviando agendamento:', {
        barbershopId,
        barberId: selectedBarber,
        serviceId: selectedService.id,
        date: selectedTime,
        clientId: client?.id
      });

      const response = await fetch('https://barberflow-back-end.onrender.com/api/client/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ TOKEN DO CLIENTE PÚBLICO
        },
        body: JSON.stringify({
          barbershopId: barbershopId, // ✅ ENVIANDO BARBERSHOP ID
          barberId: selectedBarber,
          serviceId: selectedService.id,
          date: selectedTime
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ [BOOKING] Erro:', data);
        setBookingError(data.error || 'Erro ao criar agendamento');
        return;
      }

      console.log('✅ [BOOKING] Agendamento criado:', data);
      setBookingSuccess(true);
      setBookingError('');
      
      setTimeout(() => {
        setShowBookingModal(false);
        resetBooking();
        router.push('/meus-agendamentos');
      }, 2500);
    } catch (error) {
      console.error('❌ [BOOKING] Erro na requisição:', error);
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
      alert('Link copiado!');
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
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!barbershop) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white text-xl mb-4">Barbearia não encontrada</p>
          <Link href="/sou-cliente">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              Voltar para lista
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <style jsx global>{`
        :root {
          --primary-color: ${config.primaryColor};
          --secondary-color: ${config.secondaryColor};
        }
        .btn-primary {
          background-color: var(--primary-color) !important;
        }
        .btn-primary:hover {
          filter: brightness(0.9);
        }
        .text-primary {
          color: var(--primary-color) !important;
        }
        .border-primary {
          border-color: var(--primary-color) !important;
        }
        .bg-primary {
          background-color: var(--primary-color) !important;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)) !important;
        }
      `}</style>

      {/* Header Fixo */}
      <div className="sticky top-0 z-40 bg-[#1a1f2e]/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/sou-cliente">
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Voltar</span>
              </button>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              {/* ✅ INDICADOR DE LOGIN */}
              {isAuthenticated && client ? (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">{client.name.split(' ')[0]}</span>
                </div>
              ) : (
                <Link href="/sou-cliente">
                  <button className="text-xs sm:text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium">
                    Entrar
                  </button>
                </Link>
              )}
              <button 
                onClick={handleShare}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
                title="Compartilhar"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ... TODO O RESTO DO CÓDIGO DA LANDING PAGE (Hero, Informações, Serviços, etc.) ... */}
      {/* (Mantenha todo o código visual da landing page que você já tem) */}

      {/* Modal de Agendamento - VERSÃO CORRIGIDA */}
      {showBookingModal && selectedService && config.allowOnlineBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#1a1f2e] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800 my-4">
            {bookingSuccess ? (
              <div className="p-6 sm:p-8 text-center">
                <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-green-500">Agendamento Confirmado!</h2>
                <p className="text-gray-400 mb-4 text-sm sm:text-base">
                  Você receberá uma confirmação por email
                </p>
                <p className="text-xs sm:text-sm text-gray-500">Redirecionando...</p>
              </div>
            ) : (
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold">Agendar {selectedService.name}</h2>
                  <button
                    onClick={() => { setShowBookingModal(false); resetBooking(); }}
                    className="p-2 hover:bg-gray-800 rounded-lg transition"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* ✅ EXIBIR ERRO SE HOUVER */}
                {bookingError && (
                  <div className="mb-4 flex items-center gap-2 bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{bookingError}</span>
                  </div>
                )}

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-6 sm:mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${
                        bookingStep >= step ? 'bg-primary' : 'bg-gray-700'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-12 sm:w-16 h-1 ${bookingStep > step ? 'bg-primary' : 'bg-gray-700'}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Escolher Barbeiro */}
                {bookingStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-base sm:text-lg mb-3">Escolha o Profissional</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {barbers.map((barber) => (
                        <button
                          key={barber.id}
                          onClick={() => setSelectedBarber(barber.id)}
                          className={`p-4 rounded-lg border-2 transition text-left ${
                            selectedBarber === barber.id
                              ? 'border-primary bg-primary/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                              {barber.avatar ? (
                                <Image src={barber.avatar} alt={barber.name} width={48} height={48} className="rounded-full object-cover w-full h-full" />
                              ) : '👨‍💼'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm sm:text-base truncate">{barber.name}</p>
                              <p className="text-gray-400 text-xs sm:text-sm">Barbeiro</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleNextStep}
                      disabled={!selectedBarber}
                      className="w-full mt-4 btn-primary disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition text-sm sm:text-base"
                    >
                      Próximo
                    </button>
                  </div>
                )}

                {/* Step 2: Escolher Data */}
                {bookingStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-base sm:text-lg mb-3">Escolha a Data</h3>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition text-sm sm:text-base"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => setBookingStep(1)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold transition text-sm sm:text-base"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={handleNextStep}
                        disabled={!selectedDate}
                        className="flex-1 btn-primary disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition text-sm sm:text-base"
                      >
                        Próximo
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Escolher Horário */}
                {bookingStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-base sm:text-lg mb-3">Escolha o Horário</h3>
                    
                    {loadingTimes ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-400 text-sm">Carregando horários disponíveis...</p>
                      </div>
                    ) : availableTimes.length === 0 ? (
                      <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-sm sm:text-base">Nenhum horário disponível para esta data</p>
                        <button
                          onClick={() => setBookingStep(2)}
                          className="mt-4 text-primary hover:opacity-80 text-sm"
                        >
                          Escolher outra data
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2">
                          {availableTimes.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition ${
                                selectedTime === time
                                  ? 'bg-primary text-white'
                                  : 'bg-[#0a0e1a] text-gray-300 hover:bg-gray-800 border border-gray-700'
                              }`}
                            >
                              {new Date(time).toLocaleTimeString('pt-BR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </button>
                          ))}
                        </div>

                        {/* Resumo do Agendamento */}
                        <div className="bg-[#0a0e1a] rounded-lg p-4 border border-gray-700 mt-4">
                          <h4 className="font-bold mb-3 text-sm sm:text-base">Resumo do Agendamento</h4>
                          <div className="space-y-2 text-xs sm:text-sm">
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
                                {new Date(selectedDate).toLocaleDateString('pt-BR')}
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
                            <div className="flex justify-between">
                              <span className="text-gray-400">Duração:</span>
                              <span className="font-bold">{selectedService.duration} min</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-700">
                              <span className="text-gray-400">Valor:</span>
                              <span className="font-bold text-primary text-base sm:text-lg">
                                R$ {selectedService.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => setBookingStep(2)}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold transition text-sm sm:text-base"
                          >
                            Voltar
                          </button>
                          <button
                            onClick={handleConfirmBooking}
                            disabled={!selectedTime}
                            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold transition text-sm sm:text-base"
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
    </div>
  );
}