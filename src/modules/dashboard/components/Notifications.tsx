import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

interface Notification {
    id: string;
    type: "info" | "warning" | "danger" | "success";
    title: string;
    message: string;
    action?: {
        label: string;
        url: string;
    };
    createdAt: Date;
}

interface NotificationsProps {
    alerts: Notification[];
}

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'success':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'info':
            return <AlertCircle className="w-5 h-5 text-blue-500" />;
        case 'warning':
            return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        case 'danger':
            return <AlertCircle className="w-5 h-5 text-red-500" />;
        default:
            return <Bell className="w-5 h-5 text-gray-500" />;
    }
};

const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
};

export function Notifications({ alerts }: NotificationsProps) {
    const navigate = useNavigate();
    const [isRead, setIsRead] = useState<Record<string, boolean>>({});

    const unreadCount = alerts.filter(a => !isRead[a.id]).length;

    const markAsRead = (id: string) => {
        setIsRead(prev => ({ ...prev, [id]: true }));
    };

    const markAllAsRead = () => {
        const allRead = alerts.reduce((acc, a) => ({ ...acc, [a.id]: true }), {});
        setIsRead(allRead);
    };

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
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-primary hover:underline"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="space-y-3 max-h-155 overflow-y-auto">
                {alerts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications</p>
                    </div>
                ) : (
                    alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`
                                flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer
                                ${isRead[alert.id]
                                    ? 'hover:bg-muted/30'
                                    : 'bg-primary/5 border-l-4 border-primary/30'
                                }
                                hover:bg-muted/50
                            `}
                            onClick={() => markAsRead(alert.id)}
                        >
                            {/* Icon */}
                            <div className="shrink-0 mt-0.5">
                                {getNotificationIcon(alert.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className={`text-sm font-medium ${!isRead[alert.id] ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {alert.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {alert.message}
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                                            {getTimeAgo(alert.createdAt)}
                                        </p>
                                        {!isRead[alert.id] && (
                                            <Badge variant="default" className="mt-1 bg-primary/20 text-primary text-[10px]">
                                                New
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Action Link */}
                                {alert.action && (
                                    <div className="mt-2">
                                        <button
                                            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(alert.action!.url);
                                            }}
                                        >
                                            {alert.action.label}
                                            <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* View All Button */}
            {alerts.length > 5 && (
                <div className="mt-4 pt-4 border-t border-muted-card">
                    <button
                        className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => navigate('/system/notifications')}
                    >
                        View all notifications
                    </button>
                </div>
            )}
        </Card>
    );
}