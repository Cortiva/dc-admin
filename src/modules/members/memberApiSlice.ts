import { apiSlice } from "../../store/apiSlice";
import type {
    CreateMemberRequest,
    MemberAssignCellRequest,
    MemberAssignDepartmentRequest,
    MemberCheckInRequest,
    MemberExportRequest,
    MemberListResponse,
    MemberPromoteRequest,
    MemberResponse,
    MemberSearchFilters,
    MemberStatsResponse,
    UpdateMemberRequest,
} from "../../types/member.type";

interface CheckInResponse {
    member: MemberResponse;
    visitorProfile: any;
    visit: any;
    isNewMember: boolean;
    isFirstVisit: boolean;
    isSecondVisit: boolean;
    status: string;
}

export const memberApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ─── CRUD ───────────────────────────────────────────────────────────

        getMembers: builder.query<MemberListResponse, MemberSearchFilters>({
            query: (filters) => ({
                url: `/members`,
                method: "GET",
                params: filters,
            }),
            providesTags: ["Members"],
        }),

        getMemberById: builder.query<MemberResponse, string>({
            query: (id) => ({
                url: `/members/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Members", id }],
        }),

        createMember: builder.mutation<MemberResponse, CreateMemberRequest>({
            query: (data) => ({
                url: `/members`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Members"],
        }),

        updateMember: builder.mutation<
            MemberResponse,
            { id: string; data: UpdateMemberRequest }
        >({
            query: ({ id, data }) => ({
                url: `/members/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Members", id },
            ],
        }),

        deleteMember: builder.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/members/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Members"],
        }),

        // ─── Check In ──────────────────────────────────────────────────────

        checkInMember: builder.mutation<CheckInResponse, MemberCheckInRequest>({
            query: (data) => ({
                url: `/members/check-in`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Members", "Dashboard"],
        }),

        // ─── Promotion ─────────────────────────────────────────────────────

        promoteMember: builder.mutation<MemberResponse, MemberPromoteRequest>({
            query: (data) => ({
                url: `/members/${data.memberId}/promote`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { memberId }) => [
                { type: "Members", id: memberId },
            ],
        }),

        // ─── Cell Assignment ──────────────────────────────────────────────

        assignToCell: builder.mutation<MemberResponse, MemberAssignCellRequest>(
            {
                query: ({ memberId, cellId }) => ({
                    url: `/members/${memberId}/cell`,
                    method: "PUT",
                    body: { cellId },
                }),
                invalidatesTags: (result, error, { memberId }) => [
                    { type: "Members", id: memberId },
                ],
            },
        ),

        // ─── Department Assignment ────────────────────────────────────────

        assignToDepartment: builder.mutation<
            MemberResponse,
            MemberAssignDepartmentRequest
        >({
            query: ({ memberId, departmentId }) => ({
                url: `/members/${memberId}/department`,
                method: "PUT",
                body: { departmentId },
            }),
            invalidatesTags: (result, error, { memberId }) => [
                { type: "Members", id: memberId },
            ],
        }),

        // ─── Stats ─────────────────────────────────────────────────────────

        getMemberStats: builder.query<MemberStatsResponse, void>({
            query: () => ({
                url: `/members/stats`,
                method: "GET",
            }),
            providesTags: ["Members"],
        }),

        getMemberGrowth: builder.query<
            any,
            { period?: "daily" | "weekly" | "monthly"; limit?: number }
        >({
            query: (params) => ({
                url: `/members/growth`,
                method: "GET",
                params,
            }),
            providesTags: ["Members"],
        }),

        // ─── Export ────────────────────────────────────────────────────────

        exportMembers: builder.mutation<Blob, MemberExportRequest>({
            query: (data) => ({
                url: `/members/export`,
                method: "POST",
                body: data,
                responseHandler: (response) => response.blob(),
            }),
        }),

        // ─── Bulk Import ──────────────────────────────────────────────────
        bulkImportMembers: builder.mutation<
            { total: number; created: number; failed: number; errors: any[] },
            FormData
        >({
            query: (formData) => ({
                url: `/members/bulk-import`,
                method: "POST",
                body: formData,
                headers: {
                    // Let the browser set the Content-Type for FormData
                },
            }),
            invalidatesTags: ["Members"],
        }),

        // ─── Get Members Needing Action ───────────────────────────────────

        getMembersNeedingAction: builder.query<MemberResponse[], void>({
            query: () => ({
                url: `/members/needing-action`,
                method: "GET",
            }),
            providesTags: ["Members"],
        }),

        // ─── Get Birthdays ────────────────────────────────────────────────

        getUpcomingBirthdays: builder.query<
            MemberResponse[],
            { days?: number }
        >({
            query: (params) => ({
                url: `/members/birthdays`,
                method: "GET",
                params,
            }),
            providesTags: ["Members"],
        }),
    }),
});

export const {
    useGetMembersQuery,
    useGetMemberByIdQuery,
    useCreateMemberMutation,
    useUpdateMemberMutation,
    useDeleteMemberMutation,
    useCheckInMemberMutation,
    usePromoteMemberMutation,
    useAssignToCellMutation,
    useAssignToDepartmentMutation,
    useGetMemberStatsQuery,
    useGetMemberGrowthQuery,
    useExportMembersMutation,
    useBulkImportMembersMutation,
    useGetMembersNeedingActionQuery,
    useGetUpcomingBirthdaysQuery,
} = memberApiSlice;
