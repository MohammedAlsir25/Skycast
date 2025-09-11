import type { AirQuality } from '@/lib/types';
import { Wind } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AirQualityIndexProps {
  data: AirQuality;
}

const AirQualityIndex = ({ data }: AirQualityIndexProps) => {
  const { usEpaIndex, label, description, color } = data;

  if (!usEpaIndex) {
    return (
      <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
        Air Quality data is not available for this location.
      </div>
    );
  }

  // The EPA index is 1-6. We'll map it to a 0-100 scale for the gauge.
  // We'll treat the 6 levels as segments of the gauge.
  const maxIndex = 6;
  const percentage = ((usEpaIndex - 1) / (maxIndex - 1)) * 100;

  return (
    <div className="rounded-lg border bg-card/50 p-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='cursor-help'>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <Wind className="h-5 w-5" />
                        Air Quality Index
                    </h3>
                    <span className={cn("font-bold text-lg", color)}>{label}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="h-2.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: `hsl(var(--${color.replace('text-', '')}))` }}></div>
                </div>
                 <div className="relative mb-4">
                    <div className="absolute w-full top-0">
                         <div className={cn("h-2.5 rounded-full", color)} style={{ width: `${(percentage / 100) * 100}%` }}>
                            <div className="relative">
                                <div
                                className="absolute h-4 w-4 rounded-full border-2 border-background"
                                style={{ 
                                    left: `calc(${percentage}% - 8px)`, 
                                    top: '-3px',
                                    backgroundColor: 'hsl(var(--primary))'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full h-2.5"></div>
                </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AirQualityIndex;
