import type { WeatherData } from '@/lib/types';
import WeatherTabs from './weather-tabs';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  return (
    <div className="w-full">
      <WeatherTabs data={data} />
    </div>
  );
};

export default WeatherCard;
