// lib/hooks/useTutorial.ts
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';

interface TutorialState {
  run: boolean;
  stepIndex: number;
  completed: boolean;
  skipped: boolean;
}

export function useTutorial() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const [tutorialState, setTutorialState] = useState<TutorialState>({
    run: false,
    stepIndex: 0,
    completed: false,
    skipped: false
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔄 CARREGAR ESTADO DO TUTORIAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  useEffect(() => {
    const loadTutorialState = async () => {
      if (!user) return;

      try {
        const response = await api.get('/users/profile');
        const userData = response.data;

        // ✅ Tutorial só inicia automaticamente se:
        // - Nunca foi completado
        // - Nunca foi pulado
        // - Step é 0 ou null (primeira vez)
        const shouldStartTutorial = 
          !userData.tutorialCompleted && 
          !userData.tutorialSkipped &&
          (userData.tutorialStep === 0 || userData.tutorialStep === null);

        setTutorialState({
          run: shouldStartTutorial,
          stepIndex: userData.tutorialStep || 0,
          completed: userData.tutorialCompleted || false,
          skipped: userData.tutorialSkipped || false
        });

        console.log('📚 [Tutorial] Estado carregado:', {
          shouldStart: shouldStartTutorial,
          step: userData.tutorialStep,
          completed: userData.tutorialCompleted,
          skipped: userData.tutorialSkipped
        });
      } catch (error) {
        console.error('❌ [Tutorial] Erro ao carregar:', error);
      }
    };

    loadTutorialState();
  }, [user]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ▶️ INICIAR TUTORIAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const startTutorial = () => {
    console.log('🚀 [Tutorial] Iniciando...');
    router.push('/dashboard');
    setTutorialState(prev => ({ ...prev, run: true, stepIndex: 0 }));
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⏸️ PARAR TUTORIAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const stopTutorial = () => {
    console.log('⏸️ [Tutorial] Pausando...');
    setTutorialState(prev => ({ ...prev, run: false }));
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ✅ COMPLETAR TUTORIAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const completeTutorial = () => {
    console.log('🎉 [Tutorial] Completando...');

    // ✅ FECHA IMEDIATAMENTE (sem esperar a API)
    setTutorialState({ 
      run: false,
      stepIndex: 20, 
      completed: true, 
      skipped: false 
    });

    // ✅ SALVA NO BANCO EM SEGUNDO PLANO
    api.put('/users/tutorial', {
      tutorialCompleted: true,
      tutorialStep: 20
    }).catch((error) => {
      console.error('❌ [Tutorial] Erro ao salvar conclusão:', error);
    });
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⏭️ PULAR TUTORIAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const skipTutorial = () => {
    console.log('⏭️ [Tutorial] Pulando...');

    // ✅ FECHA IMEDIATAMENTE
    setTutorialState({ run: false, stepIndex: 0, completed: false, skipped: true });

    // ✅ SALVA NO BANCO EM SEGUNDO PLANO
    api.put('/users/tutorial', { tutorialSkipped: true }).catch((error) => {
      console.error('❌ [Tutorial] Erro ao salvar skip:', error);
    });
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 💾 SALVAR PROGRESSO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const saveProgress = async (stepIndex: number) => {
    try {
      await api.put('/users/tutorial', { tutorialStep: stepIndex });
      console.log('💾 [Tutorial] Salvo:', stepIndex);
    } catch (error) {
      console.error('❌ [Tutorial] Erro ao salvar:', error);
    }
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ➡️ AVANÇAR PASSO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const setStepIndex = (index: number) => {
    console.log(`➡️ [Tutorial] Step: ${index}`);
    setTutorialState(prev => ({ ...prev, stepIndex: index }));
    saveProgress(index);
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🧭 NAVEGAR
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const navigateToRoute = (route: string) => {
    if (pathname !== route) {
      console.log(`🧭 [Tutorial] ${pathname} → ${route}`);
      router.push(route);
    }
  };

  return {
    run: tutorialState.run,
    stepIndex: tutorialState.stepIndex,
    completed: tutorialState.completed,
    skipped: tutorialState.skipped,
    currentPath: pathname,
    startTutorial,
    stopTutorial,
    completeTutorial,
    skipTutorial,
    setStepIndex,
    navigateToRoute
  };
}