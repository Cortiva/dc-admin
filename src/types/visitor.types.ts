// ─── Requests ─────────────────────────────────────────────────────────────────

import type {
    LevelOfEducation,
    ServiceType,
} from "../modules/visitors/types/visitor.types";
import type { Gender, HowHeardAboutUs, VisitorStatus } from "./member.type";
import type { UserResponse } from "./user.types";

export interface CheckInVisitorRequest {
    memberId?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    gender?: Gender;
    homeAddress?: string;
    localGovernmentArea?: string;
    birthday?: Date | string;
    isBeliever?: boolean;
    howHeardAboutUs: HowHeardAboutUs;
    levelOfEducation: LevelOfEducation;
    preferenceToReturn: boolean;
    whatTheyLovedMost?: string;
    serviceType: ServiceType;
    notes?: string;
    recordedById: string;
}

export interface RecordVisitRequest {
    memberId: string;
    serviceType: ServiceType;
    notes?: string;
    recordedById: string;
}

export interface UpdateVisitorProfileRequest {
    howHeardAboutUs?: HowHeardAboutUs;
    levelOfEducation?: LevelOfEducation;
    preferenceToReturn?: boolean;
    whatTheyLovedMost?: string;
}

export interface VisitorSearchFilters {
    search?: string;
    status?: VisitorStatus;
    howHeardAboutUs?: HowHeardAboutUs;
    levelOfEducation?: LevelOfEducation;
    preferenceToReturn?: boolean;
    visitCountMin?: number;
    visitCountMax?: number;
    recordedById?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface ExportVisitorsRequest {
    fields?: string[];
    filters?: VisitorSearchFilters;
    format?: "excel" | "csv";
}

// ─── Responses ────────────────────────────────────────────────────────────────

export interface VisitorProfileResponse {
    id: string;
    memberId: string;
    member: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string | null;
        gender: Gender | null;
        isBeliever: boolean;
        isFullMember: boolean;
        profileImageUrl: string | null;
    };
    howHeardAboutUs: HowHeardAboutUs;
    levelOfEducation: LevelOfEducation;
    preferenceToReturn: boolean;
    whatTheyLovedMost: string | null;
    status: VisitorStatus;
    visitCount: number;
    recordedById: string;
    recordedBy: UserResponse;
    visits: VisitResponse[];
    createdAt: Date;
    updatedAt: Date;
}

export interface VisitResponse {
    id: string;
    memberId: string;
    visitDate: Date;
    serviceType: ServiceType;
    notes: string | null;
    recordedById: string;
    recordedBy: UserResponse;
    createdAt: Date;
}

export interface VisitorListResponse {
    visitors: VisitorProfileResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CheckInResponse {
    visitor: VisitorProfileResponse;
    visit: VisitResponse;
    isFirstVisit: boolean;
    isSecondVisit: boolean;
    status: VisitorStatus;
}

export interface VisitorStatsResponse {
    totalVisitors: number;
    byStatus: Array<{
        status: VisitorStatus;
        _count: number;
    }>;
    byHowHeardAboutUs: Array<{
        source: HowHeardAboutUs;
        _count: number;
    }>;
    byEducation: Array<{
        level: LevelOfEducation;
        _count: number;
    }>;
    byServiceType: Array<{
        service: ServiceType;
        _count: number;
    }>;
    visitCounts: {
        totalVisits: number;
        averageVisitsPerVisitor: number;
        maxVisits: number;
    };
    conversionStats: {
        totalVisitors: number;
        convertedToMembers: number;
        conversionRate: number;
        averageTimeToConvert: number;
    };
    recentActivity: {
        today: number;
        thisWeek: number;
        thisMonth: number;
    };
    preferenceStats: {
        preferenceToReturn: number;
        preferenceToReturnRate: number;
        topLovedThings: Array<{ thing: string; count: number }>;
    };
    visitorRetention: {
        firstTimers: number;
        secondTimers: number;
        returning: number;
        returningRate: number;
    };
}
