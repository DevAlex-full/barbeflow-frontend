import { Suspense } from 'react';
import RecuperarSenhaForm from './RecuperarSenhaForm';

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default function RecuperarSenhaPage() {
  return (
    <Suspense fallback={<Loading />}>
      <RecuperarSenhaForm />
    </Suspense>
  );
}