import { Card, CardContent } from '@/components/ui/card';
import WeatherIcon from '@/components/weather-icon';
import type { HourlyWeatherData } from '@/lib/types';
import { format } from 'date-fns';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface HourlyForecastProps {
  data: HourlyWeatherData[];
}

const HourlyForecast = ({ data }: HourlyForecastProps) => {
  return (
    <div className="px-12">
      <Carousel
        opts={{
          align: 'start',
        }}
      >
        <CarouselContent>
          {data.slice(1, 25).map((hour, index) => (
            <CarouselItem key={index} className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
              <Card>
                <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                  <p className="text-sm font-semibold">
                    {format(new Date(hour.dt * 1000), 'ha')}
                  </p>
                  <WeatherIcon
                    iconCode={hour.weather[0].icon}
                    className="h-10 w-10 text-primary"
                  />
                  <p className="font-bold">{Math.round(hour.temp)}&deg;</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default HourlyForecast;
