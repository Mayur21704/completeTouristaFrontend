import flightApi from "./flightApi";

const hotelpaymentApi = flightApi.injectEndpoints({
  reducerPath: "hotelpaymentApi",
  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (bookingData) => {
        return {
          url: "/payment/create", // Ensure this matches your backend route
          method: "POST",
          body: bookingData, // Send the booking data (selected flight details, priceId, email, etc.)
        };
      },
    }),
  }),
});

export const { useCreatePaymentMutation } = hotelpaymentApi;
export default hotelpaymentApi;
