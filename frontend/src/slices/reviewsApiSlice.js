import { apiSlice } from './apiSlice';

const REVIEWS_URL = '/api/v1/reviews';
const HOTELS_URL = '/api/v1/hotels';

export const reviewsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query({
      query: () => ({
        url: REVIEWS_URL,
      }),
      providesTags: ['Review'],
      keepUnusedDataFor: 5,
    }),
    getHotelReviews: builder.query({
      query: (hotelId) => ({
        url: `${HOTELS_URL}/${hotelId}/reviews`,
      }),
      providesTags: ['Review'],
      keepUnusedDataFor: 5,
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${HOTELS_URL}/${data.hotelId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Review'],
    }),
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `${REVIEWS_URL}/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useGetHotelReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApiSlice;
