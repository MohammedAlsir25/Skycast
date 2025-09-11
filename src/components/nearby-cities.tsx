import type { WeatherData } from '@/lib/types';
import type { TempUnit } from '@/app/page';
import WeatherIcon from '@/components/weather-icon';
import { Skeleton } from '@/components/ui/skeleton';

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
    <button
      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition-colors cursor-pointer border w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={onClick}
      aria-label={`View weather for ${location.name}`}
    >
      <div className="flex items-center gap-4">
        <WeatherIcon iconCode={current.icon} shortForecast={current.shortForecast} className="h-12 w-12" />
        <div>
          <p className="font-semibold">{location.name}</p>
          <p className="text-sm text-muted-foreground">{current.shortForecast}</p>
        </div>
      </div>
      <p className="text-xl font-bold">{Math.round(temp)}&deg;</p>
    </button>
  );
};


const NearbyCities = ({ weatherDataList, loading, tempUnit, onCityClick }: NearbyCitiesProps) => {
  const hasCities = weatherDataList.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[88px] w-full" />)}
        
        {!loading && hasCities && weatherDataList.map((weatherData) => (
            <NearbyCityCard 
                key={weatherData.location.name} 
                weatherData={weatherData} 
                tempUnit={tempUnit}
                onClick={() => onCityClick(weatherData.location.name)}
            />
        ))}
         {!loading && !hasCities && (
            <p className="text-muted-foreground col-span-2 text-center py-4">No nearby cities to display.</p>
        )}
    </div>
  );
};

export default NearbyCities;
