import { Card } from "./ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    change?: string | number;
    changeType?: "increase" | "decrease" | "neutral";
    icon: React.ReactNode;
    color: "primary" | "success" | "info" | "purple" | "orange" | "yellow" | "red" | "indigo";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    trend?: number;
    suffix?: string;
    prefix?: string;
    tooltip?: string;
    onClick?: () => void;
    className?: string;
}

export default function StatsCard({ 
    title, 
    value, 
    subtitle, 
    change, 
    changeType = "neutral",
    icon, 
    color, 
    size = "md",
    loading = false,
    trend,
    suffix = "",
    prefix = "",
    tooltip,
    onClick,
    className = ""
}: StatsCardProps) {
    const colorClasses = {
        primary: "bg-yellow-100/40 text-yellow-600",
        success: "bg-green-100/40 text-green-600",
        info: "bg-blue-100/40 text-blue-600",
        purple: "bg-purple-100/40 text-purple-600",
        orange: "bg-orange-100/40 text-orange-600",
        yellow: "bg-amber-100/40 text-amber-600",
        red: "bg-red-100/40 text-red-600",
        indigo: "bg-indigo-100/40 text-indigo-600",
    };

    const sizeClasses = {
        sm: {
            card: "p-3",
            icon: "w-6 h-6",
            value: "text-2xl",
            title: "text-xs",
        },
        md: {
            card: "p-4",
            icon: "w-8 h-8",
            value: "text-3xl",
            title: "text-xs",
        },
        lg: {
            card: "p-5",
            icon: "w-10 h-10",
            value: "text-5xl",
            title: "text-sm",
        },
    };

    const getChangeIcon = () => {
        if (changeType === "increase") return <TrendingUp className="w-3 h-3" />;
        if (changeType === "decrease") return <TrendingDown className="w-3 h-3" />;
        return <Minus className="w-3 h-3" />;
    };

    const getChangeColor = () => {
        if (changeType === "increase") return "text-green-600 bg-green-50";
        if (changeType === "decrease") return "text-red-600 bg-red-50";
        return "text-gray-600 bg-gray-50";
    };

    const formattedValue = `${prefix}${typeof value === 'number' ? value.toLocaleString() : value}${suffix}`;

    if (loading) {
        return (
            <Card className={`bg-card rounded-xl shadow-xs ${sizeClasses[size].card} ${className}`}>
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-2">
                        <div className={`${sizeClasses[size].icon} rounded-lg bg-gray-200`} />
                    </div>
                    <div className="h-8 bg-gray-200 rounded mt-2 w-3/4" />
                    <div className="h-3 bg-gray-200 rounded mt-2 w-1/2" />
                </div>
            </Card>
        );
    }

    return (
        <Card 
            className={`bg-card rounded-xl shadow-xs transition-all duration-200 hover:shadow-md ${
                onClick ? "cursor-pointer hover:scale-105" : ""
            } ${sizeClasses[size].card} ${className}`}
            onClick={onClick}
            title={tooltip}
        >
            <div className="flex items-start justify-between mb-2">
                <div className={`rounded-lg ${colorClasses[color]} flex items-center justify-center ${sizeClasses[size].icon}`}>
                    {icon}
                </div>
                {(change || trend !== undefined) && (
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getChangeColor()}`}>
                        {getChangeIcon()}
                        <span>
                            {change || (trend && `${trend > 0 ? '+' : ''}${trend}%`)}
                        </span>
                    </div>
                )}
            </div>
            
            <div>
                <div className={`font-bold ${sizeClasses[size].value} text-foreground`}>
                    {formattedValue}
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                    <p className={`${sizeClasses[size].title} text-muted-foreground`}>
                        {title}
                    </p>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground/70">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}