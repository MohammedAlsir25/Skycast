'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { WeatherData } from '@/lib/types';
import CurrentWeather from './current-weather';
import HourlyForecast from './hourly-forecast';
import DailyForecast from './daily-forecast';

interface WeatherTabsProps {
  weatherData: WeatherData;
}

const WeatherTabs = ({ weatherData }: WeatherTabsProps) => {
  return (
    <Tabs defaultValue="current" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="current">Current</TabsTrigger>
        <TabsTrigger value="hourly">Hourly</TabsTrigger>
        <TabsTrigger value="daily">Daily</TabsTrigger>
      </TabsList>
      <TabsContent value="current">
        <CurrentWeather data={weatherData.current} />
      </TabsContent>
      <TabsContent value="hourly">
        <HourlyForecast data={weatherData.hourly} />
      </TabsContent>
      <TabsContent value="daily">
        <DailyForecast data={weatherData.daily} />
      </TabsContent>
    </Tabs>
  );
};

export default WeatherTabs;
