// pages/dashboard/DashboardPage.tsx

import { useState } from "react";
import { LayoutDashboard, RefreshCw } from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import { AlertsSkeleton } from "../../../components/skeletons/AlertsSkeleton";
import { KpiSkeleton } from "../components/KpiSkeleton";
import { ChartSkeleton } from "../components/ChartSkeleton";
import { Notifications } from "../components/Notifications";
import { AlertBar } from "../components/AlertBar";
import { KpiGrid } from "../components/KpiGrid";
import { ChartsGrid } from "../components/ChartsGrid";
import { FilterBar } from "../components/FilterBar";
import { useGetDashboardQuery } from "../dashboardApiSlice";

type PeriodType = "day" | "week" | "month" | "quarter" | "year";

interface Filters {
    period: PeriodType;
    dateFrom?: string;
    dateTo?: string;
}

export default function DashboardPage() {
    const [filters, setFilters] = useState<Filters>({
        period: "month",
        dateFrom: undefined,
        dateTo: undefined,
    });

    const {
        data,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useGetDashboardQuery(filters);

    const handleFilterChange = (newFilters: Partial<Filters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleRefresh = () => {
        refetch();
    };

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 p-8">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                        <LayoutDashboard className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Dashboard</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                        There was an error loading the dashboard data. Please try again.
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <PageHeader
                icon={<LayoutDashboard />}
                title="Dashboard"
                subtitle="Overview of key metrics and system status"
                action={
                    <button
                        onClick={handleRefresh}
                        disabled={isFetching}
                        className="p-2 rounded-md hover:bg-muted/50 transition-colors disabled:opacity-50"
                        aria-label="Refresh dashboard"
                    >
                        <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                    </button>
                }
            />

            {/* Filters */}
            <FilterBar
                period={filters.period}
                dateFrom={filters.dateFrom}
                dateTo={filters.dateTo}
                onFilterChange={handleFilterChange}
                isRefreshing={isFetching}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5">
                <div className="col-span-4 xl:col-span-3 space-y-4 sm:space-y-6">
                    {/* Alert Bar */}
                    {isLoading ? (
                        <AlertsSkeleton />
                    ) : (
                        <AlertBar
                            alerts={data?.alerts || []}
                            isLoading={isLoading}
                        />
                    )}

                    {/* KPI Cards Row */}
                    {isLoading ? (
                        <KpiSkeleton />
                    ) : (
                        <KpiGrid
                            overview={data?.overview}
                            metrics={data?.metrics}
                            isLoading={isLoading}
                        />
                    )}

                    {/* Charts Row */}
                    {isLoading ? (
                        <ChartSkeleton />
                    ) : (
                        <ChartsGrid
                            trends={data?.trends}
                            charts={data?.charts}
                            isLoading={isLoading}
                        />
                    )}
                </div>

                <div className="col-span-4 xl:col-span-1">
                    <Notifications alerts={data?.alerts || []} />
                </div>
            </div>
        </div>
    );
}