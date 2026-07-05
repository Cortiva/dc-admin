import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Bell, CheckCheck, Trash2, 
    CheckCircle, Info, 
    ChevronLeft, ChevronRight,
    Mail, Phone, MessageSquare, 
    Filter, X
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import PageHeader from "../../../components/PageHeader";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Skeleton } from "../../../components/ui/skeleton";
import { handleApiError } from "../../../utils/functions";
import { useDeleteNotificationMutation, useGetNotificationsQuery, useGetUnreadCountQuery, useMarkAllAsReadMutation, useMarkAsReadMutation } from "../notificationApiSlice";
import type { NotificationResponse } from "../../../types/notification.type";


const getTypeIcon = (channel: string) => {
    switch (channel) {
        case "IN_APP":
            return <Bell className="w-5 h-5 text-blue-500" />;
        case "EMAIL":
            return <Mail className="w-5 h-5 text-purple-500" />;
        case "SMS":
            return <MessageSquare className="w-5 h-5 text-green-500" />;
        case "PUSH":
            return <Phone className="w-5 h-5 text-orange-500" />;
        default:
            return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
};

const getTimeAgo = (date: Date) => {
    try {
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
        return "Some time ago";
    }
};

export default function NotificationsPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit] = useState(20);
    const [unreadOnly, setUnreadOnly] = useState(false);
    const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());

    const { data, isLoading, refetch } = useGetNotificationsQuery({ 
        page, 
        limit, 
        unreadOnly 
    });
    
    const { data: unreadCountData, refetch: refetchUnread } = useGetUnreadCountQuery({ page, limit });

    const [markAsRead] = useMarkAsReadMutation();
    const [markAllAsRead] = useMarkAllAsReadMutation();
    const [deleteNotification] = useDeleteNotificationMutation();

    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id).unwrap();
            toast.success("Notification marked as read");
            refetch();
            refetchUnread();
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead().unwrap();
            toast.success("All notifications marked as read");
            refetch();
            refetchUnread();
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNotification(id).unwrap();
            toast.success("Notification deleted");
            refetch();
            refetchUnread();
        } catch (error) {
            handleApiError(error);
        }
    };

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedNotifications);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedNotifications(newSet);
    };

    const handleBulkMarkAsRead = async () => {
        for (const id of selectedNotifications) {
            await handleMarkAsRead(id);
        }
        setSelectedNotifications(new Set());
    };

    const handleBulkDelete = async () => {
        for (const id of selectedNotifications) {
            await handleDelete(id);
        }
        setSelectedNotifications(new Set());
    };

    const handleNextPage = () => {
        if (data && page < data.totalPages) {
            setPage(page + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4 sm:space-y-6">
                <PageHeader icon={<Bell />} title="Notifications" subtitle="Stay updated with your notifications" />
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Card key={i} className="p-4">
                            <div className="flex items-start gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    const notifications = data?.data.data || [];
    const unreadCount = unreadCountData?.data.count || 0;

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <PageHeader
                    icon={<Bell />}
                    title="Notifications"
                    subtitle={`${unreadCount} unread`}
                />
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                            <CheckCheck className="w-4 h-4 mr-2" />
                            Mark All Read
                        </Button>
                    )}
                    <Button
                        variant={unreadOnly ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUnreadOnly(!unreadOnly)}
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        {unreadOnly ? "All" : "Unread Only"}
                    </Button>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedNotifications.size > 0 && (
                <Card className="p-3 bg-primary/5 border-primary/20">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                            {selectedNotifications.size} selected
                        </span>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={handleBulkMarkAsRead}>
                                <CheckCheck className="w-4 h-4 mr-2" />
                                Mark Read
                            </Button>
                            <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setSelectedNotifications(new Set())}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center">
                        <Bell className="w-16 h-16 text-muted-foreground opacity-50 mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">No Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                            {unreadOnly ? "You have no unread notifications" : "You're all caught up!"}
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-2">
                    {notifications.map((notification: NotificationResponse) => {
                        const isRead = notification.readAt !== null;
                        return (
                            <Card 
                                key={notification.id}
                                className={`p-4 hover:bg-muted/20 transition-colors cursor-pointer ${
                                    !isRead ? "border-l-4 border-l-primary" : ""
                                }`}
                                onClick={() => {
                                    if (!isRead) {
                                        handleMarkAsRead(notification.id);
                                    }
                                }}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Select Checkbox */}
                                    <div className="flex items-center mt-1">
                                        <input
                                            type="checkbox"
                                            checked={selectedNotifications.has(notification.id)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggleSelect(notification.id);
                                            }}
                                            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30"
                                        />
                                    </div>

                                    {/* Icon */}
                                    <div className="shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            {getTypeIcon(notification.channel)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className={`text-sm font-medium ${!isRead ? "text-foreground" : "text-muted-foreground"}`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {notification.body}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 shrink-0">
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {getTimeAgo(notification.createdAt)}
                                                </span>
                                                {!isRead && (
                                                    <Badge variant="default" className="text-[10px] bg-primary/20 text-primary">
                                                        New
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 mt-2">
                                            {!isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 text-xs text-primary hover:text-primary/80"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsRead(notification.id);
                                                    }}
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Mark Read
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(notification.id);
                                                }}
                                            >
                                                <Trash2 className="w-3 h-3 mr-1" />
                                                Delete
                                            </Button>
                                            {notification.data && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 text-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Navigate to the data link if present
                                                        if (notification.data?.link) {
                                                            navigate(notification.data.link as string);
                                                        }
                                                    }}
                                                >
                                                    <Info className="w-3 h-3 mr-1" />
                                                    View Details
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-muted/30">
                    <p className="text-sm text-muted-foreground">
                        Showing {((data.page - 1) * data.limit) + 1} to{" "}
                        {Math.min(data.page * data.limit, data.total)} of {data.total} notifications
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={data.page === 1}
                            onClick={handlePrevPage}
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                        </Button>
                        <span className="flex items-center px-3 text-sm">
                            Page {data.page} of {data.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={data.page === data.totalPages}
                            onClick={handleNextPage}
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}