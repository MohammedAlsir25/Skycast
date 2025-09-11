import WeatherIcon from '@/components/weather-icon';
import type { WeatherLocation, WeatherPeriod, DailyForecast } from '@/lib/types';
import type { TempUnit } from '@/app/page';
import WeatherDetails from './weather-details';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from './ui/button';
import { Shirt } from 'lucide-react';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

interface CurrentWeatherProps {
    location: WeatherLocation;
    displayWeather: WeatherPeriod;
    aiSummary: string | null;
    clothingRecommendation: string | null;
    selectedDay: DailyForecast | undefined;
    tempUnit: TempUnit;
    onTempUnitChange: (unit: TempUnit) => void;
}

const CurrentWeather = ({
    location,
    displayWeather,
    aiSummary,
    clothingRecommendation,
    selectedDay,
    tempUnit,
    onTempUnitChange
}: CurrentWeatherProps) => {

    const { name, state } = location;
    const displayDate = new Date(displayWeather.startTime).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const locationParts = [name];
    if (state && state !== name) {
        locationParts.push(state);
    }
    const locationName = locationParts.filter(Boolean).join(', ');

    const displayTemp = tempUnit === 'F' ? displayWeather.temperature_f : displayWeather.temperature_c;

    return (
        <Card className="w-full bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardDescription>{displayDate}</CardDescription>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end space-x-1 mt-2 text-lg">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn(
                                    "p-1 h-auto font-bold",
                                    tempUnit === 'C' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
                                )}
                                onClick={() => onTempUnitChange('C')}
                            >
                                &deg;C
                            </Button>
                            <span className='text-muted-foreground'>/</span>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn(
                                    "p-1 h-auto font-bold",
                                    tempUnit === 'F' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
                                )}
                                onClick={() => onTempUnitChange('F')}
                            >
                                &deg;F
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-3xl font-bold">{locationName}</p>
                    <p className="font-headline text-8xl font-bold">
                        {displayTemp ? Math.round(displayTemp) : 'N/A'}&deg;
                    </p>
                    <p className="text-lg font-semibold capitalize -mt-4">
                        {displayWeather.shortForecast}
                    </p>
                    <Separator className="my-4 w-1/2" />
                    <WeatherDetails period={displayWeather} sunrise={selectedDay?.sunrise} sunset={selectedDay?.sunset} />
                </div>
                
                {aiSummary && (
                    <div className="flex items-start gap-4 rounded-lg border bg-accent/50 p-4 text-sm text-accent-foreground">
                        <p className='leading-relaxed'>{aiSummary}</p>
                    </div>
                )}

                {clothingRecommendation && (
                    <div className="flex items-center gap-4 rounded-lg border bg-accent/50 p-4 text-sm text-accent-foreground">
                        <Shirt className="h-6 w-6 shrink-0" />
                        <p>{clothingRecommendation}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default CurrentWeather;
