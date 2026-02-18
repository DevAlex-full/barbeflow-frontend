// components/tutorial/Tutorial.tsx
'use client';

import { useEffect, useCallback, useState } from 'react';
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

  // ✅ Estado local para controlar montagem/desmontagem do Joyride
  const [shouldRender, setShouldRender] = useState(false);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🔧 CONTROLE DE MONTAGEM/DESMONTAGEM
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  useEffect(() => {
    if (run) {
      console.log('✅ [Tutorial] Montando componente');
      setShouldRender(true);
    } else {
      console.log('❌ [Tutorial] Desmontando componente');
      setShouldRender(false);
      
      // ✅ LIMPEZA FORÇADA DOS PORTALS DO JOYRIDE
      // Remove qualquer elemento do Joyride que possa ter ficado preso no DOM
      setTimeout(() => {
        const joyrideOverlay = document.querySelector('[class*="react-joyride__overlay"]');
        const joyrideTooltip = document.querySelector('[class*="react-joyride__tooltip"]');
        const joyrideSpotlight = document.querySelector('[class*="react-joyride__spotlight"]');
        
        if (joyrideOverlay) {
          console.log('🧹 [Tutorial] Removendo overlay manualmente');
          joyrideOverlay.remove();
        }
        if (joyrideTooltip) {
          console.log('🧹 [Tutorial] Removendo tooltip manualmente');
          joyrideTooltip.remove();
        }
        if (joyrideSpotlight) {
          console.log('🧹 [Tutorial] Removendo spotlight manualmente');
          joyrideSpotlight.remove();
        }
      }, 100); // Pequeno delay para garantir que o Joyride tentou limpar primeiro
    }
  }, [run]);

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

    console.log('📚 [Tutorial Event]', { status, type, index, action });

    // ✅ TUTORIAL COMPLETADO (botão Finalizar no último passo)
    if (status === STATUS.FINISHED) {
      console.log('🎉 [Tutorial] Completado!');
      completeTutorial();
      return;
    }

    // ✅ TUTORIAL PULADO (botão "Pular Tutorial")
    if (status === STATUS.SKIPPED) {
      console.log('⭐️ [Tutorial] Pulado!');
      skipTutorial();
      return;
    }

    // ✅ BOTÃO X CLICADO - ENCERRA O TUTORIAL
    if (action === ACTIONS.CLOSE) {
      console.log('✖️ [Tutorial] Botão X clicado - encerrando tutorial');
      skipTutorial();
      return;
    }

    // ✅ NAVEGAÇÃO ENTRE PASSOS
    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      // ✅ FIX: Se tentou avançar além do último passo, significa que clicou "Finalizar"
      if (nextIndex >= tutorialSteps.length && action === ACTIONS.NEXT) {
        console.log('🎉 [Tutorial] Último passo concluído - finalizando');
        completeTutorial();
        return;
      }

      // Navegação normal entre passos
      if (nextIndex >= 0 && nextIndex < tutorialSteps.length) {
        setStepIndex(nextIndex);
      }
    }
  }, [completeTutorial, skipTutorial, setStepIndex]);

  // ✅ NÃO RENDERIZA SE NÃO DEVE ESTAR VISÍVEL
  if (!shouldRender) {
    console.log('⏸️ [Tutorial] Componente oculto (shouldRender = false)');
    return null;
  }

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