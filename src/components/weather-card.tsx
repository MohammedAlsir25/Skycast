import type { WeatherData } from '@/lib/types';
import CurrentWeather from './current-weather';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  return (
    <div className="w-full">
      <CurrentWeather data={data} />
    </div>
  );
};

export default WeatherCard;
