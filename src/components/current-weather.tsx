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
    const highTemp = tempUnit === 'F' ? selectedDay?.high_f : selectedDay?.high_c;
    const lowTemp = tempUnit === 'F' ? selectedDay?.low_f : selectedDay?.low_c;

    return (
        <Card className="w-full bg-slate-900/50 backdrop-blur-md">
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
                    
                    <div className='flex flex-col items-center text-center -mt-4 space-y-1'>
                        <p className="text-3xl font-bold">{locationName}</p>
                        <p className="font-headline text-8xl font-bold">
                            {displayTemp ? Math.round(displayTemp) : 'N/A'}&deg;
                        </p>
                        <p className="text-lg font-semibold capitalize">
                            {displayWeather.shortForecast}
                        </p>
                        {highTemp !== undefined && lowTemp !== undefined && (
                            <p className="text-sm font-medium text-muted-foreground">
                                H: {Math.round(highTemp)}&deg; &nbsp; L: {Math.round(lowTemp)}&deg;
                            </p>
                        )}
                    </div>
                    
                    <WeatherDetails period={displayWeather} sunrise={selectedDay?.sunrise} sunset={selectedDay?.sunset} />
                </div>
                
                {aiSummary && (
                     <div className="flex items-start gap-4 rounded-lg border bg-accent/10 p-4 text-sm text-accent-foreground border-accent/20">
                        <p className='leading-relaxed'>{aiSummary}</p>
                    </div>
                )}

                {clothingRecommendation && (
                     <div className="flex items-center gap-4 rounded-lg border bg-accent/10 p-4 text-sm text-accent-foreground border-accent/20">
                        <Shirt className="h-6 w-6 shrink-0" />
                        <p>{clothingRecommendation}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default CurrentWeather;
