import { apiSlice } from './apiSlice';

const BOOKINGS_URL = '/api/v1/bookings';

export const bookingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (booking) => ({
        url: BOOKINGS_URL,
        method: 'POST',
        body: booking,
      }),
      invalidatesTags: ['Booking'],
    }),
    getBookingDetails: builder.query({
      query: (bookingId) => ({
        url: `${BOOKINGS_URL}/${bookingId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyBookings: builder.query({
      query: () => ({
        url: `${BOOKINGS_URL}/my`,
      }),
      providesTags: ['Booking'],
      keepUnusedDataFor: 5,
    }),
    getBookings: builder.query({
      query: () => ({
        url: BOOKINGS_URL,
      }),
      providesTags: ['Booking'],
      keepUnusedDataFor: 5,
    }),
    updateBookingStatus: builder.mutation({
      query: (data) => ({
        url: `${BOOKINGS_URL}/${data.bookingId}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Booking'],
    }),
    cancelBooking: builder.mutation({
      query: (bookingId) => ({
        url: `${BOOKINGS_URL}/${bookingId}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingDetailsQuery,
  useGetMyBookingsQuery,
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
  useCancelBookingMutation,
} = bookingsApiSlice;
