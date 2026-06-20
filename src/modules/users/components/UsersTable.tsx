"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Eye,
    ChevronDown,
    MoreVertical,
    Check,
    X,
    Ban,
    RotateCcw,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "../../../components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { UserRoleBadge, UserStatusBadge } from "./UserBadges";
import { handleApiError } from "../../../utils/functions";
import type { User, UserFilterParams, UserRole, UserStatus } from "../types/user.types";
import { useApproveMemberMutation, useReactivateUserMutation, useSuspendUserMutation } from "../usersApiSlice";

interface UsersTableProps {
    users: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    isFetching: boolean;
    filters: UserFilterParams;
    onSearch: (search: string) => void;
    onRoleFilter: (role: UserRole | "") => void;
    onStatusFilter: (status: UserStatus | "") => void;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    onViewUser: (user: User) => void;
    onReject: (user: User) => void;
    onSuccess: () => void;
}

const ROLE_OPTIONS: UserRole[] = ["SUPER_ADMIN", "ADMIN", "USER"];
const STATUS_OPTIONS: UserStatus[] = [
    "ACTIVE",
    "PENDING_INVITE",
    "PENDING_APPROVAL",
    "SUSPENDED",
    "REJECTED",
];

const ROLE_LABELS: Record<UserRole, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    USER: "User",
};

const STATUS_LABELS: Record<UserStatus, string> = {
    ACTIVE: "Active",
    PENDING_INVITE: "Invite sent",
    PENDING_APPROVAL: "Awaiting approval",
    SUSPENDED: "Suspended",
    REJECTED: "Rejected",
};

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
    onReject,
    onSuccess,
}: UsersTableProps) {
    const [searchInput, setSearchInput] = useState(filters.search || "");

    const [approveMember] = useApproveMemberMutation();
    const [suspendUser] = useSuspendUserMutation();
    const [reactivateUser] = useReactivateUserMutation();

    const handleSearch = () => onSearch(searchInput);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase();

    const handleApprove = async (user: User) => {
        try {
            await approveMember(user.id).unwrap();
            toast.success(`${user.firstName} has been approved`);
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleSuspend = async (user: User) => {
        try {
            await suspendUser(user.id).unwrap();
            toast.success(`${user.firstName} has been suspended`);
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleReactivate = async (user: User) => {
        try {
            await reactivateUser(user.id).unwrap();
            toast.success(`${user.firstName} has been reactivated`);
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters Bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3 flex-1">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search by name or email..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full sm:w-72"
                        />
                        <Button onClick={handleSearch} size="sm">
                            <Search className="w-4 h-4" />
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                Role: {filters.role ? ROLE_LABELS[filters.role] : "All"}{" "}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => onRoleFilter("")}>
                                All roles
                            </DropdownMenuItem>
                            {ROLE_OPTIONS.map((role) => (
                                <DropdownMenuItem key={role} onClick={() => onRoleFilter(role)}>
                                    {ROLE_LABELS[role]}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                Status: {filters.status ? STATUS_LABELS[filters.status] : "All"}{" "}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => onStatusFilter("")}>
                                All statuses
                            </DropdownMenuItem>
                            {STATUS_OPTIONS.map((status) => (
                                <DropdownMenuItem key={status} onClick={() => onStatusFilter(status)}>
                                    {STATUS_LABELS[status]}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                Limit: {pagination.limit} <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {[10, 25, 50, 100].map((limit) => (
                                <DropdownMenuItem key={limit} onClick={() => onLimitChange(limit)}>
                                    {limit} per page
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="text-sm text-muted-foreground whitespace-nowrap">
                    Showing {users.length} of {pagination.total} users
                </div>
            </div>

            {/* Table - horizontally scrollable on narrow screens since this
                has fewer columns than MembersTable but still benefits from
                not wrapping awkwardly on mobile */}
            <div className="border rounded-lg overflow-x-auto bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isFetching ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12">
                                    <div className="space-y-1">
                                        <p className="font-medium">No users found</p>
                                        <p className="text-sm text-muted-foreground">
                                            Try a different search or filter, or invite someone new.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user, index) => (
                                <TableRow key={user.id} className="hover:bg-muted/30">
                                    <TableCell>
                                        {(pagination.page - 1) * pagination.limit + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 shrink-0">
                                                <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{user.fullName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    ID: {user.id}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-sm truncate max-w-50">{user.email}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {user.phoneNumber ?? "No phone on file"}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <UserRoleBadge role={user.role} />
                                    </TableCell>
                                    <TableCell>
                                        <UserStatusBadge status={user.status} />
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onViewUser(user)}
                                                aria-label="View user"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" aria-label="More actions">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => onViewUser(user)}>
                                                        <Eye className="w-4 h-4 mr-2" /> View profile
                                                    </DropdownMenuItem>
                                                    {user.status === "PENDING_APPROVAL" && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleApprove(user)}>
                                                                <Check className="w-4 h-4 mr-2" /> Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => onReject(user)}
                                                            >
                                                                <X className="w-4 h-4 mr-2" /> Reject
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {user.status === "ACTIVE" && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => handleSuspend(user)}
                                                            >
                                                                <Ban className="w-4 h-4 mr-2" /> Suspend
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    {user.status === "SUSPENDED" && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleReactivate(user)}>
                                                                <RotateCcw className="w-4 h-4 mr-2" /> Reactivate
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}