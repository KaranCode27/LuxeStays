import { apiSlice } from './apiSlice';

const HOTELS_URL = '/api/v1/hotels';

export const hotelsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: (params) => {
        let queryStr = '?';
        if (params) {
          for (const key in params) {
            queryStr += `${key}=${params[key]}&`;
          }
        }
        return {
          url: `${HOTELS_URL}${queryStr}`,
        };
      },
      providesTags: ['Hotel'],
      keepUnusedDataFor: 5,
    }),
    getHotelDetails: builder.query({
      query: (hotelId) => ({
        url: `${HOTELS_URL}/${hotelId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createHotel: builder.mutation({
      query: (data) => ({
        url: HOTELS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Hotel'],
    }),
    updateHotel: builder.mutation({
      query: (data) => ({
        url: `${HOTELS_URL}/${data.hotelId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Hotel'],
    }),
    deleteHotel: builder.mutation({
      query: (hotelId) => ({
        url: `${HOTELS_URL}/${hotelId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hotel'],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelDetailsQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelsApiSlice;
