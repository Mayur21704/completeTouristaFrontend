import flightApi from "./flightApi";

const hotelbookingApi = flightApi.injectEndpoints({
  reducerPath: "bookingApi",
  endpoints: (builder) => ({
    createHotelBooking: builder.mutation({
      query: (bookingData) => {
        return {
          url: "/bookinghotel/createhotel", // Ensure this matches your backend route
          method: "POST",
          body: bookingData, // Send the booking data (selected flight details, user details, etc.)
        };
      },
    }),
    getUserBookings: builder.query({
      query: (userId) => `/bookings/${userId}`,
    }),
  }),
});

export const { useCreateHotelBookingMutation, useGetUserBookingsQuery } =
  hotelbookingApi;
export default hotelbookingApi;
