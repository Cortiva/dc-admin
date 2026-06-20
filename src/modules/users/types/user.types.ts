// Role a user account can hold. Matches the role enum used elsewhere
// (RegisterRequest in authApiSlice) rather than the single-value example
// in the invite payload, since SUPER_ADMIN was clearly just one example
// value, not the full enum.
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

// NOTE: PENDING_APPROVAL was not in the literal status list provided
// (PENDING_INVITE, ACTIVE, REJECTED, SUSPENDED), but it's required for
// the approve/reject flow to make sense: a self-registered user needs a
// status to sit in *before* an admin approves or rejects them, distinct
// from PENDING_INVITE (which is for admin-initiated invites that the
// *user* accepts, not something an admin approves/rejects). Confirm this
// matches your backend enum before wiring up real endpoints — if the
// backend uses a different name for this state, swap it here only.
export type UserStatus =
    | "PENDING_INVITE"
    | "PENDING_APPROVAL"
    | "ACTIVE"
    | "REJECTED"
    | "SUSPENDED";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
}

export interface InviteUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
}

export interface AcceptInviteRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface RejectUserRequest {
    id: string;
    reason: string;
}

export interface UserFilterParams {
    page: number;
    limit: number;
    search?: string;
    role?: UserRole | "";
    status?: UserStatus | "";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
