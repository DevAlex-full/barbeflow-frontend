'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Check, Crown, Zap, Rocket, AlertCircle } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
}

interface CurrentSubscription {
  currentPlan: any;
  usage: {
    barbers: number;
    customers: number;
  };
  limits: any;
  trial: {
    isInTrial: boolean;
    daysLeft: number;
  };
}

export default function PlansPage() {
  const [plans, setPlans] = useState<any>(null);
  const [currentSub, setCurrentSub] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [plansRes, subRes] = await Promise.all([
        api.get('/subscriptions/plans'),
        api.get('/subscriptions/current')
      ]);

      setPlans(plansRes.data);
      setCurrentSub(subRes.data);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpgrade(planId: string) {
    if (!confirm(`Deseja fazer upgrade para o plano ${plans[planId].name}?`)) {
      return;
    }

    setUpgrading(true);
    try {
      await api.post('/subscriptions/subscribe', {
        planId,
        paymentMethod: 'pending' // Aqui você integraria com gateway
      });

      alert('Plano atualizado com sucesso!');
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao atualizar plano');
    } finally {
      setUpgrading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const planIcons: any = {
    basic: Zap,
    premium: Crown,
    enterprise: Rocket
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Planos e Assinatura</h1>
        <p className="text-gray-600 mt-2">Escolha o plano ideal para sua barbearia</p>
      </div>

      {/* Status Atual */}
      {currentSub && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{currentSub.currentPlan.name}</h3>
              <p className="mt-2 opacity-90">
                {currentSub.trial.isInTrial ? (
                  `${currentSub.trial.daysLeft} dias restantes no período de teste`
                ) : (
                  `R$ ${currentSub.currentPlan.price.toFixed(2)}/mês`
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-75">Uso atual</p>
              <p className="text-lg font-semibold mt-1">
                {currentSub.usage.barbers} barbeiro(s) • {currentSub.usage.customers} clientes
              </p>
            </div>
          </div>

          {currentSub.trial.isInTrial && currentSub.trial.daysLeft <= 7 && (
            <div className="mt-4 bg-yellow-500 bg-opacity-20 rounded-lg p-3 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">
                Seu período de teste está terminando! Escolha um plano abaixo para continuar.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans && ['basic', 'premium', 'enterprise'].map((planKey) => {
          const plan = plans[planKey];
          const Icon = planIcons[planKey];
          const isCurrentPlan = currentSub?.currentPlan.id === planKey;
          const isPremiumPlan = planKey === 'premium';

          return (
            <div
              key={planKey}
              className={`relative rounded-xl border-2 p-6 transition ${isPremiumPlan
                  ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
            >
              {isPremiumPlan && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MAIS POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${isPremiumPlan ? 'bg-purple-600' : 'bg-gray-100'
                  }`}>
                  <Icon className={`w-6 h-6 ${isPremiumPlan ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">R$ {plan.price.toFixed(2)}</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  if (isCurrentPlan) return;
                  window.location.href = `/checkout?plan=${planKey}`;
                }}
                disabled={isCurrentPlan || upgrading}
                className={`w-full py-3 rounded-lg font-semibold transition ${isCurrentPlan
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isPremiumPlan
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
              >
                {isCurrentPlan ? 'Plano Atual' : upgrading ? 'Processando...' : 'Escolher Plano'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Garantia */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <Check className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Garantia de 30 dias</h3>
            <p className="text-gray-700">
              Não gostou? Cancele a qualquer momento dentro dos primeiros 30 dias e receba
              reembolso total. Sem perguntas, sem burocracia.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900">Posso mudar de plano depois?</h4>
            <p className="text-gray-600 text-sm mt-1">
              Sim! Você pode fazer upgrade ou downgrade a qualquer momento.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Como funciona o pagamento?</h4>
            <p className="text-gray-600 text-sm mt-1">
              Cobramos mensalmente no cartão de crédito. Você pode cancelar quando quiser.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Posso cancelar a qualquer momento?</h4>
            <p className="text-gray-600 text-sm mt-1">
              Sim! Sem multas ou taxas. Você continua usando até o fim do período pago.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}