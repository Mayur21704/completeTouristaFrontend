import flightApi from "./flightApi";

export const paymentApi = flightApi.injectEndpoints({
  reducerPath: "paymentApi",
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

export const { useCreatePaymentMutation } = paymentApi;
