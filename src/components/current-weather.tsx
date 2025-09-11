import { Card, CardContent } from '@/components/ui/card';
import WeatherIcon from '@/components/weather-icon';
import type { WeatherData } from '@/lib/types';
import WeatherDetails from './weather-details';

interface CurrentWeatherProps {
  data: WeatherData;
}

const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  const { main, weather, sys } = data;
  const weatherInfo = weather[0];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex flex-col items-center md:flex-row md:gap-6">
            <WeatherIcon
              iconCode={weatherInfo.icon}
              className="h-32 w-32 text-primary"
            />
            <div>
              <p className="font-headline text-8xl font-bold">
                {Math.round(main.temp)}&deg;
              </p>
              <p className="text-lg capitalize text-muted-foreground">
                {weatherInfo.description}
              </p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-2xl font-semibold">
              Feels like {Math.round(main.feels_like)}&deg;
            </p>
            <p className="text-sm text-muted-foreground">
              The real feel temperature
            </p>
          </div>
        </div>

        <div className="mt-8">
            <WeatherDetails data={data} />
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentWeather;
