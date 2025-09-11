'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, LoaderCircle, MapPin, LocateFixed, Calendar, Clock, Wind, Globe, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { getWeather } from '@/app/actions';
import { summarizeWeather } from '@/ai/flows/weather-summary-flow';
import { findNearbyCities } from '@/ai/flows/nearby-cities-flow';
import { getClothingRecommendation } from '@/ai/flows/clothing-recommendation-flow';
import type { WeatherData, DailyForecast, HourlyForecast } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import WeatherBackground from '@/components/weather-background';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CurrentWeather from '@/components/current-weather';
import DailyForecastComponent from '@/components/daily-forecast';
import HourlyChart from '@/components/hourly-chart';
import AirQualityIndex from '@/components/air-quality-index';
import NearbyCities from '@/components/nearby-cities';
import WeatherAlerts from '@/components/weather-alerts';
import { Section } from '@/components/section';


const formSchema = z.object({
  city: z
    .string()
    .min(2, { message: 'City name must be at least 2 characters.' }),
});

type FormSchema = z.infer<typeof formSchema>;
export type TempUnit = 'F' | 'C';

const getHourlyForSelectedDay = (
  hourly: HourlyForecast[] | undefined,
  selectedDay: DailyForecast | undefined,
  selectedDayIndex: number
): HourlyForecast[] => {
  if (!hourly || !selectedDay) return [];
  // Show all hourly data if it's the current day (index 0)
  if (selectedDayIndex === 0) {
    const today = new Date();
    const currentHour = today.getHours();
    // Filter to show from the current hour onwards for today
    return hourly.filter(h => {
        const hourDate = new Date(h.date);
        if (hourDate.toDateString() !== today.toDateString()) return true;
        
        const timeParts = h.time.split(/:| /); // Split by colon or space
        let forecastHour = parseInt(timeParts[0], 10);
        const period = timeParts[2];
        
        if (period === 'PM' && forecastHour !== 12) {
            forecastHour += 12;
        } else if (period === 'AM' && forecastHour === 12) {
            forecastHour = 0;
        }

        return hourDate.toDateString() === today.toDateString() && forecastHour >= currentHour;
    });
  }
  return hourly.filter(h => h.date === selectedDay.date);
};

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [nearbyCitiesWeather, setNearbyCitiesWeather] = useState<WeatherData[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [clothingRecommendation, setClothingRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: 'New York',
    },
  });
  
  const fetchNearbyCitiesWeather = async (country: string, currentCity: string) => {
    setLoadingNearby(true);
    setNearbyCitiesWeather([]);
    try {
      const nearby = await findNearbyCities({ country, currentCity });
      const weatherPromises = nearby.cities.slice(0, 4).map(city => getWeather(city)); // Limit to 4 cities
      const results = await Promise.all(weatherPromises);
      setNearbyCitiesWeather(results);
    } catch (err) {
      console.error("Failed to fetch nearby cities' weather:", err);
      // Don't show a toast for this, it's a background process
    } finally {
      setLoadingNearby(false);
    }
  };

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    setAiSummary(null);
    setClothingRecommendation(null);
    setNearbyCitiesWeather([]);
    setSelectedDayIndex(0); // Reset to today on new search
    form.clearErrors();

    try {
      const data = await getWeather(city);
      setWeatherData(data);
      form.setValue('city', data.location.name); // Set city name from response
      
      try {
        const summary = await summarizeWeather(data);
        setAiSummary(summary);
      } catch (err) {
        console.error("AI summary failed:", err);
        setAiSummary(null); // Gracefully handle AI summary failure
      }

      try {
        const recommendation = await getClothingRecommendation(data);
        setClothingRecommendation(recommendation);
      } catch (err) {
        console.error("Clothing recommendation failed:", err);
        setClothingRecommendation(null);
      }

      fetchNearbyCitiesWeather(data.location.country, data.location.name);

    } catch (err) {
      const error = err as Error;
      setWeatherData(null);
      let errorMessage = error.message || 'An unknown error occurred.';
      if (error.message.includes('WEATHERAPI_API_KEY')) {
        errorMessage = 'WeatherAPI.com API key is missing. Please add it to your .env file.'
      }
      setError(errorMessage);
      form.setValue('city', city);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          handleSearch(`${latitude},${longitude}`);
        },
        () => {
          toast({
            variant: 'destructive',
            title: 'Geolocation Error',
            description: 'Could not get your location. Defaulting to New York.',
          });
          handleSearch('New York'); // Fallback to default
        }
      );
    } else {
       toast({
        variant: 'destructive',
        title: 'Geolocation Error',
        description: 'Geolocation is not supported by your browser. Defaulting to New York.',
      });
      handleSearch('New York'); // Fallback to default
    }
  };

  const onSubmit = (data: FormSchema) => {
    handleSearch(data.city);
  };
  
  useEffect(() => {
    handleGeolocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedDay = weatherData?.daily[selectedDayIndex];
  const displayWeather = selectedDayIndex === 0 ? weatherData?.current : (selectedDay?.periods[0] || null);
  const hourlyData = getHourlyForSelectedDay(weatherData?.hourly, selectedDay, selectedDayIndex);
  
  return (
    <>
      <WeatherBackground weatherData={weatherData} />
      <main className="flex min-h-screen w-full flex-col items-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-4xl space-y-6">
          <div className="flex w-full items-center justify-between gap-4">
            <div className='flex items-center gap-2 flex-shrink-0'>
              <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Skycast
              </h1>
              <p className="mt-1 text-muted-foreground hidden md:block">
                  Your weather, simplified.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-grow justify-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <Button variant="ghost" size="icon" onClick={handleGeolocation}>
                          <LocateFixed className="h-[1.2rem] w-[1.2rem]" />
                          <span className="sr-only">Get Current Location</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Use my location</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-full max-w-xs">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                placeholder="Enter a city name..."
                                className="pl-10 text-base bg-card/80 backdrop-blur-sm"
                                {...field}
                                aria-label="City Name"
                                />
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        disabled={loading}
                        aria-label="Search"
                    >
                        {loading ? (
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        ) : (
                        <Search className="h-5 w-5" />
                        )}
                    </Button>
                    </form>
                </Form>
            </div>
          </div>
          
          <AnimatePresence>
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative min-h-[550px]">
              {loading && (
                  <div className="absolute inset-0 flex h-full items-center justify-center bg-background/30 backdrop-blur-sm rounded-lg z-20">
                      <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
                  </div>
              )}
            <AnimatePresence mode="wait">
              {weatherData && displayWeather && !loading && (
                <motion.div
                  key={weatherData.location.name + selectedDayIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <CurrentWeather
                    location={weatherData.location}
                    displayWeather={displayWeather}
                    aiSummary={aiSummary}
                    clothingRecommendation={clothingRecommendation}
                    selectedDay={selectedDay}
                    tempUnit={tempUnit}
                    onTempUnitChange={setTempUnit}
                  />

                  <Section icon={<Calendar className="h-5 w-5" />} title="7-Day Forecast">
                    <DailyForecastComponent
                      data={weatherData.daily}
                      onDaySelect={setSelectedDayIndex}
                      selectedIndex={selectedDayIndex}
                      tempUnit={tempUnit}
                    />
                  </Section>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Section icon={<Clock className="h-5 w-5" />} title="Hourly Forecast">
                      <HourlyChart data={hourlyData} tempUnit={tempUnit} />
                    </Section>
                    <Section icon={<Wind className="h-5 w-5" />} title="Air Quality">
                       {weatherData.airQuality ? (
                        <AirQualityIndex data={weatherData.airQuality} />
                      ) : (
                        <div className="text-center text-muted-foreground p-4">
                          Air Quality data not available.
                        </div>
                      )}
                    </Section>
                  </div>

                  {weatherData.alerts && weatherData.alerts.length > 0 && (
                    <Section icon={<AlertTriangle className="h-5 w-5" />} title="Active Alerts">
                      <WeatherAlerts alerts={weatherData.alerts} />
                    </Section>
                  )}

                  <Section icon={<Globe className="h-5 w-5" />} title="Elsewhere">
                    <NearbyCities
                      weatherDataList={nearbyCitiesWeather}
                      loading={loadingNearby}
                      tempUnit={tempUnit}
                      onCityClick={handleSearch}
                    />
                  </Section>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>
  );
}
