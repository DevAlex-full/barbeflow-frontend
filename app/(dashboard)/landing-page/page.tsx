'use client';

import { useState, useEffect } from 'react';
import { 
  Save, Eye, Palette, Image as ImageIcon, Info, Clock, 
  Share2, Settings, Upload, X, Plus, Trash2, Instagram,
  Facebook, MessageCircle, Youtube, CheckCircle, AlertCircle,
  ExternalLink, Globe, Sparkles, Zap, TrendingUp, Award, Users
} from 'lucide-react';

interface ConfigData {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  description: string;
  galleryImages: string[];
  businessHours: Record<string, string>;
  instagramUrl: string;
  facebookUrl: string;
  whatsappNumber: string;
  youtubeUrl: string;
  primaryColor: string;
  secondaryColor: string;
  showTeam: boolean;
  showGallery: boolean;
  showReviews: boolean;
  allowOnlineBooking: boolean;
}

interface Barber {
  id: string;
  name: string;
  avatar: string | null;
  email: string;
}

interface Barbershop {
  id: string;
  name: string;
  logo: string | null;
}

export default function ConfigurarLandingPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [barbershopId, setBarbershopId] = useState('');
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [uploadingAvatar, setUploadingAvatar] = useState<string | null>(null);
  
  const [config, setConfig] = useState<ConfigData>({
    heroImage: '',
    heroTitle: '',
    heroSubtitle: '',
    description: '',
    galleryImages: [],
    businessHours: {
      monday: '09:00-20:00',
      tuesday: '09:00-20:00',
      wednesday: '09:00-20:00',
      thursday: '09:00-20:00',
      friday: '09:00-20:00',
      saturday: '09:00-18:00',
      sunday: 'Fechado'
    },
    instagramUrl: '',
    facebookUrl: '',
    whatsappNumber: '',
    youtubeUrl: '',
    primaryColor: '#2563eb',
    secondaryColor: '#7c3aed',
    showTeam: true,
    showGallery: true,
    showReviews: true,
    allowOnlineBooking: true
  });

  useEffect(() => {
    loadConfig();
    loadBarbers();
  }, []);

  const loadConfig = async () => {
    try {
      const token = localStorage.getItem('@barberFlow:token');
      const userStr = localStorage.getItem('@barberFlow:user');
      
      if (!token) {
        console.warn('⚠️ Token não encontrado');
        setLoading(false);
        return;
      }

      if (userStr) {
        const user = JSON.parse(userStr);
        setBarbershopId(user.barbershopId);
      }

      // Carregar configurações
      const configResponse = await fetch('https://barberflow-api-v2.onrender.com/api/barbershop/config', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (configResponse.ok) {
        const data = await configResponse.json();
        setConfig({ ...config, ...data });
      }

      // Carregar dados da barbearia (logo)
      const barbershopResponse = await fetch('https://barberflow-api-v2.onrender.com/api/barbershop', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (barbershopResponse.ok) {
        const data = await barbershopResponse.json();
        setBarbershop(data);
      }

    } catch (error) {
      console.error('❌ Erro ao carregar:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBarbers = async () => {
    try {
      const token = localStorage.getItem('@barberFlow:token');
      if (!token) return;

      const response = await fetch('https://barberflow-api-v2.onrender.com/api/barbershop/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // Filtrar apenas barbeiros (role: barber)
        const barbersOnly = data.filter((user: any) => user.role === 'barber' || user.role === 'admin');
        setBarbers(barbersOnly);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar barbeiros:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage('');
    try {
      const token = localStorage.getItem('@barberFlow:token');
      
      if (!token) {
        alert('❌ Token não encontrado. Faça login novamente.');
        return;
      }

      const response = await fetch('https://barberflow-api-v2.onrender.com/api/barbershop/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('✅ Configurações salvas com sucesso!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert(`❌ Erro: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('❌ Erro:', error);
      alert('❌ Erro ao salvar. Verifique sua conexão.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('@barberFlow:token');
      const response = await fetch('https://barberflow-api-v2.onrender.com/api/upload/barbershop-logo', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const { logoUrl } = await response.json();
        setBarbershop(prev => prev ? { ...prev, logo: logoUrl } : null);
        alert('✅ Logo atualizado com sucesso!');
      } else {
        alert('❌ Erro ao enviar logo');
      }
    } catch (error) {
      alert('❌ Erro ao enviar logo');
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>, barberId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setUploadingAvatar(barberId);
    try {
      const token = localStorage.getItem('@barberFlow:token');
      // ✅ FIX: Passar barberId na URL
      const response = await fetch(`https://barberflow-api-v2.onrender.com/api/upload/user-avatar/${barberId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const { avatarUrl } = await response.json();
        setBarbers(prev => prev.map(b => 
          b.id === barberId ? { ...b, avatar: avatarUrl } : b
        ));
        alert('✅ Avatar atualizado com sucesso!');
      } else {
        const error = await response.json();
        alert(`❌ Erro: ${error.error || 'Erro ao enviar avatar'}`);
      }
    } catch (error) {
      console.error('❌ Erro:', error);
      alert('❌ Erro ao enviar avatar');
    } finally {
      setUploadingAvatar(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('@barberFlow:token');
      const response = await fetch('https://barberflow-api-v2.onrender.com/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const { url } = await response.json();
        if (type === 'hero') {
          setConfig({ ...config, heroImage: url });
        } else {
          setConfig({ ...config, galleryImages: [...config.galleryImages, url] });
        }
        alert('✅ Imagem enviada com sucesso!');
      } else {
        alert('❌ Erro ao enviar imagem');
      }
    } catch (error) {
      alert('❌ Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newImages = config.galleryImages.filter((_, i) => i !== index);
    setConfig({ ...config, galleryImages: newImages });
  };

  const openPreview = () => {
    if (barbershopId) {
      window.open(`/barbearia/${barbershopId}`, '_blank');
    } else {
      alert('ID da barbearia não encontrado');
    }
  };

  const tabs = [
    { id: 'hero', label: 'Hero/Banner', icon: ImageIcon, color: 'blue' },
    { id: 'about', label: 'Sobre', icon: Info, color: 'purple' },
    { id: 'gallery', label: 'Galeria', icon: ImageIcon, color: 'pink' },
    { id: 'hours', label: 'Horários', icon: Clock, color: 'green' },
    { id: 'social', label: 'Redes Sociais', icon: Share2, color: 'orange' },
    { id: 'design', label: 'Design & Logo', icon: Palette, color: 'red' },
    { id: 'team', label: 'Equipe', icon: Users, color: 'cyan' },
    { id: 'features', label: 'Funcionalidades', icon: Settings, color: 'indigo' }
  ];

  const dayNames: Record<string, string> = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
          <p className="text-lg font-semibold text-gray-700">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header Premium */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Personalizar Landing Page
                </h1>
                <p className="text-gray-600 text-sm mt-1">Configure sua presença digital profissional</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={openPreview}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition shadow-md border border-gray-200 font-medium"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Visualizar</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition shadow-lg font-medium"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Salvar Alterações</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {successMessage && (
            <div className="mt-4 flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg animate-in slide-in-from-top">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-purple-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Visualizações</p>
                <p className="text-lg font-bold text-gray-900">1.2k+</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-blue-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Taxa Conversão</p>
                <p className="text-lg font-bold text-gray-900">24%</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-green-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Completude</p>
                <p className="text-lg font-bold text-gray-900">87%</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-xl p-4 border border-orange-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Globe className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Status</p>
                <p className="text-lg font-bold text-green-600">Ativa</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar de Tabs Premium */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-gray-200 shadow-xl sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? `bg-gradient-to-r from-${tab.color}-600 to-${tab.color}-500 text-white shadow-lg scale-105`
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-gray-200 shadow-xl">
              
              {/* Hero/Banner */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <ImageIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Hero/Banner Principal</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        A primeira impressão é a que fica! ✨
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-900 font-medium mb-1">
                          Dica Profissional
                        </p>
                        <p className="text-xs text-blue-700">
                          Use uma imagem de alta qualidade (1920x1080px) que represente o ambiente da sua barbearia. Evite imagens muito escuras ou com texto sobreposto.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Imagem de Fundo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200">
                      {config.heroImage ? (
                        <div className="relative group">
                          <img src={config.heroImage} alt="Hero" className="w-full h-64 object-cover rounded-xl shadow-lg" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                            <button
                              onClick={() => setConfig({ ...config, heroImage: '' })}
                              className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition shadow-lg"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-700 font-medium mb-2">Clique para fazer upload</p>
                          <p className="text-gray-500 text-sm">PNG, JPG até 5MB • Recomendado: 1920x1080px</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'hero')}
                            disabled={uploading}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={config.heroTitle || ''}
                      onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                      placeholder="Ex: Bem-vindo à Barbearia Premium"
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Subtítulo
                    </label>
                    <input
                      type="text"
                      value={config.heroSubtitle || ''}
                      onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                      placeholder="Ex: Onde estilo encontra tradição"
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              )}

              {/* Sobre */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Info className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Sobre a Barbearia</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Conte sua história e conecte-se com seus clientes
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-purple-900 font-medium mb-1">
                          Crie Conexão Emocional
                        </p>
                        <p className="text-xs text-purple-700">
                          Fale sobre sua história, experiência, valores e o que torna sua barbearia única. Clientes se conectam com autenticidade!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Descrição Completa
                    </label>
                    <textarea
                      value={config.description || ''}
                      onChange={(e) => setConfig({ ...config, description: e.target.value })}
                      placeholder="Conte a história da sua barbearia, seus diferenciais, valores, experiência da equipe..."
                      rows={10}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        {(config.description || '').length} caracteres
                      </p>
                      <p className="text-xs text-gray-400">
                        Recomendado: 200-500 caracteres
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Galeria */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-pink-100 rounded-xl">
                      <ImageIcon className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Galeria de Fotos</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Mostre seu ambiente, trabalhos e equipe
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <Sparkles className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-pink-900 font-medium mb-1">
                          Fotos Profissionais = Mais Clientes
                        </p>
                        <p className="text-xs text-pink-700">
                          Use fotos em boa resolução mostrando: ambiente, trabalhos realizados (antes/depois), equipe, produtos. Ideal: 6-9 fotos.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {config.galleryImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-40 object-cover rounded-xl shadow-md" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <button
                            onClick={() => removeGalleryImage(index)}
                            className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition shadow-lg"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {config.galleryImages.length < 12 && (
                      <label className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 hover:bg-pink-50/50 transition-all h-40">
                        {uploading ? (
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
                        ) : (
                          <>
                            <Plus className="w-10 h-10 text-gray-400 mb-2" />
                            <span className="text-sm font-medium text-gray-600">Adicionar Foto</span>
                            <span className="text-xs text-gray-400 mt-1">Até 5MB</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'gallery')}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* Horários */}
              {activeTab === 'hours' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Horário de Funcionamento</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Deixe claro quando você está disponível
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(config.businessHours).map(([day, hours]) => (
                      <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                        <label className="w-full sm:w-48 text-sm font-semibold text-gray-700">
                          {dayNames[day]}
                        </label>
                        <input
                          type="text"
                          value={hours}
                          onChange={(e) => setConfig({
                            ...config,
                            businessHours: { ...config.businessHours, [day]: e.target.value }
                          })}
                          placeholder="09:00-20:00 ou Fechado"
                          className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-sm text-green-800 font-medium mb-2">
                      💡 Dica de Formatação
                    </p>
                    <ul className="text-xs text-green-700 space-y-1">
                      <li>• Use formato "HH:MM-HH:MM" (ex: 09:00-20:00)</li>
                      <li>• Para dias fechados, escreva "Fechado"</li>
                      <li>• Horário de almoço: "09:00-12:00, 14:00-20:00"</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Redes Sociais */}
              {activeTab === 'social' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-orange-100 rounded-xl">
                      <Share2 className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Redes Sociais</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Conecte suas redes e amplie seu alcance
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                      <TrendingUp className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-orange-900 font-medium mb-1">
                          Aumente sua Presença Digital
                        </p>
                        <p className="text-xs text-orange-700">
                          Clientes que encontram suas redes sociais têm 3x mais chances de agendar! Mantenha suas redes atualizadas.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <div className="p-2 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg">
                          <Instagram className="w-4 h-4 text-white" />
                        </div>
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={config.instagramUrl || ''}
                        onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                        placeholder="https://instagram.com/suabarbearia"
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
                      />
                    </div>

                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                          <Facebook className="w-4 h-4 text-white" />
                        </div>
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={config.facebookUrl || ''}
                        onChange={(e) => setConfig({ ...config, facebookUrl: e.target.value })}
                        placeholder="https://facebook.com/suabarbearia"
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>

                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <div className="p-2 bg-green-600 rounded-lg">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={config.whatsappNumber || ''}
                        onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                        placeholder="+55 11 99999-9999"
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Inclua o código do país e DDD (ex: +55 11 99999-9999)
                      </p>
                    </div>

                    <div className="group">
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                        <div className="p-2 bg-red-600 rounded-lg">
                          <Youtube className="w-4 h-4 text-white" />
                        </div>
                        YouTube
                      </label>
                      <input
                        type="url"
                        value={config.youtubeUrl || ''}
                        onChange={(e) => setConfig({ ...config, youtubeUrl: e.target.value })}
                        placeholder="https://youtube.com/@suabarbearia"
                        className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Design & Logo */}
              {activeTab === 'design' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-red-100 rounded-xl">
                      <Palette className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Personalização Visual</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Logo e cores da sua identidade visual
                      </p>
                    </div>
                  </div>

                  {/* Upload de Logo */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Upload className="w-6 h-6 text-indigo-600" />
                      <h3 className="font-bold text-lg text-gray-900">Logo da Barbearia</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Esta logo será exibida nos cards de serviços, horários e como fallback para barbeiros sem avatar.
                    </p>
                    
                    <div className="border-2 border-dashed border-indigo-300 rounded-xl p-6 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all">
                      {barbershop?.logo ? (
                        <div className="relative group">
                          <div className="flex justify-center mb-4">
                            <img 
                              src={barbershop.logo} 
                              alt="Logo" 
                              className="h-32 w-32 object-contain rounded-xl shadow-lg border-2 border-gray-200" 
                            />
                          </div>
                          <div className="flex gap-3 justify-center">
                            <label className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium text-sm">
                              Trocar Logo
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                disabled={uploading}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          {uploading ? (
                            <>
                              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                              <p className="text-gray-700 font-medium">Enviando...</p>
                            </>
                          ) : (
                            <>
                              <Upload className="w-16 h-16 mx-auto mb-4 text-indigo-400" />
                              <p className="text-gray-700 font-medium mb-2">Clique para fazer upload do logo</p>
                              <p className="text-gray-500 text-sm">PNG, JPG até 5MB • Recomendado: 512x512px</p>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            disabled={uploading}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-xs text-yellow-800">
                        <strong>⚠️ Importante:</strong> Se você não fizer upload do logo, a logo padrão do BarberFlow (/Logo1.png) será exibida.
                      </p>
                    </div>
                  </div>

                  {/* Cores */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                      <Award className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-900 font-medium mb-1">
                          Cores Certas = Marca Forte
                        </p>
                        <p className="text-xs text-red-700">
                          Use as cores da sua logo ou identidade visual. Cores consistentes transmitem profissionalismo!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Cor Principal
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="w-24 h-14 rounded-xl cursor-pointer border-2 border-gray-300 shadow-md hover:scale-105 transition"
                        />
                        <input
                          type="text"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Cor Secundária
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={config.secondaryColor}
                          onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                          className="w-24 h-14 rounded-xl cursor-pointer border-2 border-gray-300 shadow-md hover:scale-105 transition"
                        />
                        <input
                          type="text"
                          value={config.secondaryColor}
                          onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                          className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase font-mono transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 text-lg">Preview das Cores</h3>
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      <button
                        style={{ backgroundColor: config.primaryColor }}
                        className="w-full py-4 rounded-xl font-bold text-white shadow-lg hover:scale-105 transition-transform"
                      >
                        Botão Primário
                      </button>
                      <button
                        style={{ 
                          background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`
                        }}
                        className="w-full py-4 rounded-xl font-bold text-white shadow-lg hover:scale-105 transition-transform"
                      >
                        Gradiente (Hero Section)
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <div 
                          style={{ backgroundColor: config.primaryColor }}
                          className="h-20 rounded-xl shadow-md flex items-center justify-center text-white font-semibold"
                        >
                          Principal
                        </div>
                        <div 
                          style={{ backgroundColor: config.secondaryColor }}
                          className="h-20 rounded-xl shadow-md flex items-center justify-center text-white font-semibold"
                        >
                          Secundária
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                      🎨 Sugestões de Paletas
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setConfig({ ...config, primaryColor: '#2563eb', secondaryColor: '#7c3aed' })}
                        className="p-3 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition"
                      >
                        <div className="flex gap-1 mb-2">
                          <div className="w-8 h-8 rounded bg-blue-600"></div>
                          <div className="w-8 h-8 rounded bg-purple-600"></div>
                        </div>
                        <p className="text-xs font-medium text-gray-700">Moderno</p>
                      </button>
                      <button
                        onClick={() => setConfig({ ...config, primaryColor: '#dc2626', secondaryColor: '#ea580c' })}
                        className="p-3 rounded-lg border-2 border-gray-200 hover:border-red-400 transition"
                      >
                        <div className="flex gap-1 mb-2">
                          <div className="w-8 h-8 rounded bg-red-600"></div>
                          <div className="w-8 h-8 rounded bg-orange-600"></div>
                        </div>
                        <p className="text-xs font-medium text-gray-700">Intenso</p>
                      </button>
                      <button
                        onClick={() => setConfig({ ...config, primaryColor: '#059669', secondaryColor: '#0891b2' })}
                        className="p-3 rounded-lg border-2 border-gray-200 hover:border-green-400 transition"
                      >
                        <div className="flex gap-1 mb-2">
                          <div className="w-8 h-8 rounded bg-green-600"></div>
                          <div className="w-8 h-8 rounded bg-cyan-600"></div>
                        </div>
                        <p className="text-xs font-medium text-gray-700">Natural</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Equipe (NOVA ABA) */}
              {activeTab === 'team' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-cyan-100 rounded-xl">
                      <Users className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Gerenciar Equipe</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Personalize os avatares dos profissionais
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                      <Sparkles className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-cyan-900 font-medium mb-1">
                          Personalize Sua Equipe
                        </p>
                        <p className="text-xs text-cyan-700">
                          Fotos reais dos profissionais aumentam a confiança dos clientes. Se não houver foto, a logo da barbearia será exibida.
                        </p>
                      </div>
                    </div>
                  </div>

                  {barbers.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhum barbeiro cadastrado ainda</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {barbers.map((barber) => (
                        <div key={barber.id} className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                          <div className="flex items-start gap-4">
                            <div className="relative flex-shrink-0">
                              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-300 bg-gray-100">
                                {barber.avatar ? (
                                  <img 
                                    src={barber.avatar} 
                                    alt={barber.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 text-2xl">
                                    👤
                                  </div>
                                )}
                              </div>
                              {uploadingAvatar === barber.id && (
                                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg text-gray-900 truncate">{barber.name}</h3>
                              <p className="text-sm text-gray-500 truncate mb-3">{barber.email}</p>
                              
                              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition font-medium text-sm shadow-md">
                                <Upload className="w-4 h-4" />
                                {barber.avatar ? 'Trocar Foto' : 'Adicionar Foto'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleAvatarUpload(e, barber.id)}
                                  disabled={uploadingAvatar === barber.id}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>

                          {!barber.avatar && (
                            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <p className="text-xs text-yellow-800">
                                <strong>⚠️ Sem foto:</strong> A logo da barbearia será exibida como fallback.
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Funcionalidades */}
              {activeTab === 'features' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <Settings className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Funcionalidades</h2>
                      <p className="text-gray-600 text-sm mt-1">
                        Controle o que aparece na sua página
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 cursor-pointer hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-md group-hover:scale-110 transition">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">Agendamento Online</p>
                          <p className="text-sm text-gray-600 mt-1">Clientes podem agendar diretamente pela página</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.allowOnlineBooking}
                        onChange={(e) => setConfig({ ...config, allowOnlineBooking: e.target.checked })}
                        className="w-6 h-6 rounded-lg text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 cursor-pointer hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-md group-hover:scale-110 transition">
                          <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">Galeria de Fotos</p>
                          <p className="text-sm text-gray-600 mt-1">Exibir galeria de fotos na página</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.showGallery}
                        onChange={(e) => setConfig({ ...config, showGallery: e.target.checked })}
                        className="w-6 h-6 rounded-lg text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-center justify-between p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 cursor-pointer hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-md group-hover:scale-110 transition">
                          <Settings className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">Mostrar Equipe</p>
                          <p className="text-sm text-gray-600 mt-1">Exibir profissionais na página</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.showTeam}
                        onChange={(e) => setConfig({ ...config, showTeam: e.target.checked })}
                        className="w-6 h-6 rounded-lg text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer"
                      />
                    </label>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-5 mt-6 shadow-lg">
                    <div className="flex gap-4">
                      <AlertCircle className="w-6 h-6 text-yellow-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-900 font-bold mb-2">
                          ⚡ Sobre Agendamento Online
                        </p>
                        <p className="text-sm text-yellow-800 leading-relaxed">
                          Se desabilitar o agendamento online, os clientes verão um botão para entrar em contato por WhatsApp ou telefone ao invés do sistema de agendamento direto.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Link da Landing Page - PREMIUM CARD */}
            <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-2xl p-6 mt-6 shadow-2xl text-white">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
                  <ExternalLink className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-xl">Link da sua Landing Page</h3>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="text-white/90 text-sm mb-4">
                    Compartilhe este link com seus clientes e em suas redes sociais para aumentar seus agendamentos!
                  </p>
                  {barbershopId ? (
                    <div className="space-y-3">
                      <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-3">
                        <input
                          type="text"
                          value={`${window.location.origin}/barbearia/${barbershopId}`}
                          readOnly
                          className="w-full bg-transparent text-white text-sm outline-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/barbearia/${barbershopId}`);
                            alert('✅ Link copiado com sucesso!');
                          }}
                          className="flex-1 px-4 py-3 bg-white hover:bg-gray-100 text-purple-600 rounded-xl font-semibold transition shadow-lg"
                        >
                          📋 Copiar Link
                        </button>
                        <button
                          onClick={openPreview}
                          className="flex-1 px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-xl font-semibold transition border border-white/30"
                        >
                          🚀 Abrir Página
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <p className="text-sm text-white/80">Carregando link...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}