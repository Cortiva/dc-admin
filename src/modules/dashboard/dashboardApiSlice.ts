import { apiSlice } from "../../store/apiSlice";
import type { ApiEnvelope } from "../../types/api";
import type {
    Alert,
    ChartData,
    DashboardFilters,
    DashboardStatsResponse,
    ExportReportRequest,
    ReportData,
    ReportRequest,
    TrendData,
} from "../../types/dashboard.types";

interface QuickStatsResponse {
    todayAttendance: number;
    thisWeekAttendance: number;
    thisMonthAttendance: number;
    newMembersThisMonth: number;
    activeVisitors: number;
    upcomingBirthdays: number;
    pendingApprovals: number;
}

interface TrendsResponse {
    membership: TrendData[];
    visitors: TrendData[];
    growth: TrendData[];
    labels: string[];
}

interface ChartsResponse {
    memberDistribution: ChartData;
    visitorStatus: ChartData;
    departmentDistribution: ChartData;
    howHeardAboutUs: ChartData;
    educationLevels: ChartData;
    genderDistribution: ChartData;
    membershipAge: ChartData;
    topCells: ChartData;
    topDepartments: ChartData;
}

interface QuickStatsResponse {
    newMembersThisMonth: number;
    activeVisitors: number;
    upcomingBirthdays: number;
    pendingApprovals: number;
}

interface TrendsResponse {
    membership: TrendData[];
    visitors: TrendData[];
    growth: TrendData[];
    labels: string[];
}

interface ChartsResponse {
    memberDistribution: ChartData;
    visitorStatus: ChartData;
    departmentDistribution: ChartData;
    howHeardAboutUs: ChartData;
    educationLevels: ChartData;
    genderDistribution: ChartData;
    membershipAge: ChartData;
    topCells: ChartData;
    topDepartments: ChartData;
}

export const dashboardApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ─── Get Complete Dashboard ────────────────────────────────────────

        getDashboard: builder.query<DashboardStatsResponse, DashboardFilters>({
            query: (filters) => ({
                url: `/dashboard`,
                method: "GET",
                params: filters,
            }),
            transformResponse: (
                response: ApiEnvelope<DashboardStatsResponse>,
            ) => response.data,
            providesTags: ["Dashboard"],
        }),

        // ─── Get Quick Stats ──────────────────────────────────────────────

        getQuickStats: builder.query<QuickStatsResponse, void>({
            query: () => ({
                url: `/dashboard/quick-stats`,
                method: "GET",
            }),
            transformResponse: (response: ApiEnvelope<QuickStatsResponse>) =>
                response.data,
            providesTags: ["Dashboard"],
        }),

        // ─── Get Trends ──────────────────────────────────────────────────

        getTrends: builder.query<TrendsResponse, DashboardFilters>({
            query: (filters) => ({
                url: `/dashboard/trends`,
                method: "GET",
                params: filters,
            }),
            transformResponse: (response: ApiEnvelope<TrendsResponse>) =>
                response.data,
            providesTags: ["Dashboard"],
        }),

        // ─── Get Charts ──────────────────────────────────────────────────

        getCharts: builder.query<ChartsResponse, DashboardFilters>({
            query: (filters) => ({
                url: `/dashboard/charts`,
                method: "GET",
                params: filters,
            }),
            transformResponse: (response: ApiEnvelope<ChartsResponse>) =>
                response.data,
            providesTags: ["Dashboard"],
        }),

        // ─── Get Alerts ──────────────────────────────────────────────────
        // ✅ Fix: the backend returns a plain array, not { alerts: [...] }

        getAlerts: builder.query<Alert[], void>({
            query: () => ({
                url: `/dashboard/alerts`,
                method: "GET",
            }),
            transformResponse: (response: ApiEnvelope<Alert[]>) =>
                response.data,
            providesTags: ["Dashboard"],
        }),

        // ─── Generate Report ─────────────────────────────────────────────

        generateReport: builder.mutation<ReportData, ReportRequest>({
            query: (data) => ({
                url: `/dashboard/reports`,
                method: "POST",
                body: data,
            }),
            transformResponse: (response: ApiEnvelope<ReportData>) =>
                response.data,
        }),

        // ─── Export Report ───────────────────────────────────────────────
        // Not wrapped — controller streams a raw xlsx buffer, so no
        // transformResponse here; leave as-is.

        exportReport: builder.mutation<Blob, ExportReportRequest>({
            query: (data) => ({
                url: `/dashboard/reports/export`,
                method: "POST",
                body: data,
                responseHandler: (response) => response.blob(),
            }),
        }),

        // ─── Specific Reports ────────────────────────────────────────────

        getMemberOverview: builder.query<any, DashboardFilters>({
            query: (filters) => ({
                url: `/dashboard/reports/member-overview`,
                method: "GET",
                params: filters,
            }),
            transformResponse: (response: ApiEnvelope<any>) => response.data,
        }),

        getVisitorOverview: builder.query<any, DashboardFilters>({
            query: (filters) => ({
                url: `/dashboard/reports/visitor-overview`,
                method: "GET",
                params: filters,
            }),
            transformResponse: (response: ApiEnvelope<any>) => response.data,
        }),

        getAttendanceOverview: builder.query<any, DashboardFilters>({
            query: (filters) => ({
                url: `/dashboard/reports/attendance-overview`,
                method: "GET",
                params: filters,
            }),
            transformResponse: (response: ApiEnvelope<any>) => response.data,
        }),

        getGrowthReport: builder.query<any, DashboardFilters>({
            query: (filters) => ({
                url: `/dashboard/reports/growth`,
                method: "GET",
                params: filters,
            }),
            transformResponse: (response: ApiEnvelope<any>) => response.data,
        }),

        getConversionReport: builder.query<any, DashboardFilters>({
            query: (filters) => ({
                url: `/dashboard/reports/conversion`,
                method: "GET",
                params: filters,
            }),
            transformResponse: (response: ApiEnvelope<any>) => response.data,
        }),

        getDemographicReport: builder.query<any, void>({
            query: () => ({
                url: `/dashboard/reports/demographic`,
                method: "GET",
            }),
            transformResponse: (response: ApiEnvelope<any>) => response.data,
        }),

        getEngagementReport: builder.query<any, void>({
            query: () => ({
                url: `/dashboard/reports/engagement`,
                method: "GET",
            }),
            transformResponse: (response: ApiEnvelope<any>) => response.data,
        }),
    }),
});

export const {
    useGetDashboardQuery,
    useGetQuickStatsQuery,
    useGetTrendsQuery,
    useGetChartsQuery,
    useGetAlertsQuery,
    useGenerateReportMutation,
    useExportReportMutation,
    useGetMemberOverviewQuery,
    useGetVisitorOverviewQuery,
    useGetAttendanceOverviewQuery,
    useGetGrowthReportQuery,
    useGetConversionReportQuery,
    useGetDemographicReportQuery,
    useGetEngagementReportQuery,
} = dashboardApiSlice;
