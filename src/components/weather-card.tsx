import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import WeatherIcon from '@/components/weather-icon';
import type { WeatherLocation, DailyForecast, HourlyForecast, WeatherPeriod } from '@/lib/types';
import WeatherDetails from './weather-details';
import DailyForecast from './daily-forecast';
import HourlyForecast from './hourly-forecast';
import { Separator } from './ui/separator';

interface WeatherCardProps {
  location: WeatherLocation;
  displayWeather: WeatherPeriod;
  displayTemp: number | undefined;
  dailyData: DailyForecast[];
  hourlyData: HourlyForecast[];
  onDaySelect: (index: number) => void;
  selectedDayIndex: number;
}

const WeatherCard = ({ 
    location, 
    displayWeather, 
    displayTemp,
    dailyData, 
    hourlyData, 
    onDaySelect, 
    selectedDayIndex 
}: WeatherCardProps) => {
  const { name, state } = location;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-3xl font-bold">{name}{state ? `, ${state}`: ''}</CardTitle>
                 <CardDescription>{new Date(displayWeather.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </div>
             <div className="text-right">
                <p className="text-lg font-semibold">
                  {displayWeather.shortForecast}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedDayIndex === 0 ? "Current conditions" : "Forecast"}
                </p>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-8">
           <div className="flex items-center">
            <WeatherIcon
              iconCode={displayWeather.icon}
              className="h-32 w-32 text-primary"
            />
            <div>
              <p className="font-headline text-8xl font-bold">
                {displayTemp ? Math.round(displayTemp) : 'N/A'}&deg;
              </p>
              <p className="text-lg capitalize text-muted-foreground">
                {displayWeather.name}
              </p>
            </div>
           </div>
           <Separator orientation='vertical' className="hidden md:flex h-24"/>
           <WeatherDetails period={displayWeather} />
        </div>
        <Separator/>
        <HourlyForecast data={hourlyData} />
        <Separator/>
        <DailyForecast data={dailyData} onDaySelect={onDaySelect} selectedIndex={selectedDayIndex} />
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
