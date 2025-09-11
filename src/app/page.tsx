'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, LoaderCircle, MapPin } from 'lucide-react';

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
import type { WeatherData, DailyForecast, HourlyForecast, WeatherPeriod } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import WeatherCard from '@/components/weather-card';

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
  const [aiSummary, setAiSummary] = useState<string | null>(null);
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

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    setAiSummary(null);
    setSelectedDayIndex(0); // Reset to today on new search
    form.setValue('city', city);
    form.clearErrors();

    try {
      const data = await getWeather(city);
      setWeatherData(data);
      const summary = await summarizeWeather(data);
      setAiSummary(summary);
    } catch (err) {
      const error = err as Error;
      setWeatherData(null);
      let errorMessage = error.message || 'An unknown error occurred.';
      if (error.message.includes('WEATHERAPI_API_KEY')) {
        errorMessage = 'WeatherAPI.com API key is missing. Please add it to your .env file.'
      }
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: FormSchema) => {
    handleSearch(data.city);
  };
  
  useEffect(() => {
    handleSearch('New York');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedDay = weatherData?.daily[selectedDayIndex];

  const displayWeather: WeatherPeriod | null = selectedDayIndex === 0 ? weatherData?.current : (selectedDay?.periods[0] || null);

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
           <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Skycast
            </h1>
            <p className="mt-1 text-muted-foreground">
                Your weather, simplified.
            </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative w-full max-w-sm">
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
                        className="pl-10 text-base"
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
              className="absolute right-1 top-1/2 -translate-y-1/2"
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
                  onDaySelect={setSelectedDayIndex}
                  selectedDayIndex={selectedDayIndex}
                  tempUnit={tempUnit}
                  onTempUnitChange={setTempUnit}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
