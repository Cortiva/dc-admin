import { useNavigate } from "react-router-dom";
import { AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface AlertBarProps {
    alerts?: any[];
    isLoading: boolean;
}

export function AlertBar({ alerts, isLoading }: AlertBarProps) {
    const navigate = useNavigate();

    if (isLoading || !alerts || alerts.length === 0) {
        return (
            <div className="mb-4 sm:mb-6 bg-muted/30 border-l-4 border-muted p-3 sm:p-4 rounded-r-lg">
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                    <p className="text-sm text-muted-foreground">All systems are operational</p>
                </div>
            </div>
        );
    }

    // Find the most important alert
    const primaryAlert = alerts.find(a => a.type === "danger") || 
                        alerts.find(a => a.type === "warning") || 
                        alerts[0];

    const getAlertStyles = (type: string) => {
        switch (type) {
            case "danger":
                return {
                    bg: "bg-red-500/10",
                    border: "border-red-500/40",
                    icon: <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />,
                };
            case "warning":
                return {
                    bg: "bg-yellow-500/10",
                    border: "border-yellow-500/40",
                    icon: <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />,
                };
            case "success":
                return {
                    bg: "bg-green-500/10",
                    border: "border-green-500/40",
                    icon: <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />,
                };
            default:
                return {
                    bg: "bg-blue-500/10",
                    border: "border-blue-500/40",
                    icon: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
                };
        }
    };

    const styles = getAlertStyles(primaryAlert.type);

    return (
        <div className={`mb-4 sm:mb-6 border-l-4 p-3 sm:p-4 rounded-r-lg ${styles.bg} ${styles.border}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    {styles.icon}
                    <div className="flex-1 min-w-0">
                        <p className="text-base sm:text-lg font-medium text-foreground truncate">
                            {primaryAlert.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                            {primaryAlert.message}
                        </p>
                    </div>
                </div>
                {primaryAlert.action && (
                    <Button
                        size="sm"
                        className="self-start sm:self-center shrink-0"
                        onClick={() => navigate(primaryAlert.action!.url)}
                    >
                        {primaryAlert.action.label}
                    </Button>
                )}
            </div>
        </div>
    );
}