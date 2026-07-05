import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    ArrowLeft, Edit, Users, MapPin, User, 
    Calendar, Building2, Copy, Trash2,
    UserPlus, UserMinus, AlertCircle, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "date-fns";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Separator } from "../../../components/ui/separator";
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
import { useGetCellByIdQuery, useDeleteCellMutation, useAssignCellLeaderMutation, useRemoveCellLeaderMutation } from "../structureApiSlice";
import { useGetMembersQuery } from "../../members/memberApiSlice";
import { handleApiError, getInitials } from "../../../utils/functions";
import type { CellResponse } from "../../../types/structure.types";
import type { MemberResponse } from "../../../types/member.type";

interface InfoItemProps {
    label: string;
    value: string | React.ReactNode;
    icon?: React.ReactNode;
}

const InfoItem = ({ label, value, icon }: InfoItemProps) => (
    <div className="flex items-start gap-3 py-2 border-b border-muted/30 last:border-0">
        {icon && <div className="mt-0.5 text-muted-foreground">{icon}</div>}
        <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium truncate">{value || "—"}</p>
        </div>
    </div>
);

export default function CellDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [cell, setCell] = useState<CellResponse | null>(location.state?.cell || null);
    const [isLoading, setIsLoading] = useState(!cell);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [assignLeaderDialogOpen, setAssignLeaderDialogOpen] = useState(false);
    const [selectedLeaderId, setSelectedLeaderId] = useState("");

    // These hooks are now at the top level
    const { data: fetchedCell, isLoading: isFetching, isError, refetch } = useGetCellByIdQuery(
        location.state?.cell?.id || "",
        { skip: !!cell || !location.state?.cell?.id }
    );

    const { data: members } = useGetMembersQuery({ limit: 100 });
    const [deleteCell] = useDeleteCellMutation();
    const [assignLeader] = useAssignCellLeaderMutation();
    const [removeLeader] = useRemoveCellLeaderMutation();

    useEffect(() => {
        if (fetchedCell) {
            setCell(fetchedCell);
            setIsLoading(false);
        }
        if (isError) {
            setError("Failed to load cell details");
            setIsLoading(false);
        }
    }, [fetchedCell, isError]);

    useEffect(() => {
        if (!location.state?.cell && !location.state?.cell?.id) {
            navigate("/structure/cells", { replace: true });
        }
    }, [location.state, navigate]);

    const handleDelete = async () => {
        if (!cell) return;
        try {
            await deleteCell(cell.id).unwrap();
            toast.success("Cell deleted successfully");
            navigate("/structure/cells");
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleAssignLeader = async () => {
        if (!cell || !selectedLeaderId) return;
        try {
            await assignLeader({ id: cell.id, data: { leaderId: selectedLeaderId } }).unwrap();
            toast.success("Leader assigned successfully");
            setAssignLeaderDialogOpen(false);
            setSelectedLeaderId("");
            // Use the refetch function from the hook
            const result = await refetch();
            if (result.data) setCell(result.data);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleRemoveLeader = async () => {
        if (!cell) return;
        try {
            await removeLeader(cell.id).unwrap();
            toast.success("Leader removed successfully");
            // Use the refetch function from the hook
            const result = await refetch();
            if (result.data) setCell(result.data);
        } catch (error) {
            handleApiError(error);
        }
    };

    if (isLoading || isFetching) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/3">
                        <Skeleton className="h-80 w-full rounded-xl" />
                    </div>
                    <div className="lg:w-2/3">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-64 w-full mt-4" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !cell) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 p-8">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Cell Not Found</h3>
                    <p className="text-sm text-muted-foreground mb-6">{error || "The cell you're looking for doesn't exist."}</p>
                    <Button onClick={() => navigate("/structure/cells")}>Back to Cells</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/structure/cells")}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <PageHeader
                        icon={<Users />}
                        title={cell.name}
                        subtitle={`${cell._count?.members || 0} members`}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard?.writeText(cell.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy ID
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/structure/cells/edit", { state: { cell } })}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} disabled={cell._count?.members ? true : false}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Card */}
                <div className="lg:w-1/3">
                    <Card className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-500/30 via-blue-500/20 to-blue-500/5 flex items-center justify-center mb-4">
                                <Users className="w-12 h-12 text-blue-500" />
                            </div>
                            <h2 className="text-xl font-bold">{cell.name}</h2>
                            <p className="text-sm text-muted-foreground">
                                {cell._count?.members || 0} members
                            </p>
                            <div className="mt-3 flex flex-wrap justify-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    <Users className="w-3 h-3 mr-1" />
                                    {cell._count?.members || 0} members
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Created {formatDate(new Date(cell.createdAt), "MMM yyyy")}
                                </Badge>
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="text-left space-y-1">
                            <InfoItem label="Zone" value={cell.zone?.name || "—"} icon={<MapPin className="w-4 h-4" />} />
                            <InfoItem label="Area" value={cell.zone?.area?.name || "—"} icon={<Building2 className="w-4 h-4" />} />
                            <InfoItem label="Description" value={cell.description || "No description"} icon={<AlertCircle className="w-4 h-4" />} />
                            <InfoItem label="Leader" value={cell.leader ? `${cell.leader.firstName} ${cell.leader.lastName}` : "None"} icon={<User className="w-4 h-4" />} />
                            <InfoItem label="Created" value={formatDate(new Date(cell.createdAt), "PPP")} icon={<Calendar className="w-4 h-4" />} />
                            <InfoItem label="Updated" value={formatDate(new Date(cell.updatedAt), "PPP")} icon={<Calendar className="w-4 h-4" />} />
                        </div>

                        <div className="mt-4 pt-4 border-t border-muted/30">
                            <Button 
                                variant={cell.leader ? "outline" : "default"} 
                                className="w-full"
                                onClick={() => setAssignLeaderDialogOpen(true)}
                            >
                                {cell.leader ? <UserMinus className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                                {cell.leader ? "Change Leader" : "Assign Leader"}
                            </Button>
                            {cell.leader && (
                                <Button 
                                    variant="ghost" 
                                    className="w-full mt-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={handleRemoveLeader}
                                >
                                    <UserMinus className="w-4 h-4 mr-2" />
                                    Remove Leader
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Tabs */}
                <div className="lg:w-2/3">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="members">
                                Members ({cell._count?.members || 0})
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="mt-4 space-y-4">
                            <Card className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Cell Information</h3>
                                <div className="grid grid-cols-1 gap-y-2">
                                    <InfoItem label="Name" value={cell.name} />
                                    <InfoItem label="Description" value={cell.description || "—"} />
                                    <InfoItem label="Zone" value={cell.zone?.name || "—"} />
                                    <InfoItem label="Area" value={cell.zone?.area?.name || "—"} />
                                    <InfoItem label="Leader" value={cell.leader ? `${cell.leader.firstName} ${cell.leader.lastName}` : "—"} />
                                    <InfoItem label="Total Members" value={cell._count?.members || 0} />
                                    <InfoItem label="Created" value={formatDate(new Date(cell.createdAt), "PPP")} />
                                    <InfoItem label="Updated" value={formatDate(new Date(cell.updatedAt), "PPP")} />
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Button variant="outline" className="justify-start" onClick={() => navigate("/structure/cells/edit", { state: { cell } })}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Cell
                                    </Button>
                                    <Button variant="outline" className="justify-start" onClick={() => navigate("/members", { state: { fromCell: cell } })}>
                                        <Users className="w-4 h-4 mr-2" />
                                        View Members
                                    </Button>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Members Tab */}
                        <TabsContent value="members" className="mt-4">
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Members ({cell._count?.members || 0})
                                    </h3>
                                </div>

                                {cell.members?.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-lg font-medium">No members in this cell</p>
                                        <p className="text-sm">Members will appear here when assigned</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {cell.members?.map((member) => (
                                            <div 
                                                key={member.id}
                                                className="flex items-center justify-between p-3 rounded-lg border border-muted/30 hover:bg-muted/20 transition-colors cursor-pointer"
                                                onClick={() => navigate("/members/view", { state: { member } })}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={member.profileImageUrl || ""} />
                                                        <AvatarFallback className="text-xs">
                                                            {getInitials(member.firstName, member.lastName)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {member.firstName} {member.lastName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">{member.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {member.isFullMember ? (
                                                        <Badge variant="default" className="bg-green-500">Full Member</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Visitor</Badge>
                                                    )}
                                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Cell</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{cell.name}"? This action cannot be undone.
                            {cell._count?.members ? (
                                <p className="mt-2 text-red-500">
                                    Warning: This cell has {cell._count.members} member(s) assigned. 
                                    You must remove all members first.
                                </p>
                            ) : null}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={cell._count?.members ? true : false}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assign Leader Dialog */}
            <Dialog open={assignLeaderDialogOpen} onOpenChange={setAssignLeaderDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Leader to Cell</DialogTitle>
                        <DialogDescription>
                            Select a member to lead "{cell.name}".
                        </DialogDescription>
                    </DialogHeader>

                    <Select value={selectedLeaderId} onValueChange={setSelectedLeaderId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a member..." />
                        </SelectTrigger>
                        <SelectContent>
                            {members?.members?.map((member: MemberResponse) => (
                                <SelectItem key={member.id} value={member.id}>
                                    {member.fullName} ({member.phone})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAssignLeaderDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAssignLeader} disabled={!selectedLeaderId}>
                            Assign Leader
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}