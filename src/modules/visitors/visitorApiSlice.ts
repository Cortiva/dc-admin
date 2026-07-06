import { apiSlice } from "../../store/apiSlice";
import type {
    CheckInResponse,
    CheckInVisitorRequest,
    ExportVisitorsRequest,
    RecordVisitRequest,
    UpdateVisitorProfileRequest,
    VisitorListResponse,
    VisitorProfileResponse,
    VisitorSearchFilters,
    VisitorStatsResponse,
    VisitResponse,
} from "../../types/visitor.types";

export const visitorApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ─── Check In ──────────────────────────────────────────────────────

        checkInVisitor: builder.mutation<
            CheckInResponse,
            CheckInVisitorRequest
        >({
            query: (data) => ({
                url: `/visitors/check-in`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Visitors", "VisitorMetrics", "Dashboard"],
        }),

        // ─── Record Visit ──────────────────────────────────────────────────

        recordVisit: builder.mutation<
            { visit: VisitResponse; visitor: VisitorProfileResponse },
            RecordVisitRequest
        >({
            query: (data) => ({
                url: `/visitors/record-visit`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Visitors", "VisitorMetrics", "Dashboard"],
        }),

        // ─── Get Visitor ──────────────────────────────────────────────────

        getVisitorByMemberId: builder.query<VisitorProfileResponse, string>({
            query: (memberId) => ({
                url: `/visitors/${memberId}`,
                method: "GET",
            }),
            providesTags: (_, __, memberId) => [
                { type: "Visitors", id: memberId },
            ],
        }),

        // ─── Search ─────────────────────────────────────────────────────────

        searchVisitors: builder.query<
            VisitorListResponse,
            VisitorSearchFilters
        >({
            query: (filters) => ({
                url: `/visitors/search`,
                method: "GET",
                params: filters,
                cache: "no-store",
            }),
            providesTags: ["Visitors"],
        }),

        // ─── Update Profile ────────────────────────────────────────────────

        updateVisitorProfile: builder.mutation<
            VisitorProfileResponse,
            { memberId: string; data: UpdateVisitorProfileRequest }
        >({
            query: ({ memberId, data }) => ({
                url: `/visitors/${memberId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_, __, { memberId }) => [
                { type: "Visitors", id: memberId },
            ],
        }),

        // ─── Stats ──────────────────────────────────────────────────────────

        getVisitorStats: builder.query<VisitorStatsResponse, void>({
            query: () => ({
                url: `/visitors/stats`,
                method: "GET",
            }),
            providesTags: ["VisitorMetrics"],
        }),

        getVisitorFunnel: builder.query<any[], void>({
            query: () => ({
                url: `/visitors/funnel`,
                method: "GET",
            }),
            providesTags: ["VisitorMetrics"],
        }),

        getInactiveVisitors: builder.query<any[], { days?: number }>({
            query: (params) => ({
                url: `/visitors/inactive`,
                method: "GET",
                params,
            }),
            providesTags: ["Visitors"],
        }),

        // ─── Export ─────────────────────────────────────────────────────────

        exportVisitors: builder.mutation<Blob, ExportVisitorsRequest>({
            query: (data) => ({
                url: `/visitors/export`,
                method: "POST",
                body: data,
                responseHandler: (response) => response.blob(),
            }),
        }),
    }),
});

export const {
    useCheckInVisitorMutation,
    useRecordVisitMutation,
    useGetVisitorByMemberIdQuery,
    useSearchVisitorsQuery,
    useUpdateVisitorProfileMutation,
    useGetVisitorStatsQuery,
    useGetVisitorFunnelQuery,
    useGetInactiveVisitorsQuery,
    useExportVisitorsMutation,
} = visitorApiSlice;
