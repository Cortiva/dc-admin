// ==================== Base Types ====================

export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
    isDeleted?: boolean;
    deletedAt?: string | null;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    errors?: string[];
}
