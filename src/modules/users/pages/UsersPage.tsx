"use client";

import { useState, useMemo } from "react";
import {
    Shield,
    RefreshCw,
    UserCheck,
    UserPlus,
    Clock,
    ShieldAlert,
} from "lucide-react";
import { Skeleton } from "../../../components/ui/skeleton";
import UsersStatsSkeleton from "../components/UsersStatsSkeleton";
import UsersTableSkeleton from "../components/UsersTableSkeleton";
import PageHeader from "../../../components/PageHeader";
import { Button } from "../../../components/ui/button";
import StatCard from "../../../components/StatCard";
import UsersTable from "../components/UsersTable";
import { ViewUser } from "../components/ViewUser";
import InviteUser from "../components/InviteUser";
import RejectUserDialog from "../components/RejectUserDialog";
import type { User, UserFilterParams, UserRole, UserStatus } from "../types/user.types";
import { usersData } from "../../../mock/users";

export default function UsersPage() {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [rejectTarget, setRejectTarget] = useState<User | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [filters, setFilters] = useState<UserFilterParams>({
        page: 1,
        limit: 10,
        sortBy: "fullName",
        sortOrder: "asc",
        search: "",
        role: "",
        status: "",
    });

    // Simulate API fetch with delay — swap for useFetchUsersQuery(filters)
    // once the real backend endpoint is wired up.
    const fetchUsers = async () => {
        setIsFetching(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsFetching(false);
    };

    const handleRefetch = () => {
        fetchUsers();
    };

    const filteredUsers = useMemo(() => {
        let result = [...usersData];

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                (user) =>
                    user.fullName.toLowerCase().includes(searchLower) ||
                    user.email.toLowerCase().includes(searchLower),
            );
        }

        if (filters.role) {
            result = result.filter((user) => user.role === filters.role);
        }

        if (filters.status) {
            result = result.filter((user) => user.status === filters.status);
        }

        result.sort((a, b) => {
            const aVal = a[filters.sortBy as keyof User];
            const bVal = b[filters.sortBy as keyof User];
            if (aVal! < bVal!) return filters.sortOrder === "asc" ? -1 : 1;
            if (aVal! > bVal!) return filters.sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [filters]);

    const paginatedUsers = useMemo(() => {
        const start = (filters.page - 1) * filters.limit;
        const end = start + filters.limit;
        return filteredUsers.slice(start, end);
    }, [filteredUsers, filters.page, filters.limit]);

    const pagination = useMemo(
        () => ({
            page: filters.page,
            limit: filters.limit,
            total: filteredUsers.length,
            totalPages: Math.ceil(filteredUsers.length / filters.limit),
        }),
        [filteredUsers.length, filters.page, filters.limit],
    );

    const summary = useMemo(() => {
        const totalUsers = usersData.length;
        const activeUsers = usersData.filter((u) => u.status === "ACTIVE").length;
        const pendingApproval = usersData.filter((u) => u.status === "PENDING_APPROVAL").length;
        const pendingInvite = usersData.filter((u) => u.status === "PENDING_INVITE").length;
        const admins = usersData.filter(
            (u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN",
        ).length;

        return { totalUsers, activeUsers, pendingApproval, pendingInvite, admins };
    }, []);

    const activeRate = summary.totalUsers
        ? Math.round((summary.activeUsers / summary.totalUsers) * 100)
        : 0;

    const handleSearch = (search: string) => {
        setFilters((prev) => ({ ...prev, search, page: 1 }));
    };

    const handleRoleFilter = (role: UserRole | "") => {
        setFilters((prev) => ({ ...prev, role, page: 1 }));
    };

    const handleStatusFilter = (status: UserStatus | "") => {
        setFilters((prev) => ({ ...prev, status, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleLimitChange = (limit: number) => {
        setFilters((prev) => ({ ...prev, limit, page: 1 }));
    };

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    const handleSuccess = () => {
        setIsInviteModalOpen(false);
        setIsDetailModalOpen(false);
        setRejectTarget(null);
        setSelectedUser(null);
        handleRefetch();
    };

    if (isFetching) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8" />
                            <Skeleton className="h-8 w-64" />
                        </div>
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
                <UsersStatsSkeleton />
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <UsersTableSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <PageHeader
                    icon={<Shield />}
                    title="Users & Access"
                    subtitle="Manage admin accounts, invites, and access requests"
                />
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleRefetch} disabled={isFetching}>
                        <RefreshCw className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                    <Button onClick={() => setIsInviteModalOpen(true)}>
                        <UserPlus className="w-4 h-4" />
                        Invite user
                    </Button>
                </div>
            </div>

            {/* Pending-approval callout — only shown when there's something
                to act on, so it doesn't clutter the page when the queue is empty. */}
            {summary.pendingApproval > 0 && (
                <div className="bg-blue-500/10 border-l-4 border-blue-500/40 p-4 rounded-r-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="flex-1">
                            <p className="text-xl sm:text-2xl font-medium text-blue-700">
                                {summary.pendingApproval} {summary.pendingApproval === 1 ? "request" : "requests"} awaiting approval
                            </p>
                            <p className="text-sm text-blue-600 mt-1">
                                Self-registered users are waiting for an admin to review their access.
                            </p>
                        </div>
                        <Button
                            className="self-start sm:self-center"
                            onClick={() => handleStatusFilter("PENDING_APPROVAL")}
                        >
                            Review requests
                        </Button>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    title="Total Users"
                    value={summary.totalUsers.toLocaleString()}
                    icon={<Shield className="w-5 h-5" />}
                    color="blue"
                    trend={{ value: `${summary.admins} admins`, positive: true }}
                />
                <StatCard
                    title="Active"
                    value={summary.activeUsers.toLocaleString()}
                    icon={<UserCheck className="w-5 h-5" />}
                    color="green"
                    trend={{ value: `${activeRate}% of all users`, positive: true }}
                />
                <StatCard
                    title="Awaiting Approval"
                    value={summary.pendingApproval.toLocaleString()}
                    icon={<ShieldAlert className="w-5 h-5" />}
                    color="yellow"
                    trend={{ value: "Self-registered", positive: summary.pendingApproval === 0 }}
                />
                <StatCard
                    title="Invites Pending"
                    value={summary.pendingInvite.toLocaleString()}
                    icon={<Clock className="w-5 h-5" />}
                    color="purple"
                    trend={{ value: "Not yet accepted", positive: summary.pendingInvite === 0 }}
                />
            </div>

            <UsersTable
                users={paginatedUsers}
                pagination={pagination}
                isFetching={isFetching}
                filters={filters}
                onSearch={handleSearch}
                onRoleFilter={handleRoleFilter}
                onStatusFilter={handleStatusFilter}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                onViewUser={handleViewUser}
                onReject={(user) => setRejectTarget(user)}
                onSuccess={handleSuccess}
            />

            <ViewUser
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                onSuccess={handleSuccess}
            />

            <InviteUser
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSuccess={handleSuccess}
            />

            <RejectUserDialog
                user={rejectTarget}
                onClose={() => setRejectTarget(null)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}