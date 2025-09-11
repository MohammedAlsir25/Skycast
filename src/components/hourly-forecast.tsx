import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import WeatherIcon from '@/components/weather-icon';
import type { WeatherData } from '@/lib/types';

interface HourlyForecastProps {
  data: WeatherData['hourly'];
}

const HourlyForecast = ({ data }: HourlyForecastProps) => {
  // Show forecast for the next 24 hours
  const next24Hours = data.slice(1, 25);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel
          opts={{
            align: 'start',
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {next24Hours.map((hour, index) => (
              <CarouselItem
                key={index}
                className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-[12.5%]"
              >
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-secondary/50 p-4 text-center">
                  <p className="text-sm font-medium">
                    {new Date(hour.dt * 1000).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      hour12: true,
                    })}
                  </p>
                  <WeatherIcon
                    iconCode={hour.weather[0].icon}
                    className="h-10 w-10"
                  />
                  <p className="text-xl font-bold">{Math.round(hour.temp)}&deg;</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex"/>
          <CarouselNext className="hidden md:flex"/>
        </Carousel>
      </CardContent>
    </Card>
  );
};

export default HourlyForecast;
