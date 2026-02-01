'use client';

import { Scissors, TrendingUp } from 'lucide-react';

interface Service {
  name: string;
  count: number;
  revenue: number;
}

interface TopServicesCardProps {
  services: Service[];
}

export function TopServicesCard({ services }: TopServicesCardProps) {
  const colors = ['bg-purple-100 text-purple-600', 'bg-blue-100 text-blue-600', 'bg-green-100 text-green-600'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Top Serviços</h3>
        <div className="bg-purple-100 p-2 rounded-lg">
          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
      </div>

      <div className="space-y-4">
        {services.length > 0 ? (
          services.map((service, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`${colors[index]} p-2 rounded-lg`}>
                  <Scissors className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{service.name}</p>
                  <p className="text-sm text-gray-600">{service.count} agendamentos</p>
                </div>
              </div>
              <div className="text-right ml-2">
                <p className="font-bold text-gray-900">R$ {service.revenue.toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Scissors className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">Nenhum serviço concluído ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}