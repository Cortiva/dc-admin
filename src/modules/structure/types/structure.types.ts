import type { UserRole } from "../../users/types/user.types";

// Minimal leader reference, as returned embedded in Area/Zone/Cell objects.
export interface LeaderRef {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
}

export interface Area {
    id: string;
    name: string;
    description: string;
    leader: LeaderRef | null;
    createdAt: string;
}

export interface Zone {
    id: string;
    name: string;
    description: string;
    areaId: string;
    areaName: string;
    leader: LeaderRef | null;
    createdAt: string;
}

export interface Cell {
    id: string;
    name: string;
    description: string;
    zoneId: string;
    zoneName: string;
    areaId: string;
    areaName: string;
    leader: LeaderRef | null;
    createdAt: string;
}

export interface AreaDetail {
    area: Area;
    zones: Zone[];
}

export interface ZoneDetail {
    zone: Zone;
    cells: Cell[];
}

export interface CreateAreaRequest {
    name: string;
    description: string;
    leaderId: string;
}

export interface UpdateAreaRequest {
    name: string;
    description: string;
}

export interface CreateZoneRequest {
    name: string;
    description: string;
    areaId: string;
    leaderId: string;
}

export interface UpdateZoneRequest {
    name: string;
    description: string;
}

export interface CreateCellRequest {
    name: string;
    description: string;
    zoneId: string;
    leaderId: string;
}

export interface UpdateCellRequest {
    name: string;
    description: string;
}

export interface UpdateLeaderRequest {
    leaderId: string;
}

export interface StructureFilterParams {
    page: number;
    limit: number;
    search?: string;
}
