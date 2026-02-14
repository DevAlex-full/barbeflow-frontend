'use client';

import { useState } from 'react';
import { Bell, Moon, Sun, Monitor, Save, Loader2, Check, X, Settings2 } from 'lucide-react';
import { useTheme } from '@/lib/hooks/useTheme';

interface PreferenciasProps {
  initialData: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    whatsappNotifications: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  onSave: (data: any) => Promise<void>;
}

export function Preferencias({ initialData, onSave }: PreferenciasProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // ✅ Hook de tema
  const { theme, setTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    emailNotifications: initialData.emailNotifications,
    smsNotifications: initialData.smsNotifications,
    whatsappNotifications: initialData.whatsappNotifications,
  });

  const handleToggle = (field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // ✅ Mudar tema (localStorage + visual imediato)
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setTheme(newTheme);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // ✅ Salvar tema junto com notificações
      await onSave({
        ...formData,
        theme, // ✅ Inclui tema atual
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar preferências');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Settings2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Preferências</h3>
            <p className="text-sm text-indigo-100 mt-1">Personalize sua experiência</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Notificações */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Notificações</h4>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition cursor-pointer">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Email</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receber notificações por email</p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input 
                  type="checkbox" 
                  checked={formData.emailNotifications} 
                  onChange={() => handleToggle('emailNotifications')} 
                  className="sr-only peer" 
                />
                <div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-indigo-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
              </div>
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition cursor-pointer">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">SMS</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receber notificações por SMS</p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input 
                  type="checkbox" 
                  checked={formData.smsNotifications} 
                  onChange={() => handleToggle('smsNotifications')} 
                  className="sr-only peer" 
                />
                <div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-indigo-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
              </div>
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition cursor-pointer">
              <div>
                <p className="font-medium text-gray-800 dark:text-white">WhatsApp</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receber notificações no WhatsApp</p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input 
                  type="checkbox" 
                  checked={formData.whatsappNotifications} 
                  onChange={() => handleToggle('whatsappNotifications')} 
                  className="sr-only peer" 
                />
                <div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-indigo-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Tema */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Tema do Dashboard</h4>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>Nota:</strong> O tema muda instantaneamente. Clique em "Salvar Preferências" para sincronizar com outros dispositivos.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button 
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                theme === 'light' 
                  ? 'border-indigo-600 bg-indigo-50 shadow-lg' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-white rounded-lg border border-gray-300 mb-3">
                <Sun className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-white text-center">
                Claro {theme === 'light' && '✓'}
              </p>
            </button>

            <button 
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                theme === 'dark' 
                  ? 'border-indigo-600 bg-indigo-50 shadow-lg' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-gray-800 rounded-lg border border-gray-600 mb-3">
                <Moon className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-white text-center">
                Escuro {theme === 'dark' && '✓'}
              </p>
            </button>

            <button 
              type="button"
              onClick={() => handleThemeChange('auto')}
              className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                theme === 'auto' 
                  ? 'border-indigo-600 bg-indigo-50 shadow-lg' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
              }`}
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-gradient-to-r from-white to-gray-800 rounded-lg border border-gray-400 mb-3">
                <Monitor className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-800 dark:text-white text-center">
                Auto {theme === 'auto' && '✓'}
              </p>
            </button>
          </div>
        </div>

        {success && (
          <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Preferências salvas e sincronizadas!</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
            <X className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Salvar Preferências
            </>
          )}
        </button>
      </form>
    </div>
  );
}