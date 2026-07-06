// ─── Requests ─────────────────────────────────────────────────────────────────

export interface CreateAreaRequest {
    name: string;
    description?: string;
    leaderId?: string;
}

export interface UpdateAreaRequest {
    name?: string;
    description?: string;
    leaderId?: string | null;
}

export interface CreateZoneRequest {
    name: string;
    description?: string;
    areaId: string;
    leaderId?: string;
}

export interface UpdateZoneRequest {
    name?: string;
    description?: string;
    areaId?: string;
    leaderId?: string | null;
}

export interface CreateCellRequest {
    name: string;
    description?: string;
    zoneId: string;
    leaderId?: string;
}

export interface UpdateCellRequest {
    name?: string;
    description?: string;
    zoneId?: string;
    leaderId?: string | null;
}

export interface AssignLeaderRequest {
    leaderId: string;
}

export interface StructureSearchFilters {
    search?: string;
    areaId?: string;
    zoneId?: string;
    hasLeader?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface ExportStructureRequest {
    type: "areas" | "zones" | "cells";
    filters?: StructureSearchFilters;
    format?: "excel" | "csv";
}

export interface CellTransferRequest {
    memberId: string;
    fromCellId?: string;
    toCellId: string;
    reason?: string;
}

// ─── Responses ────────────────────────────────────────────────────────────────

export interface AreaResponse {
    id: string;
    name: string;
    description: string | null;
    leaderId: string | null;
    leader?: Leader | null;
    zones: ZoneResponse[];
    _count?: {
        zones: number;
        members: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface ZoneResponse {
    id: string;
    name: string;
    description: string | null;
    areaId: string;
    area?: AreaResponse;
    leaderId: string | null;
    leader?: Leader | null;
    cells: CellResponse[];
    _count?: {
        cells: number;
        members: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface Leader {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string | null;
    profileImageUrl: string | null;
    gender: string | null;
}

export interface CellResponse {
    id: string;
    name: string;
    description: string | null;
    zoneId: string;
    zone?: ZoneResponse;
    leaderId: string | null;
    leader?: Leader | null;
    members: Array<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string | null;
        isFullMember: boolean;
        profileImageUrl: string | null;
        gender: string | null;
    }>;
    _count?: {
        members: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface StructureListResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface StructureStatsResponse {
    areas: {
        total: number;
        withLeaders: number;
        withoutLeaders: number;
    };
    zones: {
        total: number;
        withLeaders: number;
        withoutLeaders: number;
    };
    cells: {
        total: number;
        withLeaders: number;
        withoutLeaders: number;
        averageMembers: number;
        maxMembers: number;
        minMembers: number;
    };
    members: {
        total: number;
        inCells: number;
        withoutCell: number;
        averagePerCell: number;
    };
    growth: {
        cellsWithGrowth: number;
        cellsWithDecline: number;
        topGrowingCells: Array<{
            cellId: string;
            cellName: string;
            growth: number;
        }>;
    };
    leaderStats: {
        totalLeaders: number;
        uniqueLeaders: number;
        leadersWithMultipleRoles: number;
        topLeaders: Array<{
            leaderId: string;
            leaderName: string;
            roles: number;
        }>;
    };
}

export interface CellTransferResponse {
    id: string;
    memberId: string;
    fromCellId: string | null;
    toCellId: string;
    reason: string | null;
    transferredAt: Date;
    transferredBy: string;
}
