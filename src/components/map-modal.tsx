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

const MapModal = ({ isOpen, onClose, weatherDataList, tempUnit }: MapModalProps) => {
  if (!isOpen || weatherDataList.length === 0) {
    return null;
  }

  // Calculate bounding box
  const latitudes = weatherDataList.map(data => data.location.lat);
  const longitudes = weatherDataList.map(data => data.location.lon);
  const minLat = Math.min(...latitudes) - 1;
  const maxLat = Math.max(...latitudes) + 1;
  const minLon = Math.min(...longitudes) - 1;
  const maxLon = Math.max(...longitudes) + 1;

  const bbox = [minLon, minLat, maxLon, maxLat].join(',');

  const markers = weatherDataList.map(data => {
    const temp = Math.round(tempUnit === 'F' ? data.current.temperature_f : data.current.temperature_c);
    const label = `${data.location.name}: ${temp}°`;
    return `marker=${data.location.lat},${data.location.lon};${encodeURIComponent(label)}`;
  }).join('&');

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&${markers}`;

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
            frameBorder="0"
            scrolling="no"
            src={mapUrl}
            className='rounded-md border'
            ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapModal;
