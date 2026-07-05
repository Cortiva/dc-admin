import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
    ArrowLeft, Edit, User, Mail, Phone, Shield, 
    Copy, CheckCircle, Clock,
    UserCheck, UserX, MoreVertical
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "date-fns";
import { useSelector } from "react-redux";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Separator } from "../../../components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import type { UserResponse } from "../../../types/user.types";
import { useActivateUserMutation, useApproveUserMutation, useDeactivateUserMutation, useGetUserByIdQuery, useRejectUserMutation, useSuspendUserMutation } from "../usersApiSlice";
import { getInitials, handleApiError } from "../../../utils/functions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { selectCurrentUser } from "../../auth/authSlice";

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

export default function UserDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get the current logged-in user
    const currentUser = useSelector(selectCurrentUser);
    const actorId = currentUser?.id || "system"; // Fallback to "system" if no user found
    
    const [user, setUser] = useState<UserResponse | undefined>(location.state?.user || undefined);
    const [isLoading, setIsLoading] = useState(!user);
    const [error, setError] = useState<string | null>(null);
    const [actionDialog, setActionDialog] = useState<{ open: boolean; type: string }>({ open: false, type: "" });

    const { data: fetchedUser, isLoading: isFetching, isError } = useGetUserByIdQuery(
        location.state?.user?.id || "",
        { skip: !!user || !location.state?.user?.id }
    );

    const [approveUser] = useApproveUserMutation();
    const [rejectUser] = useRejectUserMutation();
    const [suspendUser] = useSuspendUserMutation();
    const [activateUser] = useActivateUserMutation();
    const [deactivateUser] = useDeactivateUserMutation();

    useEffect(() => {
        if (fetchedUser) {
            setUser(fetchedUser);
            setIsLoading(false);
        }
        if (isError) {
            setError("Failed to load user details");
            setIsLoading(false);
        }
    }, [fetchedUser, isError]);

    useEffect(() => {
        if (!location.state?.user && !location.state?.user?.id) {
            navigate("/users", { replace: true });
        }
    }, [location.state, navigate]);

    const handleAction = async (action: string) => {
        if (!user) return;
        try {
            let result;
            
            // Use the logged-in user's ID
            if (!actorId || actorId === "system") {
                toast.error("You must be logged in to perform this action");
                return;
            }
            
            switch (action) {
                case "approve":
                    result = await approveUser({ id: user.id, data: { approvedById: actorId } }).unwrap();
                    toast.success("User approved successfully");
                    break;
                case "reject":
                    result = await rejectUser({ id: user.id, data: { rejectedById: actorId, reason: "Rejected by admin" } }).unwrap();
                    toast.success("User rejected successfully");
                    break;
                case "suspend":
                    result = await suspendUser({ id: user.id, data: { suspendedById: actorId, reason: "Suspended by admin" } }).unwrap();
                    toast.success("User suspended successfully");
                    break;
                case "activate":
                    result = await activateUser({ id: user.id, activatedById: actorId }).unwrap();
                    toast.success("User activated successfully");
                    break;
                case "deactivate":
                    result = await deactivateUser({ id: user.id, deactivatedById: actorId, reason: "Deactivated by admin" }).unwrap();
                    toast.success("User deactivated successfully");
                    break;
            }
            setUser(result);
            setActionDialog({ open: false, type: "" });
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

    if (error || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 p-8">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">User Not Found</h3>
                    <p className="text-sm text-muted-foreground mb-6">{error || "The user you're looking for doesn't exist."}</p>
                    <Button onClick={() => navigate("/users")}>Back to Users</Button>
                </div>
            </div>
        );
    }

    const isPending = user.status === "PENDING_APPROVAL" || user.status === "PENDING_VERIFICATION";
    const isActive = user.status === "ACTIVE";
    const isSuspended = user.status === "SUSPENDED";
    const isDeactivated = user.status === "DEACTIVATED";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/users")}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <PageHeader
                        icon={<User />}
                        title={`${user.firstName} ${user.lastName}`}
                        subtitle={user.registrationSource}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={() => navigator.clipboard?.writeText(user.id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy ID
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/users/edit", { state: { user } })}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <MoreVertical className="w-4 h-4 mr-2" />
                                Actions
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {isPending && (
                                <>
                                    <DropdownMenuItem onClick={() => setActionDialog({ open: true, type: "approve" })}>
                                        <UserCheck className="w-4 h-4 mr-2 text-green-500" />
                                        Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setActionDialog({ open: true, type: "reject" })}>
                                        <UserX className="w-4 h-4 mr-2 text-red-500" />
                                        Reject
                                    </DropdownMenuItem>
                                </>
                            )}
                            {isActive && (
                                <DropdownMenuItem onClick={() => setActionDialog({ open: true, type: "suspend" })}>
                                    <Shield className="w-4 h-4 mr-2 text-yellow-500" />
                                    Suspend
                                </DropdownMenuItem>
                            )}
                            {(isSuspended || isDeactivated) && (
                                <DropdownMenuItem onClick={() => setActionDialog({ open: true, type: "activate" })}>
                                    <UserCheck className="w-4 h-4 mr-2 text-green-500" />
                                    Activate
                                </DropdownMenuItem>
                            )}
                            {isActive && (
                                <DropdownMenuItem onClick={() => setActionDialog({ open: true, type: "deactivate" })}>
                                    <UserX className="w-4 h-4 mr-2 text-red-500" />
                                    Deactivate
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Action Dialog */}
            <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog({ ...actionDialog, open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{actionDialog.type.charAt(0).toUpperCase() + actionDialog.type.slice(1)} User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {actionDialog.type} "{user.firstName} {user.lastName}"?
                            {actionDialog.type === "delete" && " This action cannot be undone."}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialog({ open: false, type: "" })}>Cancel</Button>
                        <Button 
                            variant={actionDialog.type === "reject" || actionDialog.type === "deactivate" ? "destructive" : "default"}
                            onClick={() => handleAction(actionDialog.type)}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Card */}
                <div className="lg:w-1/3">
                    <Card className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="w-24 h-24 mb-4 ring-4 ring-primary/10">
                                <AvatarImage src={user.profileImageUrl || ""} />
                                <AvatarFallback className="text-2xl bg-linear-to-br from-primary/20 to-primary/5">
                                    {getInitials(user.firstName, user.lastName)}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                            <Badge className="mt-1">{user.role}</Badge>
                            <div className="mt-2">
                                <Badge variant={isActive ? "default" : isSuspended ? "destructive" : "secondary"}>
                                    {user.status}
                                </Badge>
                            </div>
                            <div className="mt-3 flex flex-wrap justify-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Joined {formatDate(new Date(user.createdAt), "MMM yyyy")}
                                </Badge>
                                {user.emailVerifiedAt && (
                                    <Badge variant="secondary" className="text-xs">
                                        <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                        Verified
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="text-left space-y-1">
                            <InfoItem label="Email" value={user.email || "Not provided"} icon={<Mail className="w-4 h-4" />} />
                            <InfoItem label="Phone" value={user.phone} icon={<Phone className="w-4 h-4" />} />
                            <InfoItem label="Gender" value={user.gender || "Not specified"} icon={<User className="w-4 h-4" />} />
                            <InfoItem label="Member" value={user.isFullMember ? "Full Member" : "Visitor"} icon={<UserCheck className="w-4 h-4" />} />
                            <InfoItem label="Registration" value={user.registrationSource} icon={<Shield className="w-4 h-4" />} />
                            <InfoItem label="Email Verified" value={user.emailVerifiedAt ? formatDate(new Date(user.emailVerifiedAt), "PPP") : "No"} icon={<CheckCircle className="w-4 h-4" />} />
                            <InfoItem label="Last Login" value={user.lastLoginAt ? formatDate(new Date(user.lastLoginAt), "PPP") : "Never"} icon={<Clock className="w-4 h-4" />} />
                        </div>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:w-2/3">
                    <Card className="p-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">User Information</h3>
                        <div className="grid grid-cols-1 gap-y-2">
                            <InfoItem label="User ID" value={user.id} />
                            <InfoItem label="Full Name" value={`${user.firstName} ${user.lastName}`} />
                            <InfoItem label="Role" value={user.role} />
                            <InfoItem label="Status" value={user.status} />
                            <InfoItem label="Registration Source" value={user.registrationSource} />
                            <InfoItem label="Created" value={formatDate(new Date(user.createdAt), "PPP")} />
                            <InfoItem label="Updated" value={formatDate(new Date(user.updatedAt), "PPP")} />
                            {user.invitedBy && (
                                <InfoItem label="Invited By" value={`${user.invitedBy.firstName} ${user.invitedBy.lastName}`} />
                            )}
                            {user.approvedBy && (
                                <InfoItem label="Approved By" value={`${user.approvedBy.firstName} ${user.approvedBy.lastName}`} />
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}