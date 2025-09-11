import type { WeatherData } from '@/lib/types';
import type { TempUnit } from '@/app/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WeatherIcon from '@/components/weather-icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe } from 'lucide-react';

interface NearbyCitiesProps {
  weatherDataList: WeatherData[];
  loading: boolean;
  tempUnit: TempUnit;
  onCityClick: (city: string) => void;
}

const NearbyCityCard = ({ weatherData, tempUnit, onClick }: { weatherData: WeatherData, tempUnit: TempUnit, onClick: () => void }) => {
  const { location, current } = weatherData;
  const temp = tempUnit === 'F' ? current.temperature_f : current.temperature_c;
  
  return (
    <div 
      className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent transition-colors cursor-pointer border"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <WeatherIcon iconCode={current.icon} shortForecast={current.shortForecast} className="h-12 w-12" />
        <div>
          <p className="font-semibold">{location.name}</p>
          <p className="text-sm text-muted-foreground">{current.shortForecast}</p>
        </div>
      </div>
      <p className="text-xl font-bold">{Math.round(temp)}&deg;</p>
    </div>
  );
};


const NearbyCities = ({ weatherDataList, loading, tempUnit, onCityClick }: NearbyCitiesProps) => {
  const hasCities = weatherDataList.length > 0;

  return (
    <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Elsewhere
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading && (
                <>
                    <Skeleton className="h-[88px] w-full" />
                    <Skeleton className="h-[88px] w-full" />
                    <Skeleton className="h-[88px] w-full" />
                    <Skeleton className="h-[88px] w-full" />
                </>
            )}
            {!loading && hasCities && weatherDataList.map((weatherData) => (
                <NearbyCityCard 
                    key={weatherData.location.name} 
                    weatherData={weatherData} 
                    tempUnit={tempUnit}
                    onClick={() => onCityClick(weatherData.location.name)}
                />
            ))}
             {!loading && !hasCities && (
                <p className="text-muted-foreground col-span-2 text-center">No nearby cities to display.</p>
            )}
        </div>
    </div>
  );
};

export default NearbyCities;
