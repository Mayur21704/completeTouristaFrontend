import flightApi from "./flightApi";

export const bookingApi = flightApi.injectEndpoints({
  reducerPath: "bookingApi",
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (bookingData) => {
        // Retrieve token from localStorage (or Redux store if you're storing it there)

        return {
          url: "/bookings/create", // Ensure this matches your backend route
          method: "POST",
          body: bookingData, // Send the booking data (selected flight details, user details, etc.)
        };
      },
    }),
    getUserBookings: builder.query({
      query: (userId) => `/bookings/${userId}`,
    }),
    cancelBooking: builder.mutation({
      query: (bookingId) => {
        return {
          url: `/bookings/cancel/${bookingId}`,
          method: "POST",
        };
      },
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetUserBookingsQuery,
  useCancelBookingMutation,
} = bookingApi;
