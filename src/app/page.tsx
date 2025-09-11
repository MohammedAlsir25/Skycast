'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, LoaderCircle } from 'lucide-react';

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
import WeatherCard from '@/components/weather-card';
import { getWeather } from '@/app/actions';
import type { WeatherData } from '@/lib/types';
import { suggestLocation } from '@/ai/flows/ai-suggest-location';

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
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: '',
    },
  });

  async function handleSearch(city: string) {
    setLoading(true);
    setWeather(null);
    setSuggestions([]);
    form.setValue('city', city);
    form.clearErrors();

    try {
      const weatherData = await getWeather(city);
      setWeather(weatherData);
    } catch (error) {
      const err = error as Error;
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: err.message || 'Failed to fetch weather data.',
      });
      if (err.message.toLowerCase().includes('not found')) {
        try {
          const aiResponse = await suggestLocation({ city });
          setSuggestions(aiResponse.suggestions);
        } catch (aiError) {
          console.error('AI suggestion failed:', aiError);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = (data: FormSchema) => {
    handleSearch(data.city);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Skycast
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your weather, simplified.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
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


        <div className="relative h-[450px]">
          <AnimatePresence>
            {weather && (
              <motion.div
                key="weather-card"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.3 }}
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
