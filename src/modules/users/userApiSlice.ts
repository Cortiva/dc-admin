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

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchUsers: builder.query({
            query: (params: UserFilterParams) => ({
                url: `/admin/users`,
                method: "GET",
                params,
            }),
            keepUnusedDataFor: 1,
            transformResponse: (response) => response,
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
            query: (params) => ({
                url: `/admin/users/export`,
                method: "GET",
                params,
                responseHandler: "text",
            }),
            transformResponse: (response: string) => {
                return response;
            },
        }),

        fetchUserById: builder.query({
            query: (userId: string) => ({
                url: `/admin/users/${userId}`,
                method: "GET",
            }),
            keepUnusedDataFor: 1,
            transformResponse: (response) => response,
        }),

        updateUserStatus: builder.mutation({
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

        createAdmin: builder.mutation({
            query: (data) => ({
                url: `/auth/create-admin`,
                method: "POST",
                body: data,
            }),
        }),

        deleteUser: builder.mutation({
            query: ({ userId, hard }: { userId: string; hard?: boolean }) => ({
                url: `/admin/users/${userId}`,
                method: "DELETE",
                params: { hard: hard || false },
            }),
        }),

        // ==================== Artisan Verification ====================
        fetchVerificationQueue: builder.query({
            query: (params: ArtisanVerificationFilterParams) => ({
                url: `/admin/artisans/verification/queue`,
                method: "GET",
                params,
            }),
            keepUnusedDataFor: 1,
            transformResponse: (response) => response,
        }),

        verifyArtisan: builder.mutation({
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

        bulkVerifyArtisans: builder.mutation({
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
        addStrike: builder.mutation({
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

        removeStrike: builder.mutation({
            query: (strikeId: string) => ({
                url: `/admin/strikes/${strikeId}`,
                method: "DELETE",
            }),
        }),

        fetchArtisanStrikes: builder.query({
            query: (artisanId: string) => ({
                url: `/artisans/${artisanId}/strikes`,
                method: "GET",
            }),
            keepUnusedDataFor: 1,
            transformResponse: (response) => response,
        }),

        // ==================== Blacklist Management ====================
        fetchBlacklistedUsers: builder.query<
            ListBlacklistedResponse,
            BlacklistFilterParams
        >({
            query: (params) => ({
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

        addToBlacklistUser: builder.mutation({
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

        removeFromBlacklist: builder.mutation({
            query: (blacklistId: string) => ({
                url: `/admin/blacklist/${blacklistId}`,
                method: "DELETE",
            }),
        }),

        checkBlacklistStatus: builder.query({
            query: (userId: string) => ({
                url: `/users/${userId}/blacklist-status`,
                method: "GET",
            }),
            keepUnusedDataFor: 1,
            transformResponse: (response) => response,
        }),

        // ==================== Audit Logs ====================
        fetchAuditLogs: builder.query({
            query: (params: AuditLogFilterParams) => ({
                url: `/admin/audit-logs`,
                method: "GET",
                params,
            }),
            keepUnusedDataFor: 1,
            transformResponse: (response) => response,
        }),

        // ==================== Export ====================
        exportData: builder.mutation<Blob, ExportParams>({
            query: (data) => ({
                url: `/admin/export`,
                method: "POST",
                body: data,
                responseHandler: (response) => response.blob(),
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
