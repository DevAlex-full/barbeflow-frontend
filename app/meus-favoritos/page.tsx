'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeft, MapPin, Star, Trash2 } from 'lucide-react';
import { useClientAuth } from '@/lib/contexts/ClientAuthContext';
import Link from 'next/link';

interface FavoriteBarbershop {
  id: string;
  name: string;
  city: string;
  state: string;
  logo?: string;
  address: string;
  phone: string;
  createdAt: string;
}

export default function FavoritosPage() {
  const router = useRouter();
  const { client, isAuthenticated, loading } = useClientAuth();
  const [favorites, setFavorites] = useState<FavoriteBarbershop[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/sou-cliente');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadFavorites = () => {
    try {
      setLoadingFavorites(true);
      // ✅ Lê do localStorage
      const storedFavorites = JSON.parse(localStorage.getItem('@barberFlow:favorites') || '[]');
      setFavorites(storedFavorites);
      console.log('Favoritos carregados:', storedFavorites.length);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const removeFavorite = (id: string) => {
    try {
      // Remove do localStorage
      const newFavorites = favorites.filter(f => f.id !== id);
      localStorage.setItem('@barberFlow:favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
      console.log('✅ Removido dos favoritos');
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      alert('Erro ao remover favorito');
    }
  };

  if (loading || !client) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Favoritos</h1>
            <p className="text-sm text-gray-400">Suas barbearias salvas</p>
          </div>
          <Heart className="text-red-400 fill-red-400" size={24} />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {loadingFavorites ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : favorites.length > 0 ? (
          <>
            <p className="text-gray-400 text-sm mb-4">
              {favorites.length} {favorites.length === 1 ? 'barbearia favorita' : 'barbearias favoritas'}
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="bg-[#151b23] rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition relative"
                >
                  {/* Botão Remover - Absoluto no topo */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFavorite(favorite.id);
                    }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition shadow-lg"
                    title="Remover dos favoritos"
                  >
                    <Trash2 size={14} className="text-white" />
                  </button>

                  <Link href={`/barbearia/${favorite.id}`}>
                    <div className="relative h-40 bg-gradient-to-br from-gray-800 to-gray-900">
                      {favorite.logo ? (
                        <img
                          src={favorite.logo}
                          alt={favorite.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            src="/Logo2.png"
                            alt="BarberFlow"
                            className="w-24 h-24 object-contain"
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold flex-1 pr-2">{favorite.name}</h3>
                        <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded flex-shrink-0">
                          <Star size={12} className="fill-yellow-500 text-yellow-500" />
                          <span className="text-yellow-500 font-semibold text-xs">5.0</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                        <MapPin size={14} />
                        <span className="truncate">
                          {favorite.city}, {favorite.state}
                        </span>
                      </div>

                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition text-sm">
                        Ver detalhes
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-[#151b23] rounded-xl p-12 text-center max-w-lg mx-auto">
            <Heart size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Nenhum favorito ainda</h3>
            <p className="text-gray-400 mb-6">
              Salve suas barbearias favoritas para acessá-las rapidamente
            </p>
            <button
              onClick={() => router.push('/sou-cliente')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Explorar Barbearias
            </button>
          </div>
        )}
      </div>
    </div>
  );
}