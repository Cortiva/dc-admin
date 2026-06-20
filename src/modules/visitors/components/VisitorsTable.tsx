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
    MapPin,
    Phone,
    Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import type { Visitor, VisitorFilterParams, VisitorStatus } from "../types/visitor.types";
import { VisitorStatusBadge } from "./VisitorStatusBadge";

interface VisitorsTableProps {
    visitors: Visitor[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
    isFetching: boolean;
    filters: VisitorFilterParams;
    onSearch: (search: string) => void;
    onStatusFilter: (status: VisitorStatus | "") => void;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    onViewVisitor: (visitor: Visitor) => void;
}

const STATUS_OPTIONS: VisitorStatus[] = ["FIRST_TIMER", "SECOND_TIMER", "RETURNING"];
const STATUS_LABELS: Record<VisitorStatus, string> = {
    FIRST_TIMER: "First Timer",
    SECOND_TIMER: "Second Timer",
    RETURNING: "Returning",
};

export default function VisitorsTable({
    visitors,
    pagination,
    isFetching,
    filters,
    onSearch,
    onStatusFilter,
    onPageChange,
    onLimitChange,
    onViewVisitor,
}: VisitorsTableProps) {
    const [searchInput, setSearchInput] = useState(filters.search || "");

    const handleSearch = () => onSearch(searchInput);
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    const getInitials = (first: string, last: string) =>
        `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3 flex-1">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search by name, phone, or email..."
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
                    Showing {visitors.length} of {pagination.total} visitors
                </div>
            </div>

            <div className="border rounded-lg overflow-x-auto bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Visitor</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Cell</TableHead>
                            <TableHead>Last visit</TableHead>
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
                        ) : visitors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12">
                                    <div className="space-y-1">
                                        <p className="font-medium">No visitors found</p>
                                        <p className="text-sm text-muted-foreground">
                                            Try a different search or filter, or add a new visitor.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            visitors.map((visitor, index) => (
                                <TableRow key={visitor.id} className="hover:bg-muted/30">
                                    <TableCell>
                                        {(pagination.page - 1) * pagination.limit + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 shrink-0">
                                                <AvatarFallback>
                                                    {getInitials(visitor.firstName, visitor.lastName)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">
                                                    {visitor.firstName} {visitor.lastName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {visitor.visitCount} visit
                                                    {visitor.visitCount === 1 ? "" : "s"}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1 text-sm">
                                                <Phone className="w-3 h-3 text-muted-foreground" />
                                                <span>{visitor.phone}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate max-w-45">
                                                {visitor.email}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <VisitorStatusBadge status={visitor.status} />
                                    </TableCell>
                                    <TableCell>
                                        {visitor.cellName ? (
                                            <div className="flex items-center gap-1 text-sm">
                                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                                <span className="truncate max-w-30">
                                                    {visitor.cellName}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                Not assigned
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(visitor.createdAt).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewVisitor(visitor)}
                                            aria-label="View visitor"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

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