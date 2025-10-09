'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Check, Crown, Zap, Rocket, AlertCircle } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  yearlyPrice?: number;
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

interface PriceInfo {
  plan: { id: string; name: string };
  period: string;
  price: number;
  monthlyPrice: number;
  monthlyEquivalent: number;
  discount: number;
  savings: number;
}

export default function PlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any>(null);
  const [currentSub, setCurrentSub] = useState<CurrentSubscription | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'semiannual' | 'annual'>('annual');
  const [priceCache, setPriceCache] = useState<Record<string, PriceInfo>>({});
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (plans) {
      calculateAllPrices();
    }
  }, [plans, selectedPeriod]);

  async function loadData() {
    try {
      const [plansRes, subRes] = await Promise.all([
        api.get('/subscriptions/plans'),        // ✅ PLURAL
        api.get('/subscriptions/current')       // ✅ PLURAL
      ]);

      setPlans(plansRes.data);
      setCurrentSub(subRes.data);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function calculateAllPrices() {
    const planKeys = ['basic', 'standard', 'premium', 'enterprise'];
    const newCache: Record<string, PriceInfo> = {};

    for (const planKey of planKeys) {
      try {
        const { data } = await api.post('/payment/calculate-price', {  // ⚠️ Verificar se existe
          plan: planKey,
          period: selectedPeriod
        });
        newCache[planKey] = data;
      } catch (error) {
        console.error(`Erro ao calcular preço do plano ${planKey}:`, error);
        // ✅ Fallback: Calcular preço localmente se a rota não existir
        if (plans && plans[planKey]) {
          const basePlan = plans[planKey];
          let price = basePlan.price || 0;
          let discount = 0;
          
          if (selectedPeriod === 'semiannual') {
            price = price * 6 * 0.85; // 15% desconto
            discount = 15;
          } else if (selectedPeriod === 'annual') {
            price = price * 12 * 0.70; // 30% desconto
            discount = 30;
          }
          
          newCache[planKey] = {
            plan: { id: planKey, name: basePlan.name },
            period: selectedPeriod,
            price: price,
            monthlyPrice: basePlan.price || 0,
            monthlyEquivalent: price / (selectedPeriod === 'monthly' ? 1 : selectedPeriod === 'semiannual' ? 6 : 12),
            discount: discount,
            savings: selectedPeriod !== 'monthly' ? (basePlan.price || 0) * (selectedPeriod === 'semiannual' ? 6 : 12) - price : 0
          };
        }
      }
    }

    setPriceCache(newCache);
  }

  async function handleSelectPlan(planId: string) {
    if (processingPlan) return;

    setProcessingPlan(planId);
    try {
      // ✅ Criar preferência de pagamento
      const { data } = await api.post('/payment/create-preference', {
        plan: planId,
        period: selectedPeriod
      });

      // Redirecionar para o Mercado Pago
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error('Link de pagamento não retornado');
      }
    } catch (error: any) {
      console.error('Erro ao processar pagamento:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao processar pagamento';
      alert(errorMessage);
      setProcessingPlan(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!plans) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-gray-600">Erro ao carregar planos. Tente novamente mais tarde.</p>
        <button
          onClick={loadData}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  const planIcons: any = {
    basic: Zap,
    standard: Zap,
    premium: Crown,
    enterprise: Rocket
  };

  const getPeriodLabel = () => {
    if (selectedPeriod === 'monthly') return 'Mensal';
    if (selectedPeriod === 'semiannual') return 'Semestral';
    return 'Anual';
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
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold">{currentSub.currentPlan.name}</h3>
              <p className="mt-2 opacity-90">
                {currentSub.trial.isInTrial ? (
                  `${currentSub.trial.daysLeft} dias restantes no período de teste`
                ) : (
                  `R$ ${currentSub.currentPlan.price?.toFixed(2) || '0.00'}/mês`
                )}
              </p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm opacity-75">Uso atual</p>
              <p className="text-lg font-semibold mt-1">
                {currentSub.usage.barbers} barbeiro(s) • {currentSub.usage.customers} clientes
              </p>
            </div>
          </div>

          {currentSub.trial.isInTrial && currentSub.trial.daysLeft <= 7 && (
            <div className="mt-4 bg-yellow-500 bg-opacity-20 rounded-lg p-3 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">
                Seu período de teste está terminando! Escolha um plano abaixo para continuar.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Seletor de Período */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl overflow-hidden shadow-lg">
          <button
            onClick={() => setSelectedPeriod('monthly')}
            className={`px-6 md:px-10 py-3 md:py-4 font-bold transition-all ${
              selectedPeriod === 'monthly'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <div className="text-center">
              <div>MENSAL</div>
            </div>
          </button>
          <button
            onClick={() => setSelectedPeriod('semiannual')}
            className={`px-6 md:px-10 py-3 md:py-4 font-bold transition-all relative ${
              selectedPeriod === 'semiannual'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <div className="text-center">
              <div>SEMESTRAL</div>
              <div className="text-xs font-normal">15% DE DESCONTO</div>
            </div>
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs px-2 py-1 rounded-full text-gray-900 font-bold">
              15% OFF
            </span>
          </button>
          <button
            onClick={() => setSelectedPeriod('annual')}
            className={`px-6 md:px-10 py-3 md:py-4 font-bold transition-all relative ${
              selectedPeriod === 'annual'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <div className="text-center">
              <div>ANUAL</div>
              <div className="text-xs font-normal">30% DE DESCONTO</div>
            </div>
            <span className="absolute -top-2 -right-2 bg-green-400 text-xs px-2 py-1 rounded-full text-gray-900 font-bold">
              30% OFF
            </span>
          </button>
        </div>
      </div>

      {/* Planos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans && ['basic', 'standard', 'premium', 'enterprise'].map((planKey) => {
          const plan = plans[planKey];
          const priceInfo = priceCache[planKey];
          const Icon = planIcons[planKey];
          const isCurrentPlan = currentSub?.currentPlan.id === planKey;
          const isPremiumPlan = planKey === 'standard'; // Mais popular

          return (
            <div
              key={planKey}
              className={`relative rounded-xl border-2 p-6 transition ${
                isPremiumPlan
                  ? 'border-purple-500 bg-purple-50 shadow-lg md:scale-105'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              {isPremiumPlan && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                    MAIS POPULAR
                  </span>
                </div>
              )}

              {priceInfo && priceInfo.discount > 0 && (
                <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                  {priceInfo.discount}% OFF
                </div>
              )}

              <div className="text-center mb-6">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                    isPremiumPlan ? 'bg-purple-600' : 'bg-gray-100'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isPremiumPlan ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                
                {priceInfo ? (
                  <div className="mt-4">
                    <div className="text-4xl font-bold text-gray-900">
                      R$ {priceInfo.price.toFixed(2)}
                    </div>
                    {selectedPeriod !== 'monthly' && (
                      <div className="text-sm text-gray-500 mt-1">
                        R$ {priceInfo.monthlyEquivalent.toFixed(2)}/mês
                      </div>
                    )}
                    {priceInfo.savings > 0 && (
                      <div className="text-xs text-green-600 font-semibold mt-1">
                        Economize R$ {priceInfo.savings.toFixed(2)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.benefits?.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(planKey)}
                disabled={isCurrentPlan || processingPlan !== null}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  isCurrentPlan
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : processingPlan === planKey
                    ? 'bg-gray-400 text-white cursor-wait'
                    : isPremiumPlan
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {isCurrentPlan
                  ? 'Plano Atual'
                  : processingPlan === planKey
                  ? 'Processando...'
                  : `Assinar ${getPeriodLabel()}`}
              </button>

              {selectedPeriod !== 'monthly' && priceInfo && (
                <p className="text-xs text-center text-gray-500 mt-2">
                  Pagamento único de R$ {priceInfo.price.toFixed(2)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Garantia */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start">
          <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
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
              Pagamento único via Mercado Pago. No plano mensal, renovação automática.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Posso cancelar a qualquer momento?</h4>
            <p className="text-gray-600 text-sm mt-1">
              Sim! Sem multas ou taxas. Você continua usando até o fim do período pago.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Qual forma de pagamento é aceita?</h4>
            <p className="text-gray-600 text-sm mt-1">
              Cartão de crédito, débito, PIX e boleto através do Mercado Pago.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}