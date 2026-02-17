// components/tutorial/Tutorial.tsx
'use client';

import { useEffect, useCallback } from 'react';
import Joyride, { CallBackProps, STATUS, EVENTS, ACTIONS } from 'react-joyride';
import { useTutorial } from '@/lib/hooks/useTutorial';
import { tutorialSteps } from './TutorialSteps';

export function Tutorial() {
  const {
    run,
    stepIndex,
    currentPath,
    completeTutorial,
    skipTutorial,
    setStepIndex,
    navigateToRoute
  } = useTutorial();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🧭 NAVEGAÇÃO AUTOMÁTICA
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  useEffect(() => {
    if (!run) return;

    const currentStep = tutorialSteps[stepIndex];
    // @ts-ignore
    const requiredRoute = currentStep?.route;

    if (requiredRoute && currentPath !== requiredRoute) {
      console.log(`🧭 [Tutorial] Navegando automaticamente para: ${requiredRoute}`);
      navigateToRoute(requiredRoute);
    }
  }, [stepIndex, run, currentPath, navigateToRoute]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎯 CALLBACK DO JOYRIDE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, type, index, action } = data;

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📚 [Tutorial Event]');
    console.log('   Status:', status);
    console.log('   Type:', type);
    console.log('   Index:', index);
    console.log('   Action:', action);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // ✅ NAVEGAÇÃO ENTRE PASSOS
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      
      // Não ultrapassar limites
      if (nextIndex >= 0 && nextIndex < tutorialSteps.length) {
        setStepIndex(nextIndex);
      }
    }

    // ✅ TUTORIAL COMPLETADO
    if (status === STATUS.FINISHED) {
      console.log('🎉 [Tutorial] Completado!');
      completeTutorial();
    }

    // ✅ TUTORIAL PULADO
    if (status === STATUS.SKIPPED) {
      console.log('⏭️ [Tutorial] Pulado');
      skipTutorial();
    }
  }, [completeTutorial, skipTutorial, setStepIndex]);

  return (
    <Joyride
      steps={tutorialSteps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      disableOverlayClose
      spotlightClicks={false}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#7c3aed',
          backgroundColor: '#ffffff',
          textColor: '#1f2937',
          overlayColor: 'rgba(0, 0, 0, 0.75)',
          arrowColor: '#ffffff',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 16,
          padding: 0,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        tooltipContent: {
          padding: '20px',
        },
        buttonNext: {
          backgroundColor: '#7c3aed',
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 600,
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: 12,
        },
        buttonSkip: {
          color: '#9ca3af',
          fontSize: '14px',
        },
        spotlight: {
          borderRadius: 8,
        },
      }}
      locale={{
        back: 'Voltar',
        close: 'Fechar',
        last: 'Finalizar',
        next: 'Próximo',
        open: 'Abrir',
        skip: 'Pular Tutorial',
      }}
      floaterProps={{
        disableAnimation: false,
      }}
    />
  );
}