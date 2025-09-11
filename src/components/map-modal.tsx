'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { WeatherData } from '@/lib/types';
import type { TempUnit } from '@/app/page';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import "leaflet-defaulticon-compatibility";


interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherDataList: WeatherData[];
  tempUnit: TempUnit;
}

// Component to auto-fit the map to the markers
const MapBounds = ({ bounds }: { bounds: LatLngBoundsExpression }) => {
  const map = useMap();
  map.fitBounds(bounds, { padding: [50, 50] });
  return null;
};

const MapModal = ({ isOpen, onClose, weatherDataList, tempUnit }: MapModalProps) => {
  if (!isOpen || weatherDataList.length === 0) {
    return null;
  }

  const positions = weatherDataList.map(data => ({
    lat: data.location.lat,
    lng: data.location.lon,
    name: data.location.name,
    temp: Math.round(tempUnit === 'F' ? data.current.temperature_f : data.current.temperature_c),
  }));

  const bounds: LatLngBoundsExpression = positions.map(p => [p.lat, p.lng]);
  const hasMultiplePoints = positions.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0">
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle>Weather Map</DialogTitle>
          <DialogDescription>
            Current temperatures for the selected and nearby cities.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow p-6 pt-2">
            <MapContainer
                center={[positions[0].lat, positions[0].lng]}
                zoom={hasMultiplePoints ? undefined : 10}
                scrollWheelZoom={true}
                className='h-full w-full rounded-md border'
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {positions.map((pos) => (
                    <Marker key={pos.name} position={[pos.lat, pos.lng]}>
                        <Popup>
                           <b>{pos.name}</b>: {pos.temp}°{tempUnit}
                        </Popup>
                    </Marker>
                ))}
                {hasMultiplePoints && <MapBounds bounds={bounds} />}
            </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
