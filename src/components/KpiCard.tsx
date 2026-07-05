import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "./ui/card";

interface KPICardProps {
    title: string;
    subtitle: string;
    value: string;
    change: number;
    icon: React.ReactNode;
    color: "green" | "blue" | "purple" | "orange" | "red" | "yellow" | "teal" | "indigo";
}

export default function KPICard({ title, subtitle, value, change, icon, color }: KPICardProps) {
    const colorClasses = {
        green: "bg-green-100/10 text-green-600",
        blue: "bg-blue-100/10 text-blue-600",
        purple: "bg-purple-100/10 text-purple-600",
        orange: "bg-orange-100/10 text-orange-600",
        red: "bg-red-100/10 text-red-600",
        yellow: "bg-yellow-100/10 text-yellow-600",
        teal: "bg-teal-100/10 text-teal-600",
        indigo: "bg-indigo-100/10 text-indigo-600",
    };

    const isPositive = change > 0;

    return (
        <Card className="bg-card rounded-xl shadow-sm border border-muted-card p-4 sm:p-3">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div className="flex flex-row gap-3 items-center min-w-0">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
                        {icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h3 className="text-sm sm:text-[16px] font-medium truncate">{title}</h3>
                        <p className="text-xs sm:text-[13px] text-muted-foreground truncate">{subtitle}</p>
                    </div>
                </div>
                <div className={`flex items-center gap-1 text-xs sm:text-[13px] shrink-0 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />}
                    <span className="font-medium">{Math.abs(change)}%</span>
                </div>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold truncate">{value}</h3>
        </Card>
    );
}