'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-black/60 backdrop-blur-md z-50 border-b border-gray-700/50">
        <nav className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image 
              src="/Logo BarberFlow com Estilo Distress.png" 
              alt="BarberFlow" 
              width={250} 
              height={60} 
              className="h-14 md:h-16 w-auto" 
            />
          </div>

          {/* Menu Desktop */}
          <ul className="hidden lg:flex items-center gap-2">
            <li><a href="#home" className="px-5 py-2 text-white hover:text-gray-300 transition text-sm font-medium uppercase">Home</a></li>
            <li><a href="#sobre" className="px-5 py-2 text-gray-300 hover:text-white transition text-sm font-medium uppercase">Sobre</a></li>
            <li><a href="#funcionalidades" className="px-5 py-2 text-gray-300 hover:text-white transition text-sm font-medium uppercase">Funções</a></li>
            <li><a href="#precos" className="px-5 py-2 text-gray-300 hover:text-white transition text-sm font-medium uppercase">Preços</a></li>
            <li>
              <Link href="/register">
                <button className="mx-3 px-6 py-2.5 border-2 border-purple-500 text-purple-400 rounded font-bold hover:bg-purple-500 hover:text-white transition text-sm uppercase">
                  Teste Grátis
                </button>
              </Link>
            </li>
            <li><a href="#blog" className="px-5 py-2 text-gray-300 hover:text-white transition text-sm font-medium uppercase">Blog</a></li>
            <li>
              <Link href="/login">
                <span className="px-5 py-2 text-gray-300 hover:text-white transition text-sm font-medium cursor-pointer uppercase">Acessar</span>
              </Link>
            </li>
            <li>
              <Link href="/sou-cliente">
                <span className="px-5 py-2 text-purple-400 hover:text-purple-300 transition text-sm font-medium cursor-pointer uppercase">Sou Cliente</span>
              </Link>
            </li>
          </ul>

          {/* Menu Mobile */}
          <button className="lg:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section 
        id="home" 
        className="pt-24 min-h-[500px] md:min-h-[600px] flex items-center justify-center text-center relative overflow-hidden" 
        style={{ backgroundImage: 'url(/fundo.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-4xl px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
            BarberFlow
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8">
            O sistema completo para gerenciar sua barbearia com eficiência e profissionalismo
          </p>
          <button 
            onClick={() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-bold text-base md:text-lg hover:shadow-2xl hover:scale-105 transition"
          >
            Comece Agora
          </button>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-12 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-900">
            Sobre o BarberFlow
          </h2>
          <p className="text-base md:text-lg text-gray-600 text-center max-w-3xl mx-auto leading-relaxed mb-12 md:mb-16">
            O BarberFlow é a solução completa para gestão de barbearias modernas. Oferecemos ferramentas 
            intuitivas para agendamento, controle de clientes, gestão financeira e muito mais. Nossa plataforma 
            foi desenvolvida pensando nas necessidades reais dos profissionais do setor.
          </p>

          {/* Nosso Objetivo */}
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10 text-gray-900">
            Nosso Objetivo
          </h3>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white border border-gray-100 rounded-lg p-6 md:p-8 text-center hover:shadow-md transition">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 flex items-center justify-center bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-lg md:text-xl mb-2 text-gray-900">Otimizar seu Tempo</h4>
              <p className="text-sm md:text-base text-gray-600">
                Automatize processos e economize horas do seu dia com nossa plataforma intuitiva
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-6 md:p-8 text-center hover:shadow-md transition">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 flex items-center justify-center bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-lg md:text-xl mb-2 text-gray-900">Fidelizar seus Clientes</h4>
              <p className="text-sm md:text-base text-gray-600">
                Ofereça experiências personalizadas e aumente a satisfação dos seus clientes
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-6 md:p-8 text-center hover:shadow-md transition">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 flex items-center justify-center bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 4 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-bold text-lg md:text-xl mb-2 text-gray-900">Aumentar seu Faturamento</h4>
              <p className="text-sm md:text-base text-gray-600">
                Tenha controle financeiro completo e insights para crescer seu negócio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-gray-900">
            Funcionalidades do BarberFlow
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: "📅", title: "Controle de Agendamentos", desc: "Sistema completo de agenda" },
              { icon: "📷", title: "Registro Fotográfico", desc: "Antes e depois dos cortes" },
              { icon: "💳", title: "Formas de Pagamento", desc: "Aceite diversos métodos" },
              { icon: "🗑️", title: "Controle de Cancelamentos", desc: "Gerencie faltas e remarcações" },
              { icon: "💰", title: "Relatório Financeiro", desc: "Controle total de receitas" },
              { icon: "⏰", title: "Relatórios Gerenciais", desc: "Análises detalhadas" },
              { icon: "🔒", title: "Dados de Cartões Criptografados", desc: "Segurança total" },
              { icon: "💬", title: "Notificações Automáticas", desc: "Lembretes por SMS/Email" },
              { icon: "📋", title: "Comandas Eletrônicas", desc: "Controle digital de serviços" },
              { icon: "🏪", title: "Multi-unidades", desc: "Gerencie várias barbearias" },
              { icon: "📝", title: "Controle de Estoque", desc: "Gestão de produtos" },
              { icon: "📧", title: "Notificações por Email", desc: "Comunicação automática" },
              { icon: "⭐", title: "Programa de Fidelidade", desc: "Recompense clientes fiéis" },
              { icon: "👥", title: "Clube de Clientes VIP", desc: "Benefícios exclusivos" },
              { icon: "💻", title: "Site e Agendamento Online", desc: "Presença digital completa" },
              { icon: "🎯", title: "Controle de Metas e Comissões", desc: "Motive sua equipe" },
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-gray-200 p-4 md:p-6 rounded-xl text-center hover:shadow-lg hover:-translate-y-1 transition"
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
      <section className="py-12 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-gray-900">
            Como começar
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-10">
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="font-bold text-lg md:text-xl mb-2 text-gray-900">Faça o Cadastro</h3>
              <p className="text-sm md:text-base text-gray-600">
                Preencha seus dados e comece seu teste grátis em poucos minutos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-bold text-lg md:text-xl mb-2 text-gray-900">Preencha o Plano e Escolha</h3>
              <p className="text-sm md:text-base text-gray-600">
                Selecione o plano ideal para o tamanho da sua barbearia
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-bold text-lg md:text-xl mb-2 text-gray-900">Teste grátis por 30 dias</h3>
              <p className="text-sm md:text-base text-gray-600">
                Experimente todas as funcionalidades sem compromisso
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/register">
              <button className="px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-bold text-base md:text-lg hover:shadow-xl hover:scale-105 transition">
                CADASTRE-SE E COMECE AGORA
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-gray-900">
            Case de Sucesso
          </h2>
          <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-white text-xl md:text-2xl font-bold">CASE DE SUCESSO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-12 md:py-16 px-4 md:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800">PREÇOS</h2>
          
          {/* Toggle Anual/Semestral/Mensal */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg overflow-hidden shadow-lg text-sm md:text-base">
              <button className="px-6 md:px-10 py-3 bg-blue-600 text-white font-bold">
                ANUAL<br/>
                <span className="text-xs font-normal">30% DE DESCONTO</span>
              </button>
              <button className="px-6 md:px-10 py-3 bg-gray-600 text-white font-bold hover:bg-gray-700 transition">
                SEMESTRAL<br/>
                <span className="text-xs font-normal">15% DE DESCONTO</span>
              </button>
              <button className="px-6 md:px-10 py-3 bg-gray-700 text-white font-bold hover:bg-gray-800 transition">
                MENSAL
              </button>
            </div>
          </div>

          {/* Cards de Preços */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { prof: "1 Profissional", price: "48,90", old: "69,90", total: "586,80" },
              { prof: "2 a 5 Profissionais", price: "69,90", old: "99,90", total: "838,80" },
              { prof: "6 a 15 Profissionais", price: "108,00", old: "154,50", total: "1296,00" },
              { prof: "+15 Profissionais", price: "146,90", old: "209,90", total: "1762,80" },
            ].map((plan, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden relative">
                <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold text-xs">
                  30% OFF
                </div>
                <div className="h-1.5 bg-gradient-to-r from-purple-600 to-purple-800"></div>
                <div className="p-4 text-center">
                  <p className="text-gray-600 text-sm mb-3">{plan.prof}</p>
                  <div className="mb-1">
                    <span className="text-gray-500 text-xs">R$</span>
                    <span className="text-3xl md:text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-xs">/mês</span>
                  </div>
                  <p className="text-gray-400 line-through text-xs mb-2">R$ {plan.old}/mês</p>
                  <p className="text-gray-600 text-xs mb-4">Valor Total: R$ {plan.total}</p>
                  <Link href="/register">
                    <button className="w-full py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-bold text-xs transition leading-tight">
                      EM ATÉ 12X S/ JUROS<br/>
                      NO CARTÃO DE CRÉDITO
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">
              Selecione a opção e Cadastre-se!
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Experimente todas as funcionalidades grátis por 30 dias, sem compromisso.
            </p>
            
            {/* Botões de Cadastro */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-2xl mx-auto">
              <Link href="/register" className="flex-1">
                <button className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-bold text-sm transition leading-tight">
                  TENHO UMA BARBEARIA<br/>
                  SOU BARBEIRO
                </button>
              </Link>
              <Link href="/sou-cliente" className="flex-1">
                <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition leading-tight">
                  SOU CLIENTE<br/>
                  DE BARBEARIA/ESTABELECIMENTO
                </button>
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10 text-gray-900">
              Perguntas Frequentes
            </h3>
            <div className="space-y-4 md:space-y-6">
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
                <div key={idx} className="bg-white border border-gray-200 p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition">
                  <h4 className="font-bold text-base md:text-lg mb-2 md:mb-3 text-gray-900">{faq.q}</h4>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-gray-900 text-white py-8 md:py-12 px-4 md:px-6 text-center">
        <p className="text-gray-400 mb-2">Contato: alex.bueno@hotmail.com</p>
        <p className="text-gray-400 mb-4">Tel: (11) 98394-3905</p>
        <p className="text-sm md:text-base">&copy; 2025 BarberFlow. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}