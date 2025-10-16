'use client';

import { useState, useEffect } from 'react';
import { 
  Save, Eye, Palette, Image as ImageIcon, Info, Clock, 
  Share2, Settings, Upload, X, Plus, Trash2, Instagram,
  Facebook, MessageCircle, Youtube, CheckCircle, AlertCircle,
  ExternalLink, Globe
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

export default function ConfigurarLandingPage() {
  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [barbershopId, setBarbershopId] = useState('');
  
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
  }, []);

  const loadConfig = async () => {
    try {
      const token = sessionStorage.getItem('@barberFlow:token');
      const userStr = sessionStorage.getItem('@barberFlow:user');
      
      if (userStr) {
        const user = JSON.parse(userStr);
        setBarbershopId(user.barbershopId);
      }

      const response = await fetch('https://barberflow-back-end.onrender.com/api/barbershop/config', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setConfig({ ...config, ...data });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage('');
    try {
      const token = sessionStorage.getItem('@barberFlow:token');
      const response = await fetch('https://barberflow-back-end.onrender.com/api/barbershop/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        setSuccessMessage('✅ Configurações salvas com sucesso!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert('❌ Erro ao salvar configurações');
      }
    } catch (error) {
      alert('❌ Erro ao salvar configurações');
    } finally {
      setSaving(false);
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
      const token = sessionStorage.getItem('@barberFlow:token');
      const response = await fetch('https://barberflow-back-end.onrender.com/api/upload', {
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
    { id: 'hero', label: 'Hero/Banner', icon: ImageIcon },
    { id: 'about', label: 'Sobre', icon: Info },
    { id: 'gallery', label: 'Galeria', icon: ImageIcon },
    { id: 'hours', label: 'Horários', icon: Clock },
    { id: 'social', label: 'Redes Sociais', icon: Share2 },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'features', label: 'Funcionalidades', icon: Settings }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Personalizar Landing Page</h1>
              <p className="text-gray-600 text-sm mt-1">Configure como sua barbearia aparece para os clientes</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={openPreview}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Visualizar</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Salvar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">{successMessage}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar de Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 border border-gray-200 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-md'
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
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              
              {/* Hero/Banner */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Hero/Banner Principal</h2>
                    <p className="text-gray-600 text-sm">
                      Primeira impressão que os clientes terão ao acessar sua página
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagem de Fundo
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition">
                      {config.heroImage ? (
                        <div className="relative">
                          <img src={config.heroImage} alt="Hero" className="w-full h-48 object-cover rounded-lg" />
                          <button
                            onClick={() => setConfig({ ...config, heroImage: '' })}
                            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600 mb-2">Clique para fazer upload</p>
                          <p className="text-gray-400 text-xs">PNG, JPG até 5MB</p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={config.heroTitle}
                      onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                      placeholder="Ex: Bem-vindo à Barbearia Premium"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtítulo
                    </label>
                    <input
                      type="text"
                      value={config.heroSubtitle}
                      onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                      placeholder="Ex: Onde estilo encontra tradição"
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Sobre */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Sobre a Barbearia</h2>
                    <p className="text-gray-600 text-sm">
                      Conte sua história e conecte-se com seus clientes
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição <span className="text-gray-400">(aparecerá na seção "Sobre Nós")</span>
                    </label>
                    <textarea
                      value={config.description}
                      onChange={(e) => setConfig({ ...config, description: e.target.value })}
                      placeholder="Conte a história da sua barbearia, seus diferenciais e valores..."
                      rows={8}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {config.description.length} caracteres
                    </p>
                  </div>
                </div>
              )}

              {/* Galeria */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Galeria de Fotos</h2>
                    <p className="text-gray-600 text-sm">
                      Mostre seu ambiente, trabalhos e equipe (máximo recomendado: 9 fotos)
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {config.galleryImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <button
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {config.galleryImages.length < 12 && (
                      <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition h-32">
                        {uploading ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        ) : (
                          <>
                            <Plus className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500">Adicionar</span>
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
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Horário de Funcionamento</h2>
                    <p className="text-gray-600 text-sm">
                      Configure os horários de cada dia da semana
                    </p>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(config.businessHours).map(([day, hours]) => (
                      <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <label className="w-full sm:w-40 text-sm font-medium text-gray-700">
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
                          className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Dica:</strong> Use o formato "HH:MM-HH:MM" (ex: 09:00-20:00) ou escreva "Fechado" para dias sem atendimento.
                    </p>
                  </div>
                </div>
              )}

              {/* Redes Sociais */}
              {activeTab === 'social' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Redes Sociais</h2>
                    <p className="text-gray-600 text-sm">
                      Conecte suas redes sociais para aumentar o engajamento
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Instagram className="w-4 h-4 text-pink-600" />
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={config.instagramUrl}
                        onChange={(e) => setConfig({ ...config, instagramUrl: e.target.value })}
                        placeholder="https://instagram.com/suabarbearia"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Facebook className="w-4 h-4 text-blue-600" />
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={config.facebookUrl}
                        onChange={(e) => setConfig({ ...config, facebookUrl: e.target.value })}
                        placeholder="https://facebook.com/suabarbearia"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={config.whatsappNumber}
                        onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                        placeholder="+55 11 99999-9999"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Youtube className="w-4 h-4 text-red-600" />
                        YouTube
                      </label>
                      <input
                        type="url"
                        value={config.youtubeUrl}
                        onChange={(e) => setConfig({ ...config, youtubeUrl: e.target.value })}
                        placeholder="https://youtube.com/@suabarbearia"
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Design */}
              {activeTab === 'design' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Personalização Visual</h2>
                    <p className="text-gray-600 text-sm">
                      Escolha as cores que representam sua marca
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cor Principal</label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="w-20 h-12 rounded-lg cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cor Secundária</label>
                      <div className="flex gap-3">
                        <input
                          type="color"
                          value={config.secondaryColor}
                          onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                          className="w-20 h-12 rounded-lg cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={config.secondaryColor}
                          onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                          className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Preview das Cores</h3>
                    <div className="space-y-3">
                      <button
                        style={{ backgroundColor: config.primaryColor }}
                        className="w-full py-3 rounded-lg font-bold text-white shadow-md"
                      >
                        Botão Primário
                      </button>
                      <button
                        style={{ 
                          background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`
                        }}
                        className="w-full py-3 rounded-lg font-bold text-white shadow-md"
                      >
                        Gradiente (Hero Section)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Funcionalidades */}
              {activeTab === 'features' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Funcionalidades</h2>
                    <p className="text-gray-600 text-sm">
                      Controle o que será exibido na sua landing page
                    </p>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Globe className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Permitir Agendamento Online</p>
                          <p className="text-xs text-gray-600">Clientes podem agendar diretamente pela página</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.allowOnlineBooking}
                        onChange={(e) => setConfig({ ...config, allowOnlineBooking: e.target.checked })}
                        className="w-5 h-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <ImageIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Mostrar Galeria</p>
                          <p className="text-xs text-gray-600">Exibir galeria de fotos na página</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.showGallery}
                        onChange={(e) => setConfig({ ...config, showGallery: e.target.checked })}
                        className="w-5 h-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Settings className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Mostrar Equipe</p>
                          <p className="text-xs text-gray-600">Exibir profissionais na página</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.showTeam}
                        onChange={(e) => setConfig({ ...config, showTeam: e.target.checked })}
                        className="w-5 h-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-yellow-800 font-medium mb-1">
                          Importante sobre Agendamento Online
                        </p>
                        <p className="text-xs text-yellow-700">
                          Se desabilitar o agendamento online, os clientes verão um botão para entrar em contato por telefone ao invés do sistema de agendamento.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Link da Landing Page */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 mt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-600 rounded-lg">
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Link da sua Landing Page</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Compartilhe este link com seus clientes para que eles possam ver sua página e fazer agendamentos
                  </p>
                  {barbershopId ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={`${window.location.origin}/barbearia/${barbershopId}`}
                        readOnly
                        className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/barbearia/${barbershopId}`);
                          alert('Link copiado!');
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                      >
                        Copiar
                      </button>
                      <button
                        onClick={openPreview}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition"
                      >
                        Abrir
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Carregando...</p>
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