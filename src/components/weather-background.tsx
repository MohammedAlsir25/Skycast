'use client';

import { useEffect, useState } from 'react';
import type { WeatherPeriod } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WeatherBackgroundProps {
  weather: WeatherPeriod | null | undefined;
}

const getWeatherBackgroundClass = (weather: WeatherPeriod | null | undefined): string => {
  if (!weather) return 'bg-default';

  const { shortForecast, isDaytime } = weather;
  const forecast = shortForecast.toLowerCase();
  const timeOfDay = isDaytime ? 'day' : 'night';

  if (forecast.includes('rain') || forecast.includes('shower')) {
    return `bg-${timeOfDay}-rain`;
  }
  if (forecast.includes('snow') || forecast.includes('sleet') || forecast.includes('ice')) {
    return `bg-${timeOfDay}-snow`;
  }
  if (forecast.includes('cloud') || forecast.includes('overcast')) {
    return `bg-${timeOfDay}-cloudy`;
  }
  if (forecast.includes('clear') || forecast.includes('sunny')) {
    return `bg-${timeOfDay}-clear`;
  }

  return 'bg-default';
};

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weather }) => {
  const [backgroundClass, setBackgroundClass] = useState('bg-default');
  const [previousClass, setPreviousClass] = useState('');

  useEffect(() => {
    const newClass = getWeatherBackgroundClass(weather);
    if (newClass !== backgroundClass) {
      setPreviousClass(backgroundClass);
      setBackgroundClass(newClass);
    }
  }, [weather, backgroundClass]);
  
  // We render two divs to create a cross-fade effect.
  // This is a simple way to do it without extra libraries.
  return (
    <>
        <div key={previousClass} className={cn('weather-bg', previousClass, 'opacity-0')} />
        <div key={backgroundClass} className={cn('weather-bg', backgroundClass, 'opacity-100')} />
    </>
  );
};

export default WeatherBackground;
