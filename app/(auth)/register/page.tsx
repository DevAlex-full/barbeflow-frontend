'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    barbershopName: '',
    barbershopPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(formData);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 py-12 relative"
      style={{
        backgroundImage: 'url(/fundo2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay escuro para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Card de Registro */}
      <div className="relative z-10 w-full max-w-3xl">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/Logo.png"
              alt="BarberFlow"
              width={250}
              height={70}
              className="h-16 w-auto"
              priority
            />
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Criar Conta</h1>
            <p className="text-gray-600">Cadastre sua barbearia e comece agora</p>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm">
              <p className="font-medium">Erro ao criar conta</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados Pessoais */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-purple-600">
                Seus Dados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-700"
                    placeholder="João Silva"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-700"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Senha *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-700"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-700"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </div>

            {/* Dados da Barbearia */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-purple-600">
                Dados da Barbearia
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="barbershopName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Barbearia *
                  </label>
                  <input
                    id="barbershopName"
                    name="barbershopName"
                    type="text"
                    value={formData.barbershopName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-700"
                    placeholder="Barbearia Exemplo"
                  />
                </div>

                <div>
                  <label htmlFor="barbershopPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone da Barbearia *
                  </label>
                  <input
                    id="barbershopPhone"
                    name="barbershopPhone"
                    type="tel"
                    value={formData.barbershopPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-gray-700"
                    placeholder="(11) 3333-3333"
                  />
                </div>
              </div>
            </div>

            {/* Termos */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 text-center">
                Ao criar sua conta, você concorda com nossos{' '}
                <Link href="/termos" className="text-purple-600 hover:text-purple-700 font-semibold underline">
                  Termos de Uso
                </Link>
                {' '}e{' '}
                <Link href="/privacidade" className="text-purple-600 hover:text-purple-700 font-semibold underline">
                  Política de Privacidade
                </Link>
              </p>
            </div>

            {/* Botão Criar Conta */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white py-3.5 rounded-lg font-semibold text-base transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'CRIANDO CONTA...' : 'CRIAR CONTA GRÁTIS'}
            </button>

            {/* Badge Teste Grátis */}
            <div className="text-center">
              <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full">
                🎉 30 dias de teste grátis
              </span>
            </div>
          </form>

          {/* Link para Login */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                Fazer Login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white text-xs drop-shadow-lg">
            © 2025 BarberFlow. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}