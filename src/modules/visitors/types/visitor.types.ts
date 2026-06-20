export type Gender = "MALE" | "FEMALE";

export type HowHeardAboutUs =
    | "SOCIAL_MEDIA"
    | "FRIEND_OR_FAMILY"
    | "CHURCH_MEMBER"
    | "FLYER_OR_BANNER"
    | "WEBSITE"
    | "WALK_IN"
    | "OTHER";

export type LevelOfEducation =
    | "NO_FORMAL_EDUCATION"
    | "PRIMARY"
    | "SECONDARY"
    | "TERTIARY"
    | "POSTGRADUATE";

export type ServiceType =
    | "SUNDAY_SERVICE"
    | "MIDWEEK_SERVICE"
    | "SPECIAL_EVENT"
    | "OTHER";

export type VisitorStatus = "FIRST_TIMER" | "SECOND_TIMER" | "RETURNING";

// NOTE: the exact set of values for HowHeardAboutUs and LevelOfEducation
// was not fully enumerated in the spec — only one example value was given
// for each ("SOCIAL_MEDIA", "NO_FORMAL_EDUCATION"). The lists above are a
// reasonable real-world guess to make the dropdowns usable, but they MUST
// be confirmed against the actual backend enum before going live — an
// import sheet built on the wrong enum values will fail validation against
// the real API even though it passes client-side checks.

export interface Visitor {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    gender: Gender;
    homeAddress: string;
    howHeardAboutUs: HowHeardAboutUs;
    age: number;
    levelOfEducation: LevelOfEducation;
    localGovernmentArea: string;
    birthday: string; // YYYY-MM-DD
    preferenceToReturn: boolean;
    whatTheyLovedMost: string;
    isBeliever: boolean;
    status: VisitorStatus;
    visitCount: number;
    recordedByEmail: string;
    createdAt: string;
    cellId: string | null;
    cellName: string | null;
}

export interface VisitorVisit {
    id: string;
    visitDate: string;
    serviceType: ServiceType;
    notes: string;
    recordedByEmail: string;
    createdAt: string;
}

export interface VisitorDetail {
    visitor: Visitor;
    visits: VisitorVisit[];
}

// Shape of a single record for create / import. This is also the shape
// validated row-by-row in the import review table.
export interface CreateVisitorRequest {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    gender: Gender;
    homeAddress: string;
    howHeardAboutUs: HowHeardAboutUs;
    age: number;
    levelOfEducation: LevelOfEducation;
    localGovernmentArea: string;
    birthday: string;
    preferenceToReturn: boolean;
    whatTheyLovedMost: string;
    isBeliever: boolean;
    serviceType: ServiceType;
    visitDate: string;
    notes: string;
}

export interface UpdateVisitorRequest {
    firstName: string;
    lastName: string;
    email: string;
    gender: Gender;
    homeAddress: string;
    howHeardAboutUs: HowHeardAboutUs;
    age: number;
    levelOfEducation: LevelOfEducation;
    localGovernmentArea: string;
    birthday: string;
    preferenceToReturn: boolean;
    whatTheyLovedMost: string;
    isBeliever: boolean;
}

export interface AssignVisitorCellRequest {
    cellId: string;
}

export interface RecordVisitRequest {
    serviceType: ServiceType;
    visitDate: string;
    notes: string;
}

export interface VisitorFilterParams {
    page: number;
    limit: number;
    search?: string;
    status?: VisitorStatus | "";
    serviceType?: ServiceType | "";
}

// ── Metrics ──────────────────────────────────────────────────

export interface VisitTrendPoint {
    date: string;
    serviceType: ServiceType;
    firstTimers: number;
    secondTimers: number;
    returningVisitors: number;
    total: number;
}

export interface VisitTrendsResponse {
    points: VisitTrendPoint[];
    totalFirstTimers: number;
    totalSecondTimers: number;
    totalReturning: number;
    totalVisits: number;
}

export interface VisitorSummaryResponse {
    totalVisitors: number;
    firstTimers: number;
    secondTimers: number;
    returningVisitors: number;
    totalVisits: number;
}

export interface RetentionResponse {
    saidTheyWouldReturn: number;
    actuallyReturned: number;
    retentionRate: number;
}

export interface BreakdownEntry {
    label: string;
    count: number;
    percentage: number;
}

export interface BreakdownResponse {
    entries: BreakdownEntry[];
}

export interface DemographicsResponse {
    byGender: BreakdownEntry[];
    byAgeGroup: BreakdownEntry[];
    byEducationLevel: BreakdownEntry[];
}

export interface HierarchyEntry {
    id: string;
    name: string;
    zoneName: string;
    areaName: string;
    visitorCount: number;
}

export interface ByHierarchyResponse {
    byArea: HierarchyEntry[];
    byZone: HierarchyEntry[];
    byCell: HierarchyEntry[];
}

export interface MetricsDateRangeParams {
    from?: string;
    to?: string;
}

export interface VisitTrendsParams extends MetricsDateRangeParams {
    serviceType?: ServiceType;
}
