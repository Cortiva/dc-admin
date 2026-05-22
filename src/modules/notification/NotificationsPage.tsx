"use client";

import { useState, useMemo } from "react";
import {
    Bell,
    RefreshCw,
    CheckCheck,
    ChevronLeft,
    ChevronRight,
    Search,
    Inbox,
    Calendar,
    Users,
    Star,
    Award,
    Gift,
    AlertCircle,
    CheckCircle,
} from "lucide-react";
import AppLayout from "../../components/layouts/AppLayout";
import PageHeader from "../../components/PageHeader";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
} from "../../components/ui/card";
import type { Notification, NotificationFilterParams } from "../../types/notification.type";
import { getPaginatedNotifications, getUnreadCount, markAllAsRead, markAsRead } from "../../mock/mock-notifications";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
    const [filters, setFilters] = useState<NotificationFilterParams>({
        page: 1,
        limit: 20,
        type: undefined,
        isRead: undefined,
        search: "",
    });
    const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

    const navigate = useNavigate();

    const [, forceRefresh] = useState(0);

    const unreadCount = useMemo(() => {
        return getUnreadCount();
    }, [forceRefresh]);

    const notificationsResult = useMemo(() => {
        return getPaginatedNotifications(filters.page, filters.limit, {
            page: filters.page,
            limit: filters.limit,
            type: filters.type,
            isRead: filters.isRead,
            search: filters.search,
        });
    }, [filters, forceRefresh]);

    const notifications = notificationsResult.notifications;

    const pagination = {
        page: filters.page,
        limit: filters.limit,
        total: notificationsResult.total,
        totalPages: notificationsResult.totalPages,
    };

    const handleMarkAsRead = (id: number) => {
        markAsRead(id);
        forceRefresh(prev => prev + 1);
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
        forceRefresh(prev => prev + 1);
    };

    const handleSelectAll = () => {
        if (selectedNotifications.length === notifications.length) {
            setSelectedNotifications([]);
        } else {
            setSelectedNotifications(notifications.map(n => n.id));
        }
    };

    const handleSelectNotification = (id: number) => {
        setSelectedNotifications(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkMarkAsRead = () => {
        selectedNotifications.forEach(id => markAsRead(id));

        setSelectedNotifications([]);
        forceRefresh(prev => prev + 1);
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification.id);
        }
        if (notification.actionLink) {
            navigate(notification.actionLink);
        }
    };

    const getTypeIcon = (type: Notification['type']) => {
        switch (type) {
            case 'member': return <Users className="w-4 h-4" />;
            case 'visitor': return <Star className="w-4 h-4" />;
            case 'training': return <Award className="w-4 h-4" />;
            case 'event': return <Calendar className="w-4 h-4" />;
            case 'birthday': return <Gift className="w-4 h-4" />;
            case 'warning': return <AlertCircle className="w-4 h-4" />;
            case 'success': return <CheckCircle className="w-4 h-4" />;
            default: return <Bell className="w-4 h-4" />;
        }
    };

    const getTypeColor = (type: Notification['type']) => {
        switch (type) {
            case 'member': return "bg-green-100 text-green-800";
            case 'visitor': return "bg-blue-100 text-blue-800";
            case 'training': return "bg-orange-100 text-orange-800";
            case 'event': return "bg-purple-100 text-purple-800";
            case 'birthday': return "bg-pink-100 text-pink-800";
            case 'warning': return "bg-yellow-100 text-yellow-800";
            case 'success': return "bg-emerald-100 text-emerald-800";
            default: return "bg-gray-100 text-gray-800";
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

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <PageHeader
                        icon={<Bell />}
                        title="Notifications"
                        subtitle={`You have ${unreadCount} unread notifications`}
                    />
                    <div className="flex items-center gap-3">
                        {selectedNotifications.length > 0 && (
                            <Button variant="outline" onClick={handleBulkMarkAsRead}>
                                <CheckCheck className="w-4 h-4 mr-2" />
                                Mark Selected ({selectedNotifications.length})
                            </Button>
                        )}
                        <Button variant="outline" onClick={handleMarkAllAsRead}>
                            <CheckCheck className="w-4 h-4 mr-2" />
                            Mark All as Read
                        </Button>
                        <Button variant="outline" onClick={() => forceRefresh(prev => prev + 1)}>
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-50">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search notifications..."
                                        value={filters.search}
                                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                                        className="pl-9"
                                    />
                                </div>
                            </div>

                            <Select
                                value={filters.type || "all"}
                                onValueChange={(value) => setFilters(prev => ({ 
                                    ...prev, 
                                    type: value === "all" ? undefined : value,
                                    page: 1 
                                }))}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="All Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="member">Members</SelectItem>
                                    <SelectItem value="visitor">Visitors</SelectItem>
                                    <SelectItem value="training">Training</SelectItem>
                                    <SelectItem value="event">Events</SelectItem>
                                    <SelectItem value="birthday">Birthdays</SelectItem>
                                    <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.isRead === undefined ? "all" : filters.isRead ? "read" : "unread"}
                                onValueChange={(value) => setFilters(prev => ({ 
                                    ...prev, 
                                    isRead: value === "all" ? undefined : value === "read",
                                    page: 1 
                                }))}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="unread">Unread</SelectItem>
                                    <SelectItem value="read">Read</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.limit.toString()}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, limit: parseInt(value), page: 1 }))}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10">10 per page</SelectItem>
                                    <SelectItem value="20">20 per page</SelectItem>
                                    <SelectItem value="50">50 per page</SelectItem>
                                    <SelectItem value="100">100 per page</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications List */}
                <Card>
                    <CardHeader className="border-b border-muted-card">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSelectAll}
                                >
                                    {selectedNotifications.length === notifications.length && notifications.length > 0
                                        ? "Deselect All"
                                        : "Select All"}
                                </Button>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {pagination.total} notifications total
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Inbox className="w-12 h-12 text-muted-foreground mb-3" />
                                <p className="text-muted-foreground">No notifications found</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Try adjusting your filters
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-muted-card">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`
                                            relative p-4 transition-colors cursor-pointer
                                            hover:bg-muted/30
                                            ${!notification.isRead ? 'bg-primary/5' : ''}
                                        `}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Checkbox */}
                                            <div className="shrink-0 pt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedNotifications.includes(notification.id)}
                                                    onChange={() => handleSelectNotification(notification.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded border-muted-card"
                                                />
                                            </div>

                                            {/* Icon */}
                                            <div className="shrink-0">
                                                <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                                                    {getTypeIcon(notification.type)}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className={`font-medium ${!notification.isRead ? 'text-primary' : ''}`}>
                                                                {notification.title}
                                                            </p>
                                                            <Badge className={getTypeColor(notification.type)}>
                                                                {notification.type}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {notification.message}
                                                        </p>
                                                        {notification.actionLabel && (
                                                            <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                                                                <span>{notification.actionLabel}</span>
                                                                <ChevronRight className="w-3 h-3" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="shrink-0 text-right">
                                                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                            {getTimeAgo(notification.timestamp)}
                                                        </p>
                                                        {!notification.isRead && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleMarkAsRead(notification.id);
                                                                }}
                                                                className="text-xs text-primary hover:underline mt-1"
                                                            >
                                                                Mark as read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Unread indicator */}
                                        {!notification.isRead && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between p-4 border-t border-muted-card">
                            <div className="text-sm text-muted-foreground">
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === pagination.totalPages}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AppLayout>
    );
}