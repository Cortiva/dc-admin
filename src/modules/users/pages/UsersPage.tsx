"use client";

import { useState } from "react";
import { Shield, RefreshCw, UserPlus } from "lucide-react";
import UsersTableSkeleton from "../components/UsersTableSkeleton";
import PageHeader from "../../../components/PageHeader";
import { Button } from "../../../components/ui/button";
import UsersTable from "../components/UsersTable";
import { ViewUser } from "../components/ViewUser";
import InviteUser from "../components/InviteUser";
import RejectUserDialog from "../components/RejectUserDialog";
import { handleApiError } from "../../../utils/functions";
import type { User, UserFilterParams, UserRole, UserStatus } from "../types/user.types";
import { useFetchUsersQuery } from "../usersApiSlice";

export default function UsersPage() {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [rejectTarget, setRejectTarget] = useState<User | null>(null);
    const [filters, setFilters] = useState<UserFilterParams>({
        page: 1,
        limit: 10,
        sortBy: "fullName",
        sortOrder: "asc",
        search: "",
        role: "",
        status: "",
    });

    const {
        data: response,
        isFetching,
        isError,
        error,
        refetch,
    } = useFetchUsersQuery(filters);

    if (isError) handleApiError(error);

    const users = response?.data.content ?? [];
    const pagination = {
        page: filters.page,
        limit: filters.limit,
        total: response?.data.totalElements ?? 0,
        totalPages: response?.data.totalPages ?? 0,
    };

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
        refetch();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <PageHeader
                    icon={<Shield />}
                    title="Users & Access"
                    subtitle="Manage admin accounts, invites, and access requests"
                />
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                        <RefreshCw className={`w-5 h-5 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                    {/* Previously a count-driven callout banner surfaced this
                        action when there were pending requests, backed by a
                        usersData.filter(...).length aggregate. With no real
                        summary endpoint, there's no reliable count to base
                        that banner on — so this is now a plain always-visible
                        shortcut into the same filtered view instead. */}
                    <Button
                        variant="outline"
                        onClick={() => handleStatusFilter("PENDING_APPROVAL")}
                    >
                        Review pending requests
                    </Button>
                    <Button onClick={() => setIsInviteModalOpen(true)}>
                        <UserPlus className="w-4 h-4" />
                        Invite user
                    </Button>
                </div>
            </div>

            {isFetching ? (
                <UsersTableSkeleton />
            ) : (
                <UsersTable
                    users={users}
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
            )}

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