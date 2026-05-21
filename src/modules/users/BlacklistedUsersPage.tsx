"use client";

import { useState, useMemo } from "react";
import {
    AlertTriangle,
    Calendar,
    Clock,
    Plus,
    Shield,
    UserCheck,
    UserRoundX,
} from "lucide-react";
import type { BlacklistFilterParams } from "./types/blacklist.types";
import { useFetchBlacklistedUsersQuery, useFetchUsersQuery } from "./userApiSlice";
import AppLayout from "../../components/layouts/AppLayout";
import { Skeleton } from "../../components/ui/skeleton";
import UsersTableSkeleton from "./components/UsersTableSkeleton";
import PageHeader from "../../components/PageHeader";
import { Button } from "../../components/ui/button";
import StatCard from "../../components/StatCard";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import BlacklistedUsersTable from "./components/BlacklistedUsersTable";
import { BlacklistUserModal } from "./components/BlacklistUserModal";
import type { UserFilterParams } from "./types/user.type";

export default function BlacklistedUsersPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filters, setFilters] = useState<BlacklistFilterParams>({
        page: 1,
        limit: 10,
        sortBy: "blacklistedAt",
        sortOrder: "desc",
        isActive: true,
    });
    const [searchInput, setSearchInput] = useState("");

    const { data: response, isFetching, refetch } = useFetchBlacklistedUsersQuery(filters);

    const blacklistedUsers = useMemo(() => {
        return response?.blacklistedUsers || [];
    }, [response?.blacklistedUsers]);

    const summary = useMemo(() => {
        return response?.summary || {
            totalBlacklisted: 0,
            activeBlacklisted: 0,
            removedBlacklisted: 0,
            permanentBans: 0,
            temporaryBans: 0,
            expiringSoon: 0,
            expiredBans: 0,
            blacklistedByAdmin: 0,
            blacklistedBySuperAdmin: 0,
            averageBanDuration: 0,
            mostCommonReasons: [],
        };
    }, [response?.summary]);

    const pagination = useMemo(() => {
        return response?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 };
    }, [response?.pagination]);

    const [usersFilters] = useState<UserFilterParams>({
        page: 1,
        limit: 1000000,
        sortBy: "createdAt",
        sortOrder: "desc",
    });
    
    const { data: resp } = useFetchUsersQuery(usersFilters);
    
    const users = useMemo(() => {
        return resp?.data?.users || [];
    }, [resp?.data?.users]);

    const handleSearch = () => {
        setFilters(prev => ({ ...prev, search: searchInput || undefined, page: 1 }));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleActiveFilter = (value: string) => {
        setFilters(prev => ({
            ...prev,
            isActive: value === "active" ? true : value === "removed" ? false : undefined,
            page: 1,
        }));
    };

    const handleTypeFilter = (value: string) => {
        setFilters(prev => ({
            ...prev,
            isPermanent: value === "permanent" ? true : value === "temporary" ? false : undefined,
            page: 1,
        }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleLimitChange = (limit: number) => {
        setFilters(prev => ({ ...prev, limit, page: 1 }));
    };

    const handleRemoveSuccess = () => {
        refetch();
    };

    if (isFetching && blacklistedUsers.length === 0) {
        return (
            <AppLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-64" />
                            </div>
                            <Skeleton className="h-4 w-96" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-28 w-full" />
                        ))}
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <UsersTableSkeleton />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <PageHeader
                        icon={<UserRoundX />}
                        title="Blacklisted Users"
                        subtitle="Manage platform blacklisted users and their access"
                    />
                    <div className="flex items-center gap-3">
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            <Plus className="w-4 h-4" />
                            Blacklist User
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard
                        title="Total Blacklisted"
                        value={summary.totalBlacklisted.toLocaleString()}
                        icon={<Shield className="w-5 h-5" />}
                        color="red"
                    />
                    <StatCard
                        title="Active Bans"
                        value={summary.activeBlacklisted.toLocaleString()}
                        icon={<UserCheck className="w-5 h-5" />}
                        color="yellow"
                        trend={{ value: `${summary.permanentBans} permanent, ${summary.temporaryBans} temporary`, positive: false }}
                    />
                    <StatCard
                        title="Expiring Soon"
                        value={summary.expiringSoon.toLocaleString()}
                        icon={<Clock className="w-5 h-5" />}
                        color="red"
                    />
                    <StatCard
                        title="Avg Ban Duration"
                        value={`${summary.averageBanDuration}d`}
                        icon={<Calendar className="w-5 h-5" />}
                        color="blue"
                    />
                </div>

                {/* Most Common Reasons Card */}
                {summary.mostCommonReasons.length > 0 && (
                    <Card className="bg-card rounded-xl shadow-sm border border-border p-4">
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            Most Common Blacklist Reasons
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {summary.mostCommonReasons.map((reason, index) => (
                                <Badge key={index} variant="secondary" className="text-sm">
                                    {reason.reason}: {reason.count}
                                </Badge>
                            ))}
                        </div>
                    </Card>
                )}

                {/* Table Component */}
                <BlacklistedUsersTable
                    blacklistedUsers={blacklistedUsers}
                    pagination={pagination}
                    isFetching={isFetching}
                    filters={filters}
                    searchInput={searchInput}
                    onSearchInputChange={setSearchInput}
                    onSearch={handleSearch}
                    onKeyPress={handleKeyPress}
                    onActiveFilterChange={handleActiveFilter}
                    onTypeFilterChange={handleTypeFilter}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                    onRefetch={refetch}
                    onRemoveSuccess={handleRemoveSuccess}
                />

                {/* Add Blacklist Modal */}
                <BlacklistUserModal
                    users={users}
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={() => {
                        setIsAddModalOpen(false);
                        refetch();
                    }}
                />
            </div>
        </AppLayout>
    );
}