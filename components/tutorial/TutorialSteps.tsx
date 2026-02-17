// components/tutorial/TutorialSteps.tsx

import { Step } from 'react-joyride';

// Tipo estendido com rota
interface TutorialStep extends Step {
  route?: string;
}

export const tutorialSteps: TutorialStep[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. 🎉 BOAS-VINDAS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    target: 'body',
    route: '/dashboard',
    content: (
      <div className="p-4">
        <h2 className="text-2xl font-bold text-purple-600 mb-3">
          🎉 Bem-vindo ao BarberFlow!
        </h2>
        <p className="text-gray-700 mb-4">
          Vamos fazer um tour completo pelo sistema em <strong>20 passos</strong>.
        </p>
        <p className="text-gray-600 text-sm">
          Você vai aprender tudo sobre: agendamentos, clientes, landing page completa, 
          financeiro, comissões, analytics e muito mais!
        </p>
        <p className="text-purple-600 font-semibold mt-4">
          ⏱️ Tempo estimado: 7-10 minutos
        </p>
        <p className="text-sm text-gray-500 mt-3">
          💡 O tutorial vai navegar automaticamente pelas páginas
        </p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. 📊 DASHBOARD - Apontar para PÁGINA INTEIRA
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    target: 'main',  // ✅ Elemento visível na página
    route: '/dashboard',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          📊 Dashboard - Visão Geral
        </h3>
        <p className="text-gray-700 mb-3">
          Sua "central de comando" com resumo completo do negócio.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Total de clientes cadastrados</li>
          <li>Agendamentos de hoje</li>
          <li>Receita do mês</li>
          <li>Gráficos de desempenho</li>
        </ul>
      </div>
    ),
    placement: 'center',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. 📅 AGENDAMENTOS - Apontar para PÁGINA INTEIRA
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    target: 'main',
    route: '/agendamentos',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          📅 Agendamentos
        </h3>
        <p className="text-gray-700 mb-3">
          Gerencie todos os horários marcados em um só lugar.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Criar agendamento manual</li>
          <li>Ver calendário completo</li>
          <li>Confirmar ou cancelar horários</li>
          <li>Notificar clientes automaticamente</li>
        </ul>
        <p className="text-purple-600 font-semibold mt-3">
          ⏰ Clientes também agendam pela landing page!
        </p>
      </div>
    ),
    placement: 'center',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. 👥 CLIENTES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    target: 'main',
    route: '/clientes',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          👥 Clientes
        </h3>
        <p className="text-gray-700 mb-3">
          Cadastre e gerencie toda sua base de clientes.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Adicionar novos clientes rapidamente</li>
          <li>Histórico completo de atendimentos</li>
          <li>Aniversários e informações de contato</li>
          <li>Observações importantes sobre cada cliente</li>
        </ul>
      </div>
    ),
    placement: 'center',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. ✂️ SERVIÇOS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    target: 'main',
    route: '/servicos',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          ✂️ Serviços
        </h3>
        <p className="text-gray-700 mb-3">
          Configure todos os serviços oferecidos pela barbearia.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Corte, barba, sobrancelha, etc.</li>
          <li>Definir preço e duração de cada serviço</li>
          <li>Atribuir barbeiro responsável</li>
        </ul>
        <p className="text-purple-600 font-semibold mt-3">
          💰 Preços aparecem automaticamente na landing page!
        </p>
      </div>
    ),
    placement: 'center',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 6. 📍 LOCALIZAÇÃO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    target: 'main',
    route: '/localizacao',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          📍 Localização
        </h3>
        <p className="text-gray-700 mb-3">
          Configure o endereço completo da barbearia.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Endereço completo com CEP</li>
          <li>Pin no mapa interativo</li>
          <li>Link direto para Google Maps</li>
        </ul>
        <p className="text-purple-600 font-semibold mt-3">
          🗺️ Mapa aparece automaticamente na landing page!
        </p>
      </div>
    ),
    placement: 'center',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 7. 🌐 LANDING PAGE - INTRODUÇÃO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    target: 'main',
    route: '/landing-page',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          🌐 Landing Page - Seu Site Profissional
        </h3>
        <p className="text-gray-700 mb-3">
          Personalize completamente sua presença online com várias seções:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Hero/Banner principal</li>
          <li>Sobre sua barbearia</li>
          <li>Galeria de fotos</li>
          <li>Horários de funcionamento</li>
          <li>Redes sociais</li>
          <li>Design & Logo personalizados</li>
          <li>Equipe de barbeiros</li>
          <li>Funcionalidades extras</li>
        </ul>
        <p className="text-purple-600 font-semibold mt-3">
          👉 Vamos conhecer cada seção nos próximos passos!
        </p>
      </div>
    ),
    placement: 'center',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 8-15: SEÇÕES DA LANDING PAGE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    target: 'main',
    route: '/landing-page',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          📸 Hero - Banner Principal
        </h3>
        <p className="text-gray-700 mb-3">
          A primeira impressão é a que fica! Configure o banner de destaque.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Imagem de fundo impactante</li>
          <li>Título marcante da barbearia</li>
          <li>Subtítulo descritivo</li>
          <li>Botão de ação "Agendar Agora"</li>
        </ul>
      </div>
    ),
    placement: 'center',
  },

  {
    target: 'main',
    route: '/landing-page',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          📖 Sobre - Conte Sua História
        </h3>
        <p className="text-gray-700 mb-3">
          Apresente sua barbearia aos clientes de forma única.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>História e tradição da barbearia</li>
          <li>Diferenciais e valores do negócio</li>
          <li>Anos de experiência no mercado</li>
        </ul>
      </div>
    ),
    placement: 'center',
  },

  {
    target: 'main',
    route: '/landing-page',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          🖼️ Galeria - Mostre Seus Trabalhos
        </h3>
        <p className="text-gray-700 mb-3">
          Imagens vendem! Mostre seus melhores trabalhos.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Fotos de antes e depois</li>
          <li>Diferentes estilos de corte</li>
          <li>Ambiente da barbearia</li>
        </ul>
      </div>
    ),
    placement: 'center',
  },

  {
    target: 'main',
    route: '/landing-page',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          ⏰ Horários de Funcionamento
        </h3>
        <p className="text-gray-700 mb-3">
          Clientes precisam saber quando você está disponível.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Horário específico para cada dia</li>
          <li>Marcar dias fechados</li>
        </ul>
        <p className="text-purple-600 font-semibold mt-3">
          🔄 Sincroniza com o agendamento!
        </p>
      </div>
    ),
    placement: 'center',
  },

  {
    target: 'main',
    route: '/landing-page',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          📱 Redes Sociais - Conecte-se
        </h3>
        <p className="text-gray-700 mb-3">
          Conecte todas as suas redes sociais.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Instagram</li>
          <li>Facebook</li>
          <li>WhatsApp Business</li>
        </ul>
      </div>
    ),
    placement: 'center',
  },

  {
    target: 'main',
    route: '/landing-page',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          🎨 Design & Logo
        </h3>
        <p className="text-gray-700 mb-3">
          Personalize a identidade visual.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Upload da logo</li>
          <li>Cor primária</li>
          <li>Cor secundária</li>
        </ul>
      </div>
    ),
    placement: 'center',
  },

  {
    target: 'main',
    route: '/landing-page',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          👨‍💼 Equipe - Apresente os Barbeiros
        </h3>
        <p className="text-gray-700 mb-3">
          Mostre quem são os profissionais.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Foto profissional</li>
          <li>Nome e especialidade</li>
        </ul>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mt-3">
          <p className="text-sm text-gray-700">
            <strong>⚠️ Conforme plano:</strong><br />
            • Basic: 1 barbeiro<br />
            • Premium: até 5<br />
            • Enterprise: ilimitado
          </p>
        </div>
      </div>
    ),
    placement: 'center',
  },

  {
    target: 'main',
    route: '/landing-page',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          ⚙️ Funcionalidades Extras
        </h3>
        <p className="text-gray-700 mb-3">
          Ative ou desative recursos.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Agendamento online</li>
          <li>Avaliações</li>
          <li>Galeria</li>
          <li>SEO otimizado</li>
        </ul>
      </div>
    ),
    placement: 'center',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 16. 💰 FINANCEIRO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    target: 'main',
    route: '/financeiro',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          💰 Financeiro - Controle Total
        </h3>
        <p className="text-gray-700 mb-3">
          Gerencie todas as finanças.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Transações</li>
          <li>Saldo e fluxo de caixa</li>
          <li>DRE</li>
          <li>Metas</li>
        </ul>
      </div>
    ),
    placement: 'center',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 17. 💸 COMISSÕES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    target: 'main',
    route: '/financeiro',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          💸 Comissões
        </h3>
        <p className="text-gray-700 mb-3">
          Sistema automático de comissões.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Configurar %</li>
          <li>Calcular automaticamente</li>
          <li>Relatórios</li>
        </ul>
      </div>
    ),
    placement: 'center',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 18. 📈 ANALYTICS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    target: 'main',
    route: '/analytics',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          📈 Analytics - Insights
        </h3>
        <p className="text-gray-700 mb-3">
          Análises avançadas.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Taxa de ocupação</li>
          <li>Mapa de calor</li>
          <li>Top serviços</li>
          <li>Performance</li>
        </ul>
      </div>
    ),
    placement: 'center',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 19. 💳 PLANOS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    target: 'main',
    route: '/planos',
    content: (
      <div>
        <h3 className="text-xl font-bold text-purple-600 mb-2">
          💳 Planos e Assinatura
        </h3>
        <p className="text-gray-700 mb-3">
          Gerencie sua assinatura.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
          <li>Trial: 14 dias grátis</li>
          <li>Basic: 1 barbeiro</li>
          <li>Premium: até 5</li>
          <li>Enterprise: ilimitado</li>
        </ul>
      </div>
    ),
    placement: 'center',
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 20. ✅ CONCLUSÃO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    target: 'body',
    route: '/dashboard',
    content: (
      <div className="p-4">
        <h2 className="text-2xl font-bold text-green-600 mb-3">
          🎉 Parabéns! Tutorial Completo!
        </h2>
        <p className="text-gray-700 mb-4">
          Você agora conhece todas as funcionalidades!
        </p>
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
          <h4 className="font-bold text-purple-800 mb-2">📌 Próximos Passos:</h4>
          <ol className="list-decimal list-inside text-gray-700 space-y-1 text-sm">
            <li>Configure seus <strong>serviços</strong></li>
            <li>Personalize sua <strong>landing page</strong></li>
            <li>Comece a receber <strong>agendamentos</strong>!</li>
          </ol>
        </div>
        <p className="text-gray-600 text-sm">
          💡 Rever em: <strong>Configurações → Ajuda</strong>
        </p>
      </div>
    ),
    placement: 'center',
  },
];