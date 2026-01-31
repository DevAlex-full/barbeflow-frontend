'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Shield, Lock, Eye, Database, Cookie, Globe } from 'lucide-react';

export default function PrivacidadeClientePage() {
    const [accepted, setAccepted] = useState(false);

    const sections = [
        { id: 'intro', title: '1. Introdução' },
        { id: 'coleta', title: '2. Dados Coletados' },
        { id: 'uso', title: '3. Como Usamos' },
        { id: 'cookies', title: '4. Cookies' },
        { id: 'compartilhamento', title: '5. Compartilhamento' },
        { id: 'armazenamento', title: '6. Armazenamento' },
        { id: 'direitos', title: '7. Seus Direitos (LGPD)' },
        { id: 'seguranca', title: '8. Segurança' },
        { id: 'alteracoes', title: '9. Alterações' },
        { id: 'contato', title: '10. Contato' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/login">
                            <button className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition group">
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-medium">Voltar</span>
                            </button>
                        </Link>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <span className="font-bold text-gray-900">BarberFlow</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-600 to-green-600 rounded-2xl mb-6 shadow-lg">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Política de Privacidade
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
                                        className="block text-sm text-gray-600 hover:text-teal-600 hover:translate-x-1 transition-all"
                                    >
                                        {section.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Conteúdo */}
                    <main className="lg:col-span-3 space-y-8">
                        {/* Banner LGPD */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 text-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Seus dados estão protegidos!</h3>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        Esta Política de Privacidade está em conformidade com a Lei Geral de Proteção
                                        de Dados (LGPD - Lei 13.709/2018) e descreve como coletamos, usamos,
                                        armazenamos e protegemos suas informações pessoais.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 1. Introdução */}
                        <section id="intro" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-blue-600">1.</span>
                                Introdução
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>
                                    O BarberFlow ("nós", "nosso") respeita sua privacidade e está comprometido em
                                    proteger seus dados pessoais. Esta Política explica:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Quais dados coletamos sobre você</li>
                                    <li>Como usamos esses dados</li>
                                    <li>Com quem compartilhamos</li>
                                    <li>Como protegemos suas informações</li>
                                    <li>Quais são seus direitos sob a LGPD</li>
                                </ul>
                                <p className="text-sm text-gray-600 mt-4">
                                    Ao usar nossa Plataforma, você concorda com as práticas descritas nesta Política.
                                </p>
                            </div>
                        </section>

                        {/* 2. Dados Coletados */}
                        <section id="coleta" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-blue-600">2.</span>
                                Dados Coletados
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p className="font-semibold text-gray-900">Dados Fornecidos por Você:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-blue-900 mb-2">Cadastro</h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            <li>• Nome completo</li>
                                            <li>• Endereço de e-mail</li>
                                            <li>• Número de telefone</li>
                                            <li>• Senha (criptografada)</li>
                                        </ul>
                                    </div>
                                    <div className="bg-purple-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-purple-900 mb-2">Agendamentos</h4>
                                        <ul className="text-sm text-purple-800 space-y-1">
                                            <li>• Serviços escolhidos</li>
                                            <li>• Data e horário</li>
                                            <li>• Barbearia selecionada</li>
                                            <li>• Observações</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* ✅ SEÇÃO NOVA - DADOS ADICIONAIS DE BARBEIROS */}
                                <div className="bg-teal-50 rounded-xl p-4 mt-4">
                                    <h4 className="font-semibold text-teal-900 mb-2">Dados Adicionais de Barbeiros:</h4>
                                    <ul className="text-sm text-teal-800 space-y-1">
                                        <li>• CNPJ da barbearia (quando aplicável)</li>
                                        <li>• Nome da barbearia/estabelecimento</li>
                                        <li>• Endereço completo do estabelecimento</li>
                                        <li>• Logotipo e imagens da barbearia</li>
                                        <li>• Dados dos profissionais (barbeiros) cadastrados</li>
                                        <li>• Informações de plano e pagamento</li>
                                        <li>• Histórico de transações (para fins fiscais)</li>
                                    </ul>
                                </div>

                                <p className="font-semibold text-gray-900 mt-6">Dados Coletados Automaticamente:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Endereço IP</strong> e informações do dispositivo</li>
                                    <li><strong>Navegador</strong> e sistema operacional</li>
                                    <li><strong>Páginas visitadas</strong> e tempo de navegação</li>
                                    <li><strong>Cookies</strong> e tecnologias similares</li>
                                    <li><strong>Localização aproximada</strong> (via IP)</li>
                                </ul>
                            </div>
                        </section>

                        {/* 3. Como Usamos */}
                        <section id="uso" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-blue-600">3.</span>
                                Como Usamos Seus Dados
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>Utilizamos seus dados para:</p>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Fornecer o Serviço</p>
                                            <p className="text-sm text-gray-600">Processar agendamentos, gerenciar sua conta e facilitar comunicação com barbearias</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Eye className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Melhorar a Experiência</p>
                                            <p className="text-sm text-gray-600">Personalizar conteúdo, analisar uso da Plataforma e desenvolver novos recursos</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Database className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Comunicação</p>
                                            <p className="text-sm text-gray-600">Enviar confirmações, lembretes, atualizações e suporte ao cliente</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Shield className="w-5 h-5 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Segurança</p>
                                            <p className="text-sm text-gray-600">Prevenir fraudes, proteger contra acessos não autorizados e cumprir obrigações legais</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. Cookies */}
                        <section id="cookies" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-blue-600">4.</span>
                                Cookies e Tecnologias Similares
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Cookie className="w-5 h-5 text-orange-600" />
                                        <p className="font-semibold text-orange-900">O que são Cookies?</p>
                                    </div>
                                    <p className="text-sm text-orange-800">
                                        Cookies são pequenos arquivos de texto armazenados no seu dispositivo que
                                        ajudam a melhorar sua experiência na Plataforma.
                                    </p>
                                </div>

                                <p className="font-semibold text-gray-900 mt-6">Cookies que Utilizamos:</p>
                                <div className="space-y-3">
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <p className="font-semibold text-gray-900">Cookies Essenciais</p>
                                        <p className="text-sm text-gray-600">Necessários para o funcionamento básico (login, navegação)</p>
                                    </div>
                                    <div className="border-l-4 border-green-500 pl-4">
                                        <p className="font-semibold text-gray-900">Cookies de Desempenho</p>
                                        <p className="text-sm text-gray-600">Google Analytics - para entender como você usa a Plataforma</p>
                                    </div>
                                    <div className="border-l-4 border-purple-500 pl-4">
                                        <p className="font-semibold text-gray-900">Cookies de Marketing</p>
                                        <p className="text-sm text-gray-600">Facebook Pixel - para exibir anúncios relevantes</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mt-4">
                                    Você pode gerenciar preferências de cookies nas configurações do seu navegador.
                                    Note que desabilitar cookies pode afetar a funcionalidade da Plataforma.
                                </p>
                            </div>
                        </section>

                        {/* 5. Compartilhamento */}
                        <section id="compartilhamento" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-blue-600">5.</span>
                                Compartilhamento de Dados
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>Compartilhamos seus dados apenas quando necessário:</p>
                                <div className="space-y-4 mt-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-900 mb-2">🏪 Com Barbearias</p>
                                        <p className="text-sm text-gray-600">
                                            Informações necessárias para processar seus agendamentos (nome, telefone,
                                            serviço solicitado)
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-900 mb-2">💳 Processadores de Pagamento</p>
                                        <p className="text-sm text-gray-600">
                                            Mercado Pago - quando você realizar pagamentos através da Plataforma
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-900 mb-2">📊 Ferramentas de Análise</p>
                                        <p className="text-sm text-gray-600">
                                            Google Analytics e Facebook - dados anonimizados para análise de uso
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="font-semibold text-gray-900 mb-2">⚖️ Autoridades Legais</p>
                                        <p className="text-sm text-gray-600">
                                            Quando exigido por lei ou para proteger nossos direitos
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                                    <p className="text-red-800 text-sm font-medium">
                                        <strong>Importante:</strong> Nunca vendemos seus dados pessoais para terceiros.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 6. Armazenamento */}
                        <section id="armazenamento" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-blue-600">6.</span>
                                Armazenamento e Retenção
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <div className="flex items-start gap-3 bg-blue-50 rounded-xl p-4">
                                    <Globe className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-blue-900 mb-2">Onde Armazenamos</p>
                                        <p className="text-sm text-blue-800">
                                            Seus dados são armazenados em servidores seguros da Render, que podem estar
                                            localizados nos Estados Unidos ou Europa. Utilizamos criptografia e medidas
                                            de segurança adequadas para proteger suas informações.
                                        </p>
                                    </div>
                                </div>

                                <p className="font-semibold text-gray-900 mt-6">Por Quanto Tempo Mantemos:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Dados de cadastro:</strong> Enquanto sua conta estiver ativa</li>
                                    <li><strong>Histórico de agendamentos:</strong> Por até 5 anos (fins fiscais/legais)</li>
                                    <li><strong>Dados de marketing:</strong> Até você solicitar exclusão</li>
                                    <li><strong>Logs de segurança:</strong> Por até 6 meses</li>
                                    <p><strong>Dados de cadastro:</strong> Enquanto sua conta estiver ativa</p>
                                    <p><strong>Dados de clientes:</strong> Conforme SUA política de retenção</p>  ← ADICIONAR
                                    <p><strong>Dados fiscais:</strong> Por até 5 anos (obrigação legal)</p>
                                    <p><strong>Histórico de pagamentos:</strong> Por até 5 anos</p>  ← ADICIONAR
                                </ul>

                                <p className="text-sm text-gray-600 mt-4">
                                    Após esses períodos ou mediante sua solicitação de exclusão, seus dados serão
                                    permanentemente removidos ou anonimizados.
                                </p>
                            </div>
                        </section>

                        {/* ✅ SEÇÃO SUB-PROCESSAMENTO - NOVA */}
                        <section id="subprocessamento" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-teal-600">7.5</span>
                                Você como Controlador de Dados
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>
                                    Ao usar o BarberFlow, você é o <strong>Controlador</strong> dos dados
                                    pessoais dos seus clientes. O BarberFlow atua como <strong>Operador</strong>.
                                </p>

                                <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-xl p-6 text-white mt-6">
                                    <p className="font-semibold mb-3">📋 O que isso significa?</p>
                                    <ul className="text-sm space-y-2 text-teal-50">
                                        <li>• Você define COMO e POR QUÊ os dados são coletados</li>
                                        <li>• Você é responsável por obter consentimento dos seus clientes</li>
                                        <li>• Você deve ter sua própria política de privacidade</li>
                                        <li>• Você responde por solicitações LGPD dos seus clientes</li>
                                        <li>• O BarberFlow apenas PROCESSA os dados conforme você instrui</li>
                                    </ul>
                                </div>

                                <p className="mt-4 font-semibold text-gray-900">
                                    Sub-processadores que Utilizamos:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 mt-2">
                                    <li><strong>Mercado Pago:</strong> Processamento de pagamentos</li>
                                    <li><strong>Render:</strong> Hospedagem e armazenamento de dados</li>
                                    <li><strong>Google Analytics:</strong> Análise de uso (dados anonimizados)</li>
                                </ul>

                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
                                    <p className="text-red-800 font-semibold mb-2">⚠️ Sua Responsabilidade</p>
                                    <p className="text-red-700 text-sm">
                                        Você é legalmente responsável por cumprir a LGPD em relação aos dados
                                        dos seus clientes. O BarberFlow fornece as ferramentas e segurança
                                        necessárias, mas o uso correto e ético dos dados é de sua responsabilidade.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 7. Direitos LGPD */}
                        <section id="direitos" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-blue-600">7.</span>
                                Seus Direitos sob a LGPD
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>De acordo com a LGPD, você tem direito a:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <p className="font-semibold text-green-900 mb-1">✅ Confirmação</p>
                                        <p className="text-sm text-green-800">Saber se processamos seus dados</p>
                                    </div>
                                    <div className="bg-blue-50 border border-teal-200 rounded-xl p-4">
                                        <p className="font-semibold text-blue-900 mb-1">📄 Acesso</p>
                                        <p className="text-sm text-blue-800">Obter cópia dos seus dados</p>
                                    </div>
                                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                        <p className="font-semibold text-purple-900 mb-1">✏️ Correção</p>
                                        <p className="text-sm text-purple-800">Corrigir dados incompletos ou incorretos</p>
                                    </div>
                                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                        <p className="font-semibold text-orange-900 mb-1">🚫 Oposição</p>
                                        <p className="text-sm text-orange-800">Opor-se ao processamento</p>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <p className="font-semibold text-red-900 mb-1">🗑️ Exclusão</p>
                                        <p className="text-sm text-red-800">Solicitar exclusão dos dados</p>
                                    </div>
                                    <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                                        <p className="font-semibold text-cyan-900 mb-1">📦 Portabilidade</p>
                                        <p className="text-sm text-cyan-800">Receber dados em formato estruturado</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white mt-6">
                                    <p className="font-semibold mb-2">💡 Como Exercer Seus Direitos</p>
                                    <p className="text-sm text-blue-100">
                                        Entre em contato conosco através de appbarberflow@gmail.com.
                                        Responderemos sua solicitação em até 15 dias.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 8. Segurança */}
                        <section id="seguranca" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-blue-600">8.</span>
                                Segurança dos Dados
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>
                                    Implementamos medidas técnicas e organizacionais adequadas para proteger
                                    seus dados contra acesso não autorizado, perda, destruição ou alteração:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>🔒 <strong>Criptografia SSL/TLS</strong> para transmissão de dados</li>
                                    <li>🔐 <strong>Senhas criptografadas</strong> com algoritmos seguros (bcrypt)</li>
                                    <li>🛡️ <strong>Firewalls e monitoramento</strong> de segurança 24/7</li>
                                    <li>🔑 <strong>Controle de acesso restrito</strong> aos dados</li>
                                    <li>📋 <strong>Backups regulares</strong> e plano de recuperação de desastres</li>
                                    <li>🎯 <strong>Testes de segurança</strong> periódicos</li>
                                </ul>
                                <p className="text-sm text-gray-600 mt-4">
                                    Apesar de nossos esforços, nenhum método de transmissão ou armazenamento é 100%
                                    seguro. Mantenha suas credenciais em sigilo e nos notifique imediatamente sobre
                                    qualquer uso não autorizado.
                                </p>
                            </div>
                        </section>

                        {/* 9. Alterações */}
                        <section id="alteracoes" className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 scroll-mt-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                <span className="text-blue-600">9.</span>
                                Alterações nesta Política
                            </h2>
                            <div className="prose prose-gray max-w-none text-gray-700 space-y-4">
                                <p>
                                    Podemos atualizar esta Política periodicamente para refletir mudanças em
                                    nossas práticas ou por razões legais/operacionais.
                                </p>
                                <p>Quando fizermos alterações significativas:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Atualizaremos a data da "Última atualização" no topo</li>
                                    <li>Você será notificado por e-mail</li>
                                    <li>Poderemos exibir um aviso na Plataforma</li>
                                </ul>
                                <p className="text-sm text-gray-600 mt-4">
                                    Recomendamos revisar esta Política regularmente para estar informado sobre
                                    como protegemos suas informações.
                                </p>
                            </div>
                        </section>

                        {/* 10. Contato */}
                        <section id="contato" className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-2">Dúvidas sobre Privacidade?</h3>
                                    <p className="text-blue-100 mb-4">
                                        Se você tiver dúvidas sobre esta Política de Privacidade ou quiser exercer
                                        seus direitos sob a LGPD, entre em contato:
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <p>📧 E-mail: <a href="mailto:appbarberflow@gmail.com" className="underline hover:text-white">appbarberflow@gmail.com</a></p>
                                        <p>📱 Telefone: (11) 98394-3905</p>
                                        <p>🌐 Website: barberflowoficial.vercel.app</p>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/20">
                                        <p className="text-xs text-blue-100">
                                            <strong>Encarregado de Dados (DPO):</strong> appbarberflow@gmail.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Botão de Aceitar */}
                        <div className="sticky bottom-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 rounded-t-2xl p-6 shadow-2xl">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={accepted}
                                        onChange={(e) => setAccepted(e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                                        Li e aceito a Política de Privacidade
                                    </span>
                                </label>
                                <Link href="/login">
                                    <button
                                        disabled={!accepted}
                                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:scale-100"
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