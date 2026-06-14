import { apiSlice } from './apiSlice';

const USERS_URL = '/api/v1/auth';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body: data,
      }),
    }),
    logoutApiCall: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `/api/v1/users/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    toggleWishlist: builder.mutation({
      query: (data) => ({
        url: `/api/v1/users/profile/wishlist`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: '/api/v1/users',
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutApiCallMutation,
  useUpdateUserProfileMutation,
  useToggleWishlistMutation,
  useGetUsersQuery,
} = usersApiSlice;
