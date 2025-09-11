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

  return (
    <div className={className}>
      <Image 
        src={iconCode} 
        alt={shortForecast || "Weather icon"}
        width={128}
        height={128}
        unoptimized // The API provides full URLs
      />
    </div>
  );
};


export default WeatherIcon;
