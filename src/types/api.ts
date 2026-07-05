export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiError {
    status: number;
    data: {
        message: string;
        errors?: Record<string, string[]>;
    };
}

export interface SpringPage<T> {
    totalElements: number;
    totalPages: number;
    size: number;
    content: T[];
    number: number;
    numberOfElements: number;
    pageable: {
        offset: number;
        paged: boolean;
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        unpaged: boolean;
    };
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    last: boolean;
    empty: boolean;
}

export function toPaginatedResponse<T>(
    page: SpringPage<T>,
): PaginatedResponse<T> {
    return {
        data: page.content,
        total: page.totalElements,
        page: page.number,
        limit: page.size,
        totalPages: page.totalPages,
    };
}

// Every controller response is wrapped as { message, data }.
// This helper unwraps it once, consistently, for every endpoint below.
export interface ApiEnvelope<T> {
    message: string;
    data: T;
}
