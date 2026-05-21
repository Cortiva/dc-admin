import { useState } from "react";
import { ReusableModal } from "../../../components/AppModal";
import { AlertTriangle } from "lucide-react";
import { useDeleteUserMutation } from "../userApiSlice";
import { handleApiError } from "../../../utils/functions";
import { toast } from "react-toastify";

interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userName?: string;
    userId?: string;
}

export function DeleteUserModal({
    isOpen,
    onClose,
    onSuccess,
    userName,
    userId,
}: DeleteUserModalProps) {
    const [hardDelete, setHardDelete] = useState(false);

    const [deleteUser, { isLoading }] = useDeleteUserMutation();

    const handleDelete = async () => {
        try {
            await deleteUser({
                userId: userId || "",
                hard: hardDelete,
            }).unwrap();
            
            console.log("Deleting user:", userId, "Hard delete:", hardDelete);
            toast.success(`User ${hardDelete ? "permanently deleted" : "soft deleted"} successfully`);
            onSuccess();
            onClose();
            setHardDelete(false);
        } catch (error) {
            console.error("Failed to delete user:", error);
            handleApiError(error);
        }
    };

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={() => {
                onClose();
                setHardDelete(false);
            }}
            title="Delete User Account"
            subtitle={`Deleting user: ${userName || "User"}`}
            position="center"
            size="md"
            isProcessing={isLoading}
            actions={[
                {
                    label: hardDelete ? "Permanently Delete" : "Soft Delete",
                    onClick: handleDelete,
                    loading: isLoading,
                    variant: "destructive",
                },
            ]}
            showCancel={true}
            cancelLabel="Cancel"
            onCancel={() => {
                onClose();
                setHardDelete(false);
            }}
        >
            <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-red-800 font-medium">
                            This action cannot be undone.
                        </p>
                        <p className="text-xs text-red-700 mt-1">
                            This will permanently delete the user account and all associated data.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={hardDelete}
                            onChange={(e) => setHardDelete(e.target.checked)}
                            className="w-4 h-4 rounded border-muted-card text-red-600 focus:ring-red-500 focus:ring-offset-0"
                        />
                        <div>
                            <span className="text-sm font-medium">
                                Permanently delete (hard delete)
                            </span>
                            <p className="text-xs text-muted-foreground">
                                This will completely remove the user from the database and cannot be recovered.
                            </p>
                        </div>
                    </label>

                    <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                            {hardDelete 
                                ? "⚠️ Hard delete will permanently remove all user data including posts, comments, and activity history." 
                                : "ℹ️ Soft delete will mark the account as deleted but keep data for potential restoration. Admins can restore soft-deleted accounts."}
                        </p>
                    </div>
                </div>

                <div className="text-xs text-muted-foreground border-t pt-3">
                    <p>Deleted users will:</p>
                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                        <li>Lose access to their account</li>
                        <li>Have their profile hidden from public view</li>
                        {hardDelete && <li>Have all personal data permanently erased</li>}
                        {!hardDelete && <li>Have data retained for potential restoration</li>}
                    </ul>
                </div>
            </div>
        </ReusableModal>
    );
}