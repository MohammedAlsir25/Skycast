import type { WeatherAlert } from '@/lib/types';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface WeatherAlertsProps {
  alerts: WeatherAlert[] | undefined;
}

const WeatherAlerts = ({ alerts }: WeatherAlertsProps) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className='space-y-2'>
        <Accordion type="single" collapsible className="w-full">
            {alerts.map((alert, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-none">
                     <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive-foreground rounded-lg mb-2">
                        <AccordionTrigger className="w-full p-0 hover:no-underline">
                             <div className="flex items-center justify-between w-full p-4">
                                <div className="flex items-start text-left">
                                    <AlertTriangle className="h-5 w-5 !text-destructive mr-4 flex-shrink-0" />
                                    <div>
                                        <AlertTitle className="font-bold">{alert.event}</AlertTitle>
                                        <AlertDescription className="text-destructive-foreground/80">
                                            {alert.headline}
                                        </AlertDescription>
                                    </div>
                                </div>
                                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="px-4 pb-4">
                                <div className="space-y-4 pt-4 text-sm border-t border-destructive/30">
                                    <div>
                                        <h4 className="font-semibold mb-1">Description</h4>
                                        <p className="text-muted-foreground">{alert.desc}</p>
                                    </div>
                                    {alert.instruction && (
                                        <div>
                                            <h4 className="font-semibold mb-1">Instruction</h4>
                                            <p className="text-muted-foreground">{alert.instruction}</p>
                                        </div>
                                    )}
                                    <div className="text-xs text-muted-foreground pt-4">
                                        <p>
                                            <strong>Effective:</strong> {new Date(alert.effective).toLocaleString()}
                                        </p>
                                        <p>
                                            <strong>Expires:</strong> {new Date(alert.expires).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </Alert>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
  );
};

export default WeatherAlerts;
