import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "../ui/card";

export default function MetricCard({ title, value, change, trend, icon }: { title: string; value: string; change: string; trend: "up" | "down"; icon: React.ReactNode }) {
    return (
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                    {icon}
                </div>
                <div className={`flex items-center gap-1 text-xs ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {trend === "up" ?
                        <TrendingUp className="w-3 h-3" /> :
                        <TrendingDown className="w-3 h-3" />}
                    <span>{change}</span>
                </div>
            </div>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{title}</p>
        </Card>
    );
}