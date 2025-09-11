import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import WeatherIcon from '@/components/weather-icon';
import type { WeatherLocation, DailyForecast, HourlyForecast, WeatherPeriod } from '@/lib/types';
import type { TempUnit } from '@/app/page';
import WeatherDetails from './weather-details';
import DailyForecast from './daily-forecast';
import HourlyChart from './hourly-chart';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Sparkles } from 'lucide-react';

interface WeatherCardProps {
  location: WeatherLocation;
  displayWeather: WeatherPeriod;
  dailyData: DailyForecast[];
  hourlyData: HourlyForecast[];
  aiSummary: string | null;
  onDaySelect: (index: number) => void;
  selectedDayIndex: number;
  tempUnit: TempUnit;
  onTempUnitChange: (unit: TempUnit) => void;
}

const WeatherCard = ({ 
    location, 
    displayWeather, 
    dailyData, 
    hourlyData,
    aiSummary,
    onDaySelect, 
    selectedDayIndex,
    tempUnit,
    onTempUnitChange
}: WeatherCardProps) => {
  const { name, state, country } = location;

  const displayDate = new Date(displayWeather.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const locationName = [name, state, country].filter(Boolean).join(', ');

  const displayTemp = tempUnit === 'F' ? displayWeather.temperature_f : displayWeather.temperature_c;

  return (
    <Card className="w-full bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle className="text-3xl font-bold">{locationName}</CardTitle>
                 <CardDescription>{displayDate}</CardDescription>
            </div>
             <div className="text-right">
                <p className="text-lg font-semibold capitalize">
                  {displayWeather.shortForecast}
                </p>
                <div className="flex items-center justify-end space-x-2 mt-2">
                    <Label htmlFor="temp-unit-switch" className={tempUnit === 'F' ? 'text-foreground' : 'text-muted-foreground'}>&deg;F</Label>
                    <Switch
                        id="temp-unit-switch"
                        checked={tempUnit === 'C'}
                        onCheckedChange={(checked) => onTempUnitChange(checked ? 'C' : 'F')}
                        aria-label="Toggle temperature unit"
                    />
                    <Label htmlFor="temp-unit-switch" className={tempUnit === 'C' ? 'text-foreground' : 'text-muted-foreground'}>&deg;C</Label>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:gap-8">
           <div className="flex items-center">
            <WeatherIcon
              iconCode={displayWeather.icon}
              shortForecast={displayWeather.shortForecast}
              className="h-32 w-32"
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
        {aiSummary && (
            <div className="rounded-lg border bg-accent/50 p-4 text-sm text-accent-foreground">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Summary
                </div>
                {aiSummary}
            </div>
        )}
        <Separator/>
        <HourlyChart data={hourlyData} tempUnit={tempUnit} />
        <Separator/>
        <DailyForecast data={dailyData} onDaySelect={onDaySelect} selectedIndex={selectedDayIndex} tempUnit={tempUnit}/>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
