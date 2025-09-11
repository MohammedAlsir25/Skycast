'use client';

import * as React from 'react';
import { Line, CartesianGrid, XAxis, YAxis, ComposedChart, Area } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { HourlyForecast } from '@/lib/types';
import type { TempUnit } from '@/app/page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Droplets, Wind, Thermometer } from 'lucide-react';

interface HourlyChartProps {
  data: HourlyForecast[];
  tempUnit: TempUnit;
}

type ChartDataType = 'temperature' | 'precip' | 'humidity' | 'wind';

const chartConfigs = {
  temperature: {
    label: (unit: TempUnit) => `Temp (°${unit})`,
    color: 'hsl(var(--chart-1))',
    formatter: (value: number, unit: TempUnit) => `${Math.round(value)}°${unit}`,
  },
  precip: {
    label: () => 'Precip. (%)',
    color: 'hsl(var(--chart-2))',
    formatter: (value: number) => `${value}%`,
  },
  humidity: {
    label: () => 'Humidity (%)',
    color: 'hsl(var(--chart-3))',
    formatter: (value: number) => `${value}%`,
  },
  wind: {
    label: () => 'Wind (mph)',
    color: 'hsl(var(--chart-4))',
    formatter: (value: number) => `${Math.round(value)} mph`,
  },
};

const ChartComponent = ({ data, dataType, tempUnit }: { data: HourlyForecast[], dataType: ChartDataType, tempUnit: TempUnit }) => {
   if (!data || data.length === 0) return (
     <div className="flex items-center justify-center h-[200px] text-muted-foreground">
        No hourly data available for this day.
     </div>
   );
  const config = chartConfigs[dataType];

  const chartData = React.useMemo(() => data.map(hour => {
    let value;
    switch(dataType) {
        case 'temperature':
            value = tempUnit === 'F' ? hour.temperature_f : hour.temperature_c;
            break;
        case 'precip':
            value = hour.precip_chance;
            break;
        case 'humidity':
            value = hour.humidity;
            break;
        case 'wind':
            value = hour.wind_mph;
            break;
        default:
            value = 0;
    }
    return {
        time: hour.time.replace(' ', ''), // Compact time for display
        value: value,
    }
  }), [data, dataType, tempUnit]);

  
  const chartConfig = {
    value: {
      label: config.label(tempUnit),
      color: config.color,
    },
     value_line: {
      label: config.label(tempUnit),
      color: config.color,
    },
  };
  
  const yAxisWidth = dataType === 'temperature' ? 30 : 25;

  return (
      <div className="h-[200px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ComposedChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
              style={{ fontSize: '0.75rem' }}
            />
            <YAxis
              tickFormatter={(value) => config.formatter(value, tempUnit).replace(/°[FC]/, '°').replace(' mph', '')}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={yAxisWidth}
               style={{ fontSize: '0.75rem' }}
               domain={dataType === 'precip' || dataType === 'humidity' ? [0, 100] : ['auto', 'auto']}
            />
            <ChartTooltip
              cursor={{
                stroke: 'hsl(var(--border))',
                strokeWidth: 1,
                strokeDasharray: '3 3',
              }}
              content={<ChartTooltipContent 
                formatter={(value, name) => {
                  if (name === 'value_line') return null;
                  return config.formatter(Number(value), tempUnit);
                }}
                nameKey="value"
                labelKey='time'
              />}
            />
            <defs>
                <linearGradient id={`${dataType}Color`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.color} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={config.color} stopOpacity={0}/>
                </linearGradient>
            </defs>
             <Area
              dataKey="value"
              type="monotone"
              fill={`url(#${dataType}Color)`}
              strokeWidth={0}
              stackId="a"
            />
            <Line
              dataKey="value"
              name="value_line"
              type="monotone"
              stroke={config.color}
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
  );
};


const HourlyChart = ({ data, tempUnit }: HourlyChartProps) => {
  return (
    <Tabs defaultValue="temperature">
        <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value="temperature"><Thermometer className='h-4 w-4 mr-2'/>Temp</TabsTrigger>
            <TabsTrigger value="precip"><Droplets className='h-4 w-4 mr-2'/>Precip</TabsTrigger>
            <TabsTrigger value="humidity"><Droplets className='h-4 w-4 mr-2'/>Humidity</TabsTrigger>
            <TabsTrigger value="wind"><Wind className='h-4 w-4 mr-2'/>Wind</TabsTrigger>
        </TabsList>
        <TabsContent value="temperature">
            <ChartComponent data={data} dataType='temperature' tempUnit={tempUnit} />
        </TabsContent>
        <TabsContent value="precip">
            <ChartComponent data={data} dataType='precip' tempUnit={tempUnit} />
        </TabsContent>
         <TabsContent value="humidity">
            <ChartComponent data={data} dataType='humidity' tempUnit={tempUnit} />
        </TabsContent>
         <TabsContent value="wind">
            <ChartComponent data={data} dataType='wind' tempUnit={tempUnit} />
        </TabsContent>
    </Tabs>
  )
}


export default HourlyChart;
