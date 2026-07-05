import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    ArrowLeft, Building2, Users, Calendar, Copy, Trash2, UserPlus, UserMinus,
    AlertCircle, UserCog, Layers, Circle, ChevronRight,
    Edit
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
import { useGetDepartmentByIdQuery, useDeleteDepartmentMutation, useAssignMemberToDepartmentMutation, useRemoveMemberFromDepartmentMutation, useGetDepartmentMembersQuery } from "../departmentApiSlice";
import { useGetMembersQuery } from "../../members/memberApiSlice";
import { handleApiError, getInitials } from "../../../utils/functions";
import type { DepartmentMemberResponse, DepartmentResponse } from "../../../types/department.types";
import type { MemberResponse } from "../../../types/member.type";

// ─── Sub-components ──────────────────────────────────────────────────────────

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

interface MemberListItemProps {
    data: DepartmentMemberResponse;
    onRemove?: () => void;
}

const MemberListItem = ({ data, onRemove }: MemberListItemProps) => (
    <div className="flex items-center justify-between p-3 rounded-lg border border-muted/30 hover:bg-muted/20 transition-colors">
        <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={data.member.profileImageUrl || ""} />
                <AvatarFallback className="text-xs">
                    {getInitials(data.member.firstName, data.member.lastName)}
                </AvatarFallback>
            </Avatar>
            <div>
                <p className="text-sm font-medium">
                    {data.member.firstName} {data.member.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{data.member.phone}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            {data.member.isFullMember ? (
                <Badge variant="default" className="bg-green-500">Full Member</Badge>
            ) : (
                <Badge variant="outline">Visitor</Badge>
            )}
            {onRemove && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={onRemove}
                >
                    <UserMinus className="w-4 h-4" />
                </Button>
            )}
        </div>
    </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function DepartmentDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [department, setDepartment] = useState<DepartmentResponse | null>(
        location.state?.department || null
    );
    const [isLoadingMember, setIsLoadingMember] = useState(!department);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [members, setMembers] = useState<DepartmentMemberResponse[]>([]);

    const { data: fetchedDepartment, isLoading: isFetching, isError } = useGetDepartmentByIdQuery(
        location.state?.department?.id || "",
        { skip: !!department || !location.state?.department?.id }
    );

    const { data: membersData, refetch: refetchMembers } = useGetDepartmentMembersQuery(
        department?.id || "",
        { skip: !department }
    );

    const { data: allMembers } = useGetMembersQuery({ 
        limit: 100,
        isFullMember: undefined,
    });

    const [deleteDepartment] = useDeleteDepartmentMutation();
    const [assignMember] = useAssignMemberToDepartmentMutation();
    const [removeMember] = useRemoveMemberFromDepartmentMutation();

    useEffect(() => {
        if (fetchedDepartment) {
            setDepartment(fetchedDepartment);
            setIsLoadingMember(false);
        }
        if (isError) {
            setError("Failed to load department details");
            setIsLoadingMember(false);
        }
    }, [fetchedDepartment, isError]);

    useEffect(() => {
        if (membersData) {
            setMembers(membersData);
        }
    }, [membersData]);

    useEffect(() => {
        if (!location.state?.department && !location.state?.department?.id) {
            navigate("/departments", { replace: true });
        }
    }, [location.state, navigate]);

    const isLoading = isLoadingMember || isFetching;

    const handleDelete = async () => {
        if (!department) return;
        try {
            await deleteDepartment(department.id).unwrap();
            toast.success("Department deleted successfully");
            navigate("/departments");
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleAssignMember = async () => {
        if (!department || !selectedMemberId) return;
        try {
            await assignMember({
                memberId: selectedMemberId,
                departmentId: department.id,
            }).unwrap();
            toast.success("Member assigned successfully");
            setAssignDialogOpen(false);
            setSelectedMemberId("");
            refetchMembers();
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        try {
            await removeMember(memberId).unwrap();
            toast.success("Member removed from department");
            refetchMembers();
        } catch (error) {
            handleApiError(error);
        }
    };

    if (isLoading) {
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
                        <Skeleton className="h-12 w-full rounded-xl" />
                        <Skeleton className="h-64 w-full rounded-xl mt-4" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !department) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 p-8">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Department Not Found</h3>
                    <p className="text-sm text-muted-foreground mb-6">{error || "The department you're looking for doesn't exist."}</p>
                    <Button onClick={() => navigate("/departments")}>
                        Back to Departments
                    </Button>
                </div>
            </div>
        );
    }

    const canDelete = department.memberCount === 0 && (!department.subDepartments || department.subDepartments.length === 0);

    return (
        <div className="space-y-6">
            {/* ─── Header ────────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/departments")}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl"
                        style={{ backgroundColor: department.color || "#6C5CE7" }}
                    >
                        {department.icon || <Building2 className="w-5 h-5" />}
                    </div>
                    <PageHeader
                        title={department.name}
                        subtitle={`${department.memberCount} members${department.subDepartments && department.subDepartments.length > 0 ? `, ${department.subDepartments.length} sub-departments` : ''}`}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Badge variant={department.isActive ? "default" : "outline"} className={department.isActive ? "bg-green-500" : ""}>
                        <Circle className={`w-2 h-2 mr-1 rounded-full ${department.isActive ? "bg-white" : "bg-gray-400"}`} />
                        {department.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigator.clipboard?.writeText(department.id)}
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy ID
                    </Button>
                    <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/departments/edit", { state: { department } })}
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={!canDelete}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* ─── Profile Summary ──────────────────────────────────────── */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Card */}
                <div className="lg:w-1/3">
                    <Card className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <div 
                                className="w-24 h-24 rounded-2xl flex items-center justify-center mb-4 text-5xl"
                                style={{ backgroundColor: department.color || "#6C5CE7" + "30" }}
                            >
                                {department.icon ? (
                                    <span className="text-5xl">{department.icon}</span>
                                ) : (
                                    <Building2 className="w-12 h-12 text-primary" />
                                )}
                            </div>
                            <h2 className="text-xl font-bold">{department.name}</h2>
                            <p className="text-sm text-muted-foreground">
                                {department.memberCount} members
                            </p>
                            <div className="mt-3 flex flex-wrap justify-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    <Users className="w-3 h-3 mr-1" />
                                    {department.memberCount} members
                                </Badge>
                                {department.subDepartments && department.subDepartments.length > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                        <Layers className="w-3 h-3 mr-1" />
                                        {department.subDepartments.length} sub-departments
                                    </Badge>
                                )}
                                <Badge variant="secondary" className="text-xs">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Created {formatDate(new Date(department.createdAt), "MMM yyyy")}
                                </Badge>
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="text-left space-y-1">
                            <InfoItem 
                                label="Description" 
                                value={department.description || "No description provided"} 
                                icon={<AlertCircle className="w-4 h-4" />}
                            />
                            {department.leader && (
                                <InfoItem 
                                    label="Leader" 
                                    value={`${department.leader.firstName} ${department.leader.lastName}`}
                                    icon={<UserCog className="w-4 h-4" />}
                                />
                            )}
                            {department.parentDepartment && (
                                <InfoItem 
                                    label="Parent Department" 
                                    value={department.parentDepartment.name}
                                    icon={<Layers className="w-4 h-4" />}
                                />
                            )}
                            <InfoItem 
                                label="Created" 
                                value={formatDate(new Date(department.createdAt), "PPP")} 
                                icon={<Calendar className="w-4 h-4" />}
                            />
                            <InfoItem 
                                label="Last Updated" 
                                value={formatDate(new Date(department.updatedAt), "PPP")} 
                                icon={<Calendar className="w-4 h-4" />}
                            />
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:w-2/3">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="members">
                                Members ({members.length})
                            </TabsTrigger>
                            <TabsTrigger value="subdepartments">
                                Sub-Departments ({department.subDepartments?.length || 0})
                            </TabsTrigger>
                        </TabsList>

                        {/* ─── Overview Tab ──────────────────────────────── */}
                        <TabsContent value="overview" className="mt-4 space-y-4">
                            <Card className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Department Information</h3>
                                <div className="grid grid-cols-1 gap-y-2">
                                    <InfoItem label="Name" value={department.name} />
                                    <InfoItem label="Description" value={department.description || "—"} />
                                    <InfoItem label="Leader" value={department.leader ? `${department.leader.firstName} ${department.leader.lastName}` : "—"} />
                                    <InfoItem label="Parent Department" value={department.parentDepartment?.name || "Root"} />
                                    <InfoItem label="Color" value={
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: department.color || "#6C5CE7" }} />
                                            {department.color || "Default"}
                                        </div>
                                    } />
                                    <InfoItem label="Icon" value={department.icon || "—"} />
                                    <InfoItem label="Status" value={
                                        <Badge variant={department.isActive ? "default" : "outline"} className={department.isActive ? "bg-green-500" : ""}>
                                            {department.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    } />
                                    <InfoItem label="Total Members" value={department.memberCount} />
                                    <InfoItem label="Sub-departments" value={department.subDepartments?.length || 0} />
                                    <InfoItem label="Created" value={formatDate(new Date(department.createdAt), "PPP")} />
                                    <InfoItem label="Last Updated" value={formatDate(new Date(department.updatedAt), "PPP")} />
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Button 
                                        variant="outline" 
                                        className="justify-start" 
                                        onClick={() => setAssignDialogOpen(true)}
                                    >
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Assign Member
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="justify-start" 
                                        onClick={() => navigate("/departments/edit", { state: { department } })}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Department
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="justify-start" 
                                        onClick={() => navigate("/departments/stats")}
                                    >
                                        <Users className="w-4 h-4 mr-2" />
                                        View Statistics
                                    </Button>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* ─── Members Tab ───────────────────────────────── */}
                        <TabsContent value="members" className="mt-4">
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Members ({members.length})
                                    </h3>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setAssignDialogOpen(true)}
                                    >
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Assign Member
                                    </Button>
                                </div>

                                {members.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-lg font-medium">No members assigned</p>
                                        <p className="text-sm">Assign members to this department to get started</p>
                                        <Button 
                                            variant="outline" 
                                            className="mt-4"
                                            onClick={() => setAssignDialogOpen(true)}
                                        >
                                            <UserPlus className="w-4 h-4 mr-2" />
                                            Assign Member
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {members.map((member) => (
                                            <MemberListItem
                                                key={member.id}
                                                data={member}
                                                onRemove={() => handleRemoveMember(member.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </TabsContent>

                        {/* ─── Sub-departments Tab ──────────────────────── */}
                        <TabsContent value="subdepartments" className="mt-4">
                            <Card className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                                    Sub-departments ({department.subDepartments?.length || 0})
                                </h3>

                                {!department.subDepartments || department.subDepartments.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-lg font-medium">No sub-departments</p>
                                        <p className="text-sm">This department doesn't have any sub-departments</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {department.subDepartments.map((subDept) => (
                                            <div 
                                                key={subDept.id}
                                                className="flex items-center justify-between p-3 rounded-lg border border-muted/30 hover:bg-muted/20 transition-colors cursor-pointer"
                                                onClick={() => navigate("/departments/view", { state: { department: subDept } })}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div 
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                                                        style={{ backgroundColor: "#6C5CE7" }}
                                                    >
                                                        {<Building2 className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{subDept.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {subDept.memberCount} members
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="icon">
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* ─── Delete Dialog ─────────────────────────────────────────── */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Department</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{department.name}"? This action cannot be undone.
                            {department.memberCount > 0 && (
                                <p className="mt-2 text-red-500">
                                    Warning: This department has {department.memberCount} member(s) assigned. 
                                    You must remove all members first.
                                </p>
                            )}
                            {department.subDepartments && department.subDepartments.length > 0 && (
                                <p className="mt-2 text-red-500">
                                    Warning: This department has {department.subDepartments.length} sub-department(s).
                                    You must delete or reassign all sub-departments first.
                                </p>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleDelete}
                            disabled={!canDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─── Assign Member Dialog ──────────────────────────────────── */}
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Member to Department</DialogTitle>
                        <DialogDescription>
                            Select a member to assign to "{department.name}".
                        </DialogDescription>
                    </DialogHeader>

                    <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a member..." />
                        </SelectTrigger>
                        <SelectContent>
                            {allMembers?.members
                                ?.filter((m: MemberResponse) => !members.some((dm: DepartmentMemberResponse) => dm.id === m.id))
                                .map((member: MemberResponse) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        {member.firstName} {member.lastName} ({member.phone})
                                    </SelectItem>
                                ))}
                            {allMembers?.members?.filter((m: MemberResponse) => !members.some((dm: DepartmentMemberResponse) => dm.id === m.id))
                                .length === 0 && (
                                <div className="p-2 text-sm text-muted-foreground text-center">
                                    No available members to assign
                                </div>
                            )}
                        </SelectContent>
                    </Select>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
                        <Button 
                            onClick={handleAssignMember}
                            disabled={!selectedMemberId}
                        >
                            Assign Member
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}