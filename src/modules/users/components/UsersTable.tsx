import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
    MoreVertical,
    Eye,
    UserCheck,
    UserX,
    Trash2,
    Search,
    Filter,
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Skeleton } from "../../../components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import type { User, UserFilterParams } from "../types/user.type";
import AppPagination from "../../../components/AppPagination";
import { UpdateUserStatus } from "./UpdateUserStatus";
import { DeleteUserModal } from "./DeleteUser";

interface UsersTableProps {
    users: User[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    isFetching: boolean;
    filters: UserFilterParams;
    onSearch: (search: string) => void;
    onRoleFilter: (role: string) => void;
    onStatusFilter: (status: string) => void;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    onViewUser: (user: User) => void;
    onSuccess: () => void;
}

export default function UsersTable({
    users,
    pagination,
    isFetching,
    filters,
    onSearch,
    onRoleFilter,
    onStatusFilter,
    onPageChange,
    onLimitChange,
    onViewUser,
    onSuccess,
}: UsersTableProps) {
    const [searchInput, setSearchInput] = useState(filters.search || "");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            onSearch(searchInput);
        }, 500); // 400–600ms is ideal

        return () => clearTimeout(delayDebounce);
    }, [searchInput]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100/40 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</Badge>;
            case 'suspended':
                return <Badge className="bg-yellow-100/bg-green-100/40 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Suspended</Badge>;
            case 'deleted':
                return <Badge className="bg-red-100/40 text-red-700 dark:bg-red-900/30 dark:text-red-400">Deleted</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge variant="default" className="bg-purple-100/40 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Admin</Badge>;
            case 'artisan':
                return <Badge variant="default" className="bg-blue-100/40 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Artisan</Badge>;
            case 'customer':
                return <Badge variant="secondary">Customer</Badge>;
            default:
                return <Badge variant="secondary">{role}</Badge>;
        }
    };

    if (isFetching && users.length === 0) {
        return <UsersTableSkeleton />;
    }

    return (
        <>
            <Card className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                {/* Filters Bar */}
                <div className="p-4 border-b border-border">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <form className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    disabled={isFetching}
                                    className="pl-9"
                                />
                            </div>
                        </form>

                        <div className="flex items-center gap-2">
                            <Select value={filters.role || "all"} onValueChange={(val) => onRoleFilter(val === "all" ? "" : val)}>
                                <SelectTrigger className="w-32.5">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="customer">Customer</SelectItem>
                                    <SelectItem value="artisan">Artisan</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filters.status || "all"} onValueChange={(val) => onStatusFilter(val === "all" ? "" : val)}>
                                <SelectTrigger className="w-32.5">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                    <SelectItem value="deleted">Deleted</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Jobs</TableHead>
                                <TableHead>Reviews</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="w-17.5">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewUser(user)}>
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={user.avatar} />
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {user.firstName?.[0]}{user.lastName?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                                                    <p className="text-xs text-muted-foreground">{user.gender}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm">{user.email}</p>
                                                <p className="text-xs text-muted-foreground">{user.phone}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                                        <TableCell>{user._count?.jobsCreated.toLocaleString()}</TableCell>
                                        <TableCell>{user._count?.reviewsGiven.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                                            {user.lastLoginAt && (
                                                <p className="text-xs text-muted-foreground">Last login: {new Date(user.lastLoginAt).toLocaleDateString()}</p>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-background">
                                                    <DropdownMenuItem onClick={() => onViewUser(user)}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedUser(user);
                                                        setStatusModalOpen(true);
                                                    }}>
                                                        {user.status === 'suspended' ? (
                                                            <>
                                                                <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                                                                Activate Account
                                                            </>
                                                        ) : user.status === 'active' ? (
                                                            <>
                                                                
                                                                <UserX className="w-4 h-4 mr-2 text-yellow-600" />
                                                                Suspend Account
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserX className="w-4 h-4 mr-2 text-yellow-600" />
                                                                Suspend Account
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setDeleteModalOpen(true);
                                                        }}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete Account
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 0 && (
                    <AppPagination
                        currentPage={pagination.page}
                        totalItems={pagination.total}
                        pageSize={pagination.limit}
                        onPageChange={(p) => onPageChange(p)}
                        onLimitChange={(l) => onLimitChange(l)}
                    />
                )}
            </Card>

            <UpdateUserStatus
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                onSuccess={onSuccess}
                userName={`${selectedUser?.firstName} ${selectedUser?.lastName}`}
                userId={selectedUser?.id}
                currentStatus={selectedUser?.status}
            />

            <DeleteUserModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onSuccess={onSuccess}
                userName={selectedUser?.firstName + " " + selectedUser?.lastName}
                userId={selectedUser?.id}
            />
        </>
    );
}

function UsersTableSkeleton() {
    return (
        <Card className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
                <Skeleton className="h-10 w-full max-w-md" />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/50">
                        <tr>
                            {Array.from({ length: 7 }).map((_, i) => (
                                <th key={i} className="px-4 py-3">
                                    <Skeleton className="h-4 w-24" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-b border-border">
                                {Array.from({ length: 7 }).map((_, j) => (
                                    <td key={j} className="px-4 py-3">
                                        <Skeleton className="h-6 w-full" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}