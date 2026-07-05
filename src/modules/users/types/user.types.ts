export type UserRole = "SUPER_ADMIN" | "ADMIN" | "USER";

export type UserStatus =
    | "PENDING_INVITE"
    | "PENDING_APPROVAL"
    | "PENDING_VERIFICATION"
    | "ACTIVE"
    | "REJECTED"
    | "SUSPENDED";

export type RegistrationSource = "SELF_REGISTERED" | "INVITED";

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
