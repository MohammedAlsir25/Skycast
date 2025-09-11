import { Card, CardContent } from '@/components/ui/card';
import WeatherIcon from '@/components/weather-icon';
import type { DailyWeatherData } from '@/lib/types';
import { format } from 'date-fns';

interface DailyForecastProps {
  data: DailyWeatherData[];
}

const DailyForecast = ({ data }: DailyForecastProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.slice(1, 8).map((day, index) => (
        <Card key={index}>
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            <p className="font-semibold">{format(new Date(day.dt * 1000), 'eeee')}</p>
            <WeatherIcon
              iconCode={day.weather[0].icon}
              className="h-16 w-16 text-primary"
            />
            <div>
              <p className="text-xl font-bold">{Math.round(day.temp.max)}&deg;</p>
              <p className="text-muted-foreground">{Math.round(day.temp.min)}&deg;</p>
            </div>
            <p className="text-sm capitalize text-muted-foreground">{day.weather[0].description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DailyForecast;
