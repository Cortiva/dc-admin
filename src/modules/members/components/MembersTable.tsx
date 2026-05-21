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
    Briefcase,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import type { Member, MemberFilterParams } from "../../../types/member.type";
import { departments, surulereZones } from "../../../mock/members";

interface MembersTableProps {
    members: Member[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    isFetching: boolean;
    filters: MemberFilterParams;
    onSearch: (search: string) => void;
    onZoneFilter: (zone: string) => void;
    onDepartmentFilter: (department: string) => void;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
    onViewMember: (member: Member) => void;
    onSuccess: () => void;
}

export default function MembersTable({
    members,
    pagination,
    isFetching,
    filters,
    onSearch,
    onZoneFilter,
    onDepartmentFilter,
    onPageChange,
    onLimitChange,
    onViewMember,
}: MembersTableProps) {
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

    const getTrainingBadge = (member: Member) => {
        const trainings = [];
        if (member.attendedDcaBasic) trainings.push({ label: "Basic", color: "bg-green-100 text-green-800" });
        if (member.attendedDcaMaturity) trainings.push({ label: "Maturity", color: "bg-blue-100 text-blue-800" });
        if (member.attendedDli) trainings.push({ label: "DLI", color: "bg-purple-100 text-purple-800" });
        
        if (trainings.length === 0) {
            return <Badge variant="outline" className="text-gray-500">No Training</Badge>;
        }
        
        return (
            <div className="flex gap-1 flex-wrap">
                {trainings.map((t, i) => (
                    <Badge key={i} className={t.color}>
                        {t.label}
                    </Badge>
                ))}
            </div>
        );
    };

    const getMaritalStatusColor = (status: string) => {
        switch (status) {
            case "Married": return "bg-pink-100 text-pink-800";
            case "Single": return "bg-blue-100 text-blue-800";
            case "Divorced": return "bg-orange-100 text-orange-800";
            case "Widowed": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters Bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-3 flex-1">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Search by name, phone, or address..."
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
                            {surulereZones.map(zone => (
                                <DropdownMenuItem key={zone} onClick={() => onZoneFilter(zone)}>
                                    {zone}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                Dept: {filters.department || "All"} <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => onDepartmentFilter("")}>
                                All Departments
                            </DropdownMenuItem>
                            {departments.map(dept => (
                                <DropdownMenuItem key={dept} onClick={() => onDepartmentFilter(dept)}>
                                    {dept}
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
                            {[10, 25, 50, 100].map(limit => (
                                <DropdownMenuItem key={limit} onClick={() => onLimitChange(limit)}>
                                    {limit} per page
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="text-sm text-muted-foreground">
                    Showing {members.length} of {pagination.total} members
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-hidden bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Member</TableHead>
                            <TableHead>Contact & Location</TableHead>
                            <TableHead>Personal Info</TableHead>
                            <TableHead>Training</TableHead>
                            <TableHead>Department</TableHead>
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
                        ) : members.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    No members found
                                </TableCell>
                            </TableRow>
                        ) : (
                            members.map((member, index) => (
                                <TableRow key={member.id} className="hover:bg-muted/30">
                                    <TableCell>
                                        {(pagination.page - 1) * pagination.limit + index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={member.avatar} alt={member.fullName} />
                                                <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{member.fullName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    ID: {member.id}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1 text-sm">
                                                <Phone className="w-3 h-3 text-muted-foreground" />
                                                <span>{member.phoneNumber}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm">
                                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                                <span>{member.zone}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                {member.address}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <Badge className={getMaritalStatusColor(member.maritalStatus)}>
                                                {member.maritalStatus}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Calendar className="w-3 h-3 text-muted-foreground" />
                                                <span>DOB: {new Date(member.dateOfBirth).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Briefcase className="w-3 h-3 text-muted-foreground" />
                                                <span>{member.occupation}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getTrainingBadge(member)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-primary/10">
                                            {member.department}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewMember(member)}
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