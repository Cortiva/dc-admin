
import { cn } from "../lib/utils";

interface PageHeaderProps {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    className?: string;
}

export default function PageHeader({ icon, title, subtitle, action, className }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-3", className)}>
            <div className="flex items-center gap-3 min-w-0">
                {icon && (
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                        {icon}
                    </div>
                )}
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
                    )}
                </div>
            </div>
            {action && (
                <div className="shrink-0">{action}</div>
            )}
        </div>
    );
}