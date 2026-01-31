'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, FileText, Shield, Scale, AlertCircle } from 'lucide-react';

export default function TermosClientePage() {
    const [accepted, setAccepted] = useState(false);

    const sections = [
        { id: 'aceitacao', title: '1. Aceitação dos Termos' },
        { id: 'servico', title: '2. Descrição do Serviço' },
        { id: 'cadastro', title: '3. Cadastro e Conta' },
        { id: 'uso', title: '4. Uso Permitido' },
        { id: 'responsabilidades', title: '5. Responsabilidades' },
        { id: 'agendamentos', title: '6. Agendamentos' },
        { id: 'propriedade', title: '7. Propriedade Intelectual' },
        { id: 'limitacao', title: '8. Limitação de Responsabilidade' },
        { id: 'modificacoes', title: '9. Modificações nos Termos' },
        { id: 'lei', title: '10. Lei Aplicável' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/sou-cliente">
                            <button className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition group">
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Voltar</span>
                            </button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Scale className="w-5 h-5 text-purple-600" />
                            <span className="font-bold text-gray-900">BarberFlow</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl mb-6 shadow-lg">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Termos de Uso
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">Para Barbeiros/Estabelecimentos</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        Última atualização: 30 de janeiro de 2026
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Índice */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
                                Índice
                            </h2>
                            <nav className="space-y-2">
                                {sections.map((section) => (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        className="block text-sm text-gray-600 hover:text-purple-600 hover:translate-x-1 transition-all"
                                    >
                                        {section.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Conteúdo */}
                    <main className="lg:col-span-3 space-y-8">
                        {/* Introdução */}
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Importante!</h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Ao criar uma conta ou utilizar nossos serviços, você concorda com estes Termos de Uso.
                                        Leia atentamente antes de prosseguir. Se você não concordar com algum destes termos,
                                        por favor, não utilize a plataforma.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 1. Aceitação */}
                        <section id="aceitacao" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-emerald-600">1.</span>
                                Aceitação dos Termos
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>
                                    Estes Termos de Uso ("Termos") regem o acesso e uso da plataforma BarberFlow
                                    ("Plataforma", "nós", "nosso") por você ("Usuário", "Cliente", "você").
                                </p>
                                <p>
                                    Ao criar uma conta, fazer login ou utilizar qualquer funcionalidade da Plataforma,
                                    você declara que:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Leu, compreendeu e concorda em cumprir integralmente estes Termos</li>
                                    <li>Possui capacidade legal para celebrar contratos vinculantes</li>
                                    <li>Tem pelo menos 18 anos de idade</li>
                                    <li>Fornecerá informações verdadeiras, precisas e completas</li>
                                </ul>
                            </div>
                        </section>

                        {/* 2. Descrição do Serviço */}
                        <section id="servico" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-purple-600">2.</span>
                                Descrição do Serviço
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>
                                    O BarberFlow é uma plataforma que conecta clientes e barbearias, permitindo:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Visualização de barbearias cadastradas na Plataforma</li>
                                    <li>Acesso às páginas personalizadas (landing pages) das barbearias</li>
                                    <li>Agendamento online de serviços diretamente com as barbearias</li>
                                    <li>Visualização de serviços, preços, horários e profissionais disponíveis</li>
                                    <li>Gerenciamento de seus agendamentos</li>
                                </ul>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                                    <p className="text-yellow-800 text-sm font-medium">
                                        <strong>Importante:</strong> O BarberFlow atua como intermediário tecnológico.
                                        A prestação dos serviços de barbearia é de responsabilidade exclusiva da barbearia contratada.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 3. Cadastro e Conta */}
                        <section id="cadastro" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-purple-600">3.</span>
                                Cadastro e Conta
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>
                                    Para utilizar determinadas funcionalidades, você deverá criar uma conta fornecendo:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Nome completo</li>
                                    <li>Endereço de e-mail válido</li>
                                    <li>Número de telefone</li>
                                    <li>Senha segura</li>
                                </ul>
                                <p className="font-semibold text-gray-900 mt-6">Você é responsável por:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Manter a confidencialidade de suas credenciais de acesso</li>
                                    <li>Todas as atividades realizadas em sua conta</li>
                                    <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                                    <li>Manter suas informações atualizadas</li>
                                </ul>
                                <p className="text-sm text-red-600 font-medium mt-4">
                                    O BarberFlow não se responsabiliza por perdas decorrentes do uso não autorizado de sua conta.
                                </p>
                            </div>
                        </section>

                        {/* 4. Uso Permitido */}
                        <section id="uso" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-purple-600">4.</span>
                                Uso Permitido
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>Você concorda em utilizar a Plataforma apenas para:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Fins legais e legítimos</li>
                                    <li>Agendar serviços de barbearia para uso pessoal</li>
                                    <li>Visualizar informações sobre barbearias e serviços</li>
                                </ul>
                                <p className="font-semibold text-gray-900 mt-6">É expressamente proibido:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Usar a Plataforma para fins comerciais sem autorização</li>
                                    <li>Fazer agendamentos falsos ou fraudulentos</li>
                                    <li>Coletar dados de outros usuários ou barbearias</li>
                                    <li>Tentar acessar áreas restritas da Plataforma</li>
                                    <li>Interferir no funcionamento da Plataforma</li>
                                    <li>Transmitir vírus, malware ou códigos maliciosos</li>
                                    <li>Violar direitos de terceiros ou qualquer lei aplicável</li>
                                </ul>
                            </div>
                        </section>

                        {/* 5. Responsabilidades */}
                        <section id="responsabilidades" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-purple-600">5.</span>
                                Responsabilidades
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p className="font-semibold text-gray-900">Do Cliente:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Comparecer aos agendamentos confirmados ou cancelar com antecedência</li>
                                    <li>Respeitar as políticas de cancelamento de cada barbearia</li>
                                    <li>Fornecer informações precisas ao agendar</li>
                                    <li>Tratar profissionais e estabelecimentos com respeito</li>
                                </ul>
                                <p className="font-semibold text-gray-900 mt-6">Do BarberFlow:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Manter a Plataforma funcional e disponível (exceto em casos de manutenção)</li>
                                    <li>Proteger seus dados conforme nossa Política de Privacidade</li>
                                    <li>Intermediar a comunicação entre clientes e barbearias</li>
                                </ul>
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
                                    <p className="text-red-800 text-sm">
                                        <strong>Importante:</strong> O BarberFlow NÃO é responsável por:
                                    </p>
                                    <ul className="list-disc pl-6 mt-2 text-sm text-red-700 space-y-1">
                                        <li>Qualidade, segurança ou execução dos serviços prestados pelas barbearias</li>
                                        <li>Conflitos entre clientes e barbearias</li>
                                        <li>Cancelamentos ou alterações feitas pelas barbearias</li>
                                        <li>Danos ou prejuízos decorrentes dos serviços contratados</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 6. Agendamentos */}
                        <section id="agendamentos" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-purple-600">6.</span>
                                Agendamentos
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>
                                    Os agendamentos realizados através da Plataforma estabelecem um compromisso
                                    diretamente entre você e a barbearia selecionada.
                                </p>
                                <p className="font-semibold text-gray-900">Políticas de Agendamento:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Horários estão sujeitos à disponibilidade da barbearia</li>
                                    <li>Confirmações são enviadas por e-mail/SMS quando disponível</li>
                                    <li>Cancelamentos devem ser feitos diretamente na Plataforma ou com a barbearia</li>
                                    <li>Cada barbearia pode ter políticas específicas de cancelamento</li>
                                    <li>Não comparecimento pode resultar em restrições futuras</li>
                                </ul>
                                <p className="text-sm text-gray-600 mt-4">
                                    O BarberFlow facilita o agendamento mas não garante a execução do serviço,
                                    que é de responsabilidade exclusiva da barbearia.
                                </p>
                            </div>
                        </section>

                        {/* 7. Propriedade Intelectual */}
                        <section id="propriedade" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-purple-600">7.</span>
                                Propriedade Intelectual
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>
                                    Todo o conteúdo da Plataforma, incluindo mas não se limitando a design,
                                    código, textos, gráficos, logos, ícones, imagens e software, é propriedade
                                    do BarberFlow ou de seus licenciadores e está protegido por leis de direitos autorais.
                                </p>
                                <p className="font-semibold text-gray-900 mt-4">Você não pode:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Copiar, modificar, distribuir ou reproduzir qualquer conteúdo</li>
                                    <li>Usar o nome, marca ou logo do BarberFlow sem autorização</li>
                                    <li>Fazer engenharia reversa da Plataforma</li>
                                    <li>Criar trabalhos derivados baseados na Plataforma</li>
                                </ul>
                            </div>
                        </section>

                        {/* 8. Limitação de Responsabilidade */}
                        <section id="limitacao" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-purple-600">8.</span>
                                Limitação de Responsabilidade
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>
                                    A Plataforma é fornecida "como está" e "conforme disponível". O BarberFlow
                                    não garante que:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>O serviço será ininterrupto ou livre de erros</li>
                                    <li>Todos os defeitos serão corrigidos</li>
                                    <li>A Plataforma estará livre de vírus ou componentes prejudiciais</li>
                                </ul>
                                <div className="bg-gray-50 border-l-4 border-purple-600 rounded-r-xl p-4 mt-6">
                                    <p className="text-gray-800 font-semibold mb-2">Limitações:</p>
                                    <p className="text-gray-700 text-sm">
                                        Na extensão máxima permitida por lei, o BarberFlow não será responsável por
                                        quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou
                                        punitivos, incluindo lucros cessantes, perda de dados, ou interrupção de negócios
                                        decorrentes do uso ou incapacidade de usar a Plataforma.
                                    </p>
                                </div>
                            </div>
                        </section>

            // ✅ ADICIONAR SEÇÃO NOVA após "Descrição do Serviço":
                        <section id="pagamentos" className="...">
                            <h2>Planos e Pagamentos</h2>
                            <p>O BarberFlow oferece os seguintes planos:</p>
                            <ul>
                                <li><strong>Trial Gratuito:</strong> 15 dias sem cobrança para testar</li>
                                <li><strong>Plano Mensal:</strong> Cobrança mensal recorrente</li>
                                <li><strong>Plano Anual:</strong> Cobrança anual com desconto de 30%</li>
                            </ul>

                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                                <p className="text-red-800 font-semibold mb-2">⚠️ Política de Não Reembolso</p>
                                <p className="text-red-700 text-sm">
                                    NÃO oferecemos reembolsos de valores já pagos. Ao contratar um plano,
                                    você concorda com a cobrança pelo período integral. Você pode cancelar
                                    a qualquer momento, mas não haverá devolução proporcional.
                                </p>
                            </div>

                            <p className="mt-4 text-sm text-gray-600">
                                Os pagamentos são processados de forma segura através do Mercado Pago.
                                Após o término do período trial ou pago, seu plano será automaticamente
                                renovado, a menos que você cancele.
                            </p>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
                                <p className="text-yellow-800 font-semibold mb-2">🔒 Suspensão por Inadimplência</p>
                                <p className="text-yellow-700 text-sm">
                                    Em caso de falha no pagamento, você terá um prazo de 7 dias para regularizar.
                                    Após esse período, sua conta será automaticamente suspensa e você perderá
                                    acesso à plataforma até que o pagamento seja efetuado.
                                </p>
                            </div>
                        </section>

                        {/* 9. Modificações */}
                        <section id="modificacoes" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-purple-600">9.</span>
                                Modificações nos Termos
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>
                                    O BarberFlow reserva-se o direito de modificar estes Termos a qualquer momento.
                                    Quando isso ocorrer:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>A data da "Última atualização" no topo desta página será alterada</li>
                                    <li>Você será notificado por e-mail ou através da Plataforma</li>
                                    <li>O uso contínuo da Plataforma após as modificações constitui aceitação dos novos Termos</li>
                                </ul>
                                <p className="text-sm text-gray-600 mt-4">
                                    Recomendamos revisar periodicamente estes Termos para estar ciente de quaisquer alterações.
                                </p>
                            </div>
                        </section>

                        {/* 10. Lei Aplicável */}
                        <section id="lei" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-purple-600">10.</span>
                                Lei Aplicável
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>
                                    Estes Termos serão regidos e interpretados de acordo com as leis da República
                                    Federativa do Brasil.
                                </p>
                                <p>
                                    Qualquer disputa, controvérsia ou reclamação decorrente ou relacionada a estes
                                    Termos ou ao uso da Plataforma será submetida ao Foro da Comarca de [sua cidade],
                                    com exclusão de qualquer outro, por mais privilegiado que seja.
                                </p>
                            </div>
                        </section>

                        {/* Contato */}
                        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2">Dúvidas ou Preocupações?</h3>
                                    <p className="text-purple-100 mb-4">
                                        Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco:
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <p>📧 E-mail: <a href="mailto:appbarberflow@gmail.com" className="underline hover:text-white">appbarberflow@gmail.com</a></p>
                                        <p>📱 Telefone: (11) 98394-3905</p>
                                        <p>🌐 Website: barberflowoficial.vercel.app</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botão de Aceitar */}
                        <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 rounded-t-2xl p-6 shadow-2xl">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={accepted}
                                        onChange={(e) => setAccepted(e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                        Li e aceito os Termos de Uso
                                    </span>
                                </label>
                                <Link href="/login">
                                    <button
                                        disabled={!accepted}
                                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:scale-100"
                                    >
                                        Aceitar e Voltar
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}