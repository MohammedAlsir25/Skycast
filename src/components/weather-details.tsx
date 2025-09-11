import { Droplets, Wind, Compass } from 'lucide-react';
import type { WeatherPeriod } from '@/lib/types';

interface WeatherDetailsProps {
  period: WeatherPeriod;
}

const DetailItem = ({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: string | number | undefined | null, unit?: string }) => {
    if (value === undefined || value === null || value === '') return null;

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

const WeatherDetails = ({ period }: WeatherDetailsProps) => {
  const { 
      probabilityOfPrecipitation, 
      humidity, 
      windSpeed, 
      windDirection 
    } = period;
  
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-3">
        <DetailItem icon={<Droplets className="h-6 w-6 text-primary" />} label="Precipitation" value={probabilityOfPrecipitation?.value} unit="%"/>
        <DetailItem icon={<Droplets className="h-6 w-6 text-primary" />} label="Humidity" value={humidity?.value} unit="%"/>
        <DetailItem icon={<Wind className="h-6 w-6 text-primary" />} label="Wind Speed" value={windSpeed} />
        <DetailItem icon={<Compass className="h-6 w-6 text-primary" />} label="Wind Direction" value={windDirection} />
    </div>
  );
};

export default WeatherDetails;
