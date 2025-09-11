import { Card, CardContent } from '@/components/ui/card';
import WeatherIcon from '@/components/weather-icon';
import type { DailyWeatherData } from '@/lib/types';
import { format } from 'date-fns';

interface DailyForecastProps {
  data: DailyWeatherData[];
  title?: string;
}

const DailyForecast = ({ data, title = "5-Day Forecast" }: DailyForecastProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {data.map((day, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 p-4 bg-secondary/50 rounded-lg">
              <p className="font-semibold">{format(new Date(day.dt * 1000), 'eee')}</p>
              <WeatherIcon
                iconCode={day.weather[0].icon}
                className="h-12 w-12 text-primary"
              />
              <div className="text-center">
                <p className="text-lg font-bold">{Math.round(day.temp.max)}&deg;</p>
                <p className="text-sm text-muted-foreground">{Math.round(day.temp.min)}&deg;</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyForecast;
