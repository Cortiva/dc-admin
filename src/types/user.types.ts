// ─── Requests ─────────────────────────────────────────────────────────────────

import type {
    RegistrationSource,
    UserRole,
    UserStatus,
} from "../modules/users/types/user.types";
import type { Gender } from "./member.type";

export interface CreateUserRequest {
    memberId: string;
    password?: string;
    role?: UserRole;
    status?: UserStatus;
    registrationSource?: RegistrationSource;
    invitedById?: string | null;
    approvedById?: string | null;
    approvedAt?: Date | null;
    emailVerifiedAt?: Date | null;
    lastLoginAt?: Date | null;
}

export interface UpdateUserRequest {
    // User fields
    role?: UserRole;
    status?: UserStatus;
    passwordHash?: string;
    lastLoginAt?: Date | null;
    emailVerifiedAt?: Date | null;
    approvedById?: string | null;
    approvedAt?: Date | null;
    rejectionReason?: string | null;

    // Member fields
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    gender?: Gender | null;
    homeAddress?: string | null;
    localGovernmentArea?: string | null;
    birthday?: Date | null;
    isMarried?: boolean;
    weddingDate?: Date | null;
    profileImageUrl?: string | null;
    isBeliever?: boolean;
    isFullMember?: boolean;
    cellId?: string | null;
    departmentId?: string | null;
}

export interface ApproveUserRequest {
    approvedById: string;
    notes?: string;
}

export interface RejectUserRequest {
    rejectedById: string;
    reason: string;
}

export interface SuspendUserRequest {
    suspendedById: string;
    reason: string;
    duration?: number;
}

export interface UserSearchFilters {
    search?: string;
    role?: UserRole;
    status?: UserStatus;
    registrationSource?: RegistrationSource;
    emailVerified?: boolean;
    fromDate?: Date | string;
    toDate?: Date | string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface ExportUserRequest {
    filters?: UserSearchFilters;
    format?: "excel" | "csv";
}

export interface BulkUserActionRequest {
    userIds: string[];
    action: "activate" | "suspend" | "deactivate" | "delete";
    reason?: string;
}

// ─── Responses ────────────────────────────────────────────────────────────────

export interface UserResponse {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string | null;
    gender: Gender | null;
    profileImageUrl: string | null;
    role: UserRole;
    status: UserStatus;
    registrationSource: RegistrationSource;
    emailVerifiedAt: Date | null;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    memberId: string;
    isFullMember: boolean;
    invitedBy?: {
        id: string;
        firstName: string;
        lastName: string;
    } | null;
    approvedBy?: {
        id: string;
        firstName: string;
        lastName: string;
    } | null;
    member?: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string | null;
        isFullMember: boolean;
        profileImageUrl: string | null;
        gender: Gender | null;
    } | null;
}

export interface UserListResponse {
    users: UserResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface UserStatsResponse {
    overview: {
        total: number;
        active: number;
        pendingVerification: number;
        pendingApproval: number;
        suspended: number;
        deactivated: number;
        rejected: number;
    };
    byRole: Array<{
        role: UserRole;
        count: number;
        percentage: number;
    }>;
    byStatus: Array<{
        status: UserStatus;
        count: number;
        percentage: number;
    }>;
    byRegistrationSource: Array<{
        source: RegistrationSource;
        count: number;
        percentage: number;
    }>;
    growth: {
        lastWeek: number;
        lastMonth: number;
        lastQuarter: number;
        lastYear: number;
    };
    recentActivity: {
        today: number;
        thisWeek: number;
        thisMonth: number;
    };
    verificationStats: {
        emailVerified: number;
        emailNotVerified: number;
    };
    approvalStats: {
        pending: number;
        approved: number;
        rejected: number;
        averageApprovalTime: number;
    };
}

export interface BulkUserActionResult {
    total: number;
    processed: number;
    failed: number;
    errors: Array<{
        userId: string;
        error: string;
    }>;
}
