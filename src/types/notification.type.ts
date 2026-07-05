export interface NotificationResponse {
    id: string;
    title: string;
    body: string;
    channel: any;
    status: any;
    data: Record<string, unknown> | null;
    readAt: Date | null;
    createdAt: Date;
}

export interface NotificationListResponse {
    data: NotificationResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    unreadCount: number;
}

export interface NotificationListQuery {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
}

export interface BroadcastRequest {
    title: string;
    body: string;
    channel: any;
    segment: "ALL" | "ADMIN" | "SUPER_ADMIN" | "CUSTOM";
    data?: Record<string, unknown>;
}

export interface UnreadCountResponse {
    count: number;
}

export interface MarkReadResponse {
    success: boolean;
    message: string;
}
