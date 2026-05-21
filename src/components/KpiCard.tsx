import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "./ui/card";

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: "green" | "blue" | "purple" | "orange";
}

export default function KPICard({ title, value, change, icon, color }: KPICardProps) {
    const colorClasses = {
        green: "bg-green-100 text-green-600",
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600",
        orange: "bg-orange-100 text-orange-600",
    };

    const isPositive = change > 0;
    
    return (
        <Card className="bg-card rounded-xl shadow-sm border border-muted-card p-6">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="font-medium">{Math.abs(change)}%</span>
                </div>
            </div>
            <h3 className="text-2xl font-bold">{value}</h3>
            <p className="text-sm mt-1">{title}</p>
        </Card>
    );
}