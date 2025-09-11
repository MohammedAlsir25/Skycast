'use client';

import Image from 'next/image';
import type { FC } from 'react';

interface WeatherIconProps {
  iconCode: string;
  className?: string;
}

const WeatherIcon: FC<WeatherIconProps> = ({ iconCode, className }) => {
  if (!iconCode) return null;

  // The iconCode is a full URL from OpenWeatherMap
  return (
    <div className={className}>
      <Image 
        src={iconCode} 
        alt="Weather icon"
        width={128}
        height={128}
        unoptimized // Since it's an external URL that can change
      />
    </div>
  );
};


export default WeatherIcon;
