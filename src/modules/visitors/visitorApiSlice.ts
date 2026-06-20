import { apiSlice } from "../../store/apiSlice";
import type { SpringPage } from "../../types/api";
import type { ApiResponse } from "../../types/base.type";
import type {
    Visitor,
    VisitorDetail,
    CreateVisitorRequest,
    UpdateVisitorRequest,
    AssignVisitorCellRequest,
    RecordVisitRequest,
    VisitorFilterParams,
    VisitTrendsResponse,
    VisitTrendsParams,
    VisitorSummaryResponse,
    RetentionResponse,
    BreakdownResponse,
    DemographicsResponse,
    ByHierarchyResponse,
    MetricsDateRangeParams,
} from "./types/visitor.types";

const toQueryParams = (filters: VisitorFilterParams) => ({
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    status: filters.status || undefined,
    serviceType: filters.serviceType || undefined,
});

export const visitorsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        fetchVisitors: builder.query<
            ApiResponse<SpringPage<Visitor>>,
            VisitorFilterParams
        >({
            query: (filters) => ({
                url: "/visitors",
                params: toQueryParams(filters),
            }),
            providesTags: ["Visitors"],
        }),

        fetchVisitor: builder.query<ApiResponse<VisitorDetail>, string>({
            query: (id) => ({ url: `/visitors/${id}` }),
            providesTags: (_result, _error, id) => [{ type: "Visitors", id }],
        }),

        searchVisitors: builder.query<ApiResponse<Visitor>, string>({
            query: (q) => ({ url: "/visitors/search", params: { q } }),
        }),

        createVisitor: builder.mutation<
            ApiResponse<Visitor>,
            CreateVisitorRequest
        >({
            query: (data) => ({ url: `/visitors`, method: "POST", body: data }),
            invalidatesTags: ["Visitors"],
        }),

        importVisitors: builder.mutation<
            ApiResponse<{ created: number }>,
            CreateVisitorRequest[]
        >({
            query: (data) => ({
                url: `/visitors/import`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Visitors"],
        }),

        updateVisitor: builder.mutation<
            ApiResponse<Visitor>,
            { id: string; data: UpdateVisitorRequest }
        >({
            query: ({ id, data }) => ({
                url: `/visitors/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Visitors",
                { type: "Visitors", id },
            ],
        }),

        assignVisitorCell: builder.mutation<
            ApiResponse<Visitor>,
            { id: string; data: AssignVisitorCellRequest }
        >({
            query: ({ id, data }) => ({
                url: `/visitors/${id}/cell`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Visitors",
                { type: "Visitors", id },
            ],
        }),

        recordVisitorVisit: builder.mutation<
            ApiResponse<VisitorDetail>,
            { id: string; data: RecordVisitRequest }
        >({
            query: ({ id, data }) => ({
                url: `/visitors/${id}/visits`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                "Visitors",
                { type: "Visitors", id },
            ],
        }),

        // ── Metrics ────────────────────────────────────────────
        fetchVisitTrends: builder.query<
            ApiResponse<VisitTrendsResponse>,
            VisitTrendsParams
        >({
            query: (params) => ({
                url: `/metrics/visitors/visit-trends`,
                params,
            }),
            providesTags: ["VisitorMetrics"],
        }),

        fetchVisitorSummary: builder.query<
            ApiResponse<VisitorSummaryResponse>,
            MetricsDateRangeParams
        >({
            query: (params) => ({ url: `/metrics/visitors/summary`, params }),
            providesTags: ["VisitorMetrics"],
        }),

        fetchVisitorRetention: builder.query<
            ApiResponse<RetentionResponse>,
            MetricsDateRangeParams
        >({
            query: (params) => ({ url: `/metrics/visitors/retention`, params }),
            providesTags: ["VisitorMetrics"],
        }),

        fetchVisitorLikedMost: builder.query<
            ApiResponse<BreakdownResponse>,
            MetricsDateRangeParams
        >({
            query: (params) => ({
                url: `/metrics/visitors/liked-most`,
                params,
            }),
            providesTags: ["VisitorMetrics"],
        }),

        fetchVisitorHowHeard: builder.query<
            ApiResponse<BreakdownResponse>,
            MetricsDateRangeParams
        >({
            query: (params) => ({ url: `/metrics/visitors/how-heard`, params }),
            providesTags: ["VisitorMetrics"],
        }),

        fetchVisitorDemographics: builder.query<
            ApiResponse<DemographicsResponse>,
            MetricsDateRangeParams
        >({
            query: (params) => ({
                url: `/metrics/visitors/demographics`,
                params,
            }),
            providesTags: ["VisitorMetrics"],
        }),

        fetchVisitorsByHierarchy: builder.query<
            ApiResponse<ByHierarchyResponse>,
            MetricsDateRangeParams
        >({
            query: (params) => ({
                url: `/metrics/visitors/by-hierarchy`,
                params,
            }),
            providesTags: ["VisitorMetrics"],
        }),
    }),
});

export const {
    useFetchVisitorsQuery,
    useFetchVisitorQuery,
    useSearchVisitorsQuery,
    useCreateVisitorMutation,
    useImportVisitorsMutation,
    useUpdateVisitorMutation,
    useAssignVisitorCellMutation,
    useRecordVisitorVisitMutation,
    useFetchVisitTrendsQuery,
    useFetchVisitorSummaryQuery,
    useFetchVisitorRetentionQuery,
    useFetchVisitorLikedMostQuery,
    useFetchVisitorHowHeardQuery,
    useFetchVisitorDemographicsQuery,
    useFetchVisitorsByHierarchyQuery,
} = visitorsApiSlice;
