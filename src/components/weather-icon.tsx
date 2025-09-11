'use client';

import {
  Sun, Moon, CloudSun, CloudMoon, Cloud, Cloudy,
  CloudRain, CloudRainWind, CloudSnow, CloudLightning,
  Wind, Haze, SunDim, CloudFog
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { FC } from 'react';

interface WeatherIconProps extends LucideProps {
  iconCode: string;
}

const iconMap: { [key: string]: FC<LucideProps> } = {
  '01d': Sun,
  '01n': Moon,
  '02d': CloudSun,
  '02n': CloudMoon,
  '03d': Cloud,
  '03n': Cloud,
  '04d': Cloudy,
  '04n': Cloudy,
  '09d': CloudRain,
  '09n': CloudRain,
  '10d': CloudRainWind,
  '10n': CloudRainWind,
  '11d': CloudLightning,
  '11n': CloudLightning,
  '13d': CloudSnow,
  '13n': CloudSnow,
  '50d': CloudFog,
  '50n': CloudFog,
};

const WeatherIcon: FC<WeatherIconProps> = ({ iconCode, ...props }) => {
  const Icon = iconMap[iconCode] || SunDim;
  return <Icon {...props} />;
};

export default WeatherIcon;
