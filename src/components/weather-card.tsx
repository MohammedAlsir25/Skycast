import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import WeatherIcon from '@/components/weather-icon';
import type { WeatherData } from '@/lib/types';
import { Droplets, Wind, Gauge, Sunrise, Sunset } from 'lucide-react';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  const { name, sys, weather, main, wind, dt } = data;
  const weatherInfo = weather[0];
  const date = new Date(dt * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const formatTime = (timestamp: number) =>
    new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

  return (
    <Card className="h-full w-full overflow-hidden shadow-lg">
      <CardHeader className="bg-primary/20 p-4">
        <CardTitle className="text-2xl font-bold">
          {name}, {sys.country}
        </CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent className="flex h-full flex-col justify-between p-4">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:gap-12 sm:text-left">
          <div className="flex flex-col items-center">
            <WeatherIcon
              iconCode={weatherInfo.icon}
              className="h-24 w-24 text-primary"
            />
            <p className="mt-2 text-lg capitalize text-muted-foreground">
              {weatherInfo.description}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="font-headline text-7xl font-bold">
              {Math.round(main.temp)}&deg;C
            </p>
            <p className="text-md text-muted-foreground">
              Feels like {Math.round(main.feels_like)}&deg;C
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div className="flex items-center gap-2 rounded-lg bg-accent/50 p-3">
            <Droplets className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">{main.humidity}%</p>
              <p className="text-xs text-muted-foreground">Humidity</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-accent/50 p-3">
            <Wind className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">{wind.speed} m/s</p>
              <p className="text-xs text-muted-foreground">Wind Speed</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-accent/50 p-3">
            <Gauge className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">{main.pressure} hPa</p>
              <p className="text-xs text-muted-foreground">Pressure</p>
            </div>
          </div>
           <div className="flex items-center gap-2 rounded-lg bg-accent/50 p-3">
            <Sunrise className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">{formatTime(sys.sunrise)}</p>
              <p className="text-xs text-muted-foreground">Sunrise</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
