'use client';

import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface PlanStatusBadgeProps {
  status: 'active' | 'expired' | 'trial' | 'cancelled';
  daysRemaining?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function PlanStatusBadge({ status, daysRemaining, size = 'md' }: PlanStatusBadgeProps) {
  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  const config = {
    active: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: CheckCircle,
      label: daysRemaining && daysRemaining <= 7 
        ? `${daysRemaining} dias restantes`
        : 'Ativo'
    },
    expired: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: XCircle,
      label: 'Expirado'
    },
    trial: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: Clock,
      label: daysRemaining 
        ? `Trial - ${daysRemaining} dias`
        : 'Trial'
    },
    cancelled: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
      icon: AlertCircle,
      label: 'Cancelado'
    }
  };

  const style = config[status];
  const Icon = style.icon;

  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full font-medium border
      ${style.bg} ${style.text} ${style.border} ${sizes[size]}
    `}>
      <Icon size={iconSizes[size]} />
      <span>{style.label}</span>
    </span>
  );
}