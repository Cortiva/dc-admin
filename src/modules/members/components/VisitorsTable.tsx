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
    TrendingUp,
    Award,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { visitorZones, type Visitor, type VisitorFilterParams } from "../../../mock/visitors-mock-data";

interface VisitorsTableProps {
    visitors: Visitor[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    isFetching: boolean;
    filters: VisitorFilterParams;
    onSearch: (search: string) => void;
    onZoneFilter: (zone: string) => void;
    onVisitorTypeFilter: (type: 'firstTimer' | 'secondTimer') => void;
    onDcaFilter: () => void;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    onViewVisitor: (visitor: Visitor) => void;
}

export default function VisitorsTable({
    visitors,
    pagination,
    isFetching,
    filters,
    onSearch,
    onZoneFilter,
    onVisitorTypeFilter,
    onDcaFilter,
    onPageChange,
    onLimitChange,
    onViewVisitor,
}: VisitorsTableProps) {
    const [searchInput, setSearchInput] = useState(filters.search || "");

    const handleSearch = () => {
        onSearch(searchInput);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase();
    };

    const getVisitorTypeBadge = (visitor: Visitor) => {
        if (visitor.isFirstTimer) {
            return <Badge className="bg-green-100 text-green-800">First Timer</Badge>;
        }
        if (visitor.isSecondTimer) {
            return <Badge className="bg-blue-100 text-blue-800">Second Timer</Badge>;
        }
        if (visitor.visitCount > 2) {
            return <Badge className="bg-purple-100 text-purple-800">Returning</Badge>;
        }
        return <Badge variant="outline">New</Badge>;
    };

    const getInterestColor = (percentage: number) => {
        if (percentage >= 80) return "bg-green-100 text-green-800";
        if (percentage >= 60) return "bg-blue-100 text-blue-800";
        if (percentage >= 40) return "bg-yellow-100 text-yellow-800";
        return "bg-gray-100 text-gray-800";
    };

    const getVisitCountColor = (count: number) => {
        if (count === 1) return "text-blue-600";
        if (count === 2) return "text-green-600";
        return "text-purple-600";
    };

    return (
        <div className="space-y-4">
            {/* Filters Bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3 flex-1">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search by name, phone, or occupation..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-80"
                        />
                        <Button onClick={handleSearch} size="sm">
                            <Search className="w-4 h-4" />
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                Zone: {filters.zone || "All"} <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => onZoneFilter("")}>
                                All Zones
                            </DropdownMenuItem>
                            {visitorZones.map(zone => (
                                <DropdownMenuItem key={zone} onClick={() => onZoneFilter(zone)}>
                                    {zone}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button 
                        variant={filters.isFirstTimer === true ? "default" : "outline"} 
                        size="sm"
                        onClick={() => onVisitorTypeFilter('firstTimer')}
                    >
                        First Timers
                    </Button>

                    <Button 
                        variant={filters.isSecondTimer === true ? "default" : "outline"} 
                        size="sm"
                        onClick={() => onVisitorTypeFilter('secondTimer')}
                    >
                        Second Timers
                    </Button>

                    <Button 
                        variant={filters.enrolledForDca === true ? "default" : "outline"} 
                        size="sm"
                        onClick={onDcaFilter}
                    >
                        Enrolled for DCA
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                Limit: {pagination.limit} <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {[10, 25, 50, 100].map(limit => (
                                <DropdownMenuItem key={limit} onClick={() => onLimitChange(limit)}>
                                    {limit} per page
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="text-sm text-muted-foreground">
                    Showing {visitors.length} of {pagination.total} visitors
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Visitor</TableHead>
                            <TableHead>Contact & Zone</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Interest</TableHead>
                            <TableHead>Visits</TableHead>
                            <TableHead>DCA</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isFetching ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : visitors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">
                                    No visitors found
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
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={visitor.avatar} alt={visitor.fullName} />
                                                <AvatarFallback>{getInitials(visitor.fullName)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{visitor.fullName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {visitor.occupation}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-sm">{visitor.phoneNumber}</p>
                                            <p className="text-xs text-muted-foreground">{visitor.zone}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getVisitorTypeBadge(visitor)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getInterestColor(visitor.interestPercentage)}>
                                                <TrendingUp className="w-3 h-3 mr-1" />
                                                {visitor.interestPercentage}%
                                            </Badge>
                                            {visitor.hasBeenEngaged && (
                                                <Badge variant="secondary" >
                                                    Engaged
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className={`font-semibold ${getVisitCountColor(visitor.visitCount)}`}>
                                                {visitor.visitCount} {visitor.visitCount === 1 ? 'visit' : 'visits'}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Last: {new Date(visitor.lastVisitDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {visitor.enrolledForDca ? (
                                            <Badge className="bg-purple-100 text-purple-800">
                                                <Award className="w-3 h-3 mr-1" />
                                                Enrolled
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-gray-500">
                                                Not Enrolled
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewVisitor(visitor)}
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
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