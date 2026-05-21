import type { PaginationMeta } from "../../../types/base.type";

export interface UserFilterParams {
    role?: "customer" | "artisan" | "admin";
    status?: string;
    search?: string;
    isActive?: boolean;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface ArtisanVerificationFilterParams {
    status?: "pending" | "in_review" | "verified" | "rejected";
    search?: string;
    categoryId?: string;
    minRating?: number;
    hasBankAccount?: boolean;
    hasIdCard?: boolean;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface AuditLogFilterParams {
    userId?: string;
    action?: string;
    entityType?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}

export interface ExportParams {
    entity: "users" | "artisans" | "audit-logs";
    format: "csv" | "excel" | "json";
    filters: Record<string, unknown>;
    fields: string[];
}

export interface Wallet {
    balance: number;
    bonusBalance: number;
}

export interface ArtisanProfile {
    id: string;
    artisanCode: string;
    bio?: string;
    yearsOfExperience?: number;
    rating: number;
    totalJobs: number;
    completedJobs: number;
    isOnline: boolean;
    isVerified: boolean;
    verificationStatus: "pending" | "in_review" | "verified" | "rejected";
    strikes: number;
    bankAccounts?: Array<{
        bankName: string;
        accountNumber: string;
        isDefault: boolean;
    }>;
    skills?: Array<{
        id: string;
        name: string;
        priceRate: number;
    }>;
}

export interface User {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    gender?: string;
    dateOfBirth?: string;
    avatar?: string;
    role: "customer" | "artisan" | "admin";
    status: "active" | "suspended" | "deleted";
    isActive: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: string;
    updatedAt?: string;
    lastLoginAt?: string;
    wallet: Wallet;
    _count?: {
        jobsCreated: number;
        reviewsGiven: number;
    };
    artisan?: ArtisanProfile | null;
}

export interface UserDetail extends User {
    addresses?: Array<{
        id: string;
        label: string;
        address: string;
        city: string;
        state: string;
        isDefault: boolean;
    }>;
    paymentMethods?: unknown[];
    notificationPreferences?: {
        email: { jobUpdates: boolean; promotions: boolean };
        push: { jobUpdates: boolean; chatMessages: boolean };
        sms: { jobUpdates: boolean; securityAlerts: boolean };
    };
    jobsCreated?: unknown[];
    reviewsGiven?: unknown[];
    statistics?: {
        totalSpent: number;
        totalJobs: number;
        disputeCount: number;
    };
}

export interface VerificationQueueItem {
    id: string;
    artisanCode: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        avatar?: string;
        createdAt: string;
    };
    skills: Array<{ category: { name: string } }>;
    bankAccounts: Array<{
        bankName: string;
        accountNumber: string;
        isDefault: boolean;
    }>;
    certifications?: Array<{ title: string }>;
    documents?: unknown[];
    _count: { jobs: number; reviews: number };
    readinessScore: number;
    missingRequirements: string[];
}

export interface Strike {
    id: string;
    reason: string;
    severity: "minor" | "major" | "critical";
    value: number;
    issuedAt: string;
    expiresAt?: string;
    issuedBy: string;
}

export interface StrikeSummary {
    strikes: Strike[];
    totalStrikes: number;
    totalStrikeValue: number;
    strikeLimit: number;
    isSuspended: boolean;
    suspensionReason?: string;
}

export interface BlacklistStatus {
    isBlacklisted: boolean;
    reason?: string;
    blacklistedAt?: string;
    expiresAt?: string | null;
    isPermanent?: boolean;
}

export interface AuditLog {
    id: string;
    userId: string;
    action: string;
    entityType: string;
    entityId: string;
    oldValue?: Record<string, string | null> | null;
    newValue?: Record<string, string | null> | null;
    ipAddress: string;
    userAgent: string;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface ListUsersResponse {
    data: User[];
    pagination: PaginationMeta;
    summary: UsersSummary;
}

export interface UsersSummary {
    totalUsers: number;
    totalArtisans: number;
    totalCustomers: number;
    totalAdmins: number;
    suspendedUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    verifiedEmails: number;
    verifiedPhones: number;
    verifiedArtisans: number;
    pendingArtisans: number;
    suspendedArtisans: number;
    totalWalletBalance: number;
    totalBonusBalance: number;
    totalJobsCreated: number;
    usersWithRecentLogin: number;
    newUsersThisMonth: number;
    completionRate: number;
}
