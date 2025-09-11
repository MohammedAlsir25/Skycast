import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Thermometer, Calendar, Globe, AlertTriangle, Wind, Droplets } from "lucide-react";
import type { DailyForecast, HourlyForecast, AirQuality, WeatherAlert, WeatherData } from "@/lib/types";
import type { TempUnit } from "@/app/page";
import HourlyChart from "./hourly-chart";
import DailyForecastComponent from "./daily-forecast";
import NearbyCities from "./nearby-cities";
import WeatherAlerts from "./weather-alerts";
import AirQualityIndex from "./air-quality-index";
import { Badge } from "./ui/badge";

interface InfoTabsProps {
    dailyData: DailyForecast[];
    hourlyData: HourlyForecast[];
    airQuality: AirQuality | null | undefined;
    alerts: WeatherAlert[] | undefined;
    nearbyCities: WeatherData[];
    loadingNearby: boolean;
    onDaySelect: (index: number) => void;
    selectedDayIndex: number;
    tempUnit: TempUnit;
    onCityClick: (city: string) => void;
}

const InfoTabs = ({
    dailyData,
    hourlyData,
    airQuality,
    alerts,
    nearbyCities,
    loadingNearby,
    onDaySelect,
    selectedDayIndex,
    tempUnit,
    onCityClick,
}: InfoTabsProps) => {

    const hasAlerts = alerts && alerts.length > 0;

    return (
        <Tabs defaultValue="hourly">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="hourly"><Thermometer className='h-4 w-4 mr-2'/>Hourly</TabsTrigger>
                <TabsTrigger value="daily"><Calendar className='h-4 w-4 mr-2'/>7-Day</TabsTrigger>
                <TabsTrigger value="nearby"><Globe className='h-4 w-4 mr-2'/>Elsewhere</TabsTrigger>
                <TabsTrigger value="alerts">
                    <AlertTriangle className='h-4 w-4 mr-2'/>Alerts
                    {hasAlerts && <Badge variant="destructive" className="ml-2">{alerts.length}</Badge>}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="hourly">
                 <div className="rounded-lg border bg-card/80 backdrop-blur-sm p-6 mt-2 space-y-4">
                    <HourlyChart data={hourlyData} tempUnit={tempUnit} />
                    {airQuality && <AirQualityIndex data={airQuality} />}
                 </div>
            </TabsContent>
            <TabsContent value="daily">
                 <div className="rounded-lg border bg-card/80 backdrop-blur-sm p-6 mt-2">
                    <DailyForecastComponent data={dailyData} onDaySelect={onDaySelect} selectedIndex={selectedDayIndex} tempUnit={tempUnit}/>
                 </div>
            </TabsContent>
            <TabsContent value="nearby">
                <div className="rounded-lg border bg-card/80 backdrop-blur-sm p-6 mt-2">
                    <NearbyCities weatherDataList={nearbyCities} loading={loadingNearby} tempUnit={tempUnit} onCityClick={onCityClick} />
                </div>
            </TabsContent>
            <TabsContent value="alerts">
                <div className="rounded-lg border bg-card/80 backdrop-blur-sm p-6 mt-2">
                    <WeatherAlerts alerts={alerts} />
                </div>
            </TabsContent>
        </Tabs>
    )
}

export default InfoTabs;
