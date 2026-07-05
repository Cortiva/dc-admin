import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Search, Download, MoreVertical, Eye, Edit, Trash2, UserCheck, Shield } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { Skeleton } from "../../../components/ui/skeleton";
import { handleApiError, getInitials } from "../../../utils/functions";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import type { UserResponse } from "../../../types/user.types";
import { useDeleteUserMutation, useExportUsersMutation, useGetUsersQuery } from "../usersApiSlice";
import type { UserRole, UserStatus } from "../types/user.types";

export default function UserListPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc" as const,
        role: undefined as UserRole | undefined,
        status: undefined as UserStatus | undefined,
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

    const { data, isLoading, refetch } = useGetUsersQuery({
        search: search || undefined,
        ...filters,
    });

    const [deleteUser] = useDeleteUserMutation();
    const [exportUsers] = useExportUsersMutation();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        try {
            await deleteUser(selectedUser.id).unwrap();
            toast.success("User deleted successfully");
            setDeleteDialogOpen(false);
            setSelectedUser(null);
            refetch();
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleExport = async () => {
        try {
            const blob = await exportUsers({ filters: { search: search || undefined, ...filters } }).unwrap();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `users_${new Date().toISOString().split("T")[0]}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
            toast.success("Users exported successfully");
        } catch (error) {
            handleApiError(error);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
            ACTIVE: { variant: "default", label: "Active" },
            PENDING_VERIFICATION: { variant: "secondary", label: "Pending Verification" },
            PENDING_APPROVAL: { variant: "secondary", label: "Pending Approval" },
            SUSPENDED: { variant: "destructive", label: "Suspended" },
            DEACTIVATED: { variant: "outline", label: "Deactivated" },
            REJECTED: { variant: "destructive", label: "Rejected" },
        };
        return variants[status] || { variant: "outline", label: status };
    };

    const getRoleBadge = (role: string) => {
        const variants: Record<string, string> = {
            SUPER_ADMIN: "bg-purple-500",
            ADMIN: "bg-blue-500",
            USER: "bg-green-500",
        };
        return variants[role] || "bg-gray-500";
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <PageHeader
                icon={<Users />}
                title="Users"
                subtitle="Manage user accounts and permissions"
                action={
                    <Button onClick={() => navigate("/users/create")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
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
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">Search</Button>
                    </form>

                    <div className="flex gap-2 flex-wrap">
                        <Select
                            value={filters.role || "all"}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, role: value === "all" ? undefined : value as UserRole }))}
                        >
                            <SelectTrigger className="w-35">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="USER">User</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.status || "all"}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === "all" ? undefined : value as UserStatus }))}
                        >
                            <SelectTrigger className="w-35">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="PENDING_VERIFICATION">Pending Verification</SelectItem>
                                <SelectItem value="PENDING_APPROVAL">Pending Approval</SelectItem>
                                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" size="icon" onClick={handleExport}>
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Users Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">User</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">Phone</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Role</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">Member</th>
                                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="p-3"><Skeleton className="h-8 w-32" /></td>
                                        <td className="p-3 hidden sm:table-cell"><Skeleton className="h-4 w-24" /></td>
                                        <td className="p-3 hidden md:table-cell"><Skeleton className="h-6 w-20" /></td>
                                        <td className="p-3"><Skeleton className="h-6 w-20" /></td>
                                        <td className="p-3 hidden lg:table-cell"><Skeleton className="h-4 w-24" /></td>
                                        <td className="p-3 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : data?.users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-lg font-medium">No users found</p>
                                        <p className="text-sm">Try adjusting your search or filters</p>
                                        <Button className="mt-4" onClick={() => navigate("/users/create")}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Create your first user
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                data?.users.map((user: UserResponse) => {
                                    const status = getStatusBadge(user.status);
                                    const roleColor = getRoleBadge(user.role);
                                    return (
                                        <tr key={user.id} className="border-t border-muted/30 hover:bg-muted/20 transition-colors">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={user.profileImageUrl || ""} />
                                                        <AvatarFallback className="text-xs">
                                                            {getInitials(user.firstName, user.lastName)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                                                        <p className="text-xs text-muted-foreground sm:hidden">{user.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 hidden sm:table-cell text-sm">{user.phone}</td>
                                            <td className="p-3 hidden md:table-cell">
                                                <Badge className={roleColor}>{user.role}</Badge>
                                            </td>
                                            <td className="p-3">
                                                <Badge variant={status.variant}>{status.label}</Badge>
                                            </td>
                                            <td className="p-3 hidden lg:table-cell text-sm">
                                                {user.isFullMember ? (
                                                    <Badge variant="default" className="bg-green-500">Full Member</Badge>
                                                ) : (
                                                    <Badge variant="outline">Visitor</Badge>
                                                )}
                                            </td>
                                            <td className="p-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => navigate("/users/view", { state: { user } })}>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => navigate("/users/edit", { state: { user } })}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        {user.status === "PENDING_APPROVAL" && (
                                                            <DropdownMenuItem onClick={() => navigate("/users/approve", { state: { user } })}>
                                                                <UserCheck className="w-4 h-4 mr-2" />
                                                                Approve
                                                            </DropdownMenuItem>
                                                        )}
                                                        {user.status === "ACTIVE" && (
                                                            <DropdownMenuItem onClick={() => navigate("/users/suspend", { state: { user } })}>
                                                                <Shield className="w-4 h-4 mr-2" />
                                                                Suspend
                                                            </DropdownMenuItem>
                                                        )}
                                                        {(user.status === "SUSPENDED") && (
                                                            <DropdownMenuItem onClick={() => navigate("/users/activate", { state: { user } })}>
                                                                <UserCheck className="w-4 h-4 mr-2" />
                                                                Activate
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem
                                                            className="text-red-500"
                                                            onClick={() => {
                                                                setSelectedUser(user);
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
                                    );
                                })
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
                            {data.pagination.total} users
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
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{selectedUser?.firstName} {selectedUser?.lastName}"? This action cannot be undone.
                            <p className="mt-2 text-sm text-muted-foreground">
                                Note: This only deletes the user account, not the member record.
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}