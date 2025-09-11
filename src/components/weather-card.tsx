import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import WeatherIcon from '@/components/weather-icon';
import type { WeatherLocation, DailyForecast, HourlyForecast, WeatherPeriod, AirQuality, WeatherAlert } from '@/lib/types';
import type { TempUnit } from '@/app/page';
import WeatherDetails from './weather-details';
import DailyForecast from './daily-forecast';
import HourlyChart from './hourly-chart';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Droplets, Wind, Thermometer, Shirt, Bot } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AirQualityIndex from './air-quality-index';
import WeatherAlerts from './weather-alerts';


interface WeatherCardProps {
  location: WeatherLocation;
  displayWeather: WeatherPeriod;
  dailyData: DailyForecast[];
  hourlyData: HourlyForecast[];
  aiSummary: string | null;
  clothingRecommendation: string | null;
  airQuality: AirQuality | null | undefined;
  alerts: WeatherAlert[] | undefined;
  onDaySelect: (index: number) => void;
  selectedDayIndex: number;
  tempUnit: TempUnit;
  onTempUnitChange: (unit: TempUnit) => void;
  nearbyCities: React.ReactNode;
}

const WeatherCard = ({ 
    location, 
    displayWeather, 
    dailyData, 
    hourlyData,
    aiSummary,
    clothingRecommendation,
    airQuality,
    alerts,
    onDaySelect, 
    selectedDayIndex,
    tempUnit,
    onTempUnitChange,
    nearbyCities
}: WeatherCardProps) => {
  const { name, state, country } = location;

  const displayDate = new Date(displayWeather.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const locationParts = [name];
    if (state && state !== name) {
        locationParts.push(state);
    }
    if (country && country !== name) {
        locationParts.push(country);
    }
    const locationName = locationParts.filter(Boolean).join(', ');

  const displayTemp = tempUnit === 'F' ? displayWeather.temperature_f : displayWeather.temperature_c;
  const selectedDay = dailyData[selectedDayIndex];

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
        <WeatherAlerts alerts={alerts} />
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
           <WeatherDetails period={displayWeather} sunrise={selectedDay?.sunrise} sunset={selectedDay?.sunset} />
        </div>
        
        {aiSummary && (
            <div className="flex items-start gap-4 rounded-lg border bg-accent/50 p-4 text-sm text-accent-foreground">
                <Bot className="h-6 w-6 shrink-0 mt-0.5" />
                <p className='leading-relaxed'>{aiSummary}</p>
            </div>
        )}

        {clothingRecommendation && (
            <div className="flex items-center gap-4 rounded-lg border bg-accent/50 p-4 text-sm text-accent-foreground">
                <Shirt className="h-6 w-6 shrink-0" />
                <p>{clothingRecommendation}</p>
            </div>
        )}
        
        {airQuality && <AirQualityIndex data={airQuality} />}

        <Separator/>
        <div>
            <h3 className="mb-4 text-lg font-bold">Hourly Forecast</h3>
            <Tabs defaultValue="temperature">
                <TabsList className='grid w-full grid-cols-4'>
                    <TabsTrigger value="temperature"><Thermometer className='h-4 w-4 mr-2'/>Temp</TabsTrigger>
                    <TabsTrigger value="precip"><Droplets className='h-4 w-4 mr-2'/>Precip</TabsTrigger>
                    <TabsTrigger value="humidity"><Droplets className='h-4 w-4 mr-2'/>Humidity</TabsTrigger>
                    <TabsTrigger value="wind"><Wind className='h-4 w-4 mr-2'/>Wind</TabsTrigger>
                </TabsList>
                <TabsContent value="temperature">
                    <HourlyChart data={hourlyData} dataType='temperature' tempUnit={tempUnit} />
                </TabsContent>
                <TabsContent value="precip">
                    <HourlyChart data={hourlyData} dataType='precip' tempUnit={tempUnit} />
                </TabsContent>
                 <TabsContent value="humidity">
                    <HourlyChart data={hourlyData} dataType='humidity' tempUnit={tempUnit} />
                </TabsContent>
                 <TabsContent value="wind">
                    <HourlyChart data={hourlyData} dataType='wind' tempUnit={tempUnit} />
                </TabsContent>
            </Tabs>
        </div>
        <Separator/>
        <DailyForecast data={dailyData} onDaySelect={onDaySelect} selectedIndex={selectedDayIndex} tempUnit={tempUnit}/>
        <Separator/>
        {nearbyCities}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
