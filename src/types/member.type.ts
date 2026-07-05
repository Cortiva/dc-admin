export type MemberStatus = "ACTIVE" | "INACTIVE" | "PENDING";
export type Gender = "MALE" | "FEMALE";
export type VisitorStatus = "FIRST_TIMER" | "SECOND_TIMER" | "RETURNING";
export type HowHeardAboutUs =
    | "SOCIAL_MEDIA"
    | "FRIEND_OR_FAMILY"
    | "CHURCH_MEMBER"
    | "FLYER_OR_BANNER"
    | "WEBSITE"
    | "WALK_IN"
    | "OTHER";

// ─── Requests ──────────────────────────────────────────────────────────────

export interface CreateMemberRequest {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string | null;
    gender?: Gender | null;
    homeAddress?: string | null;
    localGovernmentArea?: string | null;
    birthday?: Date | string | null;
    isMarried?: boolean;
    weddingDate?: Date | string | null;
    profileImageUrl?: string | null;
    isBeliever?: boolean;
    attendedDCABasic?: boolean;
    attendedDCAMerit?: boolean;
    attendedEncounter?: boolean;
    cellId?: string | null;
    departmentId?: string | null;
}

export interface UpdateMemberRequest extends Partial<CreateMemberRequest> {
    isFullMember?: boolean;
    fullMemberAt?: Date | string | null;
}

export interface MemberSearchFilters {
    search?: string;
    cellId?: string;
    departmentId?: string;
    isFullMember?: boolean;
    isBeliever?: boolean;
    gender?: Gender;
    birthdayFrom?: Date | string;
    birthdayTo?: Date | string;
    visitorStatus?: VisitorStatus;
    localGovernmentArea?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface MemberCheckInRequest {
    memberId: string;
    serviceType: string;
    notes?: string;
    recordedById: string;
}

export interface MemberPromoteRequest {
    memberId: string;
    promotedBy: string;
    notes?: string;
}

export interface MemberAssignCellRequest {
    memberId: string;
    cellId: string;
}

export interface MemberAssignDepartmentRequest {
    memberId: string;
    departmentId: string;
}

export interface MemberExportRequest {
    filters?: MemberSearchFilters;
    format?: "excel" | "csv";
}

// ─── Responses ─────────────────────────────────────────────────────────────

export interface MemberResponse {
    id: string;
    memberNumber: string;
    firstName: string;
    lastName: string;
    fullName: string;
    phone: string;
    email: string | null;
    gender: Gender | null;
    homeAddress: string | null;
    localGovernmentArea: string | null;
    birthday: Date | null;
    age: number | null;
    isMarried: boolean;
    weddingDate: Date | null;
    profileImageUrl: string | null;
    isBeliever: boolean;
    attendedDCABasic: boolean;
    attendedDCAMerit: boolean;
    attendedEncounter: boolean;
    isFullMember: boolean;
    fullMemberAt: Date | null;
    cellId: string | null;
    cellName: string | null;
    departmentId: string | null;
    departmentName: string | null;
    visitorStatus: VisitorStatus | null;
    visitCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface MemberListResponse {
    members: MemberResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface MemberStatsResponse {
    total: number;
    fullMembers: number;
    visitors: number;
    believers: number;
    conversionRate: number;
    byGender: Record<string, number>;
    byCell: Array<{
        cellId: string | null;
        cellName: string;
        _count: number;
    }>;
    byDepartment: Array<{
        departmentId: string | null;
        departmentName: string;
        _count: number;
    }>;
    byVisitorStatus: Array<{
        status: VisitorStatus;
        _count: number;
    }>;
    byHowHeardAboutUs: Array<{
        source: HowHeardAboutUs;
        _count: number;
    }>;
    growth: {
        lastWeek: number;
        lastMonth: number;
        lastQuarter: number;
        lastYear: number;
    };
    recentActivity: {
        lastWeek: number;
        lastMonth: number;
    };
    dcaAttendance: {
        dcaBasic: number;
        dcaMerit: number;
        encounter: number;
    };
    birthdayThisWeek: number;
    birthdayThisMonth: number;
    membershipAge: {
        lessThan1Month: number;
        between1And6Months: number;
        between6And12Months: number;
        moreThan1Year: number;
    };
}
