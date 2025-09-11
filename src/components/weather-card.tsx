import type { WeatherData } from '@/lib/types';
import CurrentWeather from './current-weather';
import DailyForecast from './daily-forecast';
import { Separator } from './ui/separator';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  return (
    <div className="w-full space-y-6">
      <CurrentWeather data={data} />
      <Separator />
      <DailyForecast data={data.daily} />
    </div>
  );
};

export default WeatherCard;
