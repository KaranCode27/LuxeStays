import { apiSlice } from './apiSlice';

const PAYMENTS_URL = '/api/v1/payments';

export const paymentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRazorpayOrder: builder.mutation({
      query: (data) => ({
        url: `${PAYMENTS_URL}/create-order`,
        method: 'POST',
        body: data,
      }),
    }),
    verifyRazorpayPayment: builder.mutation({
      query: (data) => ({
        url: `${PAYMENTS_URL}/verify`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
} = paymentsApiSlice;
