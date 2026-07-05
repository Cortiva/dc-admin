import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Building2, Plus, Search, Download, MoreVertical, Eye, Edit, Trash2, Users, 
    UserCog, Layers, Circle, ChevronDown, ChevronRight
} from "lucide-react";
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
import { useGetDepartmentsQuery, useDeleteDepartmentMutation, useExportDepartmentsMutation } from "../departmentApiSlice";
import { handleApiError } from "../../../utils/functions";
import type { DepartmentResponse } from "../../../types/department.types";

export default function DepartmentListPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        sortBy: "name",
        sortOrder: "asc" as const,
        isActive: true as boolean | undefined,
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentResponse | null>(null);
    const [expandedDepartments, setExpandedDepartments] = useState<Set<string>>(new Set());

    const { data, isLoading, refetch } = useGetDepartmentsQuery({
        search: search || undefined,
        ...filters,
    });

    const [deleteDepartment] = useDeleteDepartmentMutation();
    const [exportDepartments] = useExportDepartmentsMutation();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };

    const handleDelete = async () => {
        if (!selectedDepartment) return;
        try {
            await deleteDepartment(selectedDepartment.id).unwrap();
            toast.success("Department deleted successfully");
            setDeleteDialogOpen(false);
            setSelectedDepartment(null);
            refetch();
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleExport = async () => {
        try {
            const blob = await exportDepartments({ filters: { search: search || undefined } }).unwrap();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `departments_${new Date().toISOString().split("T")[0]}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
            toast.success("Departments exported successfully");
        } catch (error) {
            handleApiError(error);
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedDepartments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const getStatusColor = (isActive: boolean) => {
        return isActive ? "bg-green-500" : "bg-gray-400";
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <PageHeader
                icon={<Building2 />}
                title="Departments"
                subtitle="Manage church departments and member assignments"
                action={
                    <Button onClick={() => navigate("/departments/create")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Department
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
                                placeholder="Search departments..."
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

            {/* Departments Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground w-10"></th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Department</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Leader</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">Parent</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Members</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">Status</th>
                                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="p-3"><Skeleton className="h-4 w-4" /></td>
                                        <td className="p-3"><Skeleton className="h-6 w-32" /></td>
                                        <td className="p-3 hidden md:table-cell"><Skeleton className="h-4 w-24" /></td>
                                        <td className="p-3 hidden lg:table-cell"><Skeleton className="h-4 w-24" /></td>
                                        <td className="p-3"><Skeleton className="h-6 w-12" /></td>
                                        <td className="p-3 hidden lg:table-cell"><Skeleton className="h-6 w-16" /></td>
                                        <td className="p-3 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : data?.departments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                                        <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-lg font-medium">No departments found</p>
                                        <p className="text-sm">Try adjusting your search</p>
                                        <Button className="mt-4" onClick={() => navigate("/departments/create")}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Department
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                data?.departments.map((dept) => (
                                    <tr key={dept.id} className="border-t border-muted/30 hover:bg-muted/20 transition-colors">
                                        <td className="p-3">
                                            {dept.subDepartments && dept.subDepartments.length > 0 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => toggleExpand(dept.id)}
                                                >
                                                    {expandedDepartments.has(dept.id) ? (
                                                        <ChevronDown className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div 
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-medium shrink-0"
                                                    style={{ 
                                                        backgroundColor: dept.color || "#6C5CE7" 
                                                    }}
                                                >
                                                    {dept.icon ? (
                                                        <span className="text-lg">{dept.icon}</span>
                                                    ) : (
                                                        <Building2 className="w-4 h-4" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-sm">{dept.name}</span>
                                                    {dept.description && (
                                                        <p className="text-xs text-muted-foreground truncate max-w-48">
                                                            {dept.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 hidden md:table-cell">
                                            {dept.leader ? (
                                                <div className="flex items-center gap-2">
                                                    <UserCog className="w-3 h-3 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {dept.leader.firstName} {dept.leader.lastName}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">—</span>
                                            )}
                                        </td>
                                        <td className="p-3 hidden lg:table-cell">
                                            {dept.parentDepartment ? (
                                                <span className="text-sm">
                                                    {dept.parentDepartment.name}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">Root</span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <Badge variant="secondary" className="gap-1">
                                                <Users className="w-3 h-3" />
                                                {dept.memberCount}
                                            </Badge>
                                            {dept.subDepartmentCount && dept.subDepartmentCount > 0 && (
                                                <Badge variant="outline" className="gap-1 ml-1 text-xs">
                                                    <Layers className="w-3 h-3" />
                                                    {dept.subDepartmentCount}
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="p-3 hidden lg:table-cell">
                                            <Badge variant="outline" className="gap-1">
                                                <Circle className={`w-2 h-2 rounded-full ${getStatusColor(dept.isActive)}`} />
                                                {dept.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => navigate("/departments/view", { state: { department: dept } })}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => navigate("/departments/edit", { state: { department: dept } })}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-500"
                                                        onClick={() => {
                                                            setSelectedDepartment(dept);
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
                            {data.pagination.total} departments
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
                        <DialogTitle>Delete Department</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{selectedDepartment?.name}"? This action cannot be undone.
                            {selectedDepartment?.memberCount ? (
                                <p className="mt-2 text-red-500">
                                    Warning: This department has {selectedDepartment.memberCount} member(s) assigned.
                                </p>
                            ) : null}
                            {selectedDepartment?.subDepartments && selectedDepartment.subDepartments.length > 0 ? (
                                <p className="mt-2 text-red-500">
                                    Warning: This department has {selectedDepartment.subDepartments.length} sub-department(s).
                                </p>
                            ) : null}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={selectedDepartment?.memberCount ? true : false}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}