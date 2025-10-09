'use client';

import Link from 'next/link';

export default function PaymentPending() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pagamento Pendente
        </h2>
        <p className="text-gray-600 mb-6">
          Seu pagamento está sendo processado. Você receberá uma confirmação em breve.
        </p>
        <Link href="/dashboard">
          <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition">
            Voltar ao Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}