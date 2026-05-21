import { useState } from "react";
import { UserCheck } from "lucide-react";
import { toast } from "react-toastify";
import { useRemoveFromBlacklistMutation } from "../userApiSlice";
import { handleApiError } from "../../../utils/functions";
import { ReusableModal } from "../../../components/AppModal";

interface RemoveFromBlacklistModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    blacklistEntry: {
        id: string;
        user?: {
            firstName: string;
            lastName: string;
        };
    } | null;
}

export function RemoveFromBlacklistModal({
    isOpen,
    onClose,
    onSuccess,
    blacklistEntry,
}: RemoveFromBlacklistModalProps) {
    const [reason, setReason] = useState("");
    const [removeFromBlacklist, { isLoading }] = useRemoveFromBlacklistMutation();

    const handleRemove = async () => {
        if (!blacklistEntry?.id) return;

        try {
            const blacklistId = blacklistEntry.id;
            await removeFromBlacklist(blacklistId).unwrap();

            toast.success("User removed from blacklist successfully");
            onSuccess();
            onClose();
            setReason("");
        } catch (error) {
            console.error("Failed to remove from blacklist:", error);
            handleApiError(error);
        }
    };

    const userName = blacklistEntry?.user 
        ? `${blacklistEntry.user.firstName} ${blacklistEntry.user.lastName}`
        : "this user";

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={() => {
                onClose();
                setReason("");
            }}
            title="Remove from Blacklist"
            subtitle={`Restoring access for ${userName}`}
            position="center"
            size="md"
            isProcessing={isLoading}
            actions={[
                {
                    label: "Remove from Blacklist",
                    onClick: handleRemove,
                    loading: isLoading,
                },
            ]}
            showCancel={true}
            cancelLabel="Cancel"
            onCancel={() => {
                onClose();
                setReason("");
            }}
        >
            <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <UserCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-green-800 font-medium">
                            Restore User Access
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                            This will restore full platform access to this user.
                        </p>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Removal Reason (Optional)
                    </label>
                    <textarea
                        className="w-full px-3 py-2 bg-background border border-muted-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason for removing from blacklist..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        This reason will be logged for audit purposes.
                    </p>
                </div>

                <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
                    <p className="flex items-center gap-1">
                        <span>📧</span>
                        <span>The user will be notified that their account has been restored.</span>
                    </p>
                </div>
            </div>
        </ReusableModal>
    );
}