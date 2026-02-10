'use client';

import { useState } from 'react';
import { Bell, Moon, Sun, Monitor, Save, Loader2, Check, X, Settings2 } from 'lucide-react';

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
  
  // ✅ TEMA FIXO EM LIGHT
  const [formData, setFormData] = useState({
    ...initialData,
    theme: 'light' as const // FORÇADO LIGHT
  });

  const handleToggle = (field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof prev[field] === 'boolean' ? !prev[field] : prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await onSave({
        emailNotifications: formData.emailNotifications,
        smsNotifications: formData.smsNotifications,
        whatsappNotifications: formData.whatsappNotifications,
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h4 className="text-lg font-semibold text-gray-800">Notificações</h4>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
              <div>
                <p className="font-medium text-gray-800">Email</p>
                <p className="text-sm text-gray-500">Receber notificações por email</p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" checked={formData.emailNotifications} onChange={() => handleToggle('emailNotifications')} className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
              </div>
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
              <div>
                <p className="font-medium text-gray-800">SMS</p>
                <p className="text-sm text-gray-500">Receber notificações por SMS</p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" checked={formData.smsNotifications} onChange={() => handleToggle('smsNotifications')} className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
              </div>
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer">
              <div>
                <p className="font-medium text-gray-800">WhatsApp</p>
                <p className="text-sm text-gray-500">Receber notificações no WhatsApp</p>
              </div>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" checked={formData.whatsappNotifications} onChange={() => handleToggle('whatsappNotifications')} className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-indigo-600 transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
              </div>
            </label>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-indigo-600" />
            <h4 className="text-lg font-semibold text-gray-800">Tema do Dashboard</h4>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Nota:</strong> Tema claro ativo. As cores da Landing Page são configuradas separadamente.
            </p>
          </div>

          {/* ✅ TEMA TRAVADO EM LIGHT */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border-2 border-indigo-600 bg-indigo-50">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-white rounded-lg border border-gray-300 mb-3">
                <Sun className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-sm font-medium text-gray-800 text-center">Claro ✓</p>
            </div>

            <div className="p-4 rounded-xl border-2 border-gray-200 opacity-50 cursor-not-allowed">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-gray-800 rounded-lg border border-gray-600 mb-3">
                <Moon className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-500 text-center">Escuro</p>
            </div>

            <div className="p-4 rounded-xl border-2 border-gray-200 opacity-50 cursor-not-allowed">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-gradient-to-r from-white to-gray-800 rounded-lg border border-gray-400 mb-3">
                <Monitor className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-500 text-center">Auto</p>
            </div>
          </div>
        </div>

        {success && (
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
            <Check className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Preferências salvas!</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <X className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg">
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