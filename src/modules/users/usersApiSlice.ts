import { apiSlice } from "../../store/apiSlice";
import type { SpringPage } from "../../types/api";
import type { ApiResponse } from "../../types/base.type";
import type {
    AcceptInviteRequest,
    InviteUserRequest,
    UpdateProfileRequest,
    User,
    UserFilterParams,
} from "./types/user.types";

interface MessageResponse {
    message: string;
}

const toQueryParams = (filters: UserFilterParams) => ({
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    role: filters.role || undefined,
    status: filters.status || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
});

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        inviteMember: builder.mutation<ApiResponse<User>, InviteUserRequest>({
            query: (data) => ({
                url: `/users/invite`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        rejectMember: builder.mutation<
            ApiResponse<User>,
            { id: string; reason: string }
        >({
            query: ({ id, reason }) => ({
                url: `/users/${id}/reject`,
                method: "PATCH",
                body: { reason },
            }),
            invalidatesTags: ["Users"],
        }),

        approveMember: builder.mutation<ApiResponse<User>, string>({
            query: (id) => ({
                url: `/users/${id}/approve`,
                method: "PATCH",
                body: {},
            }),
            invalidatesTags: ["Users"],
        }),

        suspendUser: builder.mutation<ApiResponse<User>, string>({
            query: (id) => ({
                url: `/users/${id}/suspend`,
                method: "PATCH",
                body: {},
            }),
            invalidatesTags: ["Users"],
        }),

        reactivateUser: builder.mutation<ApiResponse<User>, string>({
            query: (id) => ({
                url: `/users/${id}/reactivate`,
                method: "PATCH",
                body: {},
            }),
            invalidatesTags: ["Users"],
        }),

        updateProfile: builder.mutation<
            ApiResponse<User>,
            UpdateProfileRequest
        >({
            query: (data) => ({
                url: `/users/me`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Users"],
        }),

        // NOTE: the response example given for this endpoint described a
        // Zone/Department object (name, areaId, leader, etc.), which
        // doesn't match the Users domain. Typed here against SpringPage<User>
        // instead, consistent with the "Fetch User" (singular) example,
        // which clearly is the User shape. Confirm against the real backend
        // response before shipping.
        fetchUsers: builder.query<
            ApiResponse<SpringPage<User>>,
            UserFilterParams
        >({
            query: (filters) => ({
                url: "/users",
                params: toQueryParams(filters),
            }),
            providesTags: ["Users"],
        }),

        fetchUser: builder.query<ApiResponse<User>, string>({
            query: (id) => ({ url: `/users/${id}` }),
            providesTags: ["Users"],
        }),

        acceptInvite: builder.mutation<MessageResponse, AcceptInviteRequest>({
            query: (data) => ({
                url: `/auth/accept-invite`,
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useInviteMemberMutation,
    useRejectMemberMutation,
    useApproveMemberMutation,
    useSuspendUserMutation,
    useReactivateUserMutation,
    useUpdateProfileMutation,
    useFetchUsersQuery,
    useFetchUserQuery,
    useAcceptInviteMutation,
} = usersApiSlice;
