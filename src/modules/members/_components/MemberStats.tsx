import { Card } from "../../../components/ui/card";
import { Users, UserCheck, UserPlus, Calendar, Award } from "lucide-react";
import KPICard from "../../../components/KpiCard";
import { formatNumber } from "../../../utils/functions";

interface MemberStatsProps {
    stats: {
        total: number;
        fullMembers: number;
        visitors: number;
        believers: number;
        birthdayThisMonth: number;
        growth: {
            lastMonth: number;
        };
        conversionRate: number;
    };
    isLoading: boolean;
}

export function MemberStats({ stats, isLoading }: MemberStatsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="p-4">
                        <div className="animate-pulse space-y-2">
                            <div className="h-4 w-16 bg-muted rounded" />
                            <div className="h-8 w-20 bg-muted rounded" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
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
                value={formatNumber(stats.birthdayThisMonth)}
                icon={<Calendar className="w-5 h-5" />}
                color="pink"
            />
            <KPICard
                title="New Members"
                subtitle="This month"
                value={formatNumber(stats.growth.lastMonth)}
                icon={<UserPlus className="w-5 h-5" />}
                color="teal"
            />
        </div>
    );
}