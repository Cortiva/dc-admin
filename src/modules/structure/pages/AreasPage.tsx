import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus, Search, Download, MoreVertical, Eye, Edit, Trash2, Layers } from "lucide-react";
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
import { useGetAreasQuery, useDeleteAreaMutation, useExportStructureMutation } from "../structureApiSlice";
import { handleApiError } from "../../../utils/functions";
import type { AreaResponse } from "../../../types/structure.types";

export default function AreasPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc" as const,
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState<AreaResponse | null>(null);

    const { data, isLoading, refetch } = useGetAreasQuery({
        search: search || undefined,
        ...filters,
    });

    const [deleteArea] = useDeleteAreaMutation();
    const [exportStructure] = useExportStructureMutation();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };

    const handleDelete = async () => {
        if (!selectedArea) return;
        try {
            await deleteArea(selectedArea.id).unwrap();
            toast.success("Area deleted successfully");
            setDeleteDialogOpen(false);
            setSelectedArea(null);
            refetch();
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleExport = async () => {
        try {
            const blob = await exportStructure({
                type: "areas",
                filters: { search: search || undefined },
            }).unwrap();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `areas_${new Date().toISOString().split("T")[0]}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
            toast.success("Areas exported successfully");
        } catch (error) {
            handleApiError(error);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <PageHeader
                icon={<MapPin />}
                title="Areas"
                subtitle="Manage church areas and zones"
                action={
                    <Button onClick={() => navigate("/structure/areas/create")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Area
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
                                placeholder="Search areas..."
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

            {/* Areas Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Area</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Description</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Zones</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">Leader</th>
                                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="p-3"><Skeleton className="h-6 w-32" /></td>
                                        <td className="p-3 hidden md:table-cell"><Skeleton className="h-4 w-48" /></td>
                                        <td className="p-3"><Skeleton className="h-6 w-12" /></td>
                                        <td className="p-3 hidden lg:table-cell"><Skeleton className="h-4 w-24" /></td>
                                        <td className="p-3 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : data?.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-muted-foreground">
                                        <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-lg font-medium">No areas found</p>
                                        <p className="text-sm">Try adjusting your search</p>
                                        <Button className="mt-4" onClick={() => navigate("/structure/areas/create")}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add area
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                data?.data.map((area) => (
                                    <tr key={area.id} className="border-t border-muted/30 hover:bg-muted/20 transition-colors">
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                                                    <Layers className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-sm">{area.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 hidden md:table-cell text-sm text-muted-foreground truncate max-w-48">
                                            {area.description || "—"}
                                        </td>
                                        <td className="p-3">
                                            <Badge variant="secondary" className="gap-1">
                                                <Layers className="w-3 h-3" />
                                                {area._count?.zones || 0}
                                            </Badge>
                                        </td>
                                        <td className="p-3 hidden lg:table-cell text-sm">
                                            {area.leader ? `${area.leader.firstName} ${area.leader.lastName}` : "—"}
                                        </td>
                                        <td className="p-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => navigate("/structure/areas/view", { state: { area } })}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => navigate("/structure/areas/edit", { state: { area } })}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-500"
                                                        onClick={() => {
                                                            setSelectedArea(area);
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
                            {data.pagination.total} areas
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
                        <DialogTitle>Delete Area</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{selectedArea?.name}"? This action cannot be undone.
                            {selectedArea?._count?.zones ? (
                                <p className="mt-2 text-red-500">
                                    Warning: This area has {selectedArea._count.zones} zone(s) assigned.
                                </p>
                            ) : null}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={selectedArea?._count?.zones ? true : false}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}