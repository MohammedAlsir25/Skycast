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
  const maxIndex = 6;
  const percentage = ((usEpaIndex - 1) / (maxIndex - 1)) * 100;

  return (
    <div className="rounded-lg border bg-card/50 p-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='cursor-help'>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                        <Wind className="h-5 w-5" />
                        Air Quality Index
                    </h3>
                    <span className={cn("font-bold text-lg", color)}>{label}</span>
                </div>
                 <div className="relative mb-4 h-2.5 w-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500">
                    <div
                    className="absolute -top-1 h-4 w-1 rounded-full border-2 border-background bg-foreground"
                    style={{ 
                        left: `calc(${percentage}% - 2px)`, 
                        }}
                    />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    {description}
                </p>
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
