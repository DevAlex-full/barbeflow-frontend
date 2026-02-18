// contexts/TutorialContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';

interface TutorialState {
  run: boolean;
  stepIndex: number;
  completed: boolean;
  skipped: boolean;
}

interface TutorialContextType {
  run: boolean;
  stepIndex: number;
  completed: boolean;
  skipped: boolean;
  currentPath: string;
  startTutorial: () => void;
  stopTutorial: () => void;
  completeTutorial: () => void;
  skipTutorial: () => void;
  setStepIndex: (index: number) => void;
  navigateToRoute: (route: string) => void;
}

const TutorialContext = createContext<TutorialContextType | null>(null);

export function TutorialProvider({ children }: { children: ReactNode }) {
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

        const shouldStartTutorial =
          !userData.tutorialCompleted &&
          !userData.tutorialSkipped &&
          (userData.tutorialStep === 0 || userData.tutorialStep === null);

        setTutorialState(prev => {
          if (prev.run) {
            console.log('⚠️ [Tutorial] Estado já ativo, não sobrescrever');
            return prev;
          }
          console.log('📚 [Tutorial] Estado carregado:', {
            shouldStart: shouldStartTutorial,
            step: userData.tutorialStep,
            completed: userData.tutorialCompleted,
            skipped: userData.tutorialSkipped
          });
          return {
            run: shouldStartTutorial,
            stepIndex: userData.tutorialStep || 0,
            completed: userData.tutorialCompleted || false,
            skipped: userData.tutorialSkipped || false
          };
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
    console.log('🚀 [Tutorial] Iniciando manualmente...');

    api.put('/users/tutorial', {
      tutorialCompleted: false,
      tutorialSkipped: false,
      tutorialStep: 0
    }).then(() => {
      console.log('✅ [Tutorial] Estado resetado no banco');
    }).catch(error => {
      console.error('❌ [Tutorial] Erro ao resetar no banco:', error);
    });

    setTutorialState({ run: true, stepIndex: 0, completed: false, skipped: false });
    console.log('✅ [Tutorial] Estado local atualizado: run=true');

    router.push('/dashboard');
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⏸️ PARAR TUTORIAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const stopTutorial = () => {
    console.log('⏸️ [Tutorial] Parando...');
    setTutorialState(prev => ({ ...prev, run: false }));
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ✅ COMPLETAR TUTORIAL
  // ✅ Sem setTimeout — o Tutorial.tsx controla o timing de desmontagem
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const completeTutorial = () => {
    console.log('🎉 [Tutorial] Completando...');
    setTutorialState({ run: false, stepIndex: 20, completed: true, skipped: false });
    console.log('✅ [Tutorial] Estado atualizado: run=false, completed=true');

    api.put('/users/tutorial', {
      tutorialCompleted: true,
      tutorialStep: 20
    }).then(() => {
      console.log('✅ [Tutorial] Conclusão salva no banco');
    }).catch(error => {
      console.error('❌ [Tutorial] Erro ao salvar conclusão:', error);
    });
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⭐ PULAR TUTORIAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const skipTutorial = () => {
    console.log('⭐ [Tutorial] Pulando...');
    setTutorialState({ run: false, stepIndex: 0, completed: false, skipped: true });
    console.log('✅ [Tutorial] Estado atualizado: run=false, skipped=true');

    api.put('/users/tutorial', { tutorialSkipped: true })
      .then(() => {
        console.log('✅ [Tutorial] Skip salvo no banco');
      })
      .catch(error => {
        console.error('❌ [Tutorial] Erro ao salvar skip:', error);
      });
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ➡️ AVANÇAR PASSO
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const setStepIndex = (index: number) => {
    console.log(`➡️ [Tutorial] Step: ${index}`);
    setTutorialState(prev => ({ ...prev, stepIndex: index }));

    api.put('/users/tutorial', { tutorialStep: index })
      .catch(error => console.error('❌ [Tutorial] Erro ao salvar step:', error));
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

  // Log sempre que o estado mudar
  useEffect(() => {
    console.log('🔄 [Tutorial] Estado do contexto:', tutorialState);
  }, [tutorialState]);

  return (
    <TutorialContext.Provider value={{
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
    }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial deve ser usado dentro de TutorialProvider');
  }
  return context;
}