import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, Search, Download, Upload, MoreVertical, Eye, Edit, Trash2, UserCheck } from "lucide-react";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { Skeleton } from "../../../components/ui/skeleton";
import { useDeleteMemberMutation, useExportMembersMutation, useGetMembersQuery } from "../memberApiSlice";
import { getInitials, handleApiError } from "../../../utils/functions";

export default function MemberListPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc" as const,
        isFullMember: undefined as boolean | undefined,
        gender: undefined as string | undefined,
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string | null>(null);

    const { data, isLoading, refetch } = useGetMembersQuery({
        search: search || undefined,
        ...filters,
    });

    const [deleteMember] = useDeleteMemberMutation();
    const [exportMembers] = useExportMembersMutation();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };

    const handleDelete = async () => {
        if (!selectedMember) return;
        try {
            await deleteMember(selectedMember).unwrap();
            toast.success("Member deleted successfully");
            setDeleteDialogOpen(false);
            setSelectedMember(null);
            refetch();
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleExport = async () => {
        try {
            const blob = await exportMembers({ filters: { search: search || undefined, ...filters } }).unwrap();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `members_${new Date().toISOString().split("T")[0]}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
            toast.success("Members exported successfully");
        } catch (error) {
            handleApiError(error);
        }
    };

    const getStatusBadge = (member: { isFullMember?: boolean; visitorStatus?: string }) => {
        if (member.isFullMember) {
            return <Badge variant="default" className="bg-green-500">Full Member</Badge>;
        }
        if (member.visitorStatus === "FIRST_TIMER") {
            return <Badge variant="outline" className="text-blue-500 border-blue-500">First Timer</Badge>;
        }
        if (member.visitorStatus === "SECOND_TIMER") {
            return <Badge variant="outline" className="text-purple-500 border-purple-500">Second Timer</Badge>;
        }
        if (member.visitorStatus === "RETURNING") {
            return <Badge variant="outline" className="text-green-500 border-green-500">Returning</Badge>;
        }
        return <Badge variant="outline">Visitor</Badge>;
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <PageHeader
                icon={<Users />}
                title="Members"
                subtitle="Manage church members and their profiles"
                action={
                    <Button onClick={() => navigate("/members/create")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Member
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
                                placeholder="Search by name, phone, email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary">Search</Button>
                    </form>

                    <div className="flex gap-2 flex-wrap">
                        <Select
                            value={filters.isFullMember?.toString() || "all"}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, isFullMember: value === "all" ? undefined : value === "true" }))}
                        >
                            <SelectTrigger className="w-35">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="true">Full Members</SelectItem>
                                <SelectItem value="false">Visitors</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.gender || "all"}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, gender: value === "all" ? undefined : value }))}
                        >
                            <SelectTrigger className="w-32.5">
                                <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Genders</SelectItem>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" size="icon" onClick={handleExport}>
                            <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Upload className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Members Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Member</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">Phone</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Email</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">Member #</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                                <th className="text-left p-3 text-sm font-medium text-muted-foreground hidden xl:table-cell">Cell</th>
                                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="p-3"><Skeleton className="h-8 w-32" /></td>
                                        <td className="p-3 hidden sm:table-cell"><Skeleton className="h-4 w-24" /></td>
                                        <td className="p-3 hidden md:table-cell"><Skeleton className="h-4 w-32" /></td>
                                        <td className="p-3 hidden lg:table-cell"><Skeleton className="h-4 w-20" /></td>
                                        <td className="p-3"><Skeleton className="h-6 w-20" /></td>
                                        <td className="p-3 hidden xl:table-cell"><Skeleton className="h-4 w-24" /></td>
                                        <td className="p-3 text-right"><Skeleton className="h-8 w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : data?.members.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-muted-foreground">
                                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-lg font-medium">No members found</p>
                                        <p className="text-sm">Try adjusting your search or filters</p>
                                        <Button className="mt-4" onClick={() => navigate("/members/create")}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add your first member
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                data?.members.map((member: { id: string; firstName: string; lastName: string; fullName: string; phone: string; email?: string; memberNumber: string; cellName?: string, isFullMember?: boolean; visitorStatus?: string }) => (
                                    <tr key={member.id} className="border-t border-muted/30 hover:bg-muted/20 transition-colors">
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium shrink-0">
                                                    {getInitials(member.firstName, member.lastName)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{member.fullName}</p>
                                                    <p className="text-xs text-muted-foreground sm:hidden">{member.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3 hidden sm:table-cell text-sm">{member.phone}</td>
                                        <td className="p-3 hidden md:table-cell text-sm">{member.email || "—"}</td>
                                        <td className="p-3 hidden lg:table-cell text-sm font-mono">{member.memberNumber}</td>
                                        <td className="p-3">{getStatusBadge(member)}</td>
                                        <td className="p-3 hidden xl:table-cell text-sm">{member.cellName || "—"}</td>
                                        <td className="p-3 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => navigate(`/members/${member.id}`)}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => navigate(`/members/${member.id}/edit`)}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    {!member.isFullMember && (
                                                        <DropdownMenuItem onClick={() => navigate(`/members/${member.id}/promote`)}>
                                                            <UserCheck className="w-4 h-4 mr-2" />
                                                            Promote
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem
                                                        className="text-red-500"
                                                        onClick={() => {
                                                            setSelectedMember(member.id);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
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
                            {data.pagination.total} members
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

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Member</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this member? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}