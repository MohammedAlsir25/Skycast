import type { WeatherAlert } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface WeatherAlertsProps {
  alerts: WeatherAlert[] | undefined;
}

const WeatherAlerts = ({ alerts }: WeatherAlertsProps) => {
  if (!alerts || alerts.length === 0) {
    return null;
  }

  return (
    <div className='space-y-4'>
        {alerts.map((alert, index) => (
            <Alert variant="destructive" key={index}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{alert.event}</AlertTitle>
                <AlertDescription>
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-b-0">
                            <AccordionTrigger className='p-0 hover:no-underline text-sm'>
                                {alert.headline}
                            </AccordionTrigger>
                            <AccordionContent className="pt-2">
                                <p className='mb-2'>{alert.desc}</p>
                                {alert.instruction && <p className="font-semibold">{alert.instruction}</p>}
                                <p className="text-xs text-muted-foreground mt-2">
                                    Effective: {new Date(alert.effective).toLocaleString()} | Expires: {new Date(alert.expires).toLocaleString()}
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </AlertDescription>
            </Alert>
        ))}
    </div>
  );
};

export default WeatherAlerts;
