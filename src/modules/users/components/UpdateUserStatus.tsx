import { useState } from "react";
import { ReusableModal } from "../../../components/AppModal";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useUpdateUserStatusMutation } from "../userApiSlice";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/functions";

interface UpdateUserStatusProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userName?: string;
    userId?: string;
    currentStatus?: string;
}

export function UpdateUserStatus({
    isOpen,
    onClose,
    onSuccess,
    userName,
    userId,
    currentStatus = "active",
}: UpdateUserStatusProps) {
    const [reason, setReason] = useState("");
    
    const [updateUserStatus, { isLoading }] = useUpdateUserStatusMutation();
    
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    
    const handleSubmit = async () => {
        try {
            const requestBody: { status: string; reason?: string } = {
                status: newStatus,
            };
            
            // Only include reason for suspension or when provided
            if (reason) {
                requestBody.reason = reason;
            }
            
            await updateUserStatus({
                userId: userId || "",
                data: requestBody,
            }).unwrap();
            
            const actionText = newStatus === "suspended" ? "suspended" : "activated";
            toast.success(`User ${actionText} successfully`);
            onSuccess();
            onClose();
            setReason("");
        } catch (error) {
            console.error("Failed to update user status:", error);
            handleApiError(error);
        }
    };
    
    const getModalConfig = () => {
        if (newStatus === "suspended") {
            return {
                title: "Suspend User Account",
                icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
                iconBg: "bg-yellow-50 border-yellow-200",
                buttonLabel: "Suspend User",
                buttonVariant: "destructive" as const,
                colorClass: "yellow",
                effects: [
                    "Prevent the user from logging in",
                    "Hide their profile from searches",
                    "Cancel any active jobs",
                    "Notify the user via email",
                ],
            };
        } else if (newStatus === "active") {
            return {
                title: "Activate User Account",
                icon: <CheckCircle className="w-5 h-5 text-green-600" />,
                iconBg: "bg-green-50 border-green-200",
                buttonLabel: "Activate User",
                colorClass: "green",
                effects: [
                    "Restore user's login access",
                    "Make their profile visible again",
                    "Allow them to accept new jobs",
                    "Notify the user via email",
                ],
            };
        } else {
            return {
                title: "Send Warning to User",
                icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
                iconBg: "bg-orange-50 border-orange-200",
                buttonLabel: "Send Warning",
                buttonVariant: "warning" as const,
                colorClass: "orange",
                effects: [
                    "User will receive a formal warning",
                    "Warning will be logged to their record",
                    "Multiple warnings may lead to suspension",
                ],
            };
        }
    };
    
    const config = getModalConfig();
    const isProcessing = isLoading;
    
    return (
        <ReusableModal
            isOpen={isOpen}
            onClose={() => {
                onClose();
                setReason("");
            }}
            title={config.title}
            subtitle={`${newStatus === "suspended" ? "Suspending" : newStatus === "active" ? "Activating" : "Warning"} user: ${userName || "User"}`}
            position="center"
            size="md"
            isProcessing={isProcessing}
            actions={[
                {
                    label: config.buttonLabel,
                    onClick: handleSubmit,
                    loading: isProcessing,
                    variant: config.buttonVariant as unknown as "destructive" | "default" | "outline" | "ghost",
                    disabled: newStatus === "suspended" && !reason,
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
                {/* Warning Box */}
                <div className={`flex items-start gap-3 p-3 rounded-lg border ${config.iconBg}`}>
                    {config.icon}
                    <div className="flex-1">
                        <p className={`text-sm font-medium text-${config.colorClass}-800`}>
                            {newStatus === "suspended" && "Suspending this account will:"}
                            {newStatus === "active" && "Activating this account will:"}
                        </p>
                        <ul className={`text-xs text-${config.colorClass}-700 mt-1 list-disc list-inside`}>
                            {config.effects.map((effect, index) => (
                                <li key={index}>{effect}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                {/* Reason Input - Required for suspension, optional for others */}
                <div>
                    <label className="text-sm font-medium mb-2 block">
                        {newStatus === "suspended" ? "Suspension Reason *" : newStatus === "active" ? "Activation Note (Optional)" : "Warning Reason *"}
                    </label>
                    <textarea
                        className="w-full px-3 py-2 bg-background border border-muted-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={
                            newStatus === "suspended" 
                                ? "Enter detailed reason for suspension..."
                                : newStatus === "active"
                                ? "Enter optional note for reactivation..."
                                : "Enter reason for this warning..."
                        }
                    />
                    <p className="text-xs text-muted-foreground mt-1 flex justify-between">
                        <span>{reason.length}/500 characters</span>
                        {newStatus === "suspended" && !reason && <span className="text-red-500">Required</span>}
                    </p>
                </div>
                
                {/* Email Notification Info */}
                <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">
                    <p className="flex items-center gap-1">
                        <span>📧</span>
                        <span>The user will receive an email notification{reason ? " with this reason" : ""}.</span>
                    </p>
                    {newStatus === "active" && (
                        <p className="mt-1 text-green-600">
                            ✅ User will regain full access to their account.
                        </p>
                    )}
                </div>
                
                {/* Warning counter for repeated actions */}
                {newStatus === "suspended" && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                        ⚠️ This action will be recorded and cannot be undone without admin approval.
                    </div>
                )}
            </div>
        </ReusableModal>
    );
}