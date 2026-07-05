import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface ChartsGridProps {
    trends?: {
        membership: any[];
        visitors: any[];
        growth: any[];
    };
    charts?: {
        memberDistribution: any;
        visitorStatus: any;
        departmentDistribution: any;
        howHeardAboutUs: any;
        educationLevels: any;
        genderDistribution: any;
        membershipAge: any;
        topCells: any;
        topDepartments: any;
    };
    isLoading?: boolean;
}

const COLORS = ["#00A86B", "#FF6B35", "#17A2B8", "#FFC107", "#6C5CE7", "#FD79A8", "#00CEC9", "#FDCB6E"];

export function ChartsGrid({ trends, charts, isLoading }: ChartsGridProps) {
    if (isLoading || !trends || !charts) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                <Card className="lg:col-span-2 p-4 sm:p-6">
                    <Skeleton className="h-6 w-40 mb-6" />
                    <Skeleton className="h-50 sm:h-60 lg:h-70 w-full rounded-lg" />
                </Card>
                <Card className="p-4 sm:p-6">
                    <Skeleton className="h-6 w-40 mb-6" />
                    <Skeleton className="h-50 sm:h-60 lg:h-70 w-full rounded-lg" />
                </Card>
            </div>
        );
    }

    // Prepare data for area chart
    const areaData = trends.membership?.map((item, index) => ({
        date: item.label,
        members: item.value,
        visitors: trends.visitors?.[index]?.value || 0,
    })) || [];

    // Prepare training data
    const trainingData = charts.memberDistribution?.labels?.map((label: string, index: number) => ({
        name: label,
        value: charts.memberDistribution?.datasets[0]?.data[index] || 0,
    })) || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Growth Trend Chart */}
            <Card className="lg:col-span-2 bg-card rounded-xl shadow-sm border border-muted-card p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold">Growth Trend</h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <span className="w-3 h-3 rounded-full bg-[#00A86B]" />
                            Members
                        </span>
                    </div>
                </div>
                <div className="w-full h-50 sm:h-60 lg:h-70">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={areaData}>
                            <defs>
                                <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00A86B" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00A86B" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                            <XAxis 
                                dataKey="date" 
                                stroke="#9CA3AF" 
                                fontSize={10} 
                                tick={{ fill: "#9CA3AF" }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                stroke="#9CA3AF" 
                                fontSize={10} 
                                width={30}
                                tick={{ fill: "#9CA3AF" }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <RechartsTooltip 
                                contentStyle={{ 
                                    borderRadius: '8px', 
                                    border: '1px solid #e5e7eb',
                                    fontSize: '12px',
                                    padding: '8px 12px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="members"
                                stroke="#00A86B"
                                fill="url(#colorMembers)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Pie Chart */}
            <Card className="bg-card rounded-xl shadow-sm border border-muted-card p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Member Distribution</h3>
                <div className="w-full h-50 sm:h-60 lg:h-70">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={trainingData}
                                cx="50%"
                                cy="50%"
                                innerRadius={35}
                                outerRadius={65}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {trainingData.map((_: any, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <RechartsTooltip 
                                contentStyle={{ 
                                    borderRadius: '8px', 
                                    border: '1px solid #e5e7eb',
                                    fontSize: '12px',
                                    padding: '8px 12px'
                                }}
                            />
                            <Legend 
                                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                                iconSize={10}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
}