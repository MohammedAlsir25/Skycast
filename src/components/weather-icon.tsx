'use client';

import Image from 'next/image';
import type { FC } from 'react';

interface WeatherIconProps {
  iconCode: string;
  shortForecast: string;
  className?: string;
}

const WeatherIcon: FC<WeatherIconProps> = ({ iconCode, shortForecast, className }) => {
  if (!iconCode) return null;

  const getFullImageUrl = (iconUrl: string) => {
    const url = new URL(iconUrl);
    // You can add logic here to change parameters, e.g., size
    // url.searchParams.set('size', 'large');
    return url.toString();
  };


  return (
    <div className={className}>
      <Image 
        src={getFullImageUrl(iconCode)} 
        alt={shortForecast || "Weather icon"}
        width={128}
        height={128}
        unoptimized // Since it's an external URL that can change
      />
    </div>
  );
};


export default WeatherIcon;
