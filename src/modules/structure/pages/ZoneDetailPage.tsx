"use client";

import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layers, Plus, Pencil, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import type { Cell } from "../types/structure.types";
import { useUpdateZoneLeaderMutation, useUpdateZoneMutation } from "../structureApiSlice";
import { areasData, cellsData, zonesData } from "../../../mock/structure";
import { StructureBreadcrumb } from "../components/StructureBreadcrumb";
import { LeaderCard } from "../components/LeaderCard";
import { CellCard } from "../components/CellCard";
import { LeaderPickerDialog } from "../components/LeaderPickerDialog";
import { CreateCellDialog } from "../components/CreateCellDialog";
import { EditDetailsDialog } from "../components/EditDetailDialog";
import { ViewCellDialog } from "../components/ViewCellDialog";

export default function ZoneDetailPage() {
    const { zoneId } = useParams<{ zoneId: string }>();
    const navigate = useNavigate();

    const [isLeaderPickerOpen, setIsLeaderPickerOpen] = useState(false);
    const [isCreateCellOpen, setIsCreateCellOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    const [updateZone] = useUpdateZoneMutation();
    const [updateZoneLeader] = useUpdateZoneLeaderMutation();

    // Swap for useFetchZoneQuery(zoneId) once the real endpoint is wired
    // up — it already returns { zone, cells } in exactly this shape.
    const zone = useMemo(() => zonesData.find((z) => z.id === zoneId), [zoneId]);
    const cells = useMemo(() => cellsData.filter((c) => c.zoneId === zoneId), [zoneId]);
    const area = useMemo(
        () => (zone ? areasData.find((a) => a.id === zone.areaId) : undefined),
        [zone],
    );

    const handleRefetch = async () => {
        setIsFetching(true);
        await new Promise((r) => setTimeout(r, 400));
        setIsFetching(false);
    };

    if (!zone) {
        return (
            <div className="space-y-4">
                <StructureBreadcrumb crumbs={[{ label: "Church Structure", to: "/structure" }, { label: "Not found" }]} />
                <div className="text-center py-16 space-y-3">
                    <p className="font-medium">This zone couldn't be found</p>
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
                crumbs={[
                    { label: "Church Structure", to: "/structure" },
                    ...(area ? [{ label: area.name, to: `/structure/areas/${area.id}` }] : []),
                    { label: zone.name },
                ]}
            />

            <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                        <div className="w-14 h-14 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                            <Layers className="w-7 h-7" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold truncate">{zone.name}</h1>
                            <p className="text-sm text-muted-foreground mt-1">{zone.description}</p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                                <Calendar className="w-3.5 h-3.5" />
                                Created {new Date(zone.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="shrink-0">
                        <Pencil className="w-3.5 h-3.5 mr-1.5" />
                        Edit
                    </Button>
                </div>

                <div className="mt-5">
                    <LeaderCard leader={zone.leader} onChangeLeader={() => setIsLeaderPickerOpen(true)} />
                </div>
            </Card>

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Cells <span className="text-muted-foreground font-normal">({cells.length})</span>
                </h2>
                <Button onClick={() => setIsCreateCellOpen(true)} size="sm">
                    <Plus className="w-4 h-4" />
                    New cell
                </Button>
            </div>

            {isFetching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
            ) : cells.length === 0 ? (
                <div className="text-center py-12 space-y-1">
                    <p className="font-medium">No cells yet</p>
                    <p className="text-sm text-muted-foreground">
                        Create the first cell under {zone.name}.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cells.map((cell) => (
                        <CellCard key={cell.id} cell={cell} onView={setSelectedCell} />
                    ))}
                </div>
            )}

            <LeaderPickerDialog
                isOpen={isLeaderPickerOpen}
                onClose={() => setIsLeaderPickerOpen(false)}
                currentLeaderId={zone.leader?.id}
                targetLabel={zone.name}
                onAssign={(leaderId) =>
                    updateZoneLeader({ id: zone.id, data: { leaderId } })
                        .unwrap()
                        .then(() => handleRefetch())
                }
            />

            <CreateCellDialog
                isOpen={isCreateCellOpen}
                onClose={() => setIsCreateCellOpen(false)}
                onSuccess={() => {
                    setIsCreateCellOpen(false);
                    handleRefetch();
                }}
                zoneId={zone.id}
                zoneName={zone.name}
            />

            <EditDetailsDialog
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSuccess={() => {
                    setIsEditOpen(false);
                    handleRefetch();
                }}
                title="Edit zone"
                initialName={zone.name}
                initialDescription={zone.description}
                onSave={(data) => updateZone({ id: zone.id, data }).unwrap().then(() => handleRefetch())}
            />

            <ViewCellDialog
                cell={selectedCell}
                onClose={() => setSelectedCell(null)}
                onSuccess={() => {
                    setSelectedCell(null);
                    handleRefetch();
                }}
            />
        </div>
    );
}