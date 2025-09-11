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
  const [transform, setTransform] = useState('rotate(0deg) translateX(45vw) rotate(0deg)');
  const [opacity, setOpacity] = useState(0);

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

    let startHour = 6;
    let endHour = 18;

    if (weather?.isDaytime) {
        if (hours >= startHour && hours < endHour) {
            const totalMinutesInCycle = (endHour - startHour) * 60;
            const elapsedMinutes = (hours - startHour) * 60 + minutes;
            const percentage = elapsedMinutes / totalMinutesInCycle;
            // Map percentage (0 to 1) to an angle from 15 to 345 degrees
            const degrees = 15 + percentage * 330;
            setTransform(`rotate(${degrees}deg) translateX(45vw) rotate(-${degrees}deg)`);
            setOpacity(1);
        } else {
            setOpacity(0);
        }
    } else {
        let currentHour = hours;
        // Handle nighttime wrapping past midnight
        if (currentHour < startHour) {
            currentHour += 24;
            startHour += 24;
            endHour += 24;
        }

        if (currentHour >= 18 && currentHour < 30) { // 6 PM to 6 AM (next day)
             const totalMinutesInCycle = (30 - 18) * 60;
             const elapsedMinutes = (currentHour - 18) * 60 + minutes;
             const percentage = elapsedMinutes / totalMinutesInCycle;
             const degrees = 15 + percentage * 330;
             setTransform(`rotate(${degrees}deg) translateX(45vw) rotate(-${degrees}deg)`);
             setOpacity(1);
        } else {
            setOpacity(0);
        }
    }
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
                    style={{ transform, opacity, transition: 'transform 1s ease-out, opacity 1s ease-out' }}
                />
            )}
        </div>
    </>
  );
};

export default WeatherBackground;
