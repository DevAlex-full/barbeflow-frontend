'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/60 backdrop-blur-md z-50 border-b border-gray-700/50">
        <nav className="max-w-[1400px] mx-auto px-8 py-3 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo-barberflow.png" alt="BarberFlow" className="h-10 w-auto" />
          </div>

          {/* Menu */}
          <ul className="hidden lg:flex items-center gap-1">
            <li><a href="#home" className="px-4 py-2 text-white hover:text-gray-300 transition text-sm font-medium">HOME</a></li>
            <li><a href="#sobre" className="px-4 py-2 text-gray-400 hover:text-white transition text-sm font-medium">SOBRE</a></li>
            <li><a href="#funcionalidades" className="px-4 py-2 text-gray-400 hover:text-white transition text-sm font-medium">FUNÇÕES</a></li>
            <li><a href="#precos" className="px-4 py-2 text-gray-400 hover:text-white transition text-sm font-medium">PREÇOS</a></li>
            <li>
              <Link href="/register">
                <button className="mx-2 px-6 py-2.5 bg-gradient-to-r from-black via-purple-700 to-purple-900 text-white rounded font-bold hover:opacity-90 transition text-sm shadow-lg">
                  TESTE GRÁTIS
                </button>
              </Link>
            </li>
            <li><a href="#blog" className="px-4 py-2 text-gray-400 hover:text-white transition text-sm font-medium">BLOG</a></li>
            <li>
              <Link href="/login">
                <span className="px-4 py-2 text-gray-400 hover:text-white transition text-sm font-medium cursor-pointer">ACESSAR</span>
              </Link>
            </li>
            <li>
              <Link href="/sou-cliente">
                <span className="px-4 py-2 text-purple-400 hover:text-purple-300 transition text-sm font-medium cursor-pointer">SOU CLIENTE</span>
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-24 min-h-[600px] flex items-center justify-center text-center relative overflow-hidden" style={{ backgroundImage: 'url(/fundo.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-4xl px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            BarberFlow
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            O sistema completo para gerenciar sua barbearia com eficiência e profissionalismo
          </p>
          <button 
            onClick={() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition"
          >
            Comece Agora
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">Sobre o BarberFlow</h2>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
          O BarberFlow é a solução completa para gestão de barbearias modernas. Oferecemos ferramentas intuitivas para agendamento, controle de clientes, gestão financeira e muito mais. Nossa plataforma foi desenvolvida pensando nas necessidades reais dos profissionais do setor, proporcionando uma experiência simples e eficiente.
        </p>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Funcionalidades do BarberFlow</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "📅", title: "Controle de Agendamentos", desc: "Gerencie todos os agendamentos em tempo real" },
              { icon: "👥", title: "Gestão de Clientes", desc: "Cadastro completo e histórico de atendimentos" },
              { icon: "💰", title: "Controle Financeiro", desc: "Acompanhe receitas e despesas facilmente" },
              { icon: "📊", title: "Relatórios Completos", desc: "Análises detalhadas do desempenho" },
              { icon: "✂️", title: "Gestão de Serviços", desc: "Cadastre e organize todos os serviços" },
              { icon: "💬", title: "Integração WhatsApp", desc: "Lembretes automáticos para clientes" },
              { icon: "👨‍💼", title: "Gestão de Barbeiros", desc: "Controle de equipe e comissões" },
              { icon: "📱", title: "Acesso Mobile", desc: "Gerencie de qualquer lugar" },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl text-center hover:shadow-xl hover:-translate-y-2 transition">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Preços</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Basic Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Plano Básico</h3>
              <p className="text-gray-600 mb-4">Perfeito para barbearias iniciantes</p>
              <div className="text-5xl font-bold text-purple-600 mb-2">R$ 49,90<span className="text-lg text-gray-600">/mês</span></div>
              <ul className="space-y-3 mb-8">
                {[
                  "Até 100 clientes cadastrados",
                  "1 barbeiro",
                  "Agendamentos ilimitados",
                  "Relatórios básicos",
                  "Suporte por email"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="text-purple-600 font-bold text-xl">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:shadow-lg transition">
                  Escolher Plano
                </button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-600 transform scale-105 relative">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-2 rounded-full text-sm font-bold">
                MAIS POPULAR
              </span>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Plano Premium</h3>
              <p className="text-gray-600 mb-4">Para barbearias em crescimento</p>
              <div className="text-5xl font-bold text-purple-600 mb-2">R$ 99,90<span className="text-lg text-gray-600">/mês</span></div>
              <ul className="space-y-3 mb-8">
                {[
                  "Clientes ilimitados",
                  "Até 5 barbeiros",
                  "Agendamentos ilimitados",
                  "Relatórios avançados",
                  "Integração WhatsApp",
                  "Suporte prioritário",
                  "Lembretes automáticos"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="text-purple-600 font-bold text-xl">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:shadow-lg transition">
                  Escolher Plano
                </button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">Plano Enterprise</h3>
              <p className="text-gray-600 mb-4">Para redes de barbearias</p>
              <div className="text-5xl font-bold text-purple-600 mb-2">R$ 199,90<span className="text-lg text-gray-600">/mês</span></div>
              <ul className="space-y-3 mb-8">
                {[
                  "Tudo ilimitado",
                  "Multi-unidades",
                  "Barbeiros ilimitados",
                  "Marca personalizada",
                  "Relatórios completos",
                  "Integração WhatsApp",
                  "Suporte 24/7",
                  "Treinamento personalizado"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="text-purple-600 font-bold text-xl">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:shadow-lg transition">
                  Escolher Plano
                </button>
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-center mb-8 text-gray-900">Perguntas Frequentes</h3>
            <div className="space-y-4">
              {[
                { q: "Posso mudar de plano depois?", a: "Sim! Você pode fazer upgrade ou downgrade a qualquer momento." },
                { q: "Como funciona o pagamento?", a: "Cobramos mensalmente no cartão de crédito. Você pode cancelar quando quiser." },
                { q: "Posso cancelar a qualquer momento?", a: "Sim! Sem multas ou taxas. Você continua usando até o fim do período pago." }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow">
                  <h4 className="font-bold text-lg mb-2 text-gray-900">{faq.q}</h4>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-gray-900 text-white py-12 px-6 text-center">
        <p className="text-gray-400">Contato: alex.bueno@hotmail.com</p>
        <p className="text-gray-400">Telefone: (11) 98394-3905</p>
        <p className="mb-2">&copy; 2025 BarberFlow. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}