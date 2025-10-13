'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

/**
 * Modal que vira Bottom Sheet em mobile
 * Desktop: Modal centralizado
 * Mobile: Slide de baixo (como apps nativos)
 */
export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg'
}: ResponsiveModalProps) {
  // Previne scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal/Bottom Sheet */}
      <div className={cn(
        // Mobile: Bottom Sheet
        'fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl',
        'max-h-[90vh] overflow-y-auto',
        'animate-in slide-in-from-bottom duration-300',
        // Desktop: Modal centralizado
        'md:absolute md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2',
        'md:rounded-2xl md:max-h-[85vh] md:w-full',
        maxWidthClasses[maxWidth]
      )}>
        {/* Handle (só mobile) */}
        <div className="md:hidden flex justify-center py-3">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl md:rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

interface ModalActionsProps {
  children: ReactNode;
}

/**
 * Área de botões do modal (sempre no bottom em mobile)
 */
export function ModalActions({ children }: ModalActionsProps) {
  return (
    <div className={cn(
      'sticky bottom-0 bg-white border-t border-gray-200 p-4',
      'flex flex-col sm:flex-row gap-3 sm:gap-4',
      'rounded-b-3xl md:rounded-b-2xl'
    )}>
      {children}
    </div>
  );
}