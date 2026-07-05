export interface DashboardStatsResponse {
    overview: {
        totalMembers: number;
        totalVisitors: number;
        totalAttendance: number;
        totalDepartments: number;
        totalCells: number;
        growthRate: number;
        conversionRate: number;
        memberRetention: number;
    };
    trends: {
        membership: TrendData[];
        attendance: TrendData[];
        visitors: TrendData[];
        growth: TrendData[];
    };
    metrics: {
        newMembers: MetricData;
        newVisitors: MetricData;
        attendanceRate: MetricData;
        engagementScore: MetricData;
        averageAttendance: MetricData;
        activeCells: MetricData;
    };
    charts: {
        memberDistribution: ChartData;
        attendanceByType: ChartData;
        visitorStatus: ChartData;
        departmentDistribution: ChartData;
        howHeardAboutUs: ChartData;
        educationLevels: ChartData;
        genderDistribution: ChartData;
        membershipAge: ChartData;
        topCells: ChartData;
        topDepartments: ChartData;
    };
    quickStats: {
        todayAttendance: number;
        thisWeekAttendance: number;
        thisMonthAttendance: number;
        newMembersThisMonth: number;
        activeVisitors: number;
        upcomingBirthdays: number;
        pendingApprovals: number;
    };
    alerts: Alert[];
    lastUpdated: Date;
}

export interface TrendData {
    label: string;
    value: number;
    change?: number;
    changePercent?: number;
}

export interface MetricData {
    current: number;
    previous: number;
    change: number;
    changePercent: number;
    trend: "up" | "down" | "stable";
}

export interface ChartData {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor?: string[];
        borderColor?: string;
        fill?: boolean;
    }>;
}

export interface Alert {
    id: string;
    type: "info" | "warning" | "danger" | "success";
    title: string;
    message: string;
    action?: {
        label: string;
        url: string;
    };
    dismissible: boolean;
    createdAt: Date;
}

export interface ReportData {
    title: string;
    subtitle: string;
    generatedAt: Date;
    period: {
        from: Date;
        to: Date;
        label: string;
    };
    summary: Record<string, any>;
    data: Record<string, any>;
    charts?: ChartData[];
    tables?: Array<{
        title: string;
        headers: string[];
        rows: Record<string, any>[];
    }>;
    insights: string[];
    recommendations?: string[];
}

export interface DashboardFilters {
    dateFrom?: Date | string;
    dateTo?: Date | string;
    period?: "day" | "week" | "month" | "quarter" | "year";
    compareWith?: "previous_period" | "same_period_last_year";
}

export interface ReportRequest {
    type: ReportType;
    filters?: DashboardFilters;
    format?: "json" | "excel" | "pdf";
    includeCharts?: boolean;
}

export type ReportType =
    | "member_overview"
    | "visitor_overview"
    | "attendance_overview"
    | "structure_overview"
    | "department_overview"
    | "growth_report"
    | "conversion_report"
    | "demographic_report"
    | "engagement_report"
    | "combined_dashboard";

export interface ExportReportRequest {
    type: ReportType;
    filters?: DashboardFilters;
    format?: "excel" | "pdf";
}
