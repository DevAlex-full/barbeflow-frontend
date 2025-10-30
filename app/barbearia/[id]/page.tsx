'use client';

import { Suspense } from 'react';
import BarbershopLanding from './BarbershopLanding';
import { Sparkles } from 'lucide-react';

function BarbershopLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-500 mx-auto"></div>
          <Sparkles className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-white text-lg font-medium animate-pulse">Carregando experiência...</p>
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