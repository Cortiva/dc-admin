"use client";

import { useState } from "react";
import {
    UserPlus,
    RefreshCw,
    Plus,
    Upload,
    Users,
    Sparkles,
    Repeat,
    TrendingUp,
} from "lucide-react";
import type { Visitor, VisitorFilterParams, VisitorStatus } from "../types/visitor.types";
import { Skeleton } from "../../../components/ui/skeleton";
import PageHeader from "../../../components/PageHeader";
import { Button } from "../../../components/ui/button";
import StatCard from "../../../components/StatCard";
import VisitorsTable from "../components/VisitorsTable";
import { ViewVisitorDialog } from "../components/ViewVisitorDialog";
import CreateVisitorDialog from "../components/CreateVisitorDialog";
import { ImportLauncherDialog } from "../components/ImportLauncherDialog";
import { ImportReviewPanel } from "../components/ImportReviewPanel";
import { RecordVisitDialog } from "../components/RecordVisitDialog";
import { AssignCellDialog } from "../components/AssignCellDialog";
import type { RawImportRow } from "../visitorValidation";
import { handleApiError } from "../../../utils/functions";
import { useFetchVisitorRetentionQuery, useFetchVisitorsQuery, useFetchVisitorSummaryQuery } from "../visitorApiSlice";

type ViewMode = "table" | "import-review";

export default function VisitorsPage() {
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [pendingImportRows, setPendingImportRows] = useState<RawImportRow[]>([]);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportLauncherOpen, setIsImportLauncherOpen] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
    const [visitorToAssignCell, setVisitorToAssignCell] = useState<Visitor | null>(null);
    const [visitorToRecordVisit, setVisitorToRecordVisit] = useState<Visitor | null>(null);

    const [filters, setFilters] = useState<VisitorFilterParams>({
        page: 1,
        limit: 10,
        search: "",
        status: "",
    });

    const {
        data: visitorsResponse,
        isFetching,
        isError,
        error,
        refetch,
    } = useFetchVisitorsQuery(filters);

    const { data: summaryResponse } = useFetchVisitorSummaryQuery({});
    const { data: retentionResponse } = useFetchVisitorRetentionQuery({});

    if (isError) handleApiError(error);

    const visitors = visitorsResponse?.data.content ?? [];
    const pagination = {
        page: filters.page,
        limit: filters.limit,
        total: visitorsResponse?.data.totalElements ?? 0,
        totalPages: visitorsResponse?.data.totalPages ?? 0,
    };

    const summary = summaryResponse?.data;
    const retention = retentionResponse?.data;
    const retentionRate = retention ? Math.round(retention.retentionRate * 100) : 0;

    const handleSearch = (search: string) => setFilters((p) => ({ ...p, search, page: 1 }));
    const handleStatusFilter = (status: VisitorStatus | "") =>
        setFilters((p) => ({ ...p, status, page: 1 }));
    const handlePageChange = (page: number) => {
        setFilters((p) => ({ ...p, page }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const handleLimitChange = (limit: number) => setFilters((p) => ({ ...p, limit, page: 1 }));

    const handleSheetParsed = (rows: RawImportRow[]) => {
        setIsImportLauncherOpen(false);
        setPendingImportRows(rows);
        setViewMode("import-review");
    };

    const handleImportFinished = () => {
        setViewMode("table");
        setPendingImportRows([]);
        refetch();
    };

    if (viewMode === "import-review") {
        return (
            <ImportReviewPanel
                initialRows={pendingImportRows}
                onCancel={() => {
                    setViewMode("table");
                    setPendingImportRows([]);
                }}
                onImported={handleImportFinished}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <PageHeader
                    icon={<UserPlus />}
                    title="Visitors"
                    subtitle="Welcome new faces, track return visits, and grow the church family"
                />
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                    <Button variant="outline" onClick={() => setIsImportLauncherOpen(true)}>
                        <Upload className="w-4 h-4" />
                        Import
                    </Button>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="w-4 h-4" />
                        Add visitor
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Total Visitors"
                    value={(summary?.totalVisitors ?? 0).toLocaleString()}
                    icon={<Users className="w-5 h-5" />}
                    color="blue"
                    trend={{ value: "All time", positive: true }}
                />
                <StatCard
                    title="First Timers"
                    value={(summary?.firstTimers ?? 0).toLocaleString()}
                    icon={<Sparkles className="w-5 h-5" />}
                    color="green"
                    trend={{ value: "Awaiting follow-up", positive: true }}
                />
                <StatCard
                    title="Returning"
                    value={(summary?.returningVisitors ?? 0).toLocaleString()}
                    icon={<Repeat className="w-5 h-5" />}
                    color="purple"
                    trend={{ value: "3+ visits", positive: true }}
                />
                <StatCard
                    title="Retention Rate"
                    value={`${retentionRate}%`}
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="orange"
                    trend={{
                        value: retention
                            ? `${retention.actuallyReturned} of ${retention.saidTheyWouldReturn} who said yes`
                            : "Said yes, then returned",
                        positive: true,
                    }}
                />
            </div>

            {isFetching ? (
                <Skeleton className="h-96 rounded-lg" />
            ) : (
                <VisitorsTable
                    visitors={visitors}
                    pagination={pagination}
                    isFetching={isFetching}
                    filters={filters}
                    onSearch={handleSearch}
                    onStatusFilter={handleStatusFilter}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    onViewVisitor={setSelectedVisitor}
                />
            )}

            <ViewVisitorDialog
                visitor={selectedVisitor}
                onClose={() => setSelectedVisitor(null)}
                onAssignCell={(visitor) => {
                    setSelectedVisitor(null);
                    setVisitorToAssignCell(visitor);
                }}
                onRecordVisit={(visitor) => {
                    setSelectedVisitor(null);
                    setVisitorToRecordVisit(visitor);
                }}
            />

            <CreateVisitorDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={() => {
                    setIsCreateOpen(false);
                    refetch();
                }}
            />

            <ImportLauncherDialog
                isOpen={isImportLauncherOpen}
                onClose={() => setIsImportLauncherOpen(false)}
                onParsed={handleSheetParsed}
            />

            <RecordVisitDialog
                visitor={visitorToRecordVisit}
                onClose={() => setVisitorToRecordVisit(null)}
                onSuccess={() => {
                    setVisitorToRecordVisit(null);
                    refetch();
                }}
            />

            <AssignCellDialog
                visitor={visitorToAssignCell}
                onClose={() => setVisitorToAssignCell(null)}
                onSuccess={() => {
                    setVisitorToAssignCell(null);
                    refetch();
                }}
            />
        </div>
    );
}