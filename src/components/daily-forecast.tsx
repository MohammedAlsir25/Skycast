import WeatherIcon from '@/components/weather-icon';
import type { DailyForecast } from '@/lib/types';
import type { TempUnit } from '@/app/page';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';


interface DailyForecastProps {
  data: DailyForecast[];
  onDaySelect: (index: number) => void;
  selectedIndex: number;
  tempUnit: TempUnit;
}

const DailyForecastComponent = ({ data, onDaySelect, selectedIndex, tempUnit }: DailyForecastProps) => {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-7 gap-4">
      {data.map((day, index) => {
        const high = tempUnit === 'F' ? day.high_f : day.high_c;
        const low = tempUnit === 'F' ? day.low_f : day.low_c;
        return (
          <button
            key={index} 
            className={cn(
              "flex flex-col items-center space-y-2 p-3 rounded-lg border text-sm transition-colors w-full",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              selectedIndex === index ? "bg-primary/90 text-primary-foreground ring-2 ring-primary-foreground" : "bg-slate-800/60 hover:bg-slate-700/60"
            )}
            onClick={() => onDaySelect(index)}
            aria-label={`Select forecast for ${day.day}`}
          >
            <p className="font-semibold">{day.day}</p>
            <WeatherIcon
              iconCode={day.icon}
              shortForecast={day.shortForecast}
              className="h-16 w-16"
            />
            <div className="text-center">
              <p className="font-bold">{Math.round(high)}&deg;</p>
              <p className="text-xs text-muted-foreground">{Math.round(low)}&deg;</p>
            </div>
          </button>
        )
      })}
    </div>
  );
};

export default DailyForecastComponent;
