'use client';

import React, { useState } from 'react';
import { X, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<'email' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://barberflow-api-v2.onrender.com/api/client/auth/forgot-password', {
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

  const handleClose = () => {
    setStep('email');
    setEmail('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-[#2a3441] rounded-2xl max-w-md w-full relative shadow-2xl animate-fadeIn">
        <button 
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white z-10 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {step === 'email' ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="text-blue-500" size={32} />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Recuperar senha</h2>
                <p className="text-gray-400 text-sm">
                  Digite seu email e enviaremos instruções para redefinir sua senha
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full bg-[#374151] border border-gray-600 rounded-lg pl-11 pr-4 py-3.5 text-white placeholder-gray-400 focus:outline-none focus:border-[#2463eb] transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2463eb] hover:bg-[#1d4fd8] disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3.5 rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    'Enviar link de recuperação'
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-gray-400 hover:text-white py-2 text-sm font-medium transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Voltar para o login
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-500" size={32} />
                </div>
                <h2 className="text-2xl font-semibold mb-3">Email enviado!</h2>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Enviamos um link de recuperação para <strong className="text-white">{email}</strong>. 
                  Verifique sua caixa de entrada e spam.
                </p>
                <p className="text-gray-500 text-xs mb-6">
                  O link expira em 1 hora por motivos de segurança.
                </p>
                <button
                  onClick={handleClose}
                  className="w-full bg-[#2463eb] hover:bg-[#1d4fd8] text-white py-3.5 rounded-lg font-semibold transition-all shadow-lg"
                >
                  Entendi
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}