export interface TokenPayload {
    sub: string;
    iat?: number;
    exp?: number;
}

export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    memberNumber: string;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
    status:
        | "PENDING_VERIFICATION"
        | "PENDING_APPROVAL"
        | "ACTIVE"
        | "REJECTED"
        | "SUSPENDED"
        | "DEACTIVATED";
    emailVerifiedAt: string | null;
    lastLoginAt: string | null;
    createdAt: string;
    memberId: string;
    isFullMember: boolean;
    profileImageUrl: string | null;
    gender: "MALE" | "FEMALE" | null;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: "Bearer";
    user: AuthUser;
}

// Re-export as User for authSlice compatibility
export type User = AuthUser;

export interface MemberInfo {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string | null;
    isFullMember: boolean;
}

export interface ValidateMemberNumberResponse {
    valid: boolean;
    member?: MemberInfo;
    message?: string;
}
