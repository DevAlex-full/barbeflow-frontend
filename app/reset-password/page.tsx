'use client';

import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';

function ResetPasswordLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-[#151b23] rounded-2xl max-w-md w-full p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  );
}