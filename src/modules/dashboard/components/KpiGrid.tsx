import { Users, Briefcase, UserPlus, UserCheck } from "lucide-react";
import KPICard from "../../../components/KpiCard";
import { formatNumber } from "../../../utils/functions";
import { Skeleton } from "../../../components/ui/skeleton";

interface KpiGridProps {
    overview?: {
        totalMembers: number;
        totalVisitors: number;
        totalAttendance: number;
        totalDepartments: number;
        totalCells: number;
        growthRate: number;
        conversionRate: number;
        memberRetention: number;
    };
    metrics?: {
        newMembers: any;
        newVisitors: any;
        attendanceRate: any;
        engagementScore: any;
        averageAttendance: any;
        activeCells: any;
    };
    isLoading?: boolean;
}

export function KpiGrid({ overview, metrics, isLoading }: KpiGridProps) {
    if (isLoading || !overview || !metrics) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-card p-4 sm:p-6 rounded-xl border space-y-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <KPICard
                title="Total Members"
                subtitle="Total church members"
                value={formatNumber(overview.totalMembers)}
                change={overview.growthRate}
                icon={<Users className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="green"
            />
            <KPICard
                title="First Timers"
                subtitle="New visitors"
                value={formatNumber(overview.totalVisitors)}
                change={metrics.newVisitors?.changePercent || 0}
                icon={<UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="blue"
            />
            <KPICard
                title="Departments"
                subtitle="Church departments"
                value={formatNumber(overview.totalDepartments)}
                change={0}
                icon={<Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="purple"
            />
            <KPICard
                title="Cells"
                subtitle="Small groups"
                value={formatNumber(overview.totalCells)}
                change={0}
                icon={<UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />}
                color="orange"
            />
        </div>
    );
}