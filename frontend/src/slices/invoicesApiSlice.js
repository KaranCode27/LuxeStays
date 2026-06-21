import { apiSlice } from './apiSlice';

const INVOICES_URL = '/api/v1/invoices';

export const invoicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyInvoices: builder.query({
      query: () => ({
        url: `${INVOICES_URL}/my`,
      }),
      providesTags: ['Invoice'],
      keepUnusedDataFor: 5,
    }),
    getInvoices: builder.query({
      query: () => ({
        url: INVOICES_URL,
      }),
      providesTags: ['Invoice'],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetMyInvoicesQuery,
  useGetInvoicesQuery,
} = invoicesApiSlice;
