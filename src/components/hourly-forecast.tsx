import WeatherIcon from '@/components/weather-icon';
import type { HourlyForecast } from '@/lib/types';
import type { TempUnit } from '@/app/page';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface HourlyForecastProps {
  data: HourlyForecast[];
  title?: string;
  tempUnit: TempUnit;
}

const HourlyForecast = ({ data, title = "Hourly Forecast", tempUnit }: HourlyForecastProps) => {
    if (data.length === 0) return null;
    
  return (
    <div>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
            <div className="flex w-max space-x-4 p-4">
            {data.map((hour, index) => {
              const temp = tempUnit === 'F' ? hour.temperature_f : hour.temperature_c;
              return (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <p className="text-sm font-semibold">{hour.time}</p>
                  <WeatherIcon
                      iconCode={hour.icon}
                      className="h-12 w-12"
                  />
                  <p className="text-lg font-bold">{Math.round(temp)}&deg;{tempUnit}</p>
                </div>
              )
            })}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    </div>
  );
};

export default HourlyForecast;
