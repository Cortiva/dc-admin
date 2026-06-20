"use client";

import { useState, useMemo } from "react";
import { MapPin, RefreshCw, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Skeleton } from "../../../components/ui/skeleton";
import { AreaCard } from "../components/AreaCard";
import { CreateAreaDialog } from "../components/CreateAreaDialog";
import { handleApiError } from "../../../utils/functions";
import type { StructureFilterParams } from "../types/structure.types";
import { useFetchAreasQuery, useFetchZonesQuery } from "../structureApiSlice";

const ALL_ZONES_LIMIT = 500;

export default function AreasPage() {
    const [searchInput, setSearchInput] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [filters, setFilters] = useState<StructureFilterParams>({
        page: 1,
        limit: 12,
        search: "",
    });

    const { data, isFetching, isError, error, refetch } = useFetchAreasQuery(filters);
    if (isError) handleApiError(error);

    const areas = data?.data.content ?? [];
    const totalPages = data?.data.totalPages ?? 0;

    const { data: zonesResponse } = useFetchZonesQuery({ page: 1, limit: ALL_ZONES_LIMIT });
    const zoneCountByArea = useMemo(() => {
        const counts: Record<string, number> = {};
        (zonesResponse?.data.content ?? []).forEach((zone) => {
            counts[zone.areaId] = (counts[zone.areaId] ?? 0) + 1;
        });
        return counts;
    }, [zonesResponse]);

    const handleSearch = () => setFilters((p) => ({ ...p, search: searchInput, page: 1 }));
    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <PageHeader
                    icon={<MapPin />}
                    title="Church Structure"
                    subtitle="Browse areas, zones, and cells, and manage their leaders"
                />
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="w-4 h-4" />
                        New area
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Search areas..."
                        className="pl-9"
                    />
                </div>
                <Button onClick={handleSearch} size="sm">
                    <Search className="w-4 h-4" />
                </Button>
            </div>

            {isFetching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-36 rounded-xl" />
                    ))}
                </div>
            ) : areas.length === 0 ? (
                <div className="text-center py-16 space-y-1">
                    <p className="font-medium">No areas found</p>
                    <p className="text-sm text-muted-foreground">
                        Try a different search, or create the first area.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {areas.map((area) => (
                        <AreaCard
                            key={area.id}
                            area={area}
                            zoneCount={zoneCountByArea[area.id] ?? 0}
                        />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page {filters.page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                            disabled={filters.page === 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                            disabled={filters.page === totalPages}
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            <CreateAreaDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={() => {
                    setIsCreateOpen(false);
                    refetch();
                }}
            />
        </div>
    );
}