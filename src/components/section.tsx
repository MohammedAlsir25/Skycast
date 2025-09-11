import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator";

interface SectionProps {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Section = ({ icon, title, children, className }: SectionProps) => {
    return (
        <Card className="w-full bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-4 md:p-6">
                {children}
            </CardContent>
        </Card>
    );
};
