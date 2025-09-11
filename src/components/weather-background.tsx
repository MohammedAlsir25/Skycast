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
  const [animationDelay, setAnimationDelay] = useState('-0s');

  useEffect(() => {
    const newClass = getWeatherBackgroundClass(weather);
    if (newClass !== backgroundClass) {
      setPreviousClass(backgroundClass);
      setBackgroundClass(newClass);
    }
  }, [weather, backgroundClass]);
  
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    let cycleDuration = 0;
    let startOfCycle = 0;

    if (weather?.isDaytime) {
      // Assuming daytime is roughly 6 AM to 6 PM (12 hours)
      startOfCycle = 6 * 60; 
      cycleDuration = 12 * 60;
    } else {
      // Assuming nighttime is 6 PM to 6 AM (12 hours)
      startOfCycle = 18 * 60;
      cycleDuration = 12 * 60;
      if (totalMinutes < startOfCycle) {
        // Handle time past midnight (e.g., 1 AM is part of the "previous" night cycle)
        startOfCycle -= 24 * 60;
      }
    }

    const elapsedMinutes = totalMinutes - startOfCycle;
    const percentageOfDay = (elapsedMinutes / cycleDuration);
    
    // Total animation duration is 60s
    const delay = -(percentageOfDay * 60);
    setAnimationDelay(`${delay}s`);

  }, [weather]);


  // We render two divs to create a cross-fade effect.
  // This is a simple way to do it without extra libraries.
  return (
    <>
        <div key={previousClass} className={cn('weather-bg', previousClass, 'opacity-0')} />
        <div key={backgroundClass} className={cn('weather-bg', backgroundClass, 'opacity-100')}>
            {weather && (
                <div 
                    className={cn('celestial-body', weather.isDaytime ? 'sun' : 'moon')}
                    style={{ animationDelay }}
                />
            )}
        </div>
    </>
  );
};

export default WeatherBackground;
