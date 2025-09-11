import type { WeatherAlert } from '@/lib/types';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface WeatherAlertsProps {
  alerts: WeatherAlert[] | undefined;
}

const WeatherAlerts = ({ alerts }: WeatherAlertsProps) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div>
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none">
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive-foreground rounded-lg">
                    <AccordionTrigger className="w-full p-4 hover:no-underline">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center text-left">
                                <AlertTriangle className="h-5 w-5 !text-destructive mr-4 flex-shrink-0" />
                                <AlertTitle className="font-bold">
                                    Active Weather Alerts
                                </AlertTitle>
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
                                        <div>
                                            <h5 className="font-semibold mb-1">Description</h5>
                                            <p className="text-muted-foreground">{alert.desc}</p>
                                        </div>
                                        {alert.instruction && (
                                            <div>
                                                <h5 className="font-semibold mb-1">Instruction</h5>
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
