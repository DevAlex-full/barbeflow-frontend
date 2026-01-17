'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function RecuperarSenhaForm() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://barberflow-api-v2.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar email de recuperação');
      }

      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Erro ao processar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/Logo.png"
              alt="BarberFlow"
              width={280}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </div>

          {step === 'email' ? (
            <>
              {/* Título */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-blue-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Recuperar Senha</h2>
                <p className="text-gray-600 text-sm">
                  Digite seu email cadastrado para receber o link de recuperação
                </p>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700 placeholder-gray-400"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">
                    <p className="font-medium">Erro</p>
                    <p className="text-xs mt-1">{error}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#003A5D] hover:bg-[#002A4D] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3.5 rounded-lg font-semibold transition shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    'Enviar Link de Recuperação'
                  )}
                </button>

                <Link href="/login">
                  <button
                    type="button"
                    className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm font-medium transition flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    Voltar para o login
                  </button>
                </Link>
              </form>
            </>
          ) : (
            <>
              {/* Sucesso */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Email Enviado!</h2>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  Enviamos um link de recuperação para <strong className="text-gray-900">{email}</strong>. 
                  Verifique sua caixa de entrada e spam.
                </p>
                <p className="text-gray-500 text-xs mb-6">
                  O link expira em 1 hora por motivos de segurança.
                </p>
                <Link href="/login">
                  <button
                    className="w-full bg-[#003A5D] hover:bg-[#002A4D] text-white py-3.5 rounded-lg font-semibold transition shadow-lg"
                  >
                    Voltar para o Login
                  </button>
                </Link>
              </div>
            </>
          )}
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