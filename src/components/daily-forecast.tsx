import WeatherIcon from '@/components/weather-icon';
import type { DailyForecast } from '@/lib/types';
import type { TempUnit } from '@/app/page';
import { cn } from '@/lib/utils';

interface DailyForecastProps {
  data: DailyForecast[];
  title?: string;
  onDaySelect: (index: number) => void;
  selectedIndex: number;
  tempUnit: TempUnit;
}

const DailyForecast = ({ data, title = "7-Day Forecast", onDaySelect, selectedIndex, tempUnit }: DailyForecastProps) => {
  return (
    <div>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {data.map((day, index) => {
            const high = tempUnit === 'F' ? day.high_f : day.high_c;
            const low = tempUnit === 'F' ? day.low_f : day.low_c;
            return (
              <div 
                key={index} 
                className={cn(
                  "flex flex-col items-center space-y-2 p-3 rounded-lg border transition-colors cursor-pointer",
                  selectedIndex === index ? "bg-accent ring-2 ring-primary" : "bg-card hover:bg-accent"
                )}
                onClick={() => onDaySelect(index)}
              >
                <p className="font-semibold">{day.day}</p>
                <WeatherIcon
                  iconCode={day.icon}
                  className="h-16 w-16"
                />
                <div className="text-center">
                  <p className="text-base font-bold">{Math.round(high)}&deg;</p>
                  <p className="text-xs text-muted-foreground">{Math.round(low)}&deg;</p>
                </div>
              </div>
            )
          })}
        </div>
    </div>
  );
};

export default DailyForecast;
