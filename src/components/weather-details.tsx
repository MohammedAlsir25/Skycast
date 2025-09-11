import { Droplets, Wind, Gauge, Sunrise, Sunset, Eye, Thermometer } from 'lucide-react';
import type { CurrentWeatherData } from '@/lib/types';

interface WeatherDetailsProps {
  data: Partial<CurrentWeatherData>; // Use Partial as some data might be missing for future days
  isToday: boolean;
}

const formatTime = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const DetailItem = ({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: string | number | undefined, unit?: string }) => {
    if (value === undefined || value === null) return null;

    return (
        <div className="flex items-center gap-3">
            {icon}
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-base font-semibold">{value}{unit}</p>
            </div>
        </div>
    )
}

const WeatherDetails = ({ data, isToday }: WeatherDetailsProps) => {
  const { humidity, wind_speed, pressure, visibility, sunrise, sunset } = data;
  
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
        {isToday && (
            <>
                <DetailItem icon={<Droplets className="h-6 w-6 text-primary" />} label="Humidity" value={humidity} unit="%"/>
                <DetailItem icon={<Wind className="h-6 w-6 text-primary" />} label="Wind Speed" value={wind_speed?.toFixed(1)} unit=" m/s" />
                <DetailItem icon={<Gauge className="h-6 w-6 text-primary" />} label="Pressure" value={pressure} unit=" hPa" />
                <DetailItem icon={<Eye className="h-6 w-6 text-primary" />} label="Visibility" value={visibility ? (visibility / 1000).toFixed(1) : undefined} unit=" km"/>
            </>
        )}
        <DetailItem icon={<Sunrise className="h-6 w-6 text-primary" />} label="Sunrise" value={sunrise ? formatTime(sunrise) : undefined} />
        <DetailItem icon={<Sunset className="h-6 w-6 text-primary" />} label="Sunset" value={sunset ? formatTime(sunset) : undefined} />
    </div>
  );
};

export default WeatherDetails;
