import {
    type Notification,
    type NotificationFilterParams,
} from "../types/notification.type";

export const mockNotifications: Notification[] = [
    {
        id: 1,
        title: "New Member Registered",
        message:
            "Oluwaseun Adebayo has successfully completed membership registration and has been assigned to the Technical department.",
        type: "member",
        timestamp: "2025-01-20T09:30:00",
        isRead: false,
        actionLink: "/members/1",
        actionLabel: "View Member Profile",
        metadata: { userId: 1 },
    },
    {
        id: 2,
        title: "First Timer Visitor Alert",
        message:
            "Chinedu Okonkwo visited for the first time today. Interest level: 85%. Follow-up recommended within 48 hours.",
        type: "visitor",
        timestamp: "2025-01-20T08:45:00",
        isRead: false,
        actionLink: "/visitors/1",
        actionLabel: "View Visitor Details",
        metadata: { visitorId: 1 },
    },
    {
        id: 3,
        title: "Training Completion Celebration",
        message:
            "Congratulations! Amara Eze has completed DCA Basic training with distinction. Certificate has been generated.",
        type: "training",
        timestamp: "2025-01-19T16:20:00",
        isRead: true,
        actionLink: "/members/2",
        actionLabel: "View Certificate",
        metadata: { userId: 2, trainingId: 1 },
    },
    {
        id: 4,
        title: "Upcoming Event: Leadership Conference",
        message:
            "Dominion City Leadership Conference starts in 3 days. 120 members have registered so far. Final preparations underway.",
        type: "event",
        timestamp: "2025-01-19T10:15:00",
        isRead: false,
        actionLink: "/events/conference",
        actionLabel: "View Event Details",
        metadata: { eventId: 1 },
    },
    {
        id: 5,
        title: "High Potential Visitor",
        message:
            "Oluwatobi Adeleke shows 95% interest in becoming a member. Immediate follow-up recommended for membership conversion.",
        type: "visitor",
        timestamp: "2025-01-18T14:30:00",
        isRead: true,
        actionLink: "/visitors/3",
        actionLabel: "Schedule Follow-up",
        metadata: { visitorId: 3 },
    },
    {
        id: 6,
        title: "Birthday Reminder",
        message:
            "Today is Grace Okafor's 39th birthday. Don't forget to send your birthday wishes and blessings!",
        type: "birthday",
        timestamp: "2025-01-18T08:00:00",
        isRead: false,
        actionLink: "/members/6",
        actionLabel: "Send Birthday Wish",
        metadata: { userId: 6 },
    },
    {
        id: 7,
        title: "Second Timer Visitor",
        message:
            "Samuel Obi visited for the second time this month. Engagement team has been notified for follow-up.",
        type: "visitor",
        timestamp: "2025-01-17T11:45:00",
        isRead: true,
        actionLink: "/visitors/10",
        actionLabel: "View Follow-up Status",
        metadata: { visitorId: 10 },
    },
    {
        id: 8,
        title: "Department Assignment Update",
        message:
            "Blessing Okafor has been assigned to the Media Department. Department head has been notified.",
        type: "member",
        timestamp: "2025-01-17T09:20:00",
        isRead: true,
        actionLink: "/members/5",
        actionLabel: "View Member",
        metadata: { userId: 5 },
    },
    {
        id: 9,
        title: "DCA Maturity Enrollment Surge",
        message:
            "5 new members have enrolled for DCA Maturity training starting next week. Additional resources may be needed.",
        type: "training",
        timestamp: "2025-01-16T15:00:00",
        isRead: true,
        actionLink: "/training/dca-maturity",
        actionLabel: "View Enrollment List",
        metadata: { trainingId: 2 },
    },
    {
        id: 10,
        title: "System Update: New Features Available",
        message:
            "New features available: Enhanced visitor tracking system, automated follow-up reminders, and improved reporting dashboard.",
        type: "system",
        timestamp: "2025-01-16T10:00:00",
        isRead: false,
        actionLink: "/updates",
        actionLabel: "What's New",
    },
    {
        id: 11,
        title: "Prayer Request Submitted",
        message:
            "A new prayer request has been submitted by Esther Adeyemi. Prayer team has been notified.",
        type: "info",
        timestamp: "2025-01-15T18:30:00",
        isRead: true,
        actionLink: "/prayer-requests/1",
        actionLabel: "View Prayer Request",
    },
    {
        id: 12,
        title: "Financial Report Ready",
        message:
            "Monthly financial report for December is now available for review by the finance committee.",
        type: "info",
        timestamp: "2025-01-15T09:00:00",
        isRead: true,
        actionLink: "/reports/financial/december",
        actionLabel: "Download Report",
    },
    {
        id: 13,
        title: "Volunteer Needed",
        message:
            "Children's ministry is looking for 3 volunteers for the upcoming holiday program.",
        type: "info",
        timestamp: "2025-01-14T14:20:00",
        isRead: false,
        actionLink: "/volunteer/children-ministry",
        actionLabel: "Volunteer Now",
    },
    {
        id: 14,
        title: "Maintenance Alert",
        message:
            "Church website will undergo maintenance on Sunday, Jan 22 from 2 AM to 4 AM.",
        type: "warning",
        timestamp: "2025-01-14T11:00:00",
        isRead: true,
        actionLink: "/status",
        actionLabel: "View Details",
    },
    {
        id: 15,
        title: "New Resource Added",
        message:
            "New Bible study materials have been added to the resource library for DCA students.",
        type: "success",
        timestamp: "2025-01-13T13:45:00",
        isRead: true,
        actionLink: "/resources/bible-study",
        actionLabel: "Access Resources",
    },
];

// Helper function to get notifications with pagination
export const getPaginatedNotifications = (
    page: number,
    limit: number,
    filters?: NotificationFilterParams,
) => {
    let filtered = [...mockNotifications];

    if (filters?.type) {
        filtered = filtered.filter((n) => n.type === filters.type);
    }

    if (filters?.isRead !== undefined) {
        filtered = filtered.filter((n) => n.isRead === filters.isRead);
    }

    if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
            (n) =>
                n.title.toLowerCase().includes(searchLower) ||
                n.message.toLowerCase().includes(searchLower),
        );
    }

    filtered.sort(
        (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
        notifications: filtered.slice(start, end),
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
    };
};

export const getUnreadCount = () => {
    return mockNotifications.filter((n) => !n.isRead).length;
};

export const markAsRead = (id: number) => {
    const notification = mockNotifications.find((n) => n.id === id);
    if (notification) {
        notification.isRead = true;
    }
};

export const markAllAsRead = () => {
    mockNotifications.forEach((n) => {
        n.isRead = true;
    });
};
