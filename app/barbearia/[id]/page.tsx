'use client';

import { Suspense } from 'react';
import BarbershopLanding from './BarbershopLanding';

function BarbershopLoading() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-white">Carregando barbearia...</p>
      </div>
    </div>
  );
}

export default function BarbershopPage() {
  return (
    <Suspense fallback={<BarbershopLoading />}>
      <BarbershopLanding />
    </Suspense>
  );
}