'use client';

import { useRouter } from 'next/navigation';
import { User, Mail, Phone, ExternalLink } from 'lucide-react';

interface ConfiguracoesContaProps {
  initialData: {
    name: string;
    email: string;
    phone: string;
  };
  onSave?: (data: any) => Promise<void>; // mantido para não quebrar a interface
}

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '');
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return raw;
}

export function ConfiguracoesConta({ initialData }: ConfiguracoesContaProps) {
  const router = useRouter();

  const phone = initialData.phone && !initialData.phone.includes('@')
    ? formatPhone(initialData.phone)
    : '';

  return (
    <div className="bg-[#151b23] rounded-2xl border border-gray-800 overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 bg-white/20 rounded-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Informações Pessoais</h3>
            <p className="text-sm text-purple-100 mt-1">
              Seus dados cadastrais
            </p>
          </div>
        </div>
      </div>

      {/* Dados */}
      <div className="p-6 space-y-5">

        {/* Nome */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-2">
            Nome Completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              value={initialData.name || ''}
              disabled
              className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-gray-400 text-sm disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-2">
            E-mail
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="email"
              value={initialData.email || ''}
              disabled
              className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-gray-400 text-sm disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-2">
            Telefone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="tel"
              value={phone || 'Não cadastrado'}
              disabled
              className="w-full bg-[#1f2937] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-gray-400 text-sm disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Botão ir para perfil */}
        <button
          onClick={() => router.push('/meu-perfil')}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition"
        >
          <ExternalLink size={16} />
          Editar no Meu Perfil
        </button>

        <p className="text-xs text-gray-600 text-center">
          Nome, e-mail e telefone são editados na página Meu Perfil.
        </p>

      </div>
    </div>
  );
}