'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ComissoesPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comissões</h1>
          <p className="text-gray-600 mt-1">Gestão de comissões dos barbeiros</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-6xl mb-4">💰</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Página em Desenvolvimento</h2>
        <p className="text-gray-600">A gestão de comissões será implementada em breve.</p>
      </div>
    </div>
  );
}