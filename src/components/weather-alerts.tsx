'use client';

import { useState, useEffect } from 'react';
import type { WeatherAlert } from '@/lib/types';
import { AlertTriangle, ChevronDown, Bot } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
        // In case of error, we can just leave summaries empty
      } finally {
        setLoading(false);
      }
    };

    generateSummaries();
  }, [alerts]);

  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <Alert
            variant="destructive"
            className="bg-destructive/10 border-destructive/30 text-destructive-foreground rounded-lg"
          >
            <AccordionTrigger className="w-full p-4 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center text-left">
                  <AlertTriangle className="h-5 w-5 !text-destructive mr-4 flex-shrink-0" />
                  <AlertTitle className="font-bold">Active Weather Alerts</AlertTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{alerts.length}</Badge>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 space-y-4">
                {alerts.map((alert, index) => (
                  <div key={index}>
                    {index > 0 && <Separator className="my-4 bg-destructive/30" />}
                    <div className="space-y-3 pt-2 text-sm">
                      <div>
                        <h4 className="font-bold text-base mb-1">{alert.event}</h4>
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
                      
                      <div>
                        <h5 className="font-semibold mb-1">Official Description</h5>
                        <p className="text-muted-foreground">{alert.desc}</p>
                      </div>
                      {alert.instruction && (
                        <div>
                          <h5 className="font-semibold mb-1">Official Instruction</h5>
                          <p className="text-muted-foreground">{alert.instruction}</p>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground pt-2">
                        <p>
                          <strong>Effective:</strong> {new Date(alert.effective).toLocaleString()}
                        </p>
                        <p>
                          <strong>Expires:</strong> {new Date(alert.expires).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </Alert>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default WeatherAlerts;
