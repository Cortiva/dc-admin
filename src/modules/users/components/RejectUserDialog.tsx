import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/functions";
import { useRejectMemberMutation } from "../usersApiSlice";
import type { User } from "../types/user.types";

interface RejectUserDialogProps {
    user: User | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RejectUserDialog({ user, onClose, onSuccess }: RejectUserDialogProps) {
    const [reason, setReason] = useState("");
    const [rejectMember, { isLoading }] = useRejectMemberMutation();

    const handleClose = () => {
        setReason("");
        onClose();
    };

    const handleSubmit = async () => {
        if (!user || !reason.trim()) {
            toast.error("Add a reason before rejecting");
            return;
        }
        try {
            await rejectMember({ id: user.id, reason }).unwrap();
            toast.success(`${user.firstName}'s request was rejected`);
            setReason("");
            onSuccess();
        } catch (err) {
            handleApiError(err);
        }
    };

    return (
        <Dialog open={!!user} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Reject {user?.firstName}'s request</DialogTitle>
                    <DialogDescription>
                        They'll be notified with the reason you provide below.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <Label htmlFor="reason">Reason *</Label>
                    <Textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. We couldn't verify your membership details"
                        rows={3}
                        autoFocus
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Rejecting..." : "Confirm rejection"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}