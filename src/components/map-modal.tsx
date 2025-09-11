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

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherDataList: WeatherData[];
  tempUnit: TempUnit;
}

const getMapUrl = (weatherDataList: WeatherData[], tempUnit: TempUnit) => {
    if (weatherDataList.length === 0) {
        return "about:blank";
    }

    const primaryLocation = weatherDataList[0];
    const { lat, lon } = primaryLocation.location;

    const markers = weatherDataList.map(data => {
        const temp = tempUnit === 'F' ? data.current.temperature_f : data.current.temperature_c;
        const label = `${data.location.name} (${Math.round(temp)}°${tempUnit})`;
        return `marker=${data.location.lat},${data.location.lon},${encodeURIComponent(label)}`;
    }).join('&');

    const zoom = weatherDataList.length > 1 ? 6 : 10;
    
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon-2},${lat-2},${lon+2},${lat+2}&layer=mapnik&marker=${lat},${lon}&${markers}`;
};


const MapModal = ({ isOpen, onClose, weatherDataList, tempUnit }: MapModalProps) => {
  if (!isOpen) return null;
  
  const mapUrl = getMapUrl(weatherDataList, tempUnit);

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
           <iframe
              width="100%"
              height="100%"
              className='border rounded-md'
              src={mapUrl}
           >
           </iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
