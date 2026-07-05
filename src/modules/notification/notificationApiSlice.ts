import { apiSlice } from "../../store/apiSlice";
import type {
    BroadcastRequest,
    MarkReadResponse,
} from "../../types/notification.type";

export const notificationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ─── Get Notifications ─────────────────────────────────────────────

        getNotifications: builder.query({
            query: (params) => ({
                url: `/notifications`,
                method: "GET",
                params,
            }),
            providesTags: ["Notifications"],
        }),

        // ─── Get Unread Count ──────────────────────────────────────────────

        getUnreadCount: builder.query({
            query: () => ({
                url: `/notifications/unread-count`,
                method: "GET",
            }),
            providesTags: ["Notifications"],
        }),

        // ─── Mark as Read ──────────────────────────────────────────────────

        markAsRead: builder.mutation<MarkReadResponse, string>({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),

        // ─── Mark All as Read ─────────────────────────────────────────────

        markAllAsRead: builder.mutation<MarkReadResponse, void>({
            query: () => ({
                url: `/notifications/read-all`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),

        // ─── Delete Notification ──────────────────────────────────────────

        deleteNotification: builder.mutation<MarkReadResponse, string>({
            query: (id) => ({
                url: `/notifications/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Notifications"],
        }),

        // ─── Broadcast (Admin only) ───────────────────────────────────────

        broadcastNotification: builder.mutation<
            { queued: number },
            BroadcastRequest
        >({
            query: (data) => ({
                url: `/admin/notifications/broadcast`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useGetUnreadCountQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
    useDeleteNotificationMutation,
    useBroadcastNotificationMutation,
} = notificationApiSlice;
