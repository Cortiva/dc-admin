"use client";

import {
    Search,
    Filter,
    RefreshCw,
    XCircle,
} from "lucide-react";
import { useState } from "react";
import type { BlacklistedUser, BlacklistFilterParams } from "../types/blacklist.types";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import AppPagination from "../../../components/AppPagination";
import { RemoveFromBlacklistModal } from "./RemoveFromBlacklistModal";

interface BlacklistedUsersTableProps {
    blacklistedUsers: BlacklistedUser[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    isFetching: boolean;
    filters: BlacklistFilterParams;
    searchInput: string;
    onSearchInputChange: (value: string) => void;
    onSearch: () => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    onActiveFilterChange: (value: string) => void;
    onTypeFilterChange: (value: string) => void;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    onRefetch: () => void;
    onRemoveSuccess: () => void;
}

export default function BlacklistedUsersTable({
    blacklistedUsers,
    pagination,
    isFetching,
    filters,
    searchInput,
    onSearchInputChange,
    onSearch,
    onKeyPress,
    onActiveFilterChange,
    onTypeFilterChange,
    onPageChange,
    onLimitChange,
    onRefetch,
    onRemoveSuccess,
}: BlacklistedUsersTableProps) {
    const [selectedBlacklist, setSelectedBlacklist] = useState<BlacklistedUser | null>(null);
    const [removeModalOpen, setRemoveModalOpen] = useState(false);

    const getExpiryStatus = (expiresAt: string | null, isPermanent: boolean) => {
        if (isPermanent) return "Never expires";
        if (!expiresAt) return "No expiry set";
        
        const expiryDate = new Date(expiresAt);
        const now = new Date();
        
        if (expiryDate < now) return "Expired";
        
        return `Expires ${formatDistanceToNow(expiryDate, { addSuffix: true })}`;
    };

    const getBanTypeBadge = (isPermanent: boolean, expiresAt: string | null) => {
        if (isPermanent) {
            return <Badge className="bg-red-100 text-red-700">Permanent</Badge>;
        }
        if (expiresAt) {
            const isExpired = new Date(expiresAt) < new Date();
            return (
                <Badge className={isExpired ? "bg-gray-100 text-gray-700" : "bg-yellow-100 text-yellow-700"}>
                    {isExpired ? "Expired" : "Temporary"}
                </Badge>
            );
        }
        return <Badge variant="secondary">Temporary</Badge>;
    };

    const handleRemoveClick = (blacklist: BlacklistedUser) => {
        setSelectedBlacklist(blacklist);
        setRemoveModalOpen(true);
    };

    const handleRemoveSuccess = () => {
        setRemoveModalOpen(false);
        setSelectedBlacklist(null);
        onRemoveSuccess();
    };

    return (
        <>
            <Card className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                {/* Filters Bar */}
                <div className="p-4 border-b border-border">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Search by user name, email, or phone..."
                                    value={searchInput}
                                    onChange={(e) => onSearchInputChange(e.target.value)}
                                    onKeyPress={onKeyPress}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={onSearch}>
                                Search
                            </Button>
                            
                            <Select 
                                value={filters.isActive === true ? "active" : filters.isActive === false ? "removed" : "all"} 
                                onValueChange={onActiveFilterChange}
                            >
                                <SelectTrigger className="w-32">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Currently Blacklisted</SelectItem>
                                    <SelectItem value="removed">Removed</SelectItem>
                                    <SelectItem value="all">All</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select 
                                value={filters.isPermanent === true ? "permanent" : filters.isPermanent === false ? "temporary" : "all"} 
                                onValueChange={onTypeFilterChange}
                            >
                                <SelectTrigger className="w-32">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="permanent">Permanent</SelectItem>
                                    <SelectItem value="temporary">Temporary</SelectItem>
                                    <SelectItem value="all">All Types</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline" size="icon" onClick={onRefetch} disabled={isFetching}>
                                <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
                            </Button>
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
                                <TableHead>Reason</TableHead>
                                <TableHead>Ban Type</TableHead>
                                <TableHead>Blacklisted By</TableHead>
                                <TableHead>Blacklisted At</TableHead>
                                <TableHead>Expiry</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-12">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blacklistedUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                                        No blacklisted users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                blacklistedUsers.map((blacklist: BlacklistedUser) => (
                                    <TableRow key={blacklist.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={blacklist.user.avatar || undefined} />
                                                    <AvatarFallback className="bg-primary/10 text-primary">
                                                        {blacklist.user.firstName?.[0]}{blacklist.user.lastName?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">
                                                        {blacklist.user.firstName} {blacklist.user.lastName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground capitalize">
                                                        {blacklist.user.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm">{blacklist.user.email}</p>
                                                <p className="text-xs text-muted-foreground">{blacklist.user.phone}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs">
                                                <p className="text-sm truncate" title={blacklist.reason}>
                                                    {blacklist.reason}
                                                </p>
                                                {blacklist.notes && (
                                                    <p className="text-xs text-muted-foreground truncate" title={blacklist.notes}>
                                                        Note: {blacklist.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getBanTypeBadge(blacklist.isPermanent, blacklist.expiresAt)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {blacklist.blacklistedBy?.replace("_", " ") || "admin"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm">
                                                {format(new Date(blacklist.blacklistedAt), "MMM d, yyyy")}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(blacklist.blacklistedAt), { addSuffix: true })}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <p className="text-sm">
                                                    {getExpiryStatus(blacklist.expiresAt, blacklist.isPermanent)}
                                                </p>
                                                {blacklist.expiresAt && !blacklist.isPermanent && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(new Date(blacklist.expiresAt), "MMM d, yyyy")}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {blacklist.removedAt ? (
                                                <div>
                                                    <Badge className="bg-green-100 text-green-700">Removed</Badge>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        by {blacklist.removedBy}
                                                    </p>
                                                </div>
                                            ) : blacklist.expiresAt && new Date(blacklist.expiresAt) < new Date() ? (
                                                <Badge className="bg-gray-100 text-gray-700">Expired</Badge>
                                            ) : (
                                                <Badge className="bg-red-100 text-red-700">Active</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveClick(blacklist)}
                                                disabled={!!blacklist.removedAt}
                                                title="Remove from blacklist"
                                            >
                                                <XCircle className="w-4 h-4 text-green-600" />
                                            </Button>
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
                        onPageChange={onPageChange}
                        onLimitChange={onLimitChange}
                    />
                )}
            </Card>

            {/* Remove from Blacklist Modal */}
            <RemoveFromBlacklistModal
                isOpen={removeModalOpen}
                onClose={() => setRemoveModalOpen(false)}
                onSuccess={handleRemoveSuccess}
                blacklistEntry={selectedBlacklist}
            />
        </>
    );
}