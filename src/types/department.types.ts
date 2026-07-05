// types/department.types.ts

// ─── Requests ─────────────────────────────────────────────────────────────────

export interface CreateDepartmentRequest {
    name: string;
    description?: string;
    leaderId?: string;
    parentDepartmentId?: string;
    color?: string;
    icon?: string;
}

export interface UpdateDepartmentRequest {
    name?: string;
    description?: string | null;
    leaderId?: string | null;
    parentDepartmentId?: string | null;
    color?: string | null;
    icon?: string | null;
    isActive?: boolean;
}

export interface DepartmentSearchFilters {
    search?: string;
    parentDepartmentId?: string | null;
    hasLeader?: boolean;
    isActive?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface ExportDepartmentRequest {
    filters?: DepartmentSearchFilters;
    format?: "excel" | "csv";
}

// ─── Responses ────────────────────────────────────────────────────────────────

export interface DepartmentResponse {
    id: string;
    name: string;
    description: string | null;
    leaderId: string | null;
    leader?: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string | null;
        profileImageUrl: string | null;
    } | null;
    parentDepartmentId: string | null;
    parentDepartment?: {
        id: string;
        name: string;
        description: string | null;
    } | null;
    subDepartments?: Array<{
        id: string;
        name: string;
        description: string | null;
        memberCount: number;
    }>;
    color: string | null;
    icon: string | null;
    isActive: boolean;
    memberCount: number;
    subDepartmentCount?: number;
    members?: Array<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string | null;
        isFullMember: boolean;
        profileImageUrl: string | null;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface DepartmentListResponse {
    departments: DepartmentResponse[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface DepartmentStatsResponse {
    overview: {
        totalDepartments: number;
        activeDepartments: number;
        totalMembers: number;
        averageMembersPerDepartment: number;
        departmentsWithLeaders: number;
        departmentsWithoutLeaders: number;
    };
    byDepartment: Array<{
        departmentId: string;
        departmentName: string;
        memberCount: number;
        leaderName: string | null;
        growth?: number;
    }>;
    hierarchy: {
        rootDepartments: number;
        subDepartments: number;
        maxDepth: number;
    };
    topDepartments: Array<{
        departmentId: string;
        departmentName: string;
        memberCount: number;
        growth: number;
    }>;
    memberDistribution: {
        fullMembers: number;
        visitors: number;
        byDepartment: Array<{
            departmentId: string;
            departmentName: string;
            fullMembers: number;
            visitors: number;
        }>;
    };
    recentActivity: {
        newMembers: number;
        transfers: number;
        lastWeek: number;
        lastMonth: number;
    };
}

export interface DepartmentMemberResponse {
    id: string;
    memberId: string;
    departmentId: string;
    role?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    isActive?: boolean;
    notes?: string | null;
    member: {
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string | null;
        isFullMember: boolean;
        profileImageUrl: string | null;
        gender: string | null;
    };
    department: {
        id: string;
        name: string;
    };
    assignedAt?: Date;
    createdAt: string;
    updatedAt: string;
}
