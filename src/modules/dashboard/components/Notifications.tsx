import { Bell, CheckCircle, UserPlus, Calendar, Award, Star, Heart, AlertCircle, ChevronRight } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'event' | 'member' | 'visitor' | 'training';
    timestamp: string;
    isRead: boolean;
    icon?: React.ReactNode;
    actionLink?: string;
}

const mockNotifications: Notification[] = [
    {
        id: 1,
        title: "New Member Registered",
        message: "Oluwaseun Adebayo has successfully completed membership registration.",
        type: "member",
        timestamp: "2025-01-20T09:30:00",
        isRead: false,
        actionLink: "/members/1"
    },
    {
        id: 2,
        title: "First Timer Visitor",
        message: "Chinedu Okonkwo visited for the first time today. Interest level: 85%",
        type: "visitor",
        timestamp: "2025-01-20T08:45:00",
        isRead: false,
        actionLink: "/visitors/1"
    },
    {
        id: 3,
        title: "DCA Basic Completion",
        message: "Congratulations! Amara Eze has completed DCA Basic training with distinction.",
        type: "training",
        timestamp: "2025-01-19T16:20:00",
        isRead: true,
        actionLink: "/members/2"
    },
    {
        id: 4,
        title: "Upcoming Event",
        message: "Dominion City Leadership Conference starts in 3 days. 120 members registered.",
        type: "event",
        timestamp: "2025-01-19T10:15:00",
        isRead: false,
        actionLink: "/events/conference"
    },
    {
        id: 5,
        title: "High Interest Visitor",
        message: "Oluwatobi Adeleke shows 95% interest in becoming a member. Follow up recommended.",
        type: "visitor",
        timestamp: "2025-01-18T14:30:00",
        isRead: true,
        actionLink: "/visitors/3"
    },
    {
        id: 6,
        title: "Birthday Reminder",
        message: "Today is Grace Okafor's birthday. Don't forget to send your wishes!",
        type: "success",
        timestamp: "2025-01-18T08:00:00",
        isRead: false,
        icon: <Heart className="w-5 h-5 text-pink-500" />
    },
    {
        id: 7,
        title: "Second Timer Visitor",
        message: "Samuel Obi visited for the second time this month. Engagement team notified.",
        type: "visitor",
        timestamp: "2025-01-17T11:45:00",
        isRead: true,
        actionLink: "/visitors/10"
    },
    {
        id: 8,
        title: "New Department Assignment",
        message: "Blessing Okafor has been assigned to the Media Department.",
        type: "member",
        timestamp: "2025-01-17T09:20:00",
        isRead: true,
        actionLink: "/members/5"
    },
    {
        id: 9,
        title: "Training Enrollment",
        message: "5 new members enrolled for DCA Maturity training starting next week.",
        type: "training",
        timestamp: "2025-01-16T15:00:00",
        isRead: true,
        actionLink: "/training/dca-maturity"
    },
    {
        id: 10,
        title: "System Update",
        message: "New features available: Enhanced visitor tracking and follow-up reminders.",
        type: "info",
        timestamp: "2025-01-16T10:00:00",
        isRead: false
    }
];

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'success':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'info':
            return <AlertCircle className="w-5 h-5 text-blue-500" />;
        case 'warning':
            return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        case 'event':
            return <Calendar className="w-5 h-5 text-purple-500" />;
        case 'member':
            return <UserPlus className="w-5 h-5 text-green-500" />;
        case 'visitor':
            return <Star className="w-5 h-5 text-blue-500" />;
        case 'training':
            return <Award className="w-5 h-5 text-orange-500" />;
        default:
            return <Bell className="w-5 h-5 text-gray-500" />;
    }
};

const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return then.toLocaleDateString();
};

export function Notifications() {

    const navigate = useNavigate();
    
    const unreadCount = mockNotifications.filter(n => !n.isRead).length;

    return (
        <Card className="bg-card rounded-xl shadow-sm border border-muted-card p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Bell className="w-6 h-6 text-muted-foreground" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold">Notifications</h3>
                </div>
                <button className="text-sm text-primary hover:underline">
                    Mark all as read
                </button>
            </div>

            <div className="space-y-3 max-h-155 overflow-y-auto">
                {mockNotifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`
                            flex items-start gap-3 p-3 rounded-lg transition-colors
                            ${notification.isRead 
                                ? 'hover:bg-muted/30' 
                                : 'bg-primary/5 border-l-4 border-primary/30'
                            }
                            cursor-pointer hover:bg-muted/50
                        `}
                    >
                        {/* Icon */}
                        <div className="shrink-0 mt-0.5">
                            {notification.icon || getNotificationIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className={`text-sm font-medium`}>
                                        {notification.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {notification.message}
                                    </p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                                        {getTimeAgo(notification.timestamp)}
                                    </p>
                                    {!notification.isRead && (
                                        <Badge variant="default" className="mt-1 bg-primary/20 text-primary text-[10px]">
                                            New
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Action Link */}
                            {notification.actionLink && (
                                <div className="mt-2">
                                    <button className="text-xs text-primary hover:underline inline-flex items-center gap-1" onClick={() => navigate(notification.actionLink!)}>
                                        View details
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* View All Button */}
            <div className="mt-4 pt-4 border-t border-muted-card">
                <button className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors" onClick={() => navigate('/system/notifications')}>
                    View all notifications
                </button>
            </div>
        </Card>
    );
}