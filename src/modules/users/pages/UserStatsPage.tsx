import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, UserCheck, UserX, Clock } from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { Badge } from "../../../components/ui/badge";
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
} from "recharts";
import { useGetUserStatsQuery } from "../usersApiSlice";

const COLORS = ["#3B82F6", "#8B5CF6", "#00A86B", "#F59E0B", "#EF4444", "#EC4899", "#14B8A6"];

export default function UserStatsPage() {
    const navigate = useNavigate();
    const { data: stats, isLoading } = useGetUserStatsQuery();

    if (isLoading) {
        return (
            <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-64 rounded-xl" />
                    <Skeleton className="h-64 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 p-8">
                <Users className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
                <p className="text-sm text-muted-foreground">User statistics are not available</p>
                <Button className="mt-4" onClick={() => navigate("/users")}>
                    Back to Users
                </Button>
            </div>
        );
    }

    // Prepare chart data
    const roleData = stats.byRole?.map((r: { role: string; count: number; percentage: number }) => ({
        name: r.role,
        value: r.count,
        percentage: r.percentage,
    })) || [];

    const statusData = stats.byStatus?.map((s: { status: string; count: number; percentage: number }) => ({
        name: s.status,
        value: s.count,
        percentage: s.percentage,
    })) || [];

    const sourceData = stats.byRegistrationSource?.map((s: { source: string; count: number }) => ({
        name: s.source,
        value: s.count,
    })) || [];

    const growthData = [
        { name: "Last Week", value: stats.growth.lastWeek },
        { name: "Last Month", value: stats.growth.lastMonth },
        { name: "Last Quarter", value: stats.growth.lastQuarter },
        { name: "Last Year", value: stats.growth.lastYear },
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate("/users")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <PageHeader
                    icon={<Users />}
                    title="User Statistics"
                    subtitle="Analytics and insights for user accounts"
                />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <KPICard
                    title="Total Users"
                    value={formatNumber(stats.overview.total)}
                    icon={<Users className="w-5 h-5" />}
                    color="blue"
                />
                <KPICard
                    title="Active"
                    value={formatNumber(stats.overview.active)}
                    icon={<UserCheck className="w-5 h-5" />}
                    color="green"
                />
                <KPICard
                    title="Pending Approval"
                    value={formatNumber(stats.overview.pendingApproval)}
                    icon={<Clock className="w-5 h-5" />}
                    color="orange"
                />
                <KPICard
                    title="Suspended"
                    value={formatNumber(stats.overview.suspended)}
                    icon={<UserX className="w-5 h-5" />}
                    color="red"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role Distribution */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Role Distribution</h3>
                    <div className="w-full h-62.5">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {roleData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 justify-center">
                        {roleData.map((r: { name: string; value: number; percentage: number }) => (
                            <Badge key={r.name} variant="secondary" className="text-xs">
                                {r.name}: {r.value} ({Math.round(r.percentage)}%)
                            </Badge>
                        ))}
                    </div>
                </Card>

                {/* Status Distribution */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Status Distribution</h3>
                    <div className="w-full h-62.5">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} />
                                <YAxis stroke="#9CA3AF" fontSize={11} width={36} />
                                <RechartsTooltip />
                                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 justify-center">
                        {statusData.map((s: { name: string; value: number; percentage: number }) => (
                            <Badge key={s.name} variant="secondary" className="text-xs">
                                {s.name}: {s.value}
                            </Badge>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Growth & Registration Source */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 sm:p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">User Growth</h3>
                    <div className="w-full h-50">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} />
                                <YAxis stroke="#9CA3AF" fontSize={11} width={36} />
                                <RechartsTooltip />
                                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-4 sm:p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Registration Source</h3>
                    <div className="w-full h-50">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {sourceData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Approval Stats */}
            <Card className="p-4 sm:p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Approval Statistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg border border-muted/30">
                        <p className="text-2xl font-bold text-orange-500">{stats.approvalStats.pending}</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                    <div className="text-center p-4 rounded-lg border border-muted/30">
                        <p className="text-2xl font-bold text-green-500">{stats.approvalStats.approved}</p>
                        <p className="text-xs text-muted-foreground">Approved</p>
                    </div>
                    <div className="text-center p-4 rounded-lg border border-muted/30">
                        <p className="text-2xl font-bold text-red-500">{stats.approvalStats.rejected}</p>
                        <p className="text-xs text-muted-foreground">Rejected</p>
                    </div>
                    <div className="text-center p-4 rounded-lg border border-muted/30">
                        <p className="text-2xl font-bold text-blue-500">{stats.approvalStats.averageApprovalTime}h</p>
                        <p className="text-xs text-muted-foreground">Avg Approval Time</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}