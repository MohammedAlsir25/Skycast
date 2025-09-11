import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WeatherIcon from '@/components/weather-icon';
import type { HourlyForecast } from '@/lib/types';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface HourlyForecastProps {
  data: HourlyForecast[];
  title?: string;
}

const HourlyForecast = ({ data, title = "Hourly Forecast" }: HourlyForecastProps) => {
    if (data.length === 0) return null;
    
  return (
    <div>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
            <div className="flex w-max space-x-4 p-4">
            {data.map((hour, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                <p className="text-sm font-semibold">{hour.time}</p>
                <WeatherIcon
                    iconCode={hour.icon}
                    className="h-8 w-8 text-primary"
                />
                <p className="text-lg font-bold">{Math.round(hour.temperature)}&deg;F</p>
                </div>
            ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    </div>
  );
};

export default HourlyForecast;
