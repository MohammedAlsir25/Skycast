import WeatherIcon from '@/components/weather-icon';
import type { DailyWeatherData } from '@/lib/types';
import { format } from 'date-fns';

interface DailyForecastProps {
  data: DailyWeatherData[];
  title?: string;
}

const DailyForecast = ({ data, title = "5-Day Forecast" }: DailyForecastProps) => {
  return (
    <div>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {data.map((day, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 p-3 bg-card rounded-lg border hover:bg-accent transition-colors">
              <p className="font-semibold">{format(new Date(day.dt * 1000), 'eee')}</p>
              <WeatherIcon
                iconCode={day.weather[0].icon}
                className="h-10 w-10 text-primary"
              />
              <div className="text-center">
                <p className="text-base font-bold">{Math.round(day.temp.max)}&deg;</p>
                <p className="text-xs text-muted-foreground">{Math.round(day.temp.min)}&deg;</p>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default DailyForecast;
