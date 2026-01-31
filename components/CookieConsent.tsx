'use client';

import { useState, useEffect } from 'react';
import { Cookie, X, Settings } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Sempre true
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Verificar se já aceitou
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Mostrar após 1 segundo
      setTimeout(() => setShow(true), 1000);
    } else {
      // Carregar preferências salvas
      try {
        const saved = JSON.parse(consent);
        setPreferences(saved);
        applyPreferences(saved);
      } catch (e) {
        console.error('Erro ao carregar preferências:', e);
      }
    }
  }, []);

  const applyPreferences = (prefs: typeof preferences) => {
    // Aplicar Google Analytics
    if (prefs.analytics && typeof window !== 'undefined') {
      // @ts-ignore
      window.gtag?.('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }

    // Aplicar Facebook Pixel
    if (prefs.marketing && typeof window !== 'undefined') {
      // @ts-ignore
      window.fbq?.('consent', 'grant');
    }
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    applyPreferences(allAccepted);
    setShow(false);
  };

  const acceptSelected = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    applyPreferences(preferences);
    setShow(false);
  };

  const rejectOptional = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {!showSettings ? (
          // Banner Principal
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  🍪 Nós usamos cookies
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Usamos cookies essenciais para o funcionamento do site e cookies opcionais 
                  para análise e marketing. Você pode escolher quais aceitar.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-600">
                Ao clicar em "Aceitar Todos", você concorda com o armazenamento de cookies 
                no seu dispositivo conforme nossa{' '}
                <Link href="/privacidade-cliente" className="text-purple-600 hover:underline font-medium">
                  Política de Privacidade
                </Link>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptAll}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
              >
                Aceitar Todos
              </button>
              <button
                onClick={rejectOptional}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all"
              >
                Apenas Essenciais
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="px-6 py-3 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Configurar
              </button>
            </div>
          </div>
        ) : (
          // Configurações Detalhadas
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Preferências de Cookies
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Cookies Essenciais */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">Cookies Essenciais</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Necessários para o funcionamento do site (login, navegação)
                    </p>
                  </div>
                  <div className="text-green-600 font-semibold text-sm">
                    Sempre Ativo
                  </div>
                </div>
              </div>

              {/* Cookies de Análise */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Cookies de Análise</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Google Analytics - Nos ajuda a entender como você usa o site
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              {/* Cookies de Marketing */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Cookies de Marketing</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Facebook Pixel - Para exibir anúncios relevantes
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptSelected}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all"
              >
                Salvar Preferências
              </button>
              <button
                onClick={rejectOptional}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold transition-all"
              >
                Rejeitar Opcionais
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}