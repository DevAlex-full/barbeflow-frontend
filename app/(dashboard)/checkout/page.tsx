'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Check, CreditCard, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get('plan') || 'basic';
  
  const [selectedPlan, setSelectedPlan] = useState(planFromUrl);
  const [loading, setLoading] = useState(false);

  const plans = {
    basic: {
      name: 'Plano Básico',
      price: 49.90,
      features: [
        '1 barbeiro',
        'Até 100 clientes',
        'Agendamentos ilimitados',
        'Relatórios básicos',
        'Suporte por email'
      ]
    },
    premium: {
      name: 'Plano Premium',
      price: 99.90,
      features: [
        'Até 5 barbeiros',
        'Clientes ilimitados',
        'Agendamentos ilimitados',
        'Relatórios avançados',
        'WhatsApp integrado',
        'Suporte prioritário'
      ]
    },
    enterprise: {
      name: 'Plano Enterprise',
      price: 199.90,
      features: [
        'Barbeiros ilimitados',
        'Clientes ilimitados',
        'Multi-unidades',
        'Marca personalizada',
        'Relatórios completos',
        'Suporte 24/7'
      ]
    }
  };

  async function handleCheckout() {
    setLoading(true);
    try {
      const response = await api.post('/payment/create-preference', {
        plan: selectedPlan
      });

      // Redirecionar para o Mercado Pago
      window.location.href = response.data.init_point;
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao processar pagamento');
      setLoading(false);
    }
  }

  const currentPlan = plans[selectedPlan as keyof typeof plans];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Finalizar Assinatura</h1>
        <p className="text-gray-600 mt-2">Escolha seu plano e conclua o pagamento</p>
      </div>

      {/* Seleção de Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(plans).map(([key, plan]) => (
          <button
            key={key}
            onClick={() => setSelectedPlan(key)}
            className={`p-6 rounded-xl border-2 transition text-left ${
              selectedPlan === key
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
            <div className="mt-4 mb-6">
              <span className="text-4xl font-bold text-gray-900">R$ {plan.price.toFixed(2)}</span>
              <span className="text-gray-600">/mês</span>
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      {/* Resumo do Pedido */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-lg">
            <span className="text-gray-700">{currentPlan.name}</span>
            <span className="font-semibold">R$ {currentPlan.price.toFixed(2)}</span>
          </div>
          <div className="border-t pt-4 flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-purple-600">R$ {currentPlan.price.toFixed(2)}/mês</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Pagamento Seguro:</strong> Você será redirecionado para o Mercado Pago para concluir o pagamento com segurança.
          </p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Ir para Pagamento
            </>
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Ao confirmar, você concorda com nossos Termos de Serviço
        </p>
      </div>

      {/* Métodos de Pagamento */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">Formas de Pagamento Aceitas</h3>
        <div className="flex flex-wrap gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border text-sm font-semibold">PIX</div>
          <div className="bg-white px-4 py-2 rounded-lg border text-sm font-semibold">Cartão de Crédito</div>
          <div className="bg-white px-4 py-2 rounded-lg border text-sm font-semibold">Boleto</div>
        </div>
      </div>
    </div>
  );
}