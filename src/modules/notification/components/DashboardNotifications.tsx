import { useMemo, useState } from "react";
import { Bell, ChevronRight } from "lucide-react";
import { NotificationModal } from "./NotificationModal";
import {
    getUnreadCount,
    markAsRead,
    mockNotifications,
} from "../../../mock/mock-notifications";
import type { Notification } from "../../../types/notification.type";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";

export function DashboardNotifications() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [, forceUpdate] = useState(0);

    const navigate = useNavigate();

    const notifications = useMemo(() => {
        return [...mockNotifications]
            .sort(
                (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime()
            )
            .slice(0, 5);
    }, []);

    const unreadCount = useMemo(() => {
        return getUnreadCount();
    }, []);

    const handleMarkAsRead = (id: number) => {
        markAsRead(id);

        // trigger rerender
        forceUpdate((prev) => prev + 1);
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification.id);
        }

        if (notification.actionLink) {
            navigate(notification.actionLink);
        }

        setIsModalOpen(false);
    };

    const handleViewAll = () => {
        navigate("/system/notifications");
        setIsModalOpen(false);
    };

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const then = new Date(timestamp);
        const diffMs = now.getTime() - then.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24)
            return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        if (diffDays < 7)
            return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

        return then.toLocaleDateString();
    };

    const getTypeColor = (type: Notification["type"]) => {
        switch (type) {
            case "member":
                return "bg-green-100 text-green-800";
            case "visitor":
                return "bg-blue-100 text-blue-800";
            case "training":
                return "bg-orange-100 text-orange-800";
            case "event":
                return "bg-purple-100 text-purple-800";
            case "birthday":
                return "bg-pink-100 text-pink-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <>
            <Card className="bg-card rounded-xl shadow-sm border border-muted-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Bell className="w-5 h-5" />

                            {unreadCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </div>

                        <h3 className="font-semibold">
                            Recent Activity
                        </h3>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                        className="text-xs"
                    >
                        View All
                    </Button>
                </div>

                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-muted/30 cursor-pointer ${
                                !notification.isRead
                                    ? "bg-primary/5"
                                    : ""
                            }`}
                            onClick={() =>
                                handleNotificationClick(notification)
                            }
                        >
                            <div
                                className={`p-1.5 rounded ${getTypeColor(
                                    notification.type
                                )} shrink-0`}
                            >
                                <Bell className="w-3 h-3" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <p
                                        className={`text-sm font-medium truncate ${
                                            !notification.isRead
                                                ? "text-primary"
                                                : ""
                                        }`}
                                    >
                                        {notification.title}
                                    </p>

                                    <span className="text-xs text-muted-foreground shrink-0">
                                        {getTimeAgo(
                                            notification.timestamp
                                        )}
                                    </span>
                                </div>

                                <p className="text-xs text-muted-foreground truncate">
                                    {notification.message}
                                </p>
                            </div>

                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </div>
                    ))}
                </div>

                {notifications.length === 0 && (
                    <div className="text-center py-8">
                        <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                            No notifications
                        </p>
                    </div>
                )}
            </Card>

            <NotificationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                notifications={mockNotifications}
                onNotificationClick={handleNotificationClick}
                onMarkAsRead={handleMarkAsRead}
                onViewAll={handleViewAll}
            />
        </>
    );
}