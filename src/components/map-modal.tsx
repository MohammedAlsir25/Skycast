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
    const { lat, lon, name } = primaryLocation.location;
    const temp = tempUnit === 'F' ? primaryLocation.current.temperature_f : primaryLocation.current.temperature_c;
    const tempString = `${Math.round(temp)}°${tempUnit}`;

    // Apple Maps URL parameters are more limited for embeds.
    // We can center the map and place a pin for the primary location.
    // It does not support multiple markers in the same way OpenStreetMap does.
    const q = `${name} (${tempString})`;
    const center = `${lat},${lon}`;
    
    // Set a reasonable span for the map view.
    // The values are in degrees of latitude and longitude.
    const span = weatherDataList.length > 1 ? '5.0,5.0' : '1.0,1.0';
    
    return `https://maps.apple.com/maps?q=${encodeURIComponent(q)}&ll=${center}&spn=${span}&t=m&z=10`;
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
            Map view showing the currently selected location.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow p-6 pt-2">
           <iframe
              width="100%"
              height="100%"
              className='border rounded-md'
              src={mapUrl}
              allow="geo"
           >
           </iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
