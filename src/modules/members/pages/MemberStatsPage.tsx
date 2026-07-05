import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    BarChart3, ArrowLeft, Users, UserCheck, UserPlus, Calendar, Award, TrendingUp,
    Download
} from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import KPICard from "../../../components/KpiCard";
import { formatNumber } from "../../../utils/functions";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart,
} from "recharts";
import { useGetMemberGrowthQuery, useGetMemberStatsQuery } from "../memberApiSlice";

const COLORS = ["#00A86B", "#FF6B35", "#17A2B8", "#FFC107", "#6C5CE7", "#FD79A8", "#00CEC9", "#FDCB6E"];

export default function MemberStatsPage() {
    const navigate = useNavigate();
    const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
    const limit = 12;

    const { data: stats, isLoading: statsLoading } = useGetMemberStatsQuery();
    const { data: growthData, isLoading: growthLoading } = useGetMemberGrowthQuery({ period, limit });

    const isLoading = statsLoading || growthLoading;

    if (isLoading) {
        return (
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-10 w-48" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Skeleton className="h-96 rounded-xl" />
                    <Skeleton className="h-96 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 p-8">
                <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
                <p className="text-sm text-muted-foreground">Member statistics data is not available</p>
            </div>
        );
    }

    // Prepare chart data
    const departmentData = stats.byDepartment?.map((d: { departmentName?: string; _count: number }) => ({
        name: d.departmentName || "Unassigned",
        value: d._count,
    })) || [];

    const cellData = stats.byCell?.map((c: { cellName?: string; _count: number }) => ({
        name: c.cellName || "Unassigned",
        value: c._count,
    })) || [];

    const visitorStatusData = stats.byVisitorStatus?.map((v: { status: string; _count: number }) => ({
        name: v.status,
        value: v._count,
    })) || [];

    const howHeardData = stats.byHowHeardAboutUs?.map((h: { source: string; _count: number }) => ({
        name: h.source,
        value: h._count,
    })) || [];

    const growthChartData = growthData?.map((item: { period: string; count: number }) => ({
        period: item.period,
        count: item.count,
    })) || [];

    const genderData = Object.entries(stats.byGender || {}).map(([key, value]) => ({
        name: key === "MALE" ? "Male" : key === "FEMALE" ? "Female" : "Unknown",
        value: value,
    }));

    const dcaData = [
        { name: "DCA Basic", value: stats.dcaAttendance?.dcaBasic || 0 },
        { name: "DCA Merit", value: stats.dcaAttendance?.dcaMerit || 0 },
        { name: "Encounter", value: stats.dcaAttendance?.encounter || 0 },
    ];

    const membershipAgeData = stats.membershipAge ? [
        { name: "< 1 Month", value: stats.membershipAge.lessThan1Month || 0 },
        { name: "1-6 Months", value: stats.membershipAge.between1And6Months || 0 },
        { name: "6-12 Months", value: stats.membershipAge.between6And12Months || 0 },
        { name: "> 1 Year", value: stats.membershipAge.moreThan1Year || 0 },
    ] : [];

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/members")}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <PageHeader
                        icon={<BarChart3 />}
                        title="Member Statistics"
                        subtitle="Comprehensive analytics and insights"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
                <KPICard
                    title="Total"
                    subtitle="All members"
                    value={formatNumber(stats.total)}
                    icon={<Users className="w-5 h-5" />}
                    color="blue"
                />
                <KPICard
                    title="Full Members"
                    subtitle="Approved members"
                    value={formatNumber(stats.fullMembers)}
                    change={stats.conversionRate}
                    icon={<UserCheck className="w-5 h-5" />}
                    color="green"
                />
                <KPICard
                    title="Visitors"
                    subtitle="Not yet members"
                    value={formatNumber(stats.visitors)}
                    icon={<UserPlus className="w-5 h-5" />}
                    color="orange"
                />
                <KPICard
                    title="Believers"
                    subtitle="Faith declaration"
                    value={formatNumber(stats.believers)}
                    icon={<Award className="w-5 h-5" />}
                    color="purple"
                />
                <KPICard
                    title="Birthdays"
                    subtitle="This month"
                    value={formatNumber(stats.birthdayThisMonth || 0)}
                    icon={<Calendar className="w-5 h-5" />}
                    color="pink"
                />
                <KPICard
                    title="Growth"
                    subtitle="This month"
                    value={`${stats.growth?.lastMonth || 0}%`}
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="teal"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Member Growth Chart */}
                <Card className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                        <h3 className="text-base sm:text-lg font-semibold">Member Growth</h3>
                        <div className="flex gap-2">
                            <Button
                                variant={period === "daily" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setPeriod("daily")}
                            >
                                Daily
                            </Button>
                            <Button
                                variant={period === "weekly" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setPeriod("weekly")}
                            >
                                Weekly
                            </Button>
                            <Button
                                variant={period === "monthly" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setPeriod("monthly")}
                            >
                                Monthly
                            </Button>
                        </div>
                    </div>
                    <div className="w-full h-62.5 sm:h-75">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthChartData}>
                                <defs>
                                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00A86B" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00A86B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis dataKey="period" stroke="#9CA3AF" fontSize={10} />
                                <YAxis stroke="#9CA3AF" fontSize={10} width={30} />
                                <RechartsTooltip />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#00A86B"
                                    fill="url(#colorGrowth)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Gender Distribution */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Gender Distribution</h3>
                    <div className="w-full h-62.5 sm:h-75">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genderData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {genderData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Department Distribution */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Members by Department</h3>
                    <div className="w-full h-62.5 sm:h-75">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={departmentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
                                <YAxis stroke="#9CA3AF" fontSize={10} width={30} />
                                <RechartsTooltip />
                                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Cell Distribution */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Members by Cell</h3>
                    <div className="w-full h-62.5 sm:h-75">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cellData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
                                <YAxis stroke="#9CA3AF" fontSize={10} width={30} />
                                <RechartsTooltip />
                                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Visitor Status */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Visitor Status</h3>
                    <div className="w-full h-62.5 sm:h-75">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={visitorStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {visitorStatusData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* How They Heard */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4">How They Heard</h3>
                    <div className="w-full h-62.5 sm:h-75">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={howHeardData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis type="number" stroke="#9CA3AF" fontSize={10} />
                                <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={10} width={80} />
                                <RechartsTooltip />
                                <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* DCA Attendance */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4">DCA Attendance</h3>
                    <div className="w-full h-62.5 sm:h-75">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dcaData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {dcaData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Membership Age */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Membership Age</h3>
                    <div className="w-full h-62.5 sm:h-75">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={membershipAgeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
                                <YAxis stroke="#9CA3AF" fontSize={10} width={30} />
                                <RechartsTooltip />
                                <Bar dataKey="value" fill="#EC4899" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
}