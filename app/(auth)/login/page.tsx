'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/fundo1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay escuro para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Card de Login */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="BarberFlow"
              width={280}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm">
              <p className="font-medium">Erro ao fazer login</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Email */}
            <div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700 placeholder-gray-400"
                placeholder="Usuário ou E-mail"
              />
            </div>

            {/* Campo Senha */}
            <div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700 placeholder-gray-400"
                placeholder="Senha"
              />
            </div>

            {/* Botão Acessar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#003A5D] hover:bg-[#002A4D] text-white py-3.5 rounded-lg font-semibold text-base transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'ACESSANDO...' : 'ACESSAR'}
            </button>
          </form>

          {/* Link Esqueceu a Senha */}
          <div className="mt-6 text-center">
            <Link 
              href="/recuperar-senha" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition"
            >
              Esqueceu a Senha?
            </Link>
          </div>

          {/* Divisor */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">ou</span>
            </div>
          </div>

          {/* Link para Cadastro */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-3">
              Ainda não tem uma conta?
            </p>
            <Link href="/register">
              <button
                type="button"
                className="w-full bg-white border-2 border-[#003A5D] text-[#003A5D] py-3.5 rounded-lg font-semibold text-base hover:bg-gray-50 transition duration-200 shadow-lg"
              >
                CRIAR CONTA
              </button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white text-xs drop-shadow-lg">
            © 2025 BarberFlow. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* reCAPTCHA Badge (simulado) */}
      <div className="fixed bottom-4 right-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs text-gray-600">
          <p className="font-medium">Protegido por reCAPTCHA</p>
          <p className="text-[10px]">Privacidade • Termos</p>
        </div>
      </div>
    </div>
  );
}