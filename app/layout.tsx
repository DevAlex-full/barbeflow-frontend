import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext'; // ✅ CAMINHO CORRETO
import { ClientAuthProvider } from '@/lib/contexts/ClientAuthContext'; // ✅ NOVO

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BarberFlow - Gestão de Barbearias',
  description: 'Sistema completo para gestão de barbearias',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {/* ✅ AuthProvider: Para barbearias (admin/barbeiros) */}
        <AuthProvider>
          {/* ✅ ClientAuthProvider: Para clientes públicos */}
          <ClientAuthProvider>
            {children}
          </ClientAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}