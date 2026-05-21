import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "./ui/card";

interface KPICardProps {
  title: string;
  subtitle: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: "green" | "blue" | "purple" | "orange";
}

export default function KPICard({ title, subtitle, value, change, icon, color }: KPICardProps) {
    const colorClasses = {
        green: "bg-green-100/10 text-green-600",
        blue: "bg-blue-100/10 text-blue-600",
        purple: "bg-purple-100/10 text-purple-600",
        orange: "bg-orange-100/10 text-orange-600",
    };

    const isPositive = change > 0;
    
    return (
        <Card className="bg-card rounded-xl shadow-sm border border-muted-card p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-row space-x-3 justify-center items-center">
                    <div className={`w-14 h-14 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
                        {icon}
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-lg font-medium">{title}</h3>
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    </div>
                </div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    <span className="font-medium">{Math.abs(change)}%</span>
                </div>
            </div>
            <h3 className="text-5xl font-bold">{value}</h3>
        </Card>
    );
}