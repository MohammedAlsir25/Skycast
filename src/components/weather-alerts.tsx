'use client';

import { useState, useEffect } from 'react';
import type { WeatherAlert } from '@/lib/types';
import { AlertTriangle, Bot } from 'lucide-react';
import { Alert as UIAlert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { summarizeAlert } from '@/ai/flows/alert-summary-flow';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherAlertsProps {
  alerts: WeatherAlert[] | undefined;
}

const WeatherAlerts = ({ alerts }: WeatherAlertsProps) => {
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!alerts || alerts.length === 0) {
      setLoading(false);
      return;
    }

    const generateSummaries = async () => {
      setLoading(true);
      const newSummaries: Record<string, string> = {};
      try {
        await Promise.all(
          alerts.map(async (alert) => {
            const result = await summarizeAlert(alert);
            newSummaries[alert.headline] = result.summary;
          })
        );
        setSummaries(newSummaries);
      } catch (error) {
        console.error("Failed to generate alert summaries:", error);
      } finally {
        setLoading(false);
      }
    };

    generateSummaries();
  }, [alerts]);

  if (!alerts || alerts.length === 0) {
    return <div className="text-center text-muted-foreground p-8">No active weather alerts.</div>;
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <UIAlert
          key={index}
          variant="destructive"
          className="bg-destructive/10 border-destructive/30 text-destructive-foreground rounded-lg"
        >
          <AlertTriangle className="h-5 w-5 !text-destructive" />
          <div className="ml-8 space-y-3">
            <div>
              <AlertTitle className="font-bold text-base mb-1">{alert.event}</AlertTitle>
              <p className="text-muted-foreground font-semibold">{alert.headline}</p>
            </div>

            {loading ? (
              <div className="space-y-2 mt-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              summaries[alert.headline] && (
                 <div className="flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-3 my-3">
                      <Bot className="h-5 w-5 shrink-0 mt-1" />
                      <p className="font-medium">{summaries[alert.headline]}</p>
                 </div>
              )
            )}
            
            <Separator className="my-2 bg-destructive/20" />
            
            <div className='text-sm space-y-2'>
              <div>
                <h5 className="font-semibold mb-1">Official Description</h5>
                <p className="text-muted-foreground text-xs">{alert.desc}</p>
              </div>
              {alert.instruction && (
                <div>
                  <h5 className="font-semibold mb-1">Official Instruction</h5>
                  <p className="text-muted-foreground text-xs">{alert.instruction}</p>
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground pt-2">
              <p>
                <strong>Effective:</strong> {new Date(alert.effective).toLocaleString()}
              </p>
              <p>
                <strong>Expires:</strong> {new Date(alert.expires).toLocaleString()}
              </p>
            </div>
          </div>
        </UIAlert>
      ))}
    </div>
  );
};

export default WeatherAlerts;
