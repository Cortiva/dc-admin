import { Badge } from "../../../components/ui/badge";
import type { UserRole, UserStatus } from "../types/user.types";

const STATUS_STYLES: Record<UserStatus, string> = {
    ACTIVE: "bg-green-500/10 text-green-800",
    PENDING_INVITE: "bg-amber-500/10 text-amber-800",
    PENDING_APPROVAL: "bg-blue-500/10 text-blue-800",
    PENDING_VERIFICATION: "bg-cyan-500/10 text-cyan-800",
    SUSPENDED: "bg-gray-200 text-gray-700",
    REJECTED: "bg-red-500/10 text-red-800",
};

const STATUS_LABELS: Record<UserStatus, string> = {
    ACTIVE: "Active",
    PENDING_INVITE: "Invite sent",
    PENDING_APPROVAL: "Awaiting approval",
    PENDING_VERIFICATION: "Awaiting verification",
    SUSPENDED: "Suspended",
    REJECTED: "Rejected",
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
    return (
        <Badge className={STATUS_STYLES[status]}>{STATUS_LABELS[status]}</Badge>
    );
}

const ROLE_STYLES: Record<UserRole, string> = {
    SUPER_ADMIN: "bg-purple-500/10 text-purple-800",
    ADMIN: "bg-blue-500/10 text-blue-800",
    USER: "bg-gray-500/10 text-gray-700",
};

const ROLE_LABELS: Record<UserRole, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    USER: "User",
};

export function UserRoleBadge({ role }: { role: UserRole }) {
    return <Badge className={ROLE_STYLES[role]}>{ROLE_LABELS[role]}</Badge>;
}