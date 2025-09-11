import type { WeatherAlert } from '@/lib/types';
import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';

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
            <Dialog key={index}>
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/30 text-destructive-foreground">
                    <AlertTriangle className="h-5 w-5 !text-destructive" />
                    <AlertTitle className="font-bold">{alert.event}</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                        <p className="flex-grow pr-4">{alert.headline}</p>
                        <DialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="bg-destructive/80 hover:bg-destructive text-destructive-foreground">
                                <Info className="h-4 w-4 mr-2" />
                                View Details
                            </Button>
                        </DialogTrigger>
                    </AlertDescription>
                </Alert>
                 <DialogContent className="sm:max-w-lg bg-card/95">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                            {alert.event}
                        </DialogTitle>
                        <DialogDescription>{alert.headline}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 text-sm">
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
                </DialogContent>
            </Dialog>
        ))}
    </div>
  );
};

export default WeatherAlerts;
