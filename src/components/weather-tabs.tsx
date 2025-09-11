import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { WeatherData } from '@/lib/types';
import CurrentWeather from './current-weather';
import HourlyForecast from './hourly-forecast';
import DailyForecast from './daily-forecast';

interface WeatherTabsProps {
  data: WeatherData;
}

const WeatherTabs = ({ data }: WeatherTabsProps) => {
  return (
    <Tabs defaultValue="current" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="current">Current</TabsTrigger>
        <TabsTrigger value="hourly">Hourly</TabsTrigger>
        <TabsTrigger value="daily">Daily</TabsTrigger>
      </TabsList>
      <TabsContent value="current">
        <CurrentWeather data={data} />
      </TabsContent>
      <TabsContent value="hourly">
        <HourlyForecast data={data.hourly} />
      </TabsContent>
      <TabsContent value="daily">
        <DailyForecast data={data.daily} />
      </TabsContent>
    </Tabs>
  );
};

export default WeatherTabs;
