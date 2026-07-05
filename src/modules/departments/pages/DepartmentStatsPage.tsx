import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Users, UserCheck, UserPlus } from "lucide-react";
import { useGetDepartmentStatsQuery } from "../departmentApiSlice";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { formatNumber } from "../../../utils/functions";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";
import KPICard from "../../../components/KpiCard";

// const COLORS = ["#00A86B", "#FF6B35", "#17A2B8", "#FFC107", "#6C5CE7", "#FD79A8", "#00CEC9", "#FDCB6E"];

export default function DepartmentStatsPage() {
    const navigate = useNavigate();
    const { data: stats, isLoading } = useGetDepartmentStatsQuery();

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
                <Skeleton className="h-96 rounded-xl" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 p-8">
                <Building2 className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
                <p className="text-sm text-muted-foreground">Department statistics are not available</p>
            </div>
        );
    }

    console.log("Department Stats:", stats);

    // Prepare chart data
    const departmentData = stats.byDepartment?.map((d: { departmentName: string; memberCount: number }) => ({
        name: d.departmentName,
        members: d.memberCount,
    })) || [];

    const topDepartmentData = stats.topDepartments?.map((d: { departmentName: string; memberCount: number; growth?: number }) => ({
        name: d.departmentName,
        members: d.memberCount,
        growth: d.growth || 0,
    })) || [];

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate("/departments")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <PageHeader
                    icon={<Building2 />}
                    title="Department Statistics"
                    subtitle="Analytics and insights for church departments"
                />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <KPICard
                    title="Total Departments"
                    value={formatNumber(stats.overview.totalDepartments)}
                    icon={<Building2 className="w-5 h-5" />}
                    color="blue"
                />
                <KPICard
                    title="Total Members"
                    value={formatNumber(stats.overview.totalMembers)}
                    icon={<Users className="w-5 h-5" />}
                    color="green"
                />
                <KPICard
                    title="Avg Members/Dept"
                    value={stats.overview.averageMembersPerDepartment.toFixed(1)}
                    icon={<UserPlus className="w-5 h-5" />}
                    color="purple"
                />
                <KPICard
                    title="Full Members"
                    value={formatNumber(stats.memberDistribution.fullMembers)}
                    icon={<UserCheck className="w-5 h-5" />}
                    color="orange"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Department Distribution */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Members by Department</h3>
                    <div className="w-full h-75">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={departmentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} />
                                <YAxis stroke="#9CA3AF" fontSize={11} width={36} />
                                <RechartsTooltip />
                                <Bar dataKey="members" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Top Departments */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold mb-4">Top Departments</h3>
                    <div className="w-full h-75">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topDepartmentData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                                <XAxis type="number" stroke="#9CA3AF" fontSize={11} />
                                <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={11} width={80} />
                                <RechartsTooltip />
                                <Bar dataKey="members" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Department List */}
            <Card className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4">All Departments</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-muted/30">
                                <th className="text-left py-2 text-sm font-medium text-muted-foreground">Department</th>
                                <th className="text-right py-2 text-sm font-medium text-muted-foreground">Members</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.byDepartment?.map((dept: { departmentId: string; departmentName: string; memberCount: number }) => (
                                <tr key={dept.departmentId} className="border-b border-muted/30">
                                    <td className="py-2 text-sm">{dept.departmentName}</td>
                                    <td className="py-2 text-sm text-right">{dept.memberCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}