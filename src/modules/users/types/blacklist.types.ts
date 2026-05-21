export interface BlacklistedUser {
    id: string;
    userId: string;
    reason: string;
    blacklistedBy: string;
    blacklistedAt: string;
    expiresAt: string | null;
    isPermanent: boolean;
    removedAt: string | null;
    removedBy: string | null;
    notes: string | null;
    user: {
        id: string;
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
        avatar: string | null;
        role: "customer" | "artisan" | "admin";
        status: "active" | "suspended" | "deleted";
        isActive: boolean;
        emailVerified: boolean;
        phoneVerified: boolean;
        createdAt: string;
        lastLoginAt: string | null;
    };
}

export interface BlacklistSummary {
    totalBlacklisted: number;
    activeBlacklisted: number;
    removedBlacklisted: number;
    permanentBans: number;
    temporaryBans: number;
    expiringSoon: number;
    expiredBans: number;
    blacklistedByAdmin: number;
    blacklistedBySuperAdmin: number;
    averageBanDuration: number;
    mostCommonReasons: Array<{ reason: string; count: number }>;
}

export interface BlacklistFilterParams {
    search?: string;
    isActive?: boolean; // true = currently blacklisted, false = removed
    isPermanent?: boolean;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface ListBlacklistedResponse {
    blacklistedUsers: BlacklistedUser[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
    summary: BlacklistSummary;
}
