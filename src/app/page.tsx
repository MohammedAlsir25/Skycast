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
import type { WeatherData } from '@/lib/types';
import { suggestLocation } from '@/ai/flows/ai-suggest-location';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import WeatherCard from '@/components/weather-card';

const formSchema = z.object({
  city: z
    .string()
    .min(2, { message: 'City name must be at least 2 characters.' }),
});

type FormSchema = z.infer<typeof formSchema>;

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: 'New York',
    },
  });

  const handleSearch = async (city: string) => {
    setLoading(true);
    setWeather(null);
    setSuggestions([]);
    setError(null);
    form.setValue('city', city);
    form.clearErrors();

    try {
      const weatherData = await getWeather(city);
      setWeather(weatherData);
    } catch (err) {
      const error = err as Error;
      if (error.message.startsWith('Missing OpenWeatherMap API Key')) {
        setError(error.message);
      } else {
        toast({
          variant: 'destructive',
          title: 'An error occurred',
          description: error.message || 'Failed to fetch weather data.',
        });
        if (error.message.toLowerCase().includes('not found')) {
          try {
            const aiResponse = await suggestLocation({ city });
            setSuggestions(aiResponse.suggestions);
          } catch (aiError) {
            console.error('AI suggestion failed:', aiError);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = (data: FormSchema) => {
    handleSearch(data.city);
  };
  
  // Initial search on component mount
  useEffect(() => {
    handleSearch('New York');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
           <div className="text-center md:text-left">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {weather ? `${weather.name}, ${weather.sys.country}`: "Skycast"}
            </h1>
            <p className="mt-1 text-muted-foreground">
                {weather ? new Date(weather.current.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Your weather, simplified."}
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
          {error && (
             <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Action Required</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-lg border bg-card p-4"
            >
              <h3 className="text-sm font-medium text-muted-foreground">Did you mean:</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSearch(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        <div className="relative min-h-[300px]">
            {(loading || !weather) && (
                 <div className="absolute inset-0 flex h-full items-center justify-center">
                    <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
                </div>
            )}
          <AnimatePresence>
            {weather && (
              <motion.div
                key="weather-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <WeatherCard data={weather} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
