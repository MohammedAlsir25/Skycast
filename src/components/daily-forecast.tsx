import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WeatherIcon from '@/components/weather-icon';
import type { WeatherData } from '@/lib/types';

interface DailyForecastProps {
  data: WeatherData['daily'];
}

const DailyForecast = ({ data }: DailyForecastProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.slice(1).map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
          >
            <p className="w-1/4 font-medium">
              {new Date(day.dt * 1000).toLocaleDateString('en-US', {
                weekday: 'long',
              })}
            </p>
            <div className="flex w-1/4 items-center justify-center gap-2">
              <WeatherIcon
                iconCode={day.weather[0].icon}
                className="h-8 w-8"
              />
              <span className="hidden text-sm capitalize text-muted-foreground md:inline">
                {day.weather[0].main}
              </span>
            </div>
            <p className="w-1/4 text-center text-sm text-muted-foreground">
              {Math.round(day.pop * 100)}%
            </p>
            <p className="w-1/4 text-right font-semibold">
              {Math.round(day.temp.max)}&deg; / {Math.round(day.temp.min)}&deg;
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DailyForecast;
