"use client";

import { useState, useMemo } from "react";
import {
    Users,
    RefreshCw,
    Download,
    UserCheck,
    Plus,
    TrendingUp,
    Calendar,
} from "lucide-react";
import AppLayout from "../../components/layouts/AppLayout";
import PageHeader from "../../components/PageHeader";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import StatCard from "../../components/StatCard";
import { Skeleton } from "../../components/ui/skeleton";
import { visitorsData, type Visitor, type VisitorFilterParams } from "../../mock/visitors-mock-data";
import VisitorsStatsSkeleton from "./components/VisitorsStatsSkeleton";
import VisitorsTableSkeleton from "./components/VisitorsTableSkeleton";
import VisitorsTable from "./components/VisitorsTable";
import { ViewVisitor } from "./components/ViewVisitor";
import CreateVisitor from "./components/CreateVisitor";

export default function VisitorsPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [filters, setFilters] = useState<VisitorFilterParams>({
        page: 1,
        limit: 10,
        sortBy: "lastVisitDate",
        sortOrder: "desc",
        search: "",
        zone: "",
        isFirstTimer: undefined,
        isSecondTimer: undefined,
        enrolledForDca: undefined,
    });

    // Simulate API fetch
    const fetchVisitors = async () => {
        setIsFetching(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsFetching(false);
    };

    const handleRefetch = () => {
        fetchVisitors();
    };

    // Filter and paginate visitors
    const filteredVisitors = useMemo(() => {
        let result = [...visitorsData];

        // Apply search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(visitor =>
                visitor.fullName.toLowerCase().includes(searchLower) ||
                visitor.phoneNumber.includes(filters.search!) ||
                visitor.address.toLowerCase().includes(searchLower) ||
                visitor.occupation.toLowerCase().includes(searchLower)
            );
        }

        // Apply zone filter
        if (filters.zone) {
            result = result.filter(visitor => visitor.zone === filters.zone);
        }

        // Apply visitor type filters
        if (filters.isFirstTimer !== undefined) {
            result = result.filter(visitor => visitor.isFirstTimer === filters.isFirstTimer);
        }

        if (filters.isSecondTimer !== undefined) {
            result = result.filter(visitor => visitor.isSecondTimer === filters.isSecondTimer);
        }

        // Apply DCA enrollment filter
        if (filters.enrolledForDca !== undefined) {
            result = result.filter(visitor => visitor.enrolledForDca === filters.enrolledForDca);
        }

        // Apply sorting
        result.sort((a, b) => {
            const aVal = a[filters.sortBy];
            const bVal = b[filters.sortBy];
            if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [filters]);

    // Pagination
    const paginatedVisitors = useMemo(() => {
        const start = (filters.page - 1) * filters.limit;
        const end = start + filters.limit;
        return filteredVisitors.slice(start, end);
    }, [filteredVisitors, filters.page, filters.limit]);

    const pagination = useMemo(() => ({
        page: filters.page,
        limit: filters.limit,
        total: filteredVisitors.length,
        totalPages: Math.ceil(filteredVisitors.length / filters.limit)
    }), [filteredVisitors.length, filters.page, filters.limit]);

    // Statistics
    const summary = useMemo(() => {
        const totalVisitors = visitorsData.length;
        const firstTimers = visitorsData.filter(v => v.isFirstTimer).length;
        const secondTimers = visitorsData.filter(v => v.isSecondTimer).length;
        const returningVisitors = visitorsData.filter(v => v.visitCount > 1).length;
        const enrolledForDca = visitorsData.filter(v => v.enrolledForDca).length;
        const highInterest = visitorsData.filter(v => v.interestPercentage >= 70).length;
        const engagedVisitors = visitorsData.filter(v => v.hasBeenEngaged).length;

        const conversionPotential = visitorsData.filter(v => v.interestPercentage >= 80 && !v.enrolledForDca).length;

        return {
            totalVisitors,
            firstTimers,
            secondTimers,
            returningVisitors,
            enrolledForDca,
            highInterest,
            engagedVisitors,
            conversionPotential,
            avgInterestRate: Math.round(visitorsData.reduce((sum, v) => sum + v.interestPercentage, 0) / totalVisitors),
        };
    }, []);

    const firstTimerRate = summary.totalVisitors
        ? Math.round((summary.firstTimers / summary.totalVisitors) * 100)
        : 0;

    const conversionRate = summary.totalVisitors
        ? Math.round((summary.enrolledForDca / summary.totalVisitors) * 100)
        : 0;

    const engagementRate = summary.totalVisitors
        ? Math.round((summary.engagedVisitors / summary.totalVisitors) * 100)
        : 0;

    const handleSearch = (searchTerm: string) => {
        setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    };

    const handleZoneFilter = (zone: string) => {
        setFilters(prev => ({ ...prev, zone, page: 1 }));
    };

    const handleVisitorTypeFilter = (type: 'firstTimer' | 'secondTimer') => {
        if (type === 'firstTimer') {
            setFilters(prev => ({ 
                ...prev, 
                isFirstTimer: prev.isFirstTimer === undefined ? true : undefined,
                isSecondTimer: undefined,
                page: 1 
            }));
        } else {
            setFilters(prev => ({ 
                ...prev, 
                isSecondTimer: prev.isSecondTimer === undefined ? true : undefined,
                isFirstTimer: undefined,
                page: 1 
            }));
        }
    };

    const handleDcaFilter = () => {
        setFilters(prev => ({ 
            ...prev, 
            enrolledForDca: prev.enrolledForDca === undefined ? true : undefined,
            page: 1 
        }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLimitChange = (limit: number) => {
        setFilters(prev => ({ ...prev, limit, page: 1 }));
    };

    const handleViewVisitor = (visitor: Visitor) => {
        setSelectedVisitor(visitor);
        setIsDetailModalOpen(true);
    };

    const handleExport = async () => {
        console.log("Exporting visitors...");
    };

    const handleSuccess = () => {
        setIsAddModalOpen(false);
        setIsDetailModalOpen(false);
        handleRefetch();
    };

    if (isFetching) {
        return (
            <AppLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-64" />
                            </div>
                            <Skeleton className="h-4 w-96" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10" />
                            <Skeleton className="h-10 w-10" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                    <VisitorsStatsSkeleton />
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                        <VisitorsTableSkeleton />
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <PageHeader
                        icon={<Users />}
                        title="Visitor Management"
                        subtitle="Track church visitors, first timers, and follow-up opportunities"
                    />
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={handleRefetch} disabled={isFetching}>
                            <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            className="flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Export
                        </Button>
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            <Plus className="w-4 h-4" />
                            Add Visitor
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard
                        title="Total Visitors"
                        value={summary.totalVisitors.toLocaleString()}
                        icon={<Users className="w-5 h-5" />}
                        color="blue"
                        trend={{ value: `${firstTimerRate}% first timers`, positive: true }}
                    />

                    <StatCard
                        title="First Timers"
                        value={summary.firstTimers.toLocaleString()}
                        icon={<UserCheck className="w-5 h-5" />}
                        color="green"
                        trend={{ value: `${summary.returningVisitors} returning`, positive: true }}
                    />

                    <StatCard
                        title="High Interest"
                        value={summary.highInterest.toLocaleString()}
                        icon={<TrendingUp className="w-5 h-5" />}
                        color="yellow"
                        trend={{ value: `${summary.avgInterestRate}% avg interest`, positive: true }}
                    />

                    <StatCard
                        title="Enrolled for DCA"
                        value={summary.enrolledForDca.toLocaleString()}
                        icon={<Calendar className="w-5 h-5" />}
                        color="purple"
                        trend={{ value: `${conversionRate}% conversion`, positive: true }}
                    />
                </div>

                {/* Secondary Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="bg-card rounded-xl shadow-sm border border-muted-card p-4">
                        <p className="text-sm text-muted-foreground">Engagement Rate</p>
                        <p className="text-2xl font-bold">{engagementRate}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div className="bg-green-500 rounded-full h-2" style={{ width: `${engagementRate}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{summary.engagedVisitors} visitors engaged</p>
                    </div>
                    <div className="bg-card rounded-xl shadow-sm border border-muted-card p-4">
                        <p className="text-sm text-muted-foreground">Conversion Potential</p>
                        <p className="text-2xl font-bold">{summary.conversionPotential}</p>
                        <p className="text-xs text-muted-foreground mt-2">Visitors with 80%+ interest not enrolled</p>
                    </div>
                    <div className="bg-card rounded-xl shadow-sm border border-muted-card p-4">
                        <p className="text-sm text-muted-foreground">Returning Visitors</p>
                        <p className="text-2xl font-bold">{summary.returningVisitors}</p>
                        <p className="text-xs text-muted-foreground mt-2">{Math.round((summary.returningVisitors / summary.totalVisitors) * 100)}% of total</p>
                    </div>
                </div>

                {/* Main Tabs */}
                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList className="flex items-center mb-5">
                        <TabsTrigger
                            value="all"
                            className="px-4 py-2.25 text-sm font-medium hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
                        >
                            All Visitors
                        </TabsTrigger>
                        <TabsTrigger
                            value="first-timers"
                            className="px-4 py-2.25 text-sm font-medium hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
                        >
                            First Timers
                        </TabsTrigger>
                        <TabsTrigger
                            value="second-timers"
                            className="px-4 py-2.25 text-sm font-medium hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
                        >
                            Second Timers
                        </TabsTrigger>
                        <TabsTrigger
                            value="dca-interested"
                            className="px-4 py-2.25 text-sm font-medium hover:text-foreground data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary transition-all"
                        >
                            DCA Interested
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <VisitorsTable
                            visitors={paginatedVisitors}
                            pagination={pagination}
                            isFetching={isFetching}
                            filters={filters}
                            onSearch={handleSearch}
                            onZoneFilter={handleZoneFilter}
                            onVisitorTypeFilter={handleVisitorTypeFilter}
                            onDcaFilter={handleDcaFilter}
                            onPageChange={handlePageChange}
                            onLimitChange={handleLimitChange}
                            onViewVisitor={handleViewVisitor}
                        />
                    </TabsContent>

                    <TabsContent value="first-timers">
                        <VisitorsTable
                            visitors={paginatedVisitors.filter(v => v.isFirstTimer)}
                            pagination={{ ...pagination, total: visitorsData.filter(v => v.isFirstTimer).length }}
                            isFetching={isFetching}
                            filters={filters}
                            onSearch={handleSearch}
                            onZoneFilter={handleZoneFilter}
                            onVisitorTypeFilter={handleVisitorTypeFilter}
                            onDcaFilter={handleDcaFilter}
                            onPageChange={handlePageChange}
                            onLimitChange={handleLimitChange}
                            onViewVisitor={handleViewVisitor}
                        />
                    </TabsContent>

                    <TabsContent value="second-timers">
                        <VisitorsTable
                            visitors={paginatedVisitors.filter(v => v.isSecondTimer)}
                            pagination={{ ...pagination, total: visitorsData.filter(v => v.isSecondTimer).length }}
                            isFetching={isFetching}
                            filters={filters}
                            onSearch={handleSearch}
                            onZoneFilter={handleZoneFilter}
                            onVisitorTypeFilter={handleVisitorTypeFilter}
                            onDcaFilter={handleDcaFilter}
                            onPageChange={handlePageChange}
                            onLimitChange={handleLimitChange}
                            onViewVisitor={handleViewVisitor}
                        />
                    </TabsContent>

                    <TabsContent value="dca-interested">
                        <VisitorsTable
                            visitors={paginatedVisitors.filter(v => v.enrolledForDca || v.interestPercentage >= 70)}
                            pagination={{ ...pagination, total: visitorsData.filter(v => v.enrolledForDca || v.interestPercentage >= 70).length }}
                            isFetching={isFetching}
                            filters={filters}
                            onSearch={handleSearch}
                            onZoneFilter={handleZoneFilter}
                            onVisitorTypeFilter={handleVisitorTypeFilter}
                            onDcaFilter={handleDcaFilter}
                            onPageChange={handlePageChange}
                            onLimitChange={handleLimitChange}
                            onViewVisitor={handleViewVisitor}
                        />
                    </TabsContent>
                </Tabs>

                <ViewVisitor
                    isOpen={isDetailModalOpen}
                    onClose={() => {
                        setIsDetailModalOpen(false);
                        setSelectedVisitor(null);
                    }}
                    visitor={selectedVisitor}
                />

                <CreateVisitor
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            </div>
        </AppLayout>
    );
}