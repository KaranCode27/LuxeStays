import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ 
  baseUrl: '',
  // This ensures HttpOnly cookies (like our jwt) are sent with every single request
  credentials: 'include'});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Hotel', 'Booking', 'Transport'],
  endpoints: (builder) => ({}),
});
