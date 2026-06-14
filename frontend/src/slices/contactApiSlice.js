import { apiSlice } from './apiSlice';

const CONTACT_URL = '/api/v1/contact';

export const contactApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitContact: builder.mutation({
      query: (data) => ({
        url: CONTACT_URL,
        method: 'POST',
        body: data,
      }),
    }),
    getContactMessages: builder.query({
      query: () => ({
        url: CONTACT_URL,
      }),
      providesTags: ['Contact'],
      keepUnusedDataFor: 5,
    }),
    deleteContactMessage: builder.mutation({
      query: (id) => ({
        url: `${CONTACT_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const {
  useSubmitContactMutation,
  useGetContactMessagesQuery,
  useDeleteContactMessageMutation,
} = contactApiSlice;
