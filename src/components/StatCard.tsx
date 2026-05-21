import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "../lib/utils";

type StatCardProps = {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: "blue" | "green" | "yellow" | "red" | "orange" | "purple";
    trend?: {
        value: string;
        positive?: boolean;
    };
    loading?: boolean;
};

const colorStyles = {
    blue: {
        bg: "from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20",
        iconBg: "bg-blue-500/10 text-blue-600",
    },
    green: {
        bg: "from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20",
        iconBg: "bg-green-500/10 text-green-600",
    },
    yellow: {
        bg: "from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20",
        iconBg: "bg-yellow-500/10 text-yellow-600",
    },
    red: {
        bg: "from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20",
        iconBg: "bg-red-500/10 text-red-600",
    },
    orange: {
        bg: "from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20",
        iconBg: "bg-orange-500/10 text-orange-600",
    },
    purple: {
        bg: "from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20",
        iconBg: "bg-purple-500/10 text-purple-600",
    },
};

function StatCard({ title, value, icon, color, trend, loading }: StatCardProps) {
    return (
        <Card
            className={cn(
                "bg-card p-5 rounded-2xl shadow-xs transition-all duration-300",
                "hover:shadow-md hover:-translate-y-0.5",
                "bg-linear-to-br",
            )}
        >
            <div className="flex items-start justify-between">
                {/* Left */}
                <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {title}
                    </p>

                    <p className="text-3xl font-bold tracking-tight">
                        {loading ? "--" : value}
                    </p>

                    {/* Trend */}
                    {trend && (
                        <div
                            className={cn(
                                "flex items-center gap-1 text-xs font-medium",
                                trend.positive ? "text-green-600" : "text-red-500"
                            )}
                        >
                            {trend.positive ? (
                                <TrendingUp className="w-3 h-3" />
                            ) : (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            {trend.value}
                        </div>
                    )}
                </div>

                {/* Icon */}
                <div
                    className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        colorStyles[color].iconBg
                    )}
                >
                    {icon}
                </div>
            </div>
        </Card>
    );
}

export default StatCard;