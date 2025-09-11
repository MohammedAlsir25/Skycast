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
  const [transform, setTransform] = useState('rotate(180deg) translateX(45vw) rotate(-180deg)');
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

    let startHour, endHour;
    
    if (weather?.isDaytime) {
      startHour = 6; // 6 AM
      endHour = 18; // 6 PM
      
      if (hours >= startHour && hours < endHour) {
        const totalMinutesInCycle = (endHour - startHour) * 60;
        const elapsedMinutes = (hours - startHour) * 60 + minutes;
        const percentage = elapsedMinutes / totalMinutesInCycle;
        // Arc from 180deg (left) to 360deg (right) over the top
        const degrees = 180 + (percentage * 180);
        setTransform(`rotate(${degrees}deg) translateX(45vw) rotate(-${degrees}deg)`);
        setOpacity(1);
      } else {
        setOpacity(0);
      }
    } else { // Night time
      startHour = 18; // 6 PM
      endHour = 6; // 6 AM (next day)

      let currentHour = hours;
      // Handle hours past midnight
      if (currentHour < startHour) {
          currentHour += 24;
      }

      if (currentHour >= startHour && currentHour < startHour + 12) {
          const totalMinutesInCycle = 12 * 60;
          const elapsedMinutes = (currentHour - startHour) * 60 + minutes;
          const percentage = elapsedMinutes / totalMinutesInCycle;
          // Arc from 180deg (left) to 360deg (right) over the top
          const degrees = 180 + (percentage * 180);
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
