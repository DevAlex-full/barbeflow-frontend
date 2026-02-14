// lib/hooks/useTheme.ts
'use client';

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'auto';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // ✅ Função ULTRA-SIMPLIFICADA para aplicar tema
  const applyTheme = (newTheme: Theme) => {
    if (typeof window === 'undefined') return;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎨 applyTheme() chamada!');
    console.log('   Tema recebido:', newTheme);
    
    const html = document.documentElement;
    console.log('   HTML antes:', html.className);
    
    // 🔥 SEMPRE remove dark PRIMEIRO
    html.classList.remove('dark');
    console.log('   ✅ Removeu dark');
    
    // Aplica dark se necessário
    if (newTheme === 'dark') {
      html.classList.add('dark');
      console.log('   ✅ Adicionou dark');
    } else if (newTheme === 'auto') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      console.log('   Sistema prefere dark?', systemPrefersDark);
      if (systemPrefersDark) {
        html.classList.add('dark');
        console.log('   ✅ Adicionou dark (auto)');
      }
    }
    
    console.log('   HTML depois:', html.className);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  };

  // ✅ useEffect que roda AO MONTAR
  useEffect(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 useTheme MONTADO!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Pegar tema do localStorage (padrão = light)
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'light';
    console.log('💾 Tema do localStorage:', savedTheme);
    
    // Atualizar estado
    setThemeState(savedTheme);
    console.log('✅ Estado atualizado para:', savedTheme);
    
    // 🔥 APLICAR TEMA IMEDIATAMENTE
    console.log('🔥 Aplicando tema...');
    applyTheme(savedTheme);
    
    // Marcar como montado
    setMounted(true);
    console.log('✅ useTheme pronto!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, []);

  // ✅ Função para MUDAR tema
  const setTheme = (newTheme: Theme) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔄 MUDANDO TEMA!');
    console.log('   Novo tema:', newTheme);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    console.log('💾 Salvo no localStorage');
    
    applyTheme(newTheme);
    console.log('✅ Tema aplicado!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  };

  return {
    theme,
    setTheme,
    mounted,
  };
}