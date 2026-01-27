'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix do ícone padrão do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícone vermelho para usuário
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Ícone azul para barbearias
const barbershopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Barbershop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  logo?: string;
}

interface BarbershopMapProps {
  userLocation: { lat: number; lng: number };
  barbershops: Barbershop[];
  onBarbershopClick?: (id: string) => void;
}

// Componente para ajustar o zoom/centro do mapa
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

export default function BarbershopMap({ userLocation, barbershops, onBarbershopClick }: BarbershopMapProps) {
  if (typeof window === 'undefined') return null;

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater center={[userLocation.lat, userLocation.lng]} zoom={13} />

      {/* Marcador do usuário */}
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup>
          <div className="text-center">
            <strong className="text-red-600">📍 Você está aqui</strong>
          </div>
        </Popup>
      </Marker>

      {/* Marcadores das barbearias */}
      {barbershops.map((barbershop) => (
        <Marker
          key={barbershop.id}
          position={[barbershop.latitude, barbershop.longitude]}
          icon={barbershopIcon}
          eventHandlers={{
            click: () => onBarbershopClick?.(barbershop.id)
          }}
        >
          <Popup>
            <div className="text-center min-w-[200px]">
              {barbershop.logo && (
                <img 
                  src={barbershop.logo} 
                  alt={barbershop.name}
                  className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                />
              )}
              <strong className="text-blue-600 text-base">{barbershop.name}</strong>
              <p className="text-sm text-gray-600 mt-1">
                📍 {barbershop.distance.toFixed(1)} km de distância
              </p>
              <button
                onClick={() => onBarbershopClick?.(barbershop.id)}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition"
              >
                Ver detalhes
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}