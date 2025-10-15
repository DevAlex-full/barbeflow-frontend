'use client';

import { Suspense } from 'react';
import RedefinirSenhaForm from './RedefinirSenhaForm';
import Image from 'next/image';

function RedefinirSenhaLoading() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/fundo1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <Image
              src="/Logo.png"
              alt="BarberFlow"
              width={280}
              height={80}
              className="h-20 w-auto"
              priority
            />
          </div>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={<RedefinirSenhaLoading />}>
      <RedefinirSenhaForm />
    </Suspense>
  );
}