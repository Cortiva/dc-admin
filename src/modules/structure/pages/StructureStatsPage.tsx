import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Layers, Users, User } from "lucide-react";
import { useGetStructureStatsQuery } from "../structureApiSlice";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import KPICard from "../../../components/KpiCard";
import { formatNumber } from "../../../utils/functions";
import {
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Badge } from "../../../components/ui/badge";

const COLORS = ["#00A86B", "#FF6B35", "#17A2B8", "#FFC107", "#6C5CE7", "#FD79A8", "#00CEC9", "#FDCB6E"];

export default function StructureStatsPage() {
    const navigate = useNavigate();
    const { data: stats, isLoading } = useGetStructureStatsQuery();

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
                <MapPin className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Data Available</h3>
                <p className="text-sm text-muted-foreground">Structure statistics are not available</p>
            </div>
        );
    }

    // Prepare chart data
    const areaData = [
        { name: "Total Areas", value: stats.data.areas.total },
        { name: "With Leaders", value: stats.data.areas.withLeaders },
        { name: "Without Leaders", value: stats.data.areas.withoutLeaders },
    ];

    const zoneData = [
        { name: "Total Zones", value: stats.data.zones.total },
        { name: "With Leaders", value: stats.data.zones.withLeaders },
        { name: "Without Leaders", value: stats.data.zones.withoutLeaders },
    ];

    const cellData = [
        { name: "Total Cells", value: stats.data.cells.total },
        { name: "With Leaders", value: stats.data.cells.withLeaders },
        { name: "Without Leaders", value: stats.data.cells.withoutLeaders },
    ];

    const memberDistribution = [
        { name: "In Cells", value: stats.data.members.inCells },
        { name: "Without Cell", value: stats.data.members.withoutCell },
    ];

    const leaderData = stats.data.leaderStats.topLeaders?.map((leader: any) => ({
        name: leader.leaderName || "Unknown",
        roles: leader.roles,
    })) || [];

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => navigate("/structure")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <PageHeader
                    icon={<MapPin />}
                    title="Structure Statistics"
                    subtitle="Analytics and insights for church structure"
                />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <KPICard
                    title="Areas"
                    value={formatNumber(stats.data.areas.total)}
                    icon={<MapPin className="w-5 h-5" />}
                    color="blue"
                />
                <KPICard
                    title="Zones"
                    value={formatNumber(stats.data.zones.total)}
                    icon={<Layers className="w-5 h-5" />}
                    color="purple"
                />
                <KPICard
                    title="Cells"
                    value={formatNumber(stats.data.cells.total)}
                    icon={<Users className="w-5 h-5" />}
                    color="green"
                />
                <KPICard
                    title="Total Members"
                    value={formatNumber(stats.data.members.total)}
                    icon={<User className="w-5 h-5" />}
                    color="orange"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Areas Chart */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Areas</h3>
                    <div className="w-full h-50">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={areaData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {areaData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Zones Chart */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Zones</h3>
                    <div className="w-full h-50">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={zoneData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {zoneData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Cells Chart */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Cells</h3>
                    <div className="w-full h-50">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={cellData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {cellData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Member Distribution & Top Leaders */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4 sm:p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Member Distribution</h3>
                    <div className="w-full h-62.5">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={memberDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {memberDistribution.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-4 sm:p-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Top Leaders</h3>
                    {leaderData.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No leaders assigned yet</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {leaderData.map((leader: any) => (
                                <div key={leader.name} className="flex items-center justify-between p-2 rounded-lg border border-muted/30">
                                    <span className="text-sm font-medium">{leader.name}</span>
                                    <Badge variant="secondary">{leader.roles} roles</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* Cell Stats */}
            <Card className="p-4 sm:p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Cell Statistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg border border-muted/30">
                        <p className="text-2xl font-bold text-primary">{stats.data.cells.averageMembers}</p>
                        <p className="text-xs text-muted-foreground">Avg Members per Cell</p>
                    </div>
                    <div className="text-center p-4 rounded-lg border border-muted/30">
                        <p className="text-2xl font-bold text-green-500">{stats.data.cells.maxMembers}</p>
                        <p className="text-xs text-muted-foreground">Max Members</p>
                    </div>
                    <div className="text-center p-4 rounded-lg border border-muted/30">
                        <p className="text-2xl font-bold text-red-500">{stats.data.cells.minMembers}</p>
                        <p className="text-xs text-muted-foreground">Min Members</p>
                    </div>
                    <div className="text-center p-4 rounded-lg border border-muted/30">
                        <p className="text-2xl font-bold text-blue-500">{stats.data.members.averagePerCell}</p>
                        <p className="text-xs text-muted-foreground">Avg Members per Cell</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}