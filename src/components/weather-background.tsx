'use client';

import { useEffect, useState } from 'react';
import type { WeatherData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WeatherBackgroundProps {
  weatherData: WeatherData | null | undefined;
}

const getWeatherBackgroundClass = (weatherData: WeatherData | null | undefined): string => {
  const weather = weatherData?.current;
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

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ weatherData }) => {
  const [backgroundClass, setBackgroundClass] = useState('bg-default');
  const [previousClass, setPreviousClass] = useState('');
  const [transform, setTransform] = useState('rotate(0deg) translateY(-25vh) rotate(0deg)');
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const newClass = getWeatherBackgroundClass(weatherData);
    if (newClass !== backgroundClass) {
      setPreviousClass(backgroundClass);
      setBackgroundClass(newClass);
    }
  }, [weatherData, backgroundClass]);
  
  useEffect(() => {
    if (!weatherData) {
        setOpacity(0);
        return;
    };
    
    // Use the localtime from the API response
    const now = new Date(weatherData.location.localtime);
    const hours = now.getHours();
    const minutes = now.getMinutes();

    let startHour, endHour;
    
    if (weatherData.current.isDaytime) {
      startHour = 6; // 6 AM
      endHour = 18; // 6 PM
      
      if (hours >= startHour && hours < endHour) {
        const totalMinutesInCycle = (endHour - startHour) * 60;
        const elapsedMinutes = (hours - startHour) * 60 + minutes;
        const percentage = elapsedMinutes / totalMinutesInCycle;
        // Arc from -90deg (left) to 90deg (right) over the top
        const degrees = -90 + (percentage * 180);
        setTransform(`rotate(${degrees}deg) translateY(-25vh) rotate(-${degrees}deg)`);
        setOpacity(1);
      } else {
        setOpacity(0);
      }
    } else { // Night time
      startHour = 18; // 6 PM
      endHour = 6; // 6 AM (next day)

      let currentHour = hours;
      // Handle hours past midnight
      if (currentHour < endHour) { // e.g. it's 2 AM
          currentHour += 24; // Treat it as 26 for calculation
      }

      const effectiveStartHour = startHour; // 18
      const effectiveEndHour = startHour + 12; // 30

      if (currentHour >= effectiveStartHour && currentHour < effectiveEndHour) {
          const totalMinutesInCycle = 12 * 60;
          const elapsedMinutes = (currentHour - effectiveStartHour) * 60 + minutes;
          const percentage = elapsedMinutes / totalMinutesInCycle;
          // Arc from -90deg (left) to 90deg (right) over the top
          const degrees = -90 + (percentage * 180);
          setTransform(`rotate(${degrees}deg) translateY(-25vh) rotate(-${degrees}deg)`);
          setOpacity(1);
      } else {
          setOpacity(0);
      }
    }
  }, [weatherData]);


  // We render two divs to create a cross-fade effect.
  // This is a simple way to do it without extra libraries.
  return (
    <>
        <div key={previousClass} className={cn('weather-bg', previousClass, 'opacity-0')} />
        <div key={backgroundClass} className={cn('weather-bg', backgroundClass, 'opacity-100')}>
            {weatherData && (
                <div 
                    className={cn('celestial-body', weatherData.current.isDaytime ? 'sun' : 'moon')}
                    style={{ transform, opacity, transition: 'transform 1s ease-out, opacity 1s ease-out' }}
                />
            )}
        </div>
    </>
  );
};

export default WeatherBackground;
