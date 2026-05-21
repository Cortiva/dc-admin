import { X, Mail, Phone, Calendar, Activity, Trash2, UserX } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Separator } from "../../../components/ui/separator";
import type { User } from "../types/user.type";
import { UpdateUserStatus } from "./UpdateUserStatus";
import { DeleteUserModal } from "./DeleteUser";
import { useState } from "react";

interface ViewUserProps {
    isOpen: boolean;
    onClose: () => void;
    user?: User | null;
    onSuccess: () => void;
}

export function ViewUser({
    isOpen,
    onClose,
    user,
    onSuccess
}: ViewUserProps) {
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    if (!isOpen || !user) return null;

    const fullName = `${user.firstName} ${user.lastName}`;

    const getStatusBadge = () => {
        switch (user.status) {
            case "active":
                return <Badge className="bg-green-100 text-green-700">Active</Badge>;
            case "suspended":
                return <Badge className="bg-yellow-100 text-yellow-700">Suspended</Badge>;
            case "deleted":
                return <Badge className="bg-red-100 text-red-700">Deleted</Badge>;
            default:
                return <Badge>{user.status}</Badge>;
        }
    };

    const getRoleBadge = () => {
        switch (user.role) {
            case "admin":
                return <Badge className="bg-purple-100 text-purple-700">Admin</Badge>;
            case "artisan":
                return <Badge className="bg-blue-100 text-blue-700">Artisan</Badge>;
            default:
                return <Badge variant="secondary">Customer</Badge>;
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-card shadow-2xl z-50 overflow-y-auto">

                {/* Header */}
                <div className="sticky top-0 bg-card border-b px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">User Details</h2>
                        <p className="text-sm text-muted-foreground">
                            Manage user profile and actions
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-500/10 rounded-lg"
                    >
                        <X className="w-5 h-5 text-red-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Profile Section */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatar || ""} />
                            <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <h3 className="text-lg font-semibold">{fullName}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                                {getRoleBadge()}
                                {getStatusBadge()}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Contact Info */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase">Contact Information</h4>

                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{user.email}</span>
                            {user.emailVerified && <Badge className="bg-green-100 text-green-700">Verified</Badge>}
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{user.phone || "N/A"}</span>
                            {user.phoneVerified && <Badge className="bg-green-100 text-green-700">Verified</Badge>}
                        </div>
                    </div>

                    <Separator />

                    {/* Activity */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase">Activity</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-muted/40">
                                <p className="text-xs text-muted-foreground">Jobs Created</p>
                                <p className="text-lg font-semibold">{user._count?.jobsCreated || 0}</p>
                            </div>

                            <div className="p-3 rounded-lg bg-muted/40">
                                <p className="text-xs text-muted-foreground">Reviews Given</p>
                                <p className="text-lg font-semibold">{user._count?.reviewsGiven || 0}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Timeline */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase">Timeline</h4>

                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <Activity className="w-4 h-4 text-muted-foreground" />
                            <span>
                                Last Login:{" "}
                                {user.lastLoginAt
                                    ? new Date(user.lastLoginAt).toLocaleDateString()
                                    : "Never"}
                            </span>
                        </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row justify-end gap-3">
                            <Button
                                variant="outline"
                                className={`${user.status === "suspended" ? "" : "text-yellow-600 border-yellow-300 hover:text-yellow-600"}`}
                                onClick={() => setStatusModalOpen(true)}
                            >
                                <UserX className="w-4 h-4 mr-2" />
                                {user.status === "suspended" ? "Activate Account" : "Suspend Account"}
                            </Button>

                            <Button
                                variant="destructive"
                                className=""
                                onClick={() => setDeleteModalOpen(true)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
            <UpdateUserStatus
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                onSuccess={onSuccess}
                userName={`${user?.firstName} ${user?.lastName}`}
                userId={user?.id}
                currentStatus={user?.status}
            />

            <DeleteUserModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onSuccess={onSuccess}
                userName={user?.firstName + " " + user?.lastName}
                userId={user?.id}
            />
        </>
    );
}