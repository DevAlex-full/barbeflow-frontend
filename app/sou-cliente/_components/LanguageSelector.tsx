'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

type Language = 'pt-BR' | 'en' | 'es';

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
  nativeName: string;
}

const languages: LanguageOption[] = [
  { code: 'pt-BR', name: 'Português', flag: '🇧🇷', nativeName: 'Português (Brasil)' },
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English (US)' },
  { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' }
];

export default function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('pt-BR');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Carregar idioma salvo
  useEffect(() => {
    const saved = sessionStorage.getItem('@barberFlow:language') as Language;
    if (saved && ['pt-BR', 'en', 'es'].includes(saved)) {
      setCurrentLanguage(saved);
    }
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setCurrentLanguage(lang);
    sessionStorage.setItem('@barberFlow:language', lang);
    setIsOpen(false);
    
    // Recarregar a página para aplicar tradução em toda aplicação
    window.location.reload();
  };

  const current = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition text-sm border border-gray-700 bg-gray-900"
        aria-label="Selecionar idioma"
      >
        <span className="text-2xl leading-none">{current.flag}</span>
        <span className="font-medium hidden sm:inline">{current.name.split(' ')[0]}</span>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#1f2937] border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden animate-fadeIn">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-800 transition ${
                  currentLanguage === lang.code ? 'bg-gray-800/50' : ''
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-white text-sm">{lang.nativeName}</span>
                  <span className="text-xs text-gray-400">{lang.name}</span>
                </div>
                {currentLanguage === lang.code && (
                  <svg 
                    className="ml-auto w-5 h-5 text-blue-500" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}