'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const period = searchParams.get('period');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Pagamento Confirmado!
        </h2>
        <p className="text-gray-600 mb-6">
          Sua assinatura foi ativada com sucesso. Você já pode aproveitar todos os recursos do seu plano.
        </p>
        {plan && (
          <div className="bg-purple-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-1">Plano contratado:</p>
            <p className="font-bold text-lg text-purple-600 capitalize">
              {plan} - {period === 'monthly' ? 'Mensal' : period === 'semiannual' ? 'Semestral' : 'Anual'}
            </p>
          </div>
        )}
        <Link href="/dashboard">
          <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition mb-3">
            Ir para o Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}