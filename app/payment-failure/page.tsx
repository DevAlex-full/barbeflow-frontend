'use client';

import Link from 'next/link';

export default function PaymentFailure() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pagamento não Aprovado
        </h2>
        <p className="text-gray-600 mb-6">
          Não foi possível processar seu pagamento. Por favor, tente novamente.
        </p>
        <Link href="/planos">
          <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition">
            Tentar Novamente
          </button>
        </Link>
      </div>
    </div>
  );
}