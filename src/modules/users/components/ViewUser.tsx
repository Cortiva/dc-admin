import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../../components/ui/dialog";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";
import { Mail, Phone, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "react-toastify";
import { InfoRows } from "./InfoRow";
import { UserRoleBadge, UserStatusBadge } from "./UserBadges";
import { handleApiError } from "../../../utils/functions";
import type { User } from "../types/user.types";
import { useApproveMemberMutation, useReactivateUserMutation, useRejectMemberMutation, useSuspendUserMutation } from "../usersApiSlice";

interface ViewUserProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onSuccess: () => void;
}

export function ViewUser({ isOpen, onClose, user, onSuccess }: ViewUserProps) {
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);

    const [approveMember, { isLoading: isApproving }] = useApproveMemberMutation();
    const [rejectMember, { isLoading: isRejecting }] = useRejectMemberMutation();
    const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();
    const [reactivateUser, { isLoading: isReactivating }] = useReactivateUserMutation();

    if (!user) return null;

    const getInitials = (name: string) =>
        name.split(" ").map((n) => n[0]).join("").toUpperCase();

    const handleClose = () => {
        setShowRejectForm(false);
        setRejectReason("");
        onClose();
    };

    const handleApprove = async () => {
        try {
            await approveMember(user.id).unwrap();
            toast.success(`${user.firstName} has been approved`);
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            toast.error("Add a reason before rejecting");
            return;
        }
        try {
            await rejectMember({ id: user.id, reason: rejectReason }).unwrap();
            toast.success(`${user.firstName}'s request was rejected`);
            setShowRejectForm(false);
            setRejectReason("");
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleSuspend = async () => {
        try {
            await suspendUser(user.id).unwrap();
            toast.success(`${user.firstName} has been suspended`);
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    const handleReactivate = async () => {
        try {
            await reactivateUser(user.id).unwrap();
            toast.success(`${user.firstName} has been reactivated`);
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>User profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-4 p-6 bg-linear-to-r from-primary/10 to-transparent rounded-xl">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-xl">
                                {getInitials(user.fullName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <h2 className="text-xl font-bold truncate">{user.fullName}</h2>
                            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <UserRoleBadge role={user.role} />
                                <UserStatusBadge status={user.status} />
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoRows icon={<Mail className="w-5 h-5" />} label="Email" value={user.email} />
                        <InfoRows
                            icon={<Phone className="w-5 h-5" />}
                            label="Phone number"
                            value={user.phoneNumber ?? "Not provided"}
                        />
                        <InfoRows
                            icon={<Calendar className="w-5 h-5" />}
                            label="Joined"
                            value={new Date(user.createdAt).toLocaleDateString()}
                        />
                    </div>

                    {/* Reject reason form, only shown for pending-approval users */}
                    {showRejectForm && (
                        <div className="space-y-2 border-t pt-4">
                            <Label htmlFor="rejectReason">Reason for rejecting *</Label>
                            <Textarea
                                id="rejectReason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Let them know why this request was declined"
                                rows={3}
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="flex-wrap gap-2">
                    {user.status === "PENDING_APPROVAL" && !showRejectForm && (
                        <>
                            <Button
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => setShowRejectForm(true)}
                            >
                                Reject
                            </Button>
                            <Button onClick={handleApprove} disabled={isApproving}>
                                {isApproving ? "Approving..." : "Approve"}
                            </Button>
                        </>
                    )}

                    {showRejectForm && (
                        <>
                            <Button variant="outline" onClick={() => setShowRejectForm(false)}>
                                Back
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={isRejecting}
                            >
                                {isRejecting ? "Rejecting..." : "Confirm rejection"}
                            </Button>
                        </>
                    )}

                    {user.status === "ACTIVE" && (
                        <Button
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={handleSuspend}
                            disabled={isSuspending}
                        >
                            {isSuspending ? "Suspending..." : "Suspend user"}
                        </Button>
                    )}

                    {user.status === "SUSPENDED" && (
                        <Button onClick={handleReactivate} disabled={isReactivating}>
                            {isReactivating ? "Reactivating..." : "Reactivate user"}
                        </Button>
                    )}

                    {(user.status === "PENDING_INVITE" || user.status === "REJECTED") && (
                        <Button variant="outline" onClick={handleClose}>
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}