'use client';

import * as React from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { HourlyForecast } from '@/lib/types';
import type { TempUnit } from '@/app/page';

interface HourlyChartProps {
  data: HourlyForecast[];
  title?: string;
  tempUnit: TempUnit;
}

const HourlyChart = ({
  data,
  title = 'Hourly Forecast',
  tempUnit,
}: HourlyChartProps) => {
  if (!data || data.length === 0) return null;

  const chartData = React.useMemo(() => data.map(hour => ({
    time: hour.time.replace(' ', ''), // Compact time for display
    temperature: Math.round(
      tempUnit === 'F' ? hour.temperature_f : hour.temperature_c
    ),
  })), [data, tempUnit]);
  
  const chartConfig = {
    temperature: {
      label: `Temp. (°${tempUnit})`,
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold">{title}</h3>
      <div className="h-[200px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 20,
              left: 0,
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
              tickFormatter={(value) => `${value}°`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={30}
               style={{ fontSize: '0.75rem' }}
            />
            <Tooltip
              cursor={{
                stroke: 'hsl(var(--border))',
                strokeWidth: 2,
                strokeDasharray: '3 3',
              }}
              content={<ChartTooltipContent 
                formatter={(value) => `${value}°${tempUnit}`}
              />}
            />
            <Line
              dataKey="temperature"
              type="monotone"
              stroke="var(--color-temperature)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default HourlyChart;
