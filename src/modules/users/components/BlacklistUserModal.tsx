import { useState } from "react";
import { AlertTriangle, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { useAddToBlacklistUserMutation } from "../userApiSlice";
import { handleApiError } from "../../../utils/functions";
import { ReusableModal } from "../../../components/AppModal";
import { SearchableSelect } from "../../../components/selects/SearchableSelect";
import type { User } from "../types/user.type";

interface BlacklistUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    users: User[];
}

export function BlacklistUserModal({
    isOpen,
    onClose,
    onSuccess,
    users
}: BlacklistUserModalProps) {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [reason, setReason] = useState("");
    const [notes, setNotes] = useState("");
    const [isPermanent, setIsPermanent] = useState(false);
    const [expiresAt, setExpiresAt] = useState("");

    const [addToBlacklist, { isLoading }] = useAddToBlacklistUserMutation();

    const handleSubmit = async () => {
        if (!selectedUserId) {
            toast.error("Please select a user");
            return;
        }
        if (!reason) {
            toast.error("Please provide a reason");
            return;
        }

        try {
            await addToBlacklist({
                userId: selectedUserId,
                reason,
                notes: notes || undefined,
                expiresAt: !isPermanent && expiresAt ? new Date(expiresAt).toISOString() : undefined,
            }).unwrap();

            toast.success("User blacklisted successfully");
            onSuccess();
            onClose();
            resetForm();
        } catch (error) {
            console.error("Failed to blacklist user:", error);
            handleApiError(error);
        }
    };

    const resetForm = () => {
        setSelectedUserId(null);
        setReason("");
        setNotes("");
        setIsPermanent(false);
        setExpiresAt("");
    };

    // Mock user options - replace with actual user search
    const userOptions = users.map((user) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
        icon: "👤",
    })).sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));

    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={() => {
                onClose();
                resetForm();
            }}
            title="Blacklist User"
            subtitle="Restrict user access from the platform"
            position="side"
            size="lg"
            isProcessing={isLoading}
            actions={[
                {
                    label: "Add to Blacklist",
                    onClick: handleSubmit,
                    loading: isLoading,
                    variant: "destructive",
                    disabled: !selectedUserId || !reason,
                },
            ]}
            showCancel={true}
            cancelLabel="Cancel"
            onCancel={() => {
                onClose();
                resetForm();
            }}
        >
            <div className="space-y-6">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-red-800 font-medium">
                            This action will restrict user access
                        </p>
                        <p className="text-xs text-red-700 mt-1">
                            Blacklisted users cannot log in or access platform features.
                        </p>
                    </div>
                </div>

                {/* User Selection */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Select User *
                    </label>
                    <SearchableSelect
                        options={userOptions}
                        value={selectedUserId}
                        onChange={(value) => setSelectedUserId(value)}
                        placeholder="Search for a user..."
                        clearable
                    />
                </div>

                {/* Ban Type */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Ban Type
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={!isPermanent}
                                onChange={() => setIsPermanent(false)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Temporary</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={isPermanent}
                                onChange={() => setIsPermanent(true)}
                                className="w-4 h-4"
                            />
                            <span className="text-sm">Permanent</span>
                        </label>
                    </div>
                </div>

                {/* Expiry Date (for temporary bans) */}
                {!isPermanent && (
                    <div>
                        <label className="text-sm font-medium mb-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Expiration Date (Optional)
                        </label>
                        <input
                            type="datetime-local"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-muted-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Leave empty for indefinite temporary ban
                        </p>
                    </div>
                )}

                {/* Reason */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Blacklist Reason *
                    </label>
                    <textarea
                        className="w-full px-3 py-2 bg-background border border-muted-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter detailed reason for blacklisting..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        This reason will be shown to the user and logged for audit.
                    </p>
                </div>

                {/* Notes (Internal) */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Internal Notes (Optional)
                    </label>
                    <textarea
                        className="w-full px-3 py-2 bg-background border border-muted-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Internal notes for admin reference..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        These notes are only visible to admins.
                    </p>
                </div>
            </div>
        </ReusableModal>
    );
}