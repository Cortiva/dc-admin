import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line
} from "recharts";
import { Card } from "./ui/card";
import { Briefcase, DollarSign, TrendingUp, Users } from "lucide-react";
import MetricCard from "./helper/MetricCard";

export default function AnalyticsTab({ selectedCategory }: { selectedCategory: string | null }) {
    // Mock chart data
    const monthlyData = [
        { month: "Sep", jobs: 245, revenue: 980000, artisans: 78 },
        { month: "Oct", jobs: 278, revenue: 1120000, artisans: 82 },
        { month: "Nov", jobs: 312, revenue: 1250000, artisans: 88 },
        { month: "Dec", jobs: 356, revenue: 1420000, artisans: 94 },
        { month: "Jan", jobs: 398, revenue: 1590000, artisans: 102 },
        { month: "Feb", jobs: 420, revenue: 1680000, artisans: 108 }
    ];

    const categoryDistribution = [
        { name: "Pipe Fitting", value: 35, color: "#00A86B" },
        { name: "Water Heater", value: 25, color: "#FF6B35" },
        { name: "Leak Detection", value: 20, color: "#17A2B8" },
        { name: "Drain Cleaning", value: 12, color: "#FFC107" },
        { name: "Others", value: 8, color: "#DC3545" }
    ];

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard title="Total Jobs (30d)" value="420" change="+18%" trend="up" icon={<Briefcase
                    className="w-5 h-5" />}
                />
                <MetricCard title="Total Revenue" value="₦1.68M" change="+22%" trend="up" icon={<DollarSign
                    className="w-5 h-5" />}
                />
                <MetricCard title="Active Artisans" value="108" change="+12" trend="up" icon={<Users className="w-5 h-5" />}
                />
                <MetricCard title="Avg Job Value" value="₦4,000" change="+5%" trend="up" icon={<TrendingUp
                    className="w-5 h-5" />}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Jobs & Revenue Trend */}
                <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Jobs & Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" stroke="#9CA3AF" />
                            <YAxis yAxisId="left" stroke="#00A86B" />
                            <YAxis yAxisId="right" orientation="right" stroke="#FF6B35" />
                            <RechartsTooltip />
                            <Line yAxisId="left" type="monotone" dataKey="jobs" stroke="#00A86B" strokeWidth={2} name="Jobs" />
                            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2}
                                name="Revenue (₦)" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Category Distribution */}
                <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Category Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={categoryDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}
                                dataKey="value" label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
                            >
                                {categoryDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Artisan Growth */}
            <Card className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Artisan Growth</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <RechartsTooltip />
                        <Bar dataKey="artisans" fill="#00A86B" radius={[4, 4, 0, 0]} name="Artisans" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}
