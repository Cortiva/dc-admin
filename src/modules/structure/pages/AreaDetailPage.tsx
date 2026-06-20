"use client";

import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Plus, Pencil, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { ZoneCard } from "../components/ZoneCard";
import { LeaderCard } from "../components/LeaderCard";
import { LeaderPickerDialog } from "../components/LeaderPickerDialog";
import { CreateZoneDialog } from "../components/CreateZoneDialog";
import { StructureBreadcrumb } from "../components/StructureBreadcrumb";
import {
    useFetchAreaQuery,
    useFetchCellsQuery,
    useUpdateAreaMutation,
    useUpdateAreaLeaderMutation,
} from "../structureApiSlice";
import { handleApiError } from "../../../utils/functions";
import { EditDetailsDialog } from "../components/EditDetailDialog";

// Same caveat as AreasPage's zone-count fetch — only counts cells within
// the first ALL_CELLS_LIMIT returned by GET /cells.
const ALL_CELLS_LIMIT = 1000;

export default function AreaDetailPage() {
    const { areaId } = useParams<{ areaId: string }>();
    const navigate = useNavigate();

    const [isLeaderPickerOpen, setIsLeaderPickerOpen] = useState(false);
    const [isCreateZoneOpen, setIsCreateZoneOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [updateArea] = useUpdateAreaMutation();
    const [updateAreaLeader] = useUpdateAreaLeaderMutation();

    const {
        data: response,
        isFetching,
        isError,
        error,
        refetch,
    } = useFetchAreaQuery(areaId!, { skip: !areaId });

    if (isError) handleApiError(error);

    const area = response?.data.area;
    const zones = response?.data.zones ?? [];

    const { data: cellsResponse } = useFetchCellsQuery({ page: 1, limit: ALL_CELLS_LIMIT });
    const cellCountByZone = useMemo(() => {
        const counts: Record<string, number> = {};
        (cellsResponse?.data.content ?? []).forEach((cell) => {
            counts[cell.zoneId] = (counts[cell.zoneId] ?? 0) + 1;
        });
        return counts;
    }, [cellsResponse]);

    if (isFetching && !area) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-40 rounded-xl" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-36 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!area) {
        return (
            <div className="space-y-4">
                <StructureBreadcrumb crumbs={[{ label: "Church Structure", to: "/structure" }, { label: "Not found" }]} />
                <div className="text-center py-16 space-y-3">
                    <p className="font-medium">This area couldn't be found</p>
                    <p className="text-sm text-muted-foreground">
                        It may have been removed, or the link is incorrect.
                    </p>
                    <Button variant="outline" onClick={() => navigate("/structure")}>
                        Back to all areas
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <StructureBreadcrumb
                crumbs={[{ label: "Church Structure", to: "/structure" }, { label: area.name }]}
            />

            <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <MapPin className="w-7 h-7" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold truncate">{area.name}</h1>
                            <p className="text-sm text-muted-foreground mt-1">{area.description}</p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                                <Calendar className="w-3.5 h-3.5" />
                                Created {new Date(area.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="shrink-0">
                        <Pencil className="w-3.5 h-3.5 mr-1.5" />
                        Edit
                    </Button>
                </div>

                <div className="mt-5">
                    <LeaderCard leader={area.leader} onChangeLeader={() => setIsLeaderPickerOpen(true)} />
                </div>
            </Card>

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Zones <span className="text-muted-foreground font-normal">({zones.length})</span>
                </h2>
                <Button onClick={() => setIsCreateZoneOpen(true)} size="sm">
                    <Plus className="w-4 h-4" />
                    New zone
                </Button>
            </div>

            {isFetching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-36 rounded-xl" />
                    ))}
                </div>
            ) : zones.length === 0 ? (
                <div className="text-center py-12 space-y-1">
                    <p className="font-medium">No zones yet</p>
                    <p className="text-sm text-muted-foreground">
                        Create the first zone under {area.name}.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {zones.map((zone) => (
                        <ZoneCard
                            key={zone.id}
                            zone={zone}
                            cellCount={cellCountByZone[zone.id] ?? 0}
                        />
                    ))}
                </div>
            )}

            <LeaderPickerDialog
                isOpen={isLeaderPickerOpen}
                onClose={() => setIsLeaderPickerOpen(false)}
                currentLeaderId={area.leader?.id}
                targetLabel={area.name}
                onAssign={(leaderId) =>
                    updateAreaLeader({ id: area.id, data: { leaderId } })
                        .unwrap()
                        .then(() => refetch())
                }
            />

            <CreateZoneDialog
                isOpen={isCreateZoneOpen}
                onClose={() => setIsCreateZoneOpen(false)}
                onSuccess={() => {
                    setIsCreateZoneOpen(false);
                    refetch();
                }}
                areaId={area.id}
                areaName={area.name}
            />

            <EditDetailsDialog
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSuccess={() => {
                    setIsEditOpen(false);
                    refetch();
                }}
                title="Edit area"
                initialName={area.name}
                initialDescription={area.description}
                onSave={(data) => updateArea({ id: area.id, data }).unwrap().then(() => refetch())}
            />
        </div>
    );
}