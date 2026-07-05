import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Search, Download, MoreVertical, Eye, Edit, Calendar } from "lucide-react";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { Skeleton } from "../../../components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { useSearchVisitorsQuery, useExportVisitorsMutation } from "../visitorApiSlice";
import { handleApiError, getInitials } from "../../../utils/functions";
import type { VisitorProfileResponse } from "../../../types/visitor.types";
import { formatDate } from "date-fns/format";

export default function VisitorListPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc" as const,
        status: undefined as string | undefined,
        howHeardAboutUs: undefined as string | undefined,
    });

    const { data, isLoading, refetch } = useSearchVisitorsQuery({
        search: search || undefined,
        ...filters,
    });

    const [exportVisitors] = useExportVisitorsMutation();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };

    const handleExport = async () => {
        try {
            const blob = await exportVisitors({ filters: { search: search || undefined, ...filters } }).unwrap();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `visitors_${new Date().toISOString().split("T")[0]}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
            toast.success("Visitors exported successfully");
        } catch (error) {
            handleApiError(error);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary"; label: string }> = {
            FIRST_TIMER: { variant: "secondary", label: "First Timer" },
            SECOND_TIMER: { variant: "secondary", label: "Second Timer" },
            RETURNING: { variant: "default", label: "Returning" },
        };
        return variants[status] || { variant: "outline", label: status };
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <PageHeader
                icon={<Users />}
                title="Visitors"
                subtitle="Manage church visitors and track engagement"
                action={
                    <Button onClick={() => navigate("/visitors/check-in")}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Check-in
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
                                placeholder="Search visitors by name, phone, email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">Search</Button>
                    </form>

                    <div className="flex gap-2 flex-wrap">
                        <Select
                            value={filters.status || "all"}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === "all" ? undefined : value }))}
                        >
                            <SelectTrigger className="w-35">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="FIRST_TIMER">First Timer</SelectItem>
                                <SelectItem value="SECOND_TIMER">Second Timer</SelectItem>
                                <SelectItem value="RETURNING">Returning</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.howHeardAboutUs || "all"}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, howHeardAboutUs: value === "all" ? undefined : value }))}
                        >
                            <SelectTrigger className="w-35">
                                <SelectValue placeholder="How Heard" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sources</SelectItem>
                                <SelectItem value="SOCIAL_MEDIA">Social Media</SelectItem>
                                <SelectItem value="FRIEND_OR_FAMILY">Friend/Family</SelectItem>
                                <SelectItem value="CHURCH_MEMBER">Church Member</SelectItem>
                                <SelectItem value="FLYER_OR_BANNER">Flyer/Banner</SelectItem>
                                <SelectItem value="WEBSITE">Website</SelectItem>
                                <SelectItem value="WALK_IN">Walk-in</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" size="icon" onClick={handleExport}>
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Visitors Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Visitor</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">Phone</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Status</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Visits</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">Last Visit</th>
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
                                        <td className="p-3"><Skeleton className="h-6 w-12" /></td>
                                        <td className="p-3 hidden lg:table-cell"><Skeleton className="h-4 w-24" /></td>
                                        <td className="p-3 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : data?.visitors.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-lg font-medium">No visitors found</p>
                                        <p className="text-sm">Try adjusting your search or filters</p>
                                        <Button className="mt-4" onClick={() => navigate("/visitors/check-in")}>
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Check in a visitor
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                data?.visitors.map((visitor: VisitorProfileResponse) => {
                                    const status = getStatusBadge(visitor.status);
                                    const lastVisit = visitor.visits?.[0]?.visitDate;
                                    return (
                                        <tr key={visitor.id} className="border-t border-muted/30 hover:bg-muted/20 transition-colors">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={visitor.member.profileImageUrl || ""} />
                                                        <AvatarFallback className="text-xs">
                                                            {getInitials(visitor.member.firstName, visitor.member.lastName)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {visitor.member.firstName} {visitor.member.lastName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground sm:hidden">
                                                            {visitor.member.phone}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 hidden sm:table-cell text-sm">{visitor.member.phone}</td>
                                            <td className="p-3 hidden md:table-cell">
                                                <Badge variant={status.variant}>{status.label}</Badge>
                                            </td>
                                            <td className="p-3">
                                                <Badge variant="secondary" className="gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {visitor.visitCount}
                                                </Badge>
                                            </td>
                                            <td className="p-3 hidden lg:table-cell text-sm">
                                                {lastVisit ? formatDate(new Date(lastVisit), "PPP") : "—"}
                                            </td>
                                            <td className="p-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => navigate(`/visitors/${visitor.memberId}`)}>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => navigate(`/visitors/check-in`, { state: { visitor } })}>
                                                            <UserPlus className="w-4 h-4 mr-2" />
                                                            Record Visit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => navigate(`/visitors/${visitor.memberId}/edit`)}>
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit Profile
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
                            {data.pagination.total} visitors
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
        </div>
    );
}