import React, { type ReactNode } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export type ModalPosition = "side" | "center";
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalAction {
    label: string;
    onClick: () => void;
    variant?: "default" | "destructive" | "outline" | "ghost";
    loading?: boolean;
    disabled?: boolean;
    icon?: ReactNode;
}

export interface ReusableModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: ReactNode;
    position?: ModalPosition;
    size?: ModalSize;
    actions?: ModalAction[];
    showCancel?: boolean;
    cancelLabel?: string;
    onCancel?: () => void;
    isProcessing?: boolean;
    showCloseButton?: boolean;
    closeOnBackdrop?: boolean;
    className?: string;
    isDelete?: boolean;
    footerClassName?: string;
}

const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw]",
};

const positionClasses: Record<ModalPosition, string> = {
    side: "fixed right-0 top-0 h-full transform transition-transform duration-300 ease-out",
    center: "fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out",
};

export function ReusableModal({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    position = "center",
    size = "lg",
    actions = [],
    showCancel = true,
    cancelLabel = "Cancel",
    onCancel,
    isProcessing = false,
    showCloseButton = true,
    closeOnBackdrop = true,
    isDelete = false,
    className = "",
    footerClassName = "",
}: ReusableModalProps) {
    
    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
                onClick={handleBackdropClick}
            />

            {/* Modal Container */}
            <div className={`${positionClasses[position]} z-50 ${position === "center" ? sizeClasses[size] : "w-full max-w-2xl"}`}>
                <div className={`bg-card shadow-2xl overflow-y-auto ${position === "side" ? "h-full" : "rounded-xl max-h-[90vh]"} ${className}`}>
                    
                    {/* Header */}
                    <div className={`sticky top-0 border-b border-background px-6 py-4 flex items-center justify-between ${position === "center" ? "rounded-t-xl" : ""}`}>
                        <div>
                            <h2 className="text-xl font-semibold">{title}</h2>
                            {subtitle && (
                                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                            )}
                        </div>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className={`p-2 hover:bg-red-500/20 rounded-lg transition-colors `}
                                disabled={isProcessing}
                            >
                                <X className="w-5 h-5 text-red-500" />
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {children}
                    </div>

                    {/* Footer Actions */}
                    {(actions.length > 0 || showCancel) && (
                        <div className={`sticky bottom-0 px-6 py-4 border-t border-background flex items-center justify-end gap-3 ${footerClassName}`}>
                            {showCancel && (
                                <Button 
                                    variant="ghost" 
                                    onClick={handleCancel}
                                    disabled={isProcessing}
                                    type="button"
                                >
                                    {cancelLabel}
                                </Button>
                            )}
                            {actions.map((action, index) => (
                                <Button
                                    key={index}
                                    variant={isDelete ? "destructive" : action.variant || "default"}
                                    onClick={action.onClick}
                                    disabled={action.disabled || action.loading || isProcessing}
                                    type="button"
                                >
                                    {(action.loading || (index === actions.length - 1 && isProcessing)) && (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    )}
                                    {action.icon && !action.loading && <span className="mr-2">{action.icon}</span>}
                                    {action.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}