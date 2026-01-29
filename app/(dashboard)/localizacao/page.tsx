'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { MapPin, Search, Save, Loader, CheckCircle, AlertCircle, Navigation } from 'lucide-react';

interface LocationData {
  zipCode: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
}

export default function LocalizacaoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchingCep, setSearchingCep] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState<LocationData>({
    zipCode: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    latitude: null,
    longitude: null
  });

  useEffect(() => {
    loadLocation();
  }, []);

  async function loadLocation() {
    try {
      const response = await api.get('/barbershop-location/my-location');
      const data = response.data;
      
      setFormData({
        zipCode: data.zipCode || '',
        address: data.address || '',
        number: data.number || '',
        complement: data.complement || '',
        neighborhood: data.neighborhood || '',
        city: data.city || '',
        state: data.state || '',
        latitude: data.latitude,
        longitude: data.longitude
      });
    } catch (error) {
      console.error('Erro ao carregar localização:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCepSearch() {
    const cleanCep = formData.zipCode.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      showMessage('error', 'CEP inválido. Digite 8 dígitos.');
      return;
    }

    setSearchingCep(true);
    try {
      const response = await api.get(`/barbershop-location/geocode/cep/${cleanCep}`);
      const data = response.data;

      setFormData(prev => ({
        ...prev,
        zipCode: data.cep.replace(/\D/g, ''),
        address: data.street || prev.address,
        neighborhood: data.neighborhood || prev.neighborhood,
        city: data.city || prev.city,
        state: data.state || prev.state,
        latitude: data.latitude,
        longitude: data.longitude
      }));

      showMessage('success', 'CEP encontrado! Preencha o número e clique em Salvar.');
    } catch (error: any) {
      showMessage('error', error.response?.data?.error || 'CEP não encontrado');
    } finally {
      setSearchingCep(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.zipCode || !formData.address || !formData.neighborhood || !formData.city || !formData.state) {
      showMessage('error', 'Preencha todos os campos obrigatórios');
      return;
    }

    setSaving(true);
    try {
      await api.put('/barbershop-location/update-location', formData);
      showMessage('success', 'Localização atualizada com sucesso!');
      loadLocation();
    } catch (error: any) {
      showMessage('error', error.response?.data?.error || 'Erro ao salvar localização');
    } finally {
      setSaving(false);
    }
  }

  function showMessage(type: 'success' | 'error', text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  }

  function formatCep(value: string) {
    const clean = value.replace(/\D/g, '');
    if (clean.length <= 5) return clean;
    return `${clean.slice(0, 5)}-${clean.slice(5, 8)}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Localização</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Configure o endereço da sua barbearia
          </p>
        </div>
      </div>

      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Navigation className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900 font-medium mb-1">
              Por que cadastrar a localização?
            </p>
            <p className="text-xs text-blue-700">
              Clientes poderão encontrar sua barbearia por proximidade, aumentando suas chances de agendamento!
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CEP *</label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={formatCep(formData.zipCode)}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              placeholder="00000-000"
              maxLength={9}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white"
            />
            <button
              type="button"
              onClick={handleCepSearch}
              disabled={searchingCep}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition flex items-center gap-2"
            >
              {searchingCep ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Buscando...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Buscar</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Digite o CEP e clique em Buscar para preencher automaticamente
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Endereço (Rua/Avenida) *</label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Ex: Rua das Flores"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              placeholder="123"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Complemento</label>
            <input
              type="text"
              value={formData.complement}
              onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
              placeholder="Sala 10, Apto 202..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bairro *</label>
          <input
            type="text"
            required
            value={formData.neighborhood}
            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
            placeholder="Centro"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cidade *</label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="São Paulo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
            <select
              required
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 bg-white"
            >
              <option value="">Selecione...</option>
              <option value="AC">Acre</option>
              <option value="AL">Alagoas</option>
              <option value="AP">Amapá</option>
              <option value="AM">Amazonas</option>
              <option value="BA">Bahia</option>
              <option value="CE">Ceará</option>
              <option value="DF">Distrito Federal</option>
              <option value="ES">Espírito Santo</option>
              <option value="GO">Goiás</option>
              <option value="MA">Maranhão</option>
              <option value="MT">Mato Grosso</option>
              <option value="MS">Mato Grosso do Sul</option>
              <option value="MG">Minas Gerais</option>
              <option value="PA">Pará</option>
              <option value="PB">Paraíba</option>
              <option value="PR">Paraná</option>
              <option value="PE">Pernambuco</option>
              <option value="PI">Piauí</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="RN">Rio Grande do Norte</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="RO">Rondônia</option>
              <option value="RR">Roraima</option>
              <option value="SC">Santa Catarina</option>
              <option value="SP">São Paulo</option>
              <option value="SE">Sergipe</option>
              <option value="TO">Tocantins</option>
            </select>
          </div>
        </div>

        {formData.latitude && formData.longitude && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-900">Coordenadas encontradas!</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
              <div>
                <span className="font-medium">Latitude:</span> {formData.latitude.toFixed(6)}
              </div>
              <div>
                <span className="font-medium">Longitude:</span> {formData.longitude.toFixed(6)}
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Salvar Localização
            </>
          )}
        </button>
      </div>

      {formData.latitude && formData.longitude && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Prévia no Mapa
          </h3>
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${formData.longitude-0.01},${formData.latitude-0.01},${formData.longitude+0.01},${formData.latitude+0.01}&layer=mapnik&marker=${formData.latitude},${formData.longitude}`}
              style={{ border: 0 }}
            ></iframe>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            📍 Sua barbearia será exibida nesta localização para os clientes
          </p>
        </div>
      )}
    </div>
  );
}