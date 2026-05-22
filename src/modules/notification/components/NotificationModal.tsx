import { useState } from "react";
import {
    Bell,
    CheckCircle,
    UserPlus,
    Calendar,
    Award,
    Star,
    AlertCircle,
    X,
    ChevronRight,
    MessageCircle,
    Gift,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import type { Notification } from "../../../types/notification.type";
import { markAsRead } from "../../../mock/mock-notifications";


interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onNotificationClick?: (notification: Notification) => void;
    onMarkAsRead?: (id: number) => void;
    onViewAll?: () => void;
}

export function NotificationModal({
    isOpen,
    onClose,
    notifications,
    onNotificationClick,
    onMarkAsRead,
    onViewAll
}: NotificationModalProps) {
    const [localNotifications, setLocalNotifications] = useState(notifications);

    // useEffect(() => {
    //     setLocalNotifications(notifications);
    // }, [notifications]);

    const getNotificationIcon = (type: Notification['type'], size: string = "w-5 h-5") => {
        const iconProps = { className: `${size} shrink-0` };
        
        switch (type) {
            case 'success':
                return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-500`} />;
            case 'info':
                return <AlertCircle {...iconProps} className={`${iconProps.className} text-blue-500`} />;
            case 'warning':
                return <AlertCircle {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
            case 'event':
                return <Calendar {...iconProps} className={`${iconProps.className} text-purple-500`} />;
            case 'member':
                return <UserPlus {...iconProps} className={`${iconProps.className} text-green-500`} />;
            case 'visitor':
                return <Star {...iconProps} className={`${iconProps.className} text-blue-500`} />;
            case 'training':
                return <Award {...iconProps} className={`${iconProps.className} text-orange-500`} />;
            case 'birthday':
                return <Gift {...iconProps} className={`${iconProps.className} text-pink-500`} />;
            case 'system':
                return <Bell {...iconProps} className={`${iconProps.className} text-gray-500`} />;
            default:
                return <MessageCircle {...iconProps} className={`${iconProps.className} text-gray-500`} />;
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

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead && onMarkAsRead) {
            onMarkAsRead(notification.id);
            markAsRead(notification.id);
        }
        if (onNotificationClick) {
            onNotificationClick(notification);
        }
        onClose();
    };

    const handleMarkAsRead = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (onMarkAsRead) {
            onMarkAsRead(id);
            markAsRead(id);
        }
        setLocalNotifications(prev => 
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    const topNotifications = localNotifications.slice(0, 5);
    const hasMore = localNotifications.length > 5;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b border-muted-card">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            <DialogTitle>Notifications</DialogTitle>
                            <Badge variant="secondary" className="ml-2">
                                {localNotifications.filter(n => !n.isRead).length} new
                            </Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="max-h-155 overflow-y-auto">
                    {topNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <Bell className="w-12 h-12 text-muted-foreground mb-3" />
                            <p className="text-muted-foreground">No notifications</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                You're all caught up!
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-muted-card">
                            {topNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`
                                        relative p-4 transition-colors cursor-pointer
                                        hover:bg-muted/30
                                        ${!notification.isRead ? 'bg-primary/5' : ''}
                                    `}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex gap-3">
                                        {/* Icon */}
                                        <div className="shrink-0">
                                            {getNotificationIcon(notification.type, "w-5 h-5")}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm font-medium ${!notification.isRead ? 'text-primary' : ''}`}>
                                                    {notification.title}
                                                </p>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                        {getTimeAgo(notification.timestamp)}
                                                    </span>
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={(e) => handleMarkAsRead(e, notification.id)}
                                                            className="text-xs text-primary hover:underline"
                                                        >
                                                            Mark read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            {notification.actionLabel && (
                                                <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                                                    <span>{notification.actionLabel}</span>
                                                    <ChevronRight className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Unread indicator dot */}
                                    {!notification.isRead && (
                                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {hasMore && (
                        <div className="p-3 border-t border-muted-card">
                            <Button 
                                variant="ghost" 
                                className="w-full" 
                                onClick={() => {
                                    if (onViewAll) onViewAll();
                                    onClose();
                                }}
                            >
                                View all notifications
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}