import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, Plus, Search, Download, MoreVertical, Eye, Edit, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "../../../components/PageHeader";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog";
import { Skeleton } from "../../../components/ui/skeleton";
import { useGetZonesQuery, useDeleteZoneMutation, useExportStructureMutation } from "../structureApiSlice";
import { handleApiError } from "../../../utils/functions";
import type { ZoneResponse } from "../../../types/structure.types";

export default function ZonesPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc" as const,
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState<ZoneResponse | null>(null);

    const { data, isLoading, refetch } = useGetZonesQuery({
        search: search || undefined,
        ...filters,
    });

    const [deleteZone] = useDeleteZoneMutation();
    const [exportStructure] = useExportStructureMutation();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };

    const handleDelete = async () => {
        if (!selectedZone) return;
        try {
            await deleteZone(selectedZone.id).unwrap();
            toast.success("Zone deleted successfully");
            setDeleteDialogOpen(false);
            setSelectedZone(null);
            refetch();
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleExport = async () => {
        try {
            const blob = await exportStructure({
                type: "zones",
                filters: { search: search || undefined },
            }).unwrap();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `zones_${new Date().toISOString().split("T")[0]}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
            toast.success("Zones exported successfully");
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <PageHeader
                icon={<Layers />}
                title="Zones"
                subtitle="Manage church zones and cells"
                action={
                    <Button onClick={() => navigate("/structure/zones/create")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Zone
                    </Button>
                }
            />

            {/* Filters */}
            <Card className="p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search zones..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">Search</Button>
                    </form>

                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={handleExport}>
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Zones Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Zone</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Area</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Cells</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">Leader</th>
                                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="p-3"><Skeleton className="h-6 w-32" /></td>
                                        <td className="p-3 hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
                                        <td className="p-3"><Skeleton className="h-6 w-12" /></td>
                                        <td className="p-3 hidden lg:table-cell"><Skeleton className="h-4 w-24" /></td>
                                        <td className="p-3 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : data?.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-muted-foreground">
                                        <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-lg font-medium">No zones found</p>
                                        <p className="text-sm">Try adjusting your search</p>
                                        <Button className="mt-4" onClick={() => navigate("/structure/zones/create")}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create your first zone
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                data?.data.map((zone) => (
                                    <tr key={zone.id} className="border-t border-muted/30 hover:bg-muted/20 transition-colors">
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center text-sm font-medium shrink-0">
                                                    <Layers className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-sm">{zone.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 hidden md:table-cell text-sm">
                                            {zone.area?.name || "—"}
                                        </td>
                                        <td className="p-3">
                                            <Badge variant="secondary" className="gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {zone._count?.cells || 0}
                                            </Badge>
                                        </td>
                                        <td className="p-3 hidden lg:table-cell text-sm">
                                            {zone.leader ? `${zone.leader.firstName} ${zone.leader.lastName}` : "—"}
                                        </td>
                                        <td className="p-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => navigate("/structure/zones/view", { state: { zone } })}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => navigate("/structure/zones/edit", { state: { zone } })}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-500"
                                                        onClick={() => {
                                                            setSelectedZone(zone);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data && data.pagination.total > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-muted/30">
                        <p className="text-sm text-muted-foreground">
                            Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to{" "}
                            {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{" "}
                            {data.pagination.total} zones
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={data.pagination.page === 1}
                                onClick={() => setFilters(prev => ({ ...prev, page: prev.page! - 1 }))}
                            >
                                Previous
                            </Button>
                            <span className="flex items-center px-3 text-sm">
                                Page {data.pagination.page} of {data.pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={data.pagination.page === data.pagination.totalPages}
                                onClick={() => setFilters(prev => ({ ...prev, page: prev.page! + 1 }))}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Zone</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{selectedZone?.name}"? This action cannot be undone.
                            {selectedZone?._count?.cells ? (
                                <p className="mt-2 text-red-500">
                                    Warning: This zone has {selectedZone._count.cells} cell(s) assigned.
                                </p>
                            ) : null}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={selectedZone?._count?.cells ? true : false}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}