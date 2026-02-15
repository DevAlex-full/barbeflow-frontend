'use client';

import Link from 'next/link';
import { MapPin, Star, Heart, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BarbershopCardProps {
  barbershop: {
    id: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    logo?: string;
    plan?: string | null;
    distance?: number;
  };
  locationEnabled?: boolean;
}

export default function BarbershopCard({ barbershop, locationEnabled }: BarbershopCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // ✅ Carrega o estado inicial dos favoritos
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('@barberFlow:favorites') || '[]');
    const isFav = favorites.some((fav: any) => fav.id === barbershop.id);
    setIsFavorite(isFav);
  }, [barbershop.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Pega favoritos atuais do localStorage
    const favorites = JSON.parse(localStorage.getItem('@barberFlow:favorites') || '[]');
    
    if (isFavorite) {
      // Remove dos favoritos
      const newFavorites = favorites.filter((fav: any) => fav.id !== barbershop.id);
      localStorage.setItem('@barberFlow:favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      console.log('Removido dos favoritos:', barbershop.name);
    } else {
      // Adiciona aos favoritos
      const newFavorite = {
        id: barbershop.id,
        name: barbershop.name,
        address: barbershop.address,
        city: barbershop.city,
        state: barbershop.state,
        logo: barbershop.logo,
        phone: barbershop.phone,
        createdAt: new Date().toISOString()
      };
      favorites.push(newFavorite);
      localStorage.setItem('@barberFlow:favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      console.log('Adicionado aos favoritos:', barbershop.name);
    }
  };

  // Trunca o endereço para exibir com reticências
  const truncateAddress = (address: string, maxLength: number = 35) => {
    if (address.length <= maxLength) return address;
    return address.substring(0, maxLength) + '...';
  };

  return (
    <Link
      href={`/barbearia/${barbershop.id}`}
      className="block group"
    >
      <div className="bg-[#0d1117] rounded-xl p-3 hover:bg-[#161b22] transition-all cursor-pointer border border-gray-800/50 hover:border-gray-700 relative">
        <div className="flex items-center gap-3">
          {/* Logo Circular - MAIOR */}
          <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-white">
            {barbershop.logo ? (
              <img
                src={barbershop.logo}
                alt={barbershop.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="/Logo2.png"
                alt="BarberFlow"
                className="w-full h-full object-contain p-2"
              />
            )}
          </div>

          {/* Info Central */}
          <div className="flex-1 min-w-0">
            {/* Rating no topo à direita */}
            <div className="flex items-start justify-between mb-1">
              <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition pr-2">
                {barbershop.name}
              </h3>
              <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded flex-shrink-0">
                <Star size={11} className="fill-yellow-500 text-yellow-500" />
                <span className="text-yellow-500 font-bold text-[11px]">5.0</span>
              </div>
            </div>

            {/* Endereço completo */}
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
              <span className="truncate">
                {truncateAddress(barbershop.address || `${barbershop.city}, ${barbershop.state}` || 'Endereço não informado')}
              </span>
            </div>

            {/* Distância - SEMPRE VISÍVEL quando locationEnabled */}
            {locationEnabled && barbershop.distance !== undefined && (
              <div className="flex items-center gap-1 text-red-400 text-xs font-medium">
                <MapPin size={12} className="fill-red-400" />
                <span>{Math.round(barbershop.distance * 1000)}m</span>
              </div>
            )}
          </div>

          {/* Coluna direita: Favoritar + Seta */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            {/* Botão de Favoritar */}
            <button
              onClick={handleFavoriteClick}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                isFavorite 
                  ? 'bg-red-500/20 hover:bg-red-500/30' 
                  : 'bg-gray-800/30 hover:bg-gray-700/50'
              }`}
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart 
                size={14} 
                className={`transition-all ${
                  isFavorite 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-500'
                }`}
              />
            </button>

            {/* Seta Verde */}
            <div className="w-7 h-7 rounded-full bg-green-600/20 flex items-center justify-center">
              <ChevronRight size={16} className="text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}