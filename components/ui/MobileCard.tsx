'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface MobileCardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

/**
 * Card otimizado para mobile que substitui linhas de tabela
 * Use em vez de <tr> em telas pequenas
 */
export function MobileCard({ children, onClick, className }: MobileCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-lg border border-gray-200 p-4 shadow-sm',
        'hover:shadow-md transition-shadow duration-200',
        'active:scale-[0.98] transition-transform',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface MobileCardItemProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
}

/**
 * Item dentro do MobileCard (substitui <td>)
 */
export function MobileCardItem({ label, value, icon }: MobileCardItemProps) {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className="text-sm text-gray-600 font-medium">{label}</span>
      </div>
      <div className="text-sm text-gray-900 font-semibold text-right max-w-[60%]">
        {value}
      </div>
    </div>
  );
}

interface MobileCardActionsProps {
  children: ReactNode;
}

/**
 * Área de ações do card (botões, badges, etc)
 */
export function MobileCardActions({ children }: MobileCardActionsProps) {
  return (
    <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-200 mt-2">
      {children}
    </div>
  );
}