export interface Notification {
    id: number;
    title: string;
    message: string;
    type:
        | "success"
        | "info"
        | "warning"
        | "event"
        | "member"
        | "visitor"
        | "training"
        | "birthday"
        | "system";
    timestamp: string;
    isRead: boolean;
    icon?: React.ReactNode;
    actionLink?: string;
    actionLabel?: string;
    metadata?: {
        userId?: number;
        visitorId?: number;
        eventId?: number;
        trainingId?: number;
    };
}

export interface NotificationFilterParams {
    page: number;
    limit: number;
    type?: string;
    isRead?: boolean;
    search?: string;
    startDate?: string;
    endDate?: string;
}

export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
