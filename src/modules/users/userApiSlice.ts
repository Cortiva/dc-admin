import { apiSlice } from "../../store/apiSlice";
import type {
    BlacklistFilterParams,
    ListBlacklistedResponse,
} from "./types/blacklist.types";
import type {
    ArtisanVerificationFilterParams,
    AuditLogFilterParams,
    ExportParams,
    UserFilterParams,
} from "./types/user.type";

// Define response types
interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    status: string;
    isActive: boolean;
    emailVerified: boolean;
    // add other fields as needed
}

interface UsersListResponse {
    success: boolean;
    data: {
        users: User[];
        total: number;
        page: number;
        limit: number;
    };
}

interface UserResponse {
    success: boolean;
    data: User;
}

interface VerificationQueueResponse {
    success: boolean;
    data: {
        total: number;
        page: number;
        limit: number;
    };
}

interface Strike {
    id: string;
    artisanId: string;
    reason: string;
    severity: "minor" | "major" | "critical";
    createdAt: string;
    expiresAt?: string;
}

interface AuditLog {
    id: string;
    userId: string;
    action: string;
    timestamp: string;
}

interface AuditLogsResponse {
    success: boolean;
    data: {
        logs: AuditLog[];
        total: number;
        page: number;
        limit: number;
    };
}

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchUsers: builder.query<UsersListResponse, UserFilterParams>({
            query: (params: UserFilterParams) => ({
                url: `/admin/users`,
                method: "GET",
                params,
            }),
            keepUnusedDataFor: 1,
            transformResponse: (response: UsersListResponse) => response,
        }),

        exportUsers: builder.mutation<
            string,
            {
                search?: string;
                role?: string;
                isActive?: boolean;
                status?: string;
                emailVerified?: string;
                sortOrder?: "asc" | "desc";
            }
        >({
            query: (params: {
                search?: string;
                role?: string;
                isActive?: boolean;
                status?: string;
                emailVerified?: string;
                sortOrder?: "asc" | "desc";
            }) => ({
                url: `/admin/users/export`,
                method: "GET",
                params,
                responseHandler: "text",
            }),
            transformResponse: (response: string) => {
                return response;
            },
        }),

        fetchUserById: builder.query<UserResponse, string>({
            query: (userId: string) => ({
                url: `/admin/users/${userId}`,
                method: "GET",
            }),
            keepUnusedDataFor: 1,
            transformResponse: (response: UserResponse) => response,
        }),

        updateUserStatus: builder.mutation<
            { success: boolean; message: string },
            {
                userId: string;
                data: {
                    status: string;
                    reason?: string;
                    metadata?: Record<string, unknown>;
                };
            }
        >({
            query: ({
                userId,
                data,
            }: {
                userId: string;
                data: {
                    status: string;
                    reason?: string;
                    metadata?: Record<string, unknown>;
                };
            }) => ({
                url: `/admin/users/${userId}/status`,
                method: "PUT",
                body: data,
            }),
        }),

        createAdmin: builder.mutation<
            { success: boolean; data: User },
            Partial<User>
        >({
            query: (data: Partial<User>) => ({
                url: `/auth/create-admin`,
                method: "POST",
                body: data,
            }),
        }),

        deleteUser: builder.mutation<
            { success: boolean; message: string },
            { userId: string; hard?: boolean }
        >({
            query: ({ userId, hard }: { userId: string; hard?: boolean }) => ({
                url: `/admin/users/${userId}`,
                method: "DELETE",
                params: { hard: hard || false },
            }),
        }),

        // ==================== Artisan Verification ====================
        fetchVerificationQueue: builder.query<
            VerificationQueueResponse,
            ArtisanVerificationFilterParams
        >({
            query: (params: ArtisanVerificationFilterParams) => ({
                url: `/admin/artisans/verification/queue`,
                method: "GET",
                params,
            }),
            keepUnusedDataFor: 1,
            transformResponse: (response: VerificationQueueResponse) =>
                response,
        }),

        verifyArtisan: builder.mutation<
            { success: boolean; message: string },
            {
                artisanId: string;
                data: {
                    status: string;
                    notes?: string;
                    sendNotification?: boolean;
                };
            }
        >({
            query: ({
                artisanId,
                data,
            }: {
                artisanId: string;
                data: {
                    status: string;
                    notes?: string;
                    sendNotification?: boolean;
                };
            }) => ({
                url: `/admin/artisans/${artisanId}/verify`,
                method: "POST",
                body: data,
            }),
        }),

        bulkVerifyArtisans: builder.mutation<
            { success: boolean; message: string; count: number },
            {
                artisanIds: string[];
                status: string;
                notes?: string;
            }
        >({
            query: (data: {
                artisanIds: string[];
                status: string;
                notes?: string;
            }) => ({
                url: `/admin/artisans/verification/bulk`,
                method: "POST",
                body: data,
            }),
        }),

        // ==================== Strike Management ====================
        addStrike: builder.mutation<
            { success: boolean; data: Strike },
            {
                artisanId: string;
                reason: string;
                severity: "minor" | "major" | "critical";
                expiresAt?: string;
                metadata?: Record<string, unknown>;
            }
        >({
            query: (data: {
                artisanId: string;
                reason: string;
                severity: "minor" | "major" | "critical";
                expiresAt?: string;
                metadata?: Record<string, unknown>;
            }) => ({
                url: `/admin/strikes`,
                method: "POST",
                body: data,
            }),
        }),

        removeStrike: builder.mutation<
            { success: boolean; message: string },
            string
        >({
            query: (strikeId: string) => ({
                url: `/admin/strikes/${strikeId}`,
                method: "DELETE",
            }),
        }),

        fetchArtisanStrikes: builder.query<
            { success: boolean; data: Strike[] },
            string
        >({
            query: (artisanId: string) => ({
                url: `/artisans/${artisanId}/strikes`,
                method: "GET",
            }),
            keepUnusedDataFor: 1,
            transformResponse: (response: {
                success: boolean;
                data: Strike[];
            }) => response,
        }),

        // ==================== Blacklist Management ====================
        fetchBlacklistedUsers: builder.query<
            ListBlacklistedResponse,
            BlacklistFilterParams
        >({
            query: (params: BlacklistFilterParams) => ({
                url: `/admin/users/blacklisted`,
                method: "GET",
                params,
            }),
            keepUnusedDataFor: 1,
            transformResponse: (response: {
                success: boolean;
                data: ListBlacklistedResponse;
            }) => response.data,
        }),

        addToBlacklistUser: builder.mutation<
            { success: boolean; data: { id: string; userId: string } },
            {
                userId: string;
                reason: string;
                expiresAt?: string | null;
                notes?: string;
            }
        >({
            query: (data: {
                userId: string;
                reason: string;
                expiresAt?: string | null;
                notes?: string;
            }) => ({
                url: `/admin/blacklist`,
                method: "POST",
                body: data,
            }),
        }),

        removeFromBlacklist: builder.mutation<
            { success: boolean; message: string },
            string
        >({
            query: (blacklistId: string) => ({
                url: `/admin/blacklist/${blacklistId}`,
                method: "DELETE",
            }),
        }),

        checkBlacklistStatus: builder.query<
            {
                success: boolean;
                data: {
                    isBlacklisted: boolean;
                    reason?: string;
                    expiresAt?: string;
                };
            },
            string
        >({
            query: (userId: string) => ({
                url: `/users/${userId}/blacklist-status`,
                method: "GET",
            }),
            keepUnusedDataFor: 1,
            transformResponse: (response: {
                success: boolean;
                data: {
                    isBlacklisted: boolean;
                    reason?: string;
                    expiresAt?: string;
                };
            }) => response,
        }),

        // ==================== Audit Logs ====================
        fetchAuditLogs: builder.query<AuditLogsResponse, AuditLogFilterParams>({
            query: (params: AuditLogFilterParams) => ({
                url: `/admin/audit-logs`,
                method: "GET",
                params,
            }),
            keepUnusedDataFor: 1,
            transformResponse: (response: AuditLogsResponse) => response,
        }),

        // ==================== Export ====================
        exportData: builder.mutation<Blob, ExportParams>({
            query: (data: ExportParams) => ({
                url: `/admin/export`,
                method: "POST",
                body: data,
                responseHandler: (response: Response) => response.blob(),
            }),
        }),
    }),
});

// User Management Hooks
export const {
    useFetchUsersQuery,
    useFetchUserByIdQuery,
    useUpdateUserStatusMutation,
    useCreateAdminMutation,
    useDeleteUserMutation,
} = adminApiSlice;

// Artisan Verification Hooks
export const {
    useFetchVerificationQueueQuery,
    useVerifyArtisanMutation,
    useBulkVerifyArtisansMutation,
} = adminApiSlice;

// Strike Management Hooks
export const {
    useAddStrikeMutation,
    useRemoveStrikeMutation,
    useFetchArtisanStrikesQuery,
} = adminApiSlice;

// Blacklist Management Hooks
export const {
    useFetchBlacklistedUsersQuery,
    useAddToBlacklistUserMutation,
    useRemoveFromBlacklistMutation,
    useCheckBlacklistStatusQuery,
} = adminApiSlice;

// Audit & Export Hooks
export const { useFetchAuditLogsQuery, useExportDataMutation } = adminApiSlice;
