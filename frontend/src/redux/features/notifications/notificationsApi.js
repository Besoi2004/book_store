import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/notifications`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    // Get all notifications for a user
    getUserNotifications: builder.query({
      query: (email) => `/${email}`,
      providesTags: ["Notifications"],
    }),

    // Get unread count
    getUnreadCount: builder.query({
      query: (email) => `/${email}/unread/count`,
      providesTags: ["Notifications"],
    }),

    // Mark notification as read
    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Mark all notifications as read
    markAllAsRead: builder.mutation({
      query: (email) => ({
        url: `/${email}/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Delete notification
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // Delete all notifications
    deleteAllNotifications: builder.mutation({
      query: (email) => ({
        url: `/${email}/all`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetUserNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationsApi;

export default notificationsApi;
