'use client';

import { useEffect, useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, LoaderCircle, MapPin, LocateFixed } from 'lucide-react';

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
import type { WeatherData, DailyForecast, HourlyForecast, WeatherPeriod, AirQuality } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import WeatherCard from '@/components/weather-card';
import WeatherBackground from '@/components/weather-background';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import NearbyCities from '@/components/nearby-cities';

const formSchema = z.object({
  city: z
    .string()
    .min(2, { message: 'City name must be at least 2 characters.' }),
});

type FormSchema = z.infer<typeof formSchema>;
export type TempUnit = 'F' | 'C';

const getHourlyForSelectedDay = (
  hourly: HourlyForecast[] | undefined,
  selectedDay: DailyForecast | undefined
): HourlyForecast[] => {
  if (!hourly || !selectedDay) return [];
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
  const [tempUnit, setTempUnit] = useState<TempUnit>('F');
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
      const weatherPromises = nearby.cities.slice(0, 5).map(city => getWeather(city)); // Limit to 5 cities
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

  const displayWeather: WeatherPeriod | null = selectedDayIndex === 0 ? weatherData?.current : (selectedDay?.periods[0] || null);
  
  return (
    <>
      <WeatherBackground weatherData={weatherData} />
      <main className="flex min-h-screen w-full flex-col items-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-4xl space-y-6">
          <div className="flex w-full items-center justify-between">
            <div className='flex items-center gap-2'>
              <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Skycast
              </h1>
              <p className="mt-1 text-muted-foreground hidden md:block">
                  Your weather, simplified.
              </p>
            </div>
            <div className="flex items-center gap-2">
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
                        className="absolute right-1 top-1 h-8 w-8"
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
              {(loading) && (
                  <div className="absolute inset-0 flex h-full items-center justify-center">
                      <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
                  </div>
              )}
            <AnimatePresence>
              {weatherData && displayWeather && !loading && (
                <motion.div
                  key={selectedDayIndex}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <WeatherCard 
                    location={weatherData.location}
                    displayWeather={displayWeather}
                    dailyData={weatherData.daily}
                    hourlyData={getHourlyForSelectedDay(weatherData.hourly, selectedDay)}
                    aiSummary={aiSummary}
                    clothingRecommendation={clothingRecommendation}
                    airQuality={weatherData.airQuality}
                    onDaySelect={setSelectedDayIndex}
                    selectedDayIndex={selectedDayIndex}
                    tempUnit={tempUnit}
                    onTempUnitChange={setTempUnit}
                    nearbyCities={
                      <NearbyCities 
                        weatherDataList={nearbyCitiesWeather} 
                        loading={loadingNearby}
                        tempUnit={tempUnit}
                        onCityClick={handleSearch}
                      />
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>
  );
}
