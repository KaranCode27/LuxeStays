import { apiSlice } from './apiSlice';

const NOTIFICATIONS_URL = '/api/v1/notifications';

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query({
      query: () => ({
        url: NOTIFICATIONS_URL,
      }),
      providesTags: ['Notification'],
      keepUnusedDataFor: 5,
    }),
    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `${NOTIFICATIONS_URL}/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: `${NOTIFICATIONS_URL}/read-all`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} = notificationsApiSlice;
