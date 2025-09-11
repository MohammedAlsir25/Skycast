import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import WeatherIcon from '@/components/weather-icon';
import type { WeatherData } from '@/lib/types';
import WeatherDetails from './weather-details';
import DailyForecast from './daily-forecast';
import { Separator } from './ui/separator';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard = ({ data }: WeatherCardProps) => {
  const { current, name, sys } = data;
  const weatherInfo = current.weather[0];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-3xl font-bold">{name}, {sys.country}</CardTitle>
                 <CardDescription>{new Date(current.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </div>
             <div className="text-right">
                <p className="text-lg font-semibold">
                Feels like {Math.round(current.feels_like)}&deg;
                </p>
                <p className="text-xs text-muted-foreground">
                The real feel temperature
                </p>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-8">
           <div className="flex items-center">
            <WeatherIcon
              iconCode={weatherInfo.icon}
              className="h-32 w-32 text-primary"
            />
            <div>
              <p className="font-headline text-8xl font-bold">
                {Math.round(current.temp)}&deg;
              </p>
              <p className="text-lg capitalize text-muted-foreground">
                {weatherInfo.description}
              </p>
            </div>
           </div>
           <Separator orientation='vertical' className="hidden md:flex h-24"/>
           <WeatherDetails data={data.current} />
        </div>
        <Separator/>
        <DailyForecast data={data.daily} />
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
