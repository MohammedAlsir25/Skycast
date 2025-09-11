'use client';

import type { WeatherData } from '@/lib/types';
import type { TempUnit } from '@/app/page';

export const getMapUrl = (weatherDataList: WeatherData[], tempUnit: TempUnit): string => {
    if (weatherDataList.length === 0) {
        return "about:blank";
    }

    const primaryLocation = weatherDataList[0];
    const { lat, lon } = primaryLocation.location;

    // Create marker query parameters for OpenStreetMap
    const markers = weatherDataList.map(wd => {
        const temp = tempUnit === 'F' ? wd.current.temperature_f : wd.current.temperature_c;
        const tempString = `${Math.round(temp)}°${tempUnit}`;
        return `marker=${wd.location.lat},${wd.location.lon}|${wd.location.name} (${tempString})`;
    }).join('&');

    const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=6&${markers}`;
    
    // A different way to show markers if the above doesn't work well in all browsers
    // const markers = weatherDataList.map(wd => `[${wd.location.name}](${wd.location.lat},${wd.location.lon})`).join('');
    // const url = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${lat}%2C${lon}%3B${lat}%2C${lon}#map=6/${lat}/${lon}&layers=N&pois=${markers}`;
    
    return url;
};
