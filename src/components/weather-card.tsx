import type { WeatherData } from '@/lib/types';
import WeatherTabs from '@/components/weather-tabs';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  return (
    <div className="w-full">
      <WeatherTabs weatherData={data} />
    </div>
  );
};

export default WeatherCard;
