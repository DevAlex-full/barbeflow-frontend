'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Camera, ArrowLeft, Save } from 'lucide-react';
import { useClientAuth } from '@/lib/contexts/ClientAuthContext';
import clientApi from '@/lib/client-api';

export default function PerfilPage() {
  const router = useRouter();
  const { client, isAuthenticated, loading } = useClientAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/sou-cliente');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || ''
      });
    }
  }, [client]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await clientApi.put('/client/profile', formData);
      
      // Atualiza sessionStorage
      const updatedClient = { ...client, ...formData };
      sessionStorage.setItem('@barberFlow:client:user', JSON.stringify(updatedClient));
      
      alert('✅ Perfil atualizado com sucesso!');
      setEditing(false);
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      alert(error.response?.data?.error || 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !client) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Meu Perfil</h1>
            <p className="text-sm text-gray-400">Gerencie suas informações pessoais</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Avatar Section */}
        <div className="bg-[#151b23] rounded-xl p-8 mb-6 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold">
              {client.avatar ? (
                <img
                  src={client.avatar}
                  alt={client.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                client.name.charAt(0).toUpperCase()
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="text-xl font-bold">{client.name}</h2>
          <p className="text-gray-400 text-sm">{client.email}</p>
        </div>

        {/* Form */}
        <div className="bg-[#151b23] rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Informações Pessoais</h3>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Editar
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!editing}
                  className="w-full bg-[#1f2937] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!editing}
                  className="w-full bg-[#1f2937] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Telefone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!editing}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-[#1f2937] border border-gray-700 rounded-lg pl-11 pr-4 py-3 text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Botões */}
            {editing && (
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: client.name || '',
                      email: client.email || '',
                      phone: client.phone || ''
                    });
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-[#151b23] rounded-xl p-8 mt-6">
          <h3 className="text-lg font-bold mb-4">Preferências</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div>
                <p className="font-medium">Notificações por Email</p>
                <p className="text-sm text-gray-400">Receba lembretes de agendamentos</p>
              </div>
              <input type="checkbox" className="w-12 h-6" defaultChecked />
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-800">
              <div>
                <p className="font-medium">Notificações por SMS</p>
                <p className="text-sm text-gray-400">Confirmações e lembretes via SMS</p>
              </div>
              <input type="checkbox" className="w-12 h-6" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}