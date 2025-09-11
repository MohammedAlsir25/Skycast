import { Droplets, Wind, Compass, Sun } from 'lucide-react';
import type { WeatherPeriod } from '@/lib/types';

interface WeatherDetailsProps {
  period: WeatherPeriod;
}

const getUVIndexCategory = (uvIndex: number | undefined | null): string => {
    if (uvIndex === null || uvIndex === undefined) return 'N/A';
    if (uvIndex <= 2) return 'Low';
    if (uvIndex <= 5) return 'Moderate';
    if (uvIndex <= 7) return 'High';
    if (uvIndex <= 10) return 'Very High';
    return 'Extreme';
};


const DetailItem = ({ icon, label, value, unit, category }: { icon: React.ReactNode, label: string, value: string | number | undefined | null, unit?: string, category?: string }) => {
    if (value === undefined || value === null || value === '') return null;

    return (
        <div className="flex items-center gap-3">
            {icon}
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-base font-semibold">{value}{unit}
                 {category && <span className='text-sm text-muted-foreground ml-1'>({category})</span>}
                </p>
            </div>
        </div>
    )
}

const WeatherDetails = ({ period }: WeatherDetailsProps) => {
  const { 
      probabilityOfPrecipitation,
      relativeHumidity,
      windSpeed,
      windDirection,
      uv,
    } = period;
  
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-4">
        <DetailItem icon={<Droplets className="h-6 w-6 text-primary" />} label="Precipitation" value={probabilityOfPrecipitation?.value ?? 0} unit="%"/>
        <DetailItem icon={<Droplets className="h-6 w-6 text-primary" />} label="Humidity" value={relativeHumidity?.value} unit="%"/>
        <DetailItem icon={<Wind className="h-6 w-6 text-primary" />} label="Wind Speed" value={windSpeed} />
        <DetailItem icon={<Compass className="h-6 w-6 text-primary" />} label="Wind Direction" value={windDirection} />
        <DetailItem icon={<Sun className="h-6 w-6 text-primary" />} label="UV Index" value={uv} category={getUVIndexCategory(uv)} />
    </div>
  );
};

export default WeatherDetails;
