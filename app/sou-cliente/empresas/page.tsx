'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Star, Clock } from 'lucide-react';

interface Barbershop {
  id: string;
  name: string;
  logo: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  phone: string;
  plan: string | null;
  active: boolean;
}

export default function EmpresasPage() {
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBarbershops();
  }, []);

  const fetchBarbershops = async () => {
    try {
      const response = await fetch('https://barberflow-back-end.onrender.com/api/public/barbershops');
      const data = await response.json();
      setBarbershops(data);
    } catch (error) {
      console.error('Erro ao carregar barbearias:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBarbershops = barbershops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlanBadge = (plan: string | null) => {
    const planLower = plan?.toLowerCase() || 'free';
    
    if (planLower === 'premium') {
      return 'bg-yellow-500 text-black';
    } else if (planLower === 'basic') {
      return 'bg-blue-500 text-white';
    } else {
      return 'bg-gray-600 text-white';
    }
  };

  const getPlanLabel = (plan: string | null) => {
    return plan ? plan.toUpperCase() : 'FREE';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">Carregando barbearias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1f2e] to-[#2a2f3e] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Empresas Próximas</h1>
              <p className="text-gray-400 mt-1">Encontre a barbearia perfeita para você</p>
            </div>
            <Link href="/sou-cliente">
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                Voltar
              </button>
            </Link>
          </div>

          {/* Busca */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nome ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-[#1a1f2e] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Lista de Barbearias */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredBarbershops.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">Nenhuma barbearia encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBarbershops.map((shop) => (
              <Link
                key={shop.id}
                href={`/barbearia/${shop.id}`}
                className="group"
              >
                <div className="bg-[#1a1f2e] rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1">
                  {/* Logo/Banner */}
                  <div className="relative h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                    {shop.logo ? (
                      <Image
                        src={shop.logo}
                        alt={shop.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-6xl">✂️</div>
                    )}
                    
                    {/* Badge do Plano */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPlanBadge(shop.plan)}`}>
                        {getPlanLabel(shop.plan)}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-5">
                    {/* Nome e Avaliação */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition line-clamp-1">
                        {shop.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-lg ml-2 flex-shrink-0">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-yellow-500 font-bold text-sm">5.0</span>
                      </div>
                    </div>

                    {/* Endereço */}
                    {(shop.city || shop.address) && (
                      <div className="flex items-start gap-2 text-gray-400 text-sm mb-3">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">
                          {shop.address || `${shop.city}, ${shop.state}`}
                        </span>
                      </div>
                    )}

                    {/* Telefone */}
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                      <Phone className="w-4 h-4" />
                      <span>{shop.phone}</span>
                    </div>

                    {/* Distância (simulada) */}
                    <div className="flex items-center gap-2 text-blue-400 text-sm mb-4">
                      <Clock className="w-4 h-4" />
                      <span>450m de distância</span>
                    </div>

                    {/* Botão */}
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-500/50">
                      Ver detalhes e agendar
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}