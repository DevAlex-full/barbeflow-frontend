'use client';

import { useEffect, useState } from 'react';
import { Crown, Check, TrendingUp, ExternalLink } from 'lucide-react';
import api from '@/lib/api';
import { getPlanById, formatPrice, getPlanBadgeColor } from '@/lib/plans';

interface PlanoAtualProps {
  currentPlanId: string;
}

export function PlanoAtual({ currentPlanId }: PlanoAtualProps) {
  const [planStatus, setPlanStatus] = useState<any>(null);
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const currentPlan = getPlanById(currentPlanId);

  useEffect(() => {
    async function loadData() {
      try {
        const [statusRes, subRes] = await Promise.all([
          api.get('/barbershop/plan-status'),
          api.get('/subscriptions/current')
        ]);
        setPlanStatus(statusRes.data);
        setCurrentSub(subRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados do plano:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (!currentPlan) return null;

  const badgeColor = getPlanBadgeColor(currentPlanId);

  // Preço correto: usa o preço real da assinatura, não o estático do plans.ts
  const actualMonthlyPrice = currentSub?.currentPlan?.price;
  const actualYearlyPrice = currentSub?.currentPlan?.yearlyPrice;

  // Data de expiração real do banco
  const expiresAt = planStatus?.planExpiresAt;
  const expiresFormatted = expiresAt
    ? new Date(expiresAt).toLocaleDateString('pt-BR')
    : null;

  // Dias restantes
  const daysRemaining = planStatus?.daysRemaining ?? 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-xl">
          <Crown className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Plano Atual</h2>
          <p className="text-sm text-gray-600">Gerencie sua assinatura</p>
        </div>
      </div>

      {/* Card do Plano */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${badgeColor} mb-3`}>
              <Crown className="w-4 h-4" />
              {currentPlan.name}
            </span>
            <div className="flex items-baseline gap-2 mt-3">
              {loading ? (
                <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
              ) : (
                <>
                  <span className="text-4xl font-bold text-gray-900">
                    {actualMonthlyPrice > 0 ? formatPrice(actualMonthlyPrice) : formatPrice(currentPlan.price)}
                  </span>
                  <span className="text-gray-600">/mês</span>
                </>
              )}
            </div>
            {/* Dias restantes */}
            {!loading && daysRemaining > 0 && currentPlanId !== 'trial' && (
              <p className="text-sm text-purple-600 font-medium mt-1">
                {daysRemaining} dias restantes
              </p>
            )}
          </div>
        </div>

        {/* Limites do Plano */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Barbeiros</p>
            <p className="text-lg font-bold text-gray-900">
              {currentPlan.maxBarbers === -1 ? '∞' : currentPlan.maxBarbers}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Serviços</p>
            <p className="text-lg font-bold text-gray-900">
              {currentPlan.maxServices === -1 ? '∞' : currentPlan.maxServices}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">Clientes</p>
            <p className="text-lg font-bold text-gray-900">
              {currentPlan.maxClients === -1 ? '∞' : currentPlan.maxClients}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {currentPlan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          {currentPlanId !== 'enterprise' && (
            <a
              href="/planos"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition font-semibold shadow-lg"
            >
              <TrendingUp className="w-5 h-5" />
              Fazer Upgrade
            </a>
          )}
          <a
            href="/faturas"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl transition font-semibold"
          >
            <ExternalLink className="w-5 h-5" />
            Ver Faturas
          </a>
        </div>
      </div>

      {/* Próxima cobrança */}
      {!loading && expiresFormatted && currentPlanId !== 'trial' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-900 font-semibold mb-2">
            💡 Próxima cobrança
          </p>
          <p className="text-sm text-blue-700">
            Sua próxima cobrança será em{' '}
            <strong>{expiresFormatted}</strong> no valor de{' '}
            <strong>
              {actualYearlyPrice > 0
                ? formatPrice(actualYearlyPrice)
                : actualMonthlyPrice > 0
                ? formatPrice(actualMonthlyPrice)
                : formatPrice(currentPlan.price)}
            </strong>
            {actualYearlyPrice > 0 && actualMonthlyPrice > 0 && (
              <span className="text-blue-600 font-normal">
                {' '}(12x de {formatPrice(actualMonthlyPrice)})
              </span>
            )}.
          </p>
        </div>
      )}

      {/* Trial info */}
      {!loading && currentPlanId === 'trial' && daysRemaining > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-yellow-900 font-semibold mb-1">
            ⏳ Período de teste
          </p>
          <p className="text-sm text-yellow-700">
            Seu trial expira em <strong>{expiresFormatted}</strong>.{' '}
            Restam <strong>{daysRemaining} dias</strong>.
          </p>
        </div>
      )}
    </div>
  );
}