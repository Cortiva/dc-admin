import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    ArrowLeft, Edit, MapPin, Layers, User, Calendar, Copy, Trash2,
    UserPlus, UserMinus, AlertCircle, ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "date-fns";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
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
import { useGetAreaByIdQuery, useDeleteAreaMutation, useAssignAreaLeaderMutation, useRemoveAreaLeaderMutation } from "../structureApiSlice";
import { useGetMembersQuery } from "../../members/memberApiSlice";
import { handleApiError } from "../../../utils/functions";
import type { AreaResponse } from "../../../types/structure.types";
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

export default function AreaDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [area, setArea] = useState<AreaResponse | null>(location.state?.area || null);
    const [isLoading, setIsLoading] = useState(!area);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [assignLeaderDialogOpen, setAssignLeaderDialogOpen] = useState(false);
    const [selectedLeaderId, setSelectedLeaderId] = useState("");

    // These hooks are now at the top level
    const { data: fetchedArea, isLoading: isFetching, isError, refetch } = useGetAreaByIdQuery(
        location.state?.area?.id || "",
        { skip: !!area || !location.state?.area?.id }
    );

    const { data: members } = useGetMembersQuery({ limit: 100 });
    const [deleteArea] = useDeleteAreaMutation();
    const [assignLeader] = useAssignAreaLeaderMutation();
    const [removeLeader] = useRemoveAreaLeaderMutation();

    useEffect(() => {
        if (fetchedArea) {
            setArea(fetchedArea);
            setIsLoading(false);
        }
        if (isError) {
            setError("Failed to load area details");
            setIsLoading(false);
        }
    }, [fetchedArea, isError]);

    useEffect(() => {
        if (!location.state?.area && !location.state?.area?.id) {
            navigate("/structure", { replace: true });
        }
    }, [location.state, navigate]);

    const handleDelete = async () => {
        if (!area) return;
        try {
            await deleteArea(area.id).unwrap();
            toast.success("Area deleted successfully");
            navigate("/structure");
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleAssignLeader = async () => {
        if (!area || !selectedLeaderId) return;
        try {
            await assignLeader({ id: area.id, data: { leaderId: selectedLeaderId } }).unwrap();
            toast.success("Leader assigned successfully");
            setAssignLeaderDialogOpen(false);
            setSelectedLeaderId("");
            // Refetch area data using the refetch function from the hook
            const result = await refetch();
            if (result.data) setArea(result.data);
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleRemoveLeader = async () => {
        if (!area) return;
        try {
            await removeLeader(area.id).unwrap();
            toast.success("Leader removed successfully");
            // Refetch area data using the refetch function from the hook
            const result = await refetch();
            if (result.data) setArea(result.data);
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

    if (error || !area) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 p-8">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Area Not Found</h3>
                    <p className="text-sm text-muted-foreground mb-6">{error || "The area you're looking for doesn't exist."}</p>
                    <Button onClick={() => navigate("/structure")}>Back to Areas</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/structure")}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <PageHeader
                        icon={<MapPin />}
                        title={area.name}
                        subtitle={`${area._count?.zones || 0} zones`}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard?.writeText(area.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy ID
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/structure/areas/edit", { state: { area } })}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} disabled={area._count?.zones ? true : false}>
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
                            <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-primary/30 via-primary/20 to-primary/5 flex items-center justify-center mb-4">
                                <MapPin className="w-12 h-12 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold">{area.name}</h2>
                            <p className="text-sm text-muted-foreground">
                                {area._count?.zones || 0} zones
                            </p>
                            <div className="mt-3 flex flex-wrap justify-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    <Layers className="w-3 h-3 mr-1" />
                                    {area._count?.zones || 0} zones
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Created {formatDate(new Date(area.createdAt), "MMM yyyy")}
                                </Badge>
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="text-left space-y-1">
                            <InfoItem label="Description" value={area.description || "No description"} icon={<AlertCircle className="w-4 h-4" />} />
                            <InfoItem label="Leader" value={area.leader ? `${area.leader.firstName} ${area.leader.lastName}` : "None"} icon={<User className="w-4 h-4" />} />
                            <InfoItem label="Created" value={formatDate(new Date(area.createdAt), "PPP")} icon={<Calendar className="w-4 h-4" />} />
                            <InfoItem label="Updated" value={formatDate(new Date(area.updatedAt), "PPP")} icon={<Calendar className="w-4 h-4" />} />
                        </div>

                        <div className="mt-4 pt-4 border-t border-muted/30">
                            <Button 
                                variant={area.leader ? "outline" : "default"} 
                                className="w-full"
                                onClick={() => setAssignLeaderDialogOpen(true)}
                            >
                                {area.leader ? <UserMinus className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                                {area.leader ? "Change Leader" : "Assign Leader"}
                            </Button>
                            {area.leader && (
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
                            <TabsTrigger value="zones">
                                Zones ({area._count?.zones || 0})
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview" className="mt-4 space-y-4">
                            <Card className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Area Information</h3>
                                <div className="grid grid-cols-1 gap-y-2">
                                    <InfoItem label="Name" value={area.name} />
                                    <InfoItem label="Description" value={area.description || "—"} />
                                    <InfoItem label="Leader" value={area.leader ? `${area.leader.firstName} ${area.leader.lastName}` : "—"} />
                                    <InfoItem label="Total Zones" value={area._count?.zones || 0} />
                                    <InfoItem label="Created" value={formatDate(new Date(area.createdAt), "PPP")} />
                                    <InfoItem label="Updated" value={formatDate(new Date(area.updatedAt), "PPP")} />
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <Button variant="outline" className="justify-start" onClick={() => navigate("/structure/zones/create", { state: { area } })}>
                                        <Layers className="w-4 h-4 mr-2" />
                                        Add Zone
                                    </Button>
                                    <Button variant="outline" className="justify-start" onClick={() => navigate("/structure/areas/edit", { state: { area } })}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Area
                                    </Button>
                                </div>
                            </Card>
                        </TabsContent>

                        {/* Zones Tab */}
                        <TabsContent value="zones" className="mt-4">
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Zones ({area._count?.zones || 0})
                                    </h3>
                                    <Button variant="outline" size="sm" onClick={() => navigate("/structure/zones/create", { state: { area } })}>
                                        <Layers className="w-4 h-4 mr-2" />
                                        Add Zone
                                    </Button>
                                </div>

                                {area.zones?.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p className="text-lg font-medium">No zones in this area</p>
                                        <p className="text-sm">Add zones to organize cells and members</p>
                                        <Button 
                                            variant="outline" 
                                            className="mt-4"
                                            onClick={() => navigate("/structure/zones/create", { state: { area } })}
                                        >
                                            <Layers className="w-4 h-4 mr-2" />
                                            Add Zone
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {area.zones?.map((zone) => (
                                            <div 
                                                key={zone.id}
                                                className="flex items-center justify-between p-3 rounded-lg border border-muted/30 hover:bg-muted/20 transition-colors cursor-pointer"
                                                onClick={() => navigate("/structure/zones/view", { state: { zone } })}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                                        <Layers className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{zone.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {zone._count?.cells || 0} cells
                                                        </p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
                        <DialogTitle>Delete Area</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{area.name}"? This action cannot be undone.
                            {area._count?.zones ? (
                                <p className="mt-2 text-red-500">
                                    Warning: This area has {area._count.zones} zone(s) assigned. 
                                    You must remove all zones first.
                                </p>
                            ) : null}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={area._count?.zones ? true : false}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Assign Leader Dialog */}
            <Dialog open={assignLeaderDialogOpen} onOpenChange={setAssignLeaderDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Leader to Area</DialogTitle>
                        <DialogDescription>
                            Select a member to lead "{area.name}".
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