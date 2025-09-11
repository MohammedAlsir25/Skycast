import { Droplets, Wind, Gauge, Sunrise, Sunset, Eye, Thermometer } from 'lucide-react';
import type { CurrentWeatherData } from '@/lib/types';

interface WeatherDetailsProps {
  data: CurrentWeatherData;
}

const formatTime = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="flex items-center gap-3">
        {icon}
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-base font-semibold">{value}</p>
        </div>
    </div>
)

const WeatherDetails = ({ data }: WeatherDetailsProps) => {
  const { humidity, wind_speed, pressure, visibility, sunrise, sunset } = data;
  
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
        <DetailItem icon={<Droplets className="h-6 w-6 text-primary" />} label="Humidity" value={`${humidity}%`} />
        <DetailItem icon={<Wind className="h-6 w-6 text-primary" />} label="Wind Speed" value={`${wind_speed.toFixed(1)} m/s`} />
        <DetailItem icon={<Gauge className="h-6 w-6 text-primary" />} label="Pressure" value={`${pressure} hPa`} />
        <DetailItem icon={<Eye className="h-6 w-6 text-primary" />} label="Visibility" value={`${(visibility / 1000).toFixed(1)} km`} />
        <DetailItem icon={<Sunrise className="h-6 w-6 text-primary" />} label="Sunrise" value={formatTime(sunrise)} />
        <DetailItem icon={<Sunset className="h-6 w-6 text-primary" />} label="Sunset" value={formatTime(sunset)} />
    </div>
  );
};

export default WeatherDetails;
