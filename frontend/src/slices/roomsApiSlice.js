import { apiSlice } from './apiSlice';

const ROOMS_URL = '/api/v1/rooms';
const HOTELS_URL = '/api/v1/hotels';

export const roomsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHotelRooms: builder.query({
      query: (hotelId) => ({
        url: `${HOTELS_URL}/${hotelId}/rooms`,
      }),
      keepUnusedDataFor: 5,
    }),
    getRooms: builder.query({
      query: () => ({
        url: ROOMS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getRoomDetails: builder.query({
      query: (roomId) => ({
        url: `${ROOMS_URL}/${roomId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createRoom: builder.mutation({
      query: (data) => ({
        url: `${HOTELS_URL}/${data.hotelId}/rooms`,
        method: 'POST',
        body: data,
      }),
    }),
    updateRoom: builder.mutation({
      query: (data) => ({
        url: `${ROOMS_URL}/${data.roomId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteRoom: builder.mutation({
      query: (roomId) => ({
        url: `${ROOMS_URL}/${roomId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetHotelRoomsQuery,
  useGetRoomsQuery,
  useGetRoomDetailsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} = roomsApiSlice;
