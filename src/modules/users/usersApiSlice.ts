import { apiSlice } from "../../store/apiSlice";
import type {
    CreateUserRequest,
    UpdateUserRequest,
    ApproveUserRequest,
    RejectUserRequest,
    SuspendUserRequest,
    UserSearchFilters,
    ExportUserRequest,
    BulkUserActionRequest,
    UserResponse,
    UserListResponse,
    UserStatsResponse,
    BulkUserActionResult,
} from "../../types/user.types";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ─── CRUD ───────────────────────────────────────────────────────────

        getUsers: builder.query<UserListResponse, UserSearchFilters>({
            query: (filters) => ({
                url: `/users/search`,
                method: "GET",
                params: filters,
            }),
            providesTags: ["Users"],
        }),

        getUserById: builder.query<UserResponse, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Users", id }],
        }),

        getUserByMemberId: builder.query<UserResponse, string>({
            query: (memberId) => ({
                url: `/users/by-member/${memberId}`,
                method: "GET",
            }),
            providesTags: (result, error, memberId) => [
                { type: "Users", id: memberId },
            ],
        }),

        getUserByEmail: builder.query<UserResponse, string>({
            query: (email) => ({
                url: `/users/by-email/${email}`,
                method: "GET",
            }),
            providesTags: ["Users"],
        }),

        getUserByPhone: builder.query<UserResponse, string>({
            query: (phone) => ({
                url: `/users/by-phone/${phone}`,
                method: "GET",
            }),
            providesTags: ["Users"],
        }),

        createUser: builder.mutation<UserResponse, CreateUserRequest>({
            query: (data) => ({
                url: `/users`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        updateUser: builder.mutation<
            UserResponse,
            { id: string; data: UpdateUserRequest }
        >({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Users", id }],
        }),

        deleteUser: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
        }),

        // ─── Status Management ─────────────────────────────────────────────

        approveUser: builder.mutation<
            UserResponse,
            { id: string; data: ApproveUserRequest }
        >({
            query: ({ id, data }) => ({
                url: `/users/${id}/approve`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Users", id }],
        }),

        rejectUser: builder.mutation<
            UserResponse,
            { id: string; data: RejectUserRequest }
        >({
            query: ({ id, data }) => ({
                url: `/users/${id}/reject`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Users", id }],
        }),

        suspendUser: builder.mutation<
            UserResponse,
            { id: string; data: SuspendUserRequest }
        >({
            query: ({ id, data }) => ({
                url: `/users/${id}/suspend`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Users", id }],
        }),

        activateUser: builder.mutation<
            UserResponse,
            { id: string; activatedById: string }
        >({
            query: ({ id, activatedById }) => ({
                url: `/users/${id}/activate`,
                method: "POST",
                body: { activatedById },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Users", id }],
        }),

        deactivateUser: builder.mutation<
            UserResponse,
            { id: string; deactivatedById: string; reason?: string }
        >({
            query: ({ id, deactivatedById, reason }) => ({
                url: `/users/${id}/deactivate`,
                method: "POST",
                body: { deactivatedById, reason },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Users", id }],
        }),

        getPendingApprovalUsers: builder.query<UserResponse[], void>({
            query: () => ({
                url: `/users/pending-approval`,
                method: "GET",
            }),
            providesTags: ["Users"],
        }),

        // ─── Bulk Actions ──────────────────────────────────────────────────

        bulkUserAction: builder.mutation<
            BulkUserActionResult,
            BulkUserActionRequest
        >({
            query: (data) => ({
                url: `/users/bulk-action`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        // ─── Stats ─────────────────────────────────────────────────────────

        getUserStats: builder.query<UserStatsResponse, void>({
            query: () => ({
                url: `/users/stats`,
                method: "GET",
            }),
            providesTags: ["Users"],
        }),

        // ─── Export ────────────────────────────────────────────────────────

        exportUsers: builder.mutation<Blob, ExportUserRequest>({
            query: (data) => ({
                url: `/users/export`,
                method: "POST",
                body: data,
                responseHandler: (response) => response.blob(),
            }),
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useGetUserByMemberIdQuery,
    useGetUserByEmailQuery,
    useGetUserByPhoneQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useApproveUserMutation,
    useRejectUserMutation,
    useSuspendUserMutation,
    useActivateUserMutation,
    useDeactivateUserMutation,
    useGetPendingApprovalUsersQuery,
    useBulkUserActionMutation,
    useGetUserStatsQuery,
    useExportUsersMutation,
} = userApiSlice;
