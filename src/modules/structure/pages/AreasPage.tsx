"use client";

import { useState, useMemo } from "react";
import { MapPin, RefreshCw, Plus, Search } from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Skeleton } from "../../../components/ui/skeleton";
import { areasData, zonesData } from "../../../mock/structure";
import { AreaCard } from "../components/AreaCard";
import { CreateAreaDialog } from "../components/CreateAreaDialog";

export default function AreasPage() {
    const [search, setSearch] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const handleRefetch = async () => {
        setIsFetching(true);
        await new Promise((r) => setTimeout(r, 400));
        setIsFetching(false);
    };

    const zoneCountByArea = useMemo(() => {
        const counts: Record<string, number> = {};
        zonesData.forEach((z) => {
            counts[z.areaId] = (counts[z.areaId] ?? 0) + 1;
        });
        return counts;
    }, []);

    const filteredAreas = useMemo(() => {
        if (!search) return areasData;
        const lower = search.toLowerCase();
        return areasData.filter(
            (a) =>
                a.name.toLowerCase().includes(lower) ||
                a.description.toLowerCase().includes(lower),
        );
    }, [search]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <PageHeader
                    icon={<MapPin />}
                    title="Church Structure"
                    subtitle="Browse areas, zones, and cells, and manage their leaders"
                />
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleRefetch} disabled={isFetching}>
                        <RefreshCw className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <Plus className="w-4 h-4" />
                        New area
                    </Button>
                </div>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search areas..."
                    className="pl-9"
                />
            </div>

            {isFetching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-36 rounded-xl" />
                    ))}
                </div>
            ) : filteredAreas.length === 0 ? (
                <div className="text-center py-16 space-y-1">
                    <p className="font-medium">No areas found</p>
                    <p className="text-sm text-muted-foreground">
                        Try a different search, or create the first area.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAreas.map((area) => (
                        <AreaCard key={area.id} area={area} zoneCount={zoneCountByArea[area.id] ?? 0} />
                    ))}
                </div>
            )}

            <CreateAreaDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={() => {
                    setIsCreateOpen(false);
                    handleRefetch();
                }}
            />
        </div>
    );
}