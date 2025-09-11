'use client';

import {
  Sun, Moon, CloudSun, CloudMoon, Cloud, Cloudy,
  CloudRain, CloudRainWind, CloudSnow, CloudLightning,
  Wind, Haze, SunDim, CloudFog, Tornado, Snowflake, Zap, Umbrella
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { FC } from 'react';
import { useState, useEffect } from 'react';

interface WeatherIconProps extends LucideProps {
  iconCode: string;
}

const iconMapping: { [key: string]: FC<LucideProps> } = {
    // Exact matches from API
    "skc": Sun, // Fair/clear
    "few": CloudSun, // A few clouds
    "sct": Cloud, // Partly cloudy
    "bkn": Cloudy, // Mostly cloudy
    "ovc": Cloudy, // Overcast
    "wind_skc": Wind,
    "wind_few": Wind,
    "wind_sct": Wind,
    "wind_bkn": Wind,
    "wind_ovc": Wind,
    "snow": Snowflake,
    "rain_snow": CloudSnow,
    "rain_sleet": CloudSnow,
    "snow_sleet": CloudSnow,
    "fzra": CloudSnow, // Freezing rain
    "rain_fzra": CloudSnow,
    "snow_fzra": CloudSnow,
    "sleet": CloudSnow,
    "rain": CloudRain,
    "rain_showers": CloudRainWind,
    "rain_showers_hi": CloudRainWind,
    "tsra": CloudLightning, // Thunderstorm
    "tsra_sct": CloudLightning,
    "tsra_hi": CloudLightning,
    "tornado": Tornado,
    "hurricane": Tornado,
    "tropical_storm": Tornado,
    "dust": Haze,
    "smoke": Haze,
    "haze": Haze,
    "fog": CloudFog,
    "hot": Sun,
    "cold": Snowflake,
    "blizzard": CloudSnow,
    
    // Fallbacks for day/night
    "day": Sun,
    "night": Moon
};


const WeatherIcon: FC<WeatherIconProps> = ({ iconCode, ...props }) => {
  const [IconComponent, setIconComponent] = useState<FC<LucideProps>>(() => SunDim);

  useEffect(() => {
    // Default to a generic icon
    let bestMatch: FC<LucideProps> = Umbrella;
    
    if (iconCode) {
        const lowerIconCode = iconCode.toLowerCase();

        // Find an icon by searching for keywords in the URL
        for (const key in iconMapping) {
            if (lowerIconCode.includes(key)) {
                bestMatch = iconMapping[key];
                break;
            }
        }
    }
    setIconComponent(() => bestMatch);
  }, [iconCode]);


  return <IconComponent {...props} />;
};


export default WeatherIcon;
