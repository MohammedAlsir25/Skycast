import WeatherIcon from '@/components/weather-icon';
import type { DailyForecast } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DailyForecastProps {
  data: DailyForecast[];
  title?: string;
  onDaySelect: (index: number) => void;
  selectedIndex: number;
}

const DailyForecast = ({ data, title = "7-Day Forecast", onDaySelect, selectedIndex }: DailyForecastProps) => {
  return (
    <div>
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {data.map((day, index) => (
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
                className="h-10 w-10 text-primary"
              />
              <div className="text-center">
                <p className="text-base font-bold">{Math.round(day.high)}&deg;</p>
                <p className="text-xs text-muted-foreground">{Math.round(day.low)}&deg;</p>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default DailyForecast;
