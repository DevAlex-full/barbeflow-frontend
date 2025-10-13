'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'semiannual' | 'annual'>('annual');

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // ✅ Dados dos planos baseados no período selecionado
  const getPlansData = () => {
    const plans = [
      {
        id: 'basic',
        prof: '1 Profissional',
        prices: {
          monthly: 34.90,
          semiannual: 177.99,
          annual: 418.80
        },
        oldPrices: {
          monthly: 34.90,
          semiannual: 209.40, // 34.90 * 6
          annual: 586.80 // 34.90 * 12
        }
      },
      {
        id: 'standard',
        prof: '2 a 5 Profissionais',
        prices: {
          monthly: 48.90,
          semiannual: 249.51,
          annual: 586.80
        },
        oldPrices: {
          monthly: 48.90,
          semiannual: 293.40, // 48.90 * 6
          annual: 838.80 // 48.90 * 12
        },
        popular: true
      },
      {
        id: 'premium',
        prof: '6 a 15 Profissionais',
        prices: {
          monthly: 75.60,
          semiannual: 385.56,
          annual: 907.20
        },
        oldPrices: {
          monthly: 75.60,
          semiannual: 453.60, // 75.60 * 6
          annual: 1296.00 // 75.60 * 12
        }
      },
      {
        id: 'enterprise',
        prof: '+15 Profissionais',
        prices: {
          monthly: 102.80,
          semiannual: 524.28,
          annual: 1233.60
        },
        oldPrices: {
          monthly: 102.80,
          semiannual: 616.80, // 102.80 * 6
          annual: 1761.60 // 102.80 * 12
        }
      }
    ];

    return plans.map(plan => {
      const price = plan.prices[pricingPeriod];
      const oldPrice = plan.oldPrices[pricingPeriod];
      const monthlyEquivalent = pricingPeriod === 'monthly' 
        ? price 
        : price / (pricingPeriod === 'semiannual' ? 6 : 12);
      
      let discount = 0;
      if (pricingPeriod === 'semiannual') discount = 15;
      if (pricingPeriod === 'annual') discount = 30;

      return {
        ...plan,
        displayPrice: price.toFixed(2),
        displayOldPrice: oldPrice.toFixed(2),
        displayMonthly: monthlyEquivalent.toFixed(2),
        discount,
        savings: (oldPrice - price).toFixed(2)
      };
    });
  };

  const plansData = getPlansData();

  const getPeriodLabel = () => {
    if (pricingPeriod === 'monthly') return 'Mensal';
    if (pricingPeriod === 'semiannual') return 'Semestral (6 meses)';
    return 'Anual (12 meses)';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-gray-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Image 
                src="/Logo.png" 
                alt="BarberFlow" 
                width={180} 
                height={45} 
                className="h-10 sm:h-12 md:h-14 w-auto" 
                priority
              />
            </div>

            {/* Desktop Menu */}
            <ul className="hidden lg:flex items-center gap-1">
              <li><a href="#home" className="px-4 py-2 text-white hover:text-purple-400 transition text-sm font-medium">HOME</a></li>
              <li><a href="#sobre" className="px-4 py-2 text-gray-300 hover:text-purple-400 transition text-sm font-medium">SOBRE</a></li>
              <li><a href="#funcionalidades" className="px-4 py-2 text-gray-300 hover:text-purple-400 transition text-sm font-medium">FUNÇÕES</a></li>
              <li><a href="#precos" className="px-4 py-2 text-gray-300 hover:text-purple-400 transition text-sm font-medium">PREÇOS</a></li>
              <li>
                <Link href="/register">
                  <button className="mx-2 px-5 py-2 border-2 border-purple-500 text-purple-400 rounded-lg font-bold hover:bg-purple-500 hover:text-white transition text-sm">
                    TESTE GRÁTIS
                  </button>
                </Link>
              </li>
              <li><a href="#blog" className="px-4 py-2 text-gray-300 hover:text-purple-400 transition text-sm font-medium">BLOG</a></li>
              <li>
                <Link href="/login">
                  <span className="px-4 py-2 text-gray-300 hover:text-purple-400 transition text-sm font-medium cursor-pointer">ACESSAR</span>
                </Link>
              </li>
              <li>
                <Link href="/sou-cliente">
                  <span className="px-4 py-2 text-purple-400 hover:text-purple-300 transition text-sm font-medium cursor-pointer">SOU CLIENTE</span>
                </Link>
              </li>
            </ul>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="lg:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-800">
              <ul className="flex flex-col gap-2 mt-4">
                <li><a href="#home" onClick={toggleMobileMenu} className="block px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition">HOME</a></li>
                <li><a href="#sobre" onClick={toggleMobileMenu} className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition">SOBRE</a></li>
                <li><a href="#funcionalidades" onClick={toggleMobileMenu} className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition">FUNÇÕES</a></li>
                <li><a href="#precos" onClick={toggleMobileMenu} className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition">PREÇOS</a></li>
                <li><a href="#blog" onClick={toggleMobileMenu} className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition">BLOG</a></li>
                <li>
                  <Link href="/register" onClick={toggleMobileMenu}>
                    <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition">
                      TESTE GRÁTIS
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/login" onClick={toggleMobileMenu}>
                    <button className="w-full px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition">
                      ACESSAR
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/sou-cliente" onClick={toggleMobileMenu}>
                    <button className="w-full px-4 py-2 bg-gray-800 text-purple-400 rounded-lg font-bold hover:bg-gray-700 transition">
                      SOU CLIENTE
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section 
        id="home" 
        className="pt-20 min-h-screen flex items-center justify-center text-center relative overflow-hidden" 
        style={{ backgroundImage: 'url(/fundo4.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        <div className="relative z-10 max-w-5xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
              BarberFlow
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            O sistema completo para gerenciar sua barbearia com eficiência e profissionalismo
          </p>
          <button 
            onClick={() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Comece Agora - 30 Dias Grátis
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900">
            Sobre o BarberFlow
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 text-center max-w-4xl mx-auto leading-relaxed mb-16">
            O BarberFlow é a solução completa para gestão de barbearias modernas. Oferecemos ferramentas 
            intuitivas para agendamento, controle de clientes, gestão financeira e muito mais. Nossa plataforma 
            foi desenvolvida pensando nas necessidades reais dos profissionais do setor.
          </p>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Nosso Objetivo
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 md:p-8 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-purple-600 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-3 text-gray-900">Otimizar seu Tempo</h4>
              <p className="text-gray-600 leading-relaxed">
                Automatize processos e economize horas do seu dia com nossa plataforma intuitiva
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 md:p-8 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-purple-600 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-3 text-gray-900">Fidelizar seus Clientes</h4>
              <p className="text-gray-600 leading-relaxed">
                Ofereça experiências personalizadas e aumente a satisfação dos seus clientes
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-6 md:p-8 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-purple-600 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-bold text-xl mb-3 text-gray-900">Aumentar seu Faturamento</h4>
              <p className="text-gray-600 leading-relaxed">
                Tenha controle financeiro completo e insights para crescer seu negócio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">
            Funcionalidades do BarberFlow
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar sua barbearia em um só lugar
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: "📅", title: "Controle de Agendamentos", desc: "Sistema completo de agenda" },
              { icon: "📷", title: "Registro Fotográfico", desc: "Antes e depois dos cortes" },
              { icon: "💳", title: "Formas de Pagamento", desc: "Aceite diversos métodos" },
              { icon: "🗑️", title: "Controle de Cancelamentos", desc: "Gerencie faltas e remarcações" },
              { icon: "💰", title: "Relatório Financeiro", desc: "Controle total de receitas" },
              { icon: "⏰", title: "Relatórios Gerenciais", desc: "Análises detalhadas" },
              { icon: "🔒", title: "Dados Criptografados", desc: "Segurança total" },
              { icon: "💬", title: "Notificações Automáticas", desc: "Lembretes por SMS/Email" },
              { icon: "📋", title: "Comandas Eletrônicas", desc: "Controle digital de serviços" },
              { icon: "🏪", title: "Multi-unidades", desc: "Gerencie várias barbearias" },
              { icon: "📝", title: "Controle de Estoque", desc: "Gestão de produtos" },
              { icon: "📧", title: "Notificações por Email", desc: "Comunicação automática" },
              { icon: "⭐", title: "Programa de Fidelidade", desc: "Recompense clientes fiéis" },
              { icon: "👥", title: "Clube VIP", desc: "Benefícios exclusivos" },
              { icon: "💻", title: "Agendamento Online", desc: "Presença digital completa" },
              { icon: "🎯", title: "Metas e Comissões", desc: "Motive sua equipe" },
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-gray-200 p-4 md:p-6 rounded-xl text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-purple-300"
              >
                <div className="text-3xl md:text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-sm md:text-base font-bold mb-2 text-gray-900 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como Começar */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
            Como começar
          </h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Faça o Cadastro</h3>
              <p className="text-gray-600 leading-relaxed">
                Preencha seus dados e comece seu teste grátis em poucos minutos
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Escolha seu Plano</h3>
              <p className="text-gray-600 leading-relaxed">
                Selecione o plano ideal para o tamanho da sua barbearia
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Teste grátis por 30 dias</h3>
              <p className="text-gray-600 leading-relaxed">
                Experimente todas as funcionalidades sem compromisso
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/register">
              <button className="px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                CADASTRE-SE E COMECE AGORA
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-white">
            Case de Sucesso
          </h2>
          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-black/60 flex items-center justify-center group-hover:from-purple-900/50 transition-all duration-300">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-300 group-hover:scale-110 shadow-xl">
                  <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-white text-2xl font-bold">VEJA NOSSO CASE DE SUCESSO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900">PREÇOS</h2>
          <p className="text-center text-gray-600 mb-10">Planos flexíveis para todos os tamanhos de negócio</p>
          
          {/* Toggle Anual/Semestral/Mensal */}
          <div className="flex justify-center mb-12 overflow-x-auto pb-4">
            <div className="inline-flex rounded-xl overflow-hidden shadow-lg text-sm">
              <button 
                onClick={() => setPricingPeriod('annual')}
                className={`px-6 md:px-10 py-3 md:py-4 font-bold transition-all ${
                  pricingPeriod === 'annual' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                ANUAL<br/>
                <span className="text-xs font-normal">30% DE DESCONTO</span>
              </button>
              <button 
                onClick={() => setPricingPeriod('semiannual')}
                className={`px-6 md:px-10 py-3 md:py-4 font-bold transition-all ${
                  pricingPeriod === 'semiannual' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                SEMESTRAL<br/>
                <span className="text-xs font-normal">15% DE DESCONTO</span>
              </button>
              <button 
                onClick={() => setPricingPeriod('monthly')}
                className={`px-6 md:px-10 py-3 md:py-4 font-bold transition-all ${
                  pricingPeriod === 'monthly' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                MENSAL
              </button>
            </div>
          </div>

          {/* Cards de Preços */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {plansData.map((plan) => (
              <div 
                key={plan.id} 
                className={`bg-white rounded-2xl shadow-xl overflow-hidden relative hover:scale-105 transition-all duration-300 ${
                  plan.popular ? 'ring-4 ring-purple-500' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-purple-600 text-white text-center py-2 font-bold text-sm">
                    MAIS POPULAR
                  </div>
                )}
                {plan.discount > 0 && (
                  <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                    {plan.discount}% OFF
                  </div>
                )}
                <div className="h-2 bg-gradient-to-r from-purple-600 to-purple-800"></div>
                <div className="p-6 text-center">
                  <p className="text-gray-600 font-semibold mb-4">{plan.prof}</p>
                  
                  {pricingPeriod === 'monthly' ? (
                    <>
                      <div className="mb-2">
                        <span className="text-gray-500 text-sm">R$</span>
                        <span className="text-4xl md:text-5xl font-bold text-gray-900">{plan.displayMonthly}</span>
                        <span className="text-gray-500 text-sm">/mês</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-2">
                        <span className="text-gray-500 text-sm">R$</span>
                        <span className="text-4xl md:text-5xl font-bold text-gray-900">{plan.displayMonthly}</span>
                        <span className="text-gray-500 text-sm">/mês</span>
                      </div>
                      <p className="text-gray-400 line-through text-sm mb-1">R$ {plan.displayOldPrice}</p>
                      <p className="text-gray-600 text-sm mb-3">
                        Pagamento único: <span className="font-bold text-purple-600">R$ {plan.displayPrice}</span>
                      </p>
                      <p className="text-green-600 text-xs font-semibold mb-4">
                        Economize R$ {plan.savings}
                      </p>
                    </>
                  )}
                  
                  <Link href={`/planos?plan=${plan.id}&period=${pricingPeriod}`}>
                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white rounded-xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl">
                      CONTRATAR AGORA
                    </button>
                  </Link>
                  <p className="text-xs text-gray-500 mt-3">
                    {pricingPeriod === 'monthly' ? 'Renovação automática mensal' : `Pagamento único - ${getPeriodLabel()}`}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              Selecione a opção e Cadastre-se!
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Experimente todas as funcionalidades grátis por 30 dias, sem compromisso.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-3xl mx-auto">
              <Link href="/register" className="flex-1">
                <button className="w-full py-4 px-6 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl">
                  TENHO UMA BARBEARIA<br/>
                  <span className="text-sm font-normal">Sou Barbeiro</span>
                </button>
              </Link>
              <Link href="/sou-cliente" className="flex-1">
                <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl">
                  SOU CLIENTE<br/>
                  <span className="text-sm font-normal">De Barbearia/Estabelecimento</span>
                </button>
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              Perguntas Frequentes
            </h3>
            <div className="space-y-4">
              {[
                { 
                  q: "Meu período gratuito (trial) acabou, consigo usar novamente?", 
                  a: "O período trial de 30 dias é válido apenas uma vez por barbearia. Após o término, você pode escolher um dos nossos planos pagos." 
                },
                { 
                  q: "Posso cancelar meu plano a qualquer momento?", 
                  a: "Sim! Você pode cancelar a qualquer momento sem multas. Continuará usando até o fim do período já pago." 
                },
                { 
                  q: "Posso alterar meu plano a qualquer momento?", 
                  a: "Sim! Você pode fazer upgrade ou downgrade do seu plano sempre que precisar." 
                },
                { 
                  q: "Como o bônus ou desconto é aplicado pago com tarifa?", 
                  a: "Os descontos são aplicados automaticamente no momento do pagamento de acordo com o plano escolhido." 
                },
                { 
                  q: "Meus profissionais tem acesso de usuário no sistema?", 
                  a: "Sim! Cada profissional pode ter seu próprio acesso com permissões personalizadas." 
                },
                { 
                  q: "Consigo exportar minha base de dados?", 
                  a: "Sim! Você tem total controle e pode exportar seus dados a qualquer momento em formato CSV ou Excel." 
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-300">
                  <h4 className="font-bold text-lg mb-3 text-gray-900">{faq.q}</h4>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Pronto para revolucionar sua barbearia?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Junte-se a centenas de barbeiros que já transformaram seus negócios com o BarberFlow
          </p>
          <Link href="/register">
            <button className="px-12 py-5 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              Começar Teste Grátis de 30 Dias
            </button>
          </Link>
          <p className="text-sm text-gray-500 mt-6">
            Sem cartão de crédito necessário • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Image 
                src="/Logo.png" 
                alt="BarberFlow" 
                width={200} 
                height={50} 
                className="h-12 w-auto mb-4" 
              />
              <p className="text-gray-400 mb-4">
                A solução completa para gestão de barbearias modernas
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-purple-400 transition">Home</a></li>
                <li><a href="#sobre" className="text-gray-400 hover:text-purple-400 transition">Sobre</a></li>
                <li><a href="#funcionalidades" className="text-gray-400 hover:text-purple-400 transition">Funcionalidades</a></li>
                <li><a href="#precos" className="text-gray-400 hover:text-purple-400 transition">Preços</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-purple-400 transition">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Contato</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  alex.bueno22@hotmail.com
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (11) 98394-3905
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 BarberFlow. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-40"
        aria-label="Voltar ao topo"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}