import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ClientAuthProvider } from '@/lib/contexts/ClientAuthContext';
import CookieConsent from '../components/CookieConsent';

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
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  const html = document.documentElement;
                  html.classList.remove('dark');
                  if (theme === 'dark') {
                    html.classList.add('dark');
                  } else if (theme === 'auto') {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      html.classList.add('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200`}
      >
        <AuthProvider>
          <ClientAuthProvider>
            {children}
            <CookieConsent />
          </ClientAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
