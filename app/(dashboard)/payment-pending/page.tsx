'use client';

import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';

export default function PaymentPendingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-12 h-12 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagamento Pendente</h1>
          <p className="text-gray-600">
            Estamos aguardando a confirmação do seu pagamento.
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            Você receberá um email assim que o pagamento for confirmado.
          </p>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
        >
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}