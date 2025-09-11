'use client';

import { useEffect, useMemo } from 'react';
import type { WeatherData } from '@/lib/types';
import type { TempUnit } from '@/app/page';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import L from 'leaflet';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherDataList: WeatherData[];
  tempUnit: TempUnit;
}

const createCustomIcon = (temp: number, unit: TempUnit) => {
  const html = `
    <div style="background-color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; justify-content: center; align-items: center; border: 2px solid #3b82f6; font-weight: bold; font-size: 14px;">
      ${Math.round(temp)}°
    </div>
  `;
  return L.divIcon({
    html: html,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const RecenterAutomatically = ({ bounds }: { bounds: LatLngBoundsExpression | null }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

// This is a separate component to ensure it gets a new `key` and is fully re-mounted
const WeatherMap = ({ weatherDataList, tempUnit }: { weatherDataList: WeatherData[], tempUnit: TempUnit }) => {
  const positions = useMemo(() => weatherDataList.map(wd => ({
    lat: wd.location.lat,
    lng: wd.location.lon,
    name: wd.location.name,
    temp: tempUnit === 'F' ? wd.current.temperature_f : wd.current.temperature_c,
    forecast: wd.current.shortForecast,
    icon: createCustomIcon(tempUnit === 'F' ? wd.current.temperature_f : wd.current.temperature_c, tempUnit),
  })), [weatherDataList, tempUnit]);

  if (positions.length === 0) return null;

  const hasMultiplePoints = positions.length > 1;
  const bounds: LatLngBoundsExpression | null = hasMultiplePoints
    ? positions.map(p => [p.lat, p.lng])
    : null;

  return (
      <MapContainer
          center={[positions[0].lat, positions[0].lng]}
          zoom={hasMultiplePoints ? undefined : 10}
          scrollWheelZoom={true}
          className="h-full w-full rounded-md"
      >
          <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {positions.map(pos => (
              <Marker key={pos.name} position={[pos.lat, pos.lng]} icon={pos.icon}>
                  <Popup>
                      <b>{pos.name}</b><br/>
                      {Math.round(pos.temp)}°{tempUnit} - {pos.forecast}
                  </Popup>
              </Marker>
          ))}
          {bounds && <RecenterAutomatically bounds={bounds} />}
      </MapContainer>
  );
}


const MapModal = ({ isOpen, onClose, weatherDataList, tempUnit }: MapModalProps) => {

  // Generate a key from city names to force re-render
  const mapKey = useMemo(() => weatherDataList.map(w => w.location.name).join('-'), [weatherDataList]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Weather Across Cities</DialogTitle>
          <DialogDescription>
            Temperatures for the current and nearby cities. Click a marker for more details.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow p-6 pt-2">
           {isOpen && weatherDataList.length > 0 && (
             <WeatherMap key={mapKey} weatherDataList={weatherDataList} tempUnit={tempUnit} />
           )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
