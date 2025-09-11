import { Droplets, Wind, Gauge, Sunrise, Sunset, Eye, Sun } from 'lucide-react';
import type { WeatherData } from '@/lib/types';

interface WeatherDetailsProps {
  data: WeatherData['current'];
}

const formatTime = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="flex items-center gap-4 rounded-lg bg-secondary/50 p-4">
        {icon}
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    </div>
)

const WeatherDetails = ({ data }: WeatherDetailsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 lg:grid-cols-4">
        <DetailItem icon={<Droplets className="h-6 w-6 text-primary" />} label="Humidity" value={`${data.humidity}%`} />
        <DetailItem icon={<Wind className="h-6 w-6 text-primary" />} label="Wind Speed" value={`${data.wind_speed} m/s`} />
        <DetailItem icon={<Gauge className="h-6 w-6 text-primary" />} label="Pressure" value={`${data.pressure} hPa`} />
        <DetailItem icon={<Eye className="h-6 w-6 text-primary" />} label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`} />
        <DetailItem icon={<Sun className="h-6 w-6 text-primary" />} label="UV Index" value={data.uvi} />
        <DetailItem icon={<Sunrise className="h-6 w-6 text-primary" />} label="Sunrise" value={formatTime(data.sunrise)} />
        <DetailItem icon={<Sunset className="h-6 w-6 text-primary" />} label="Sunset" value={formatTime(data.sunset)} />
    </div>
  );
};

export default WeatherDetails;
