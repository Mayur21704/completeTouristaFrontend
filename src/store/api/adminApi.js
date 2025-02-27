import flightApi from "./flightApi";

export const adminApi = flightApi.injectEndpoints({
  reducerPath: "bookingApi",
  endpoints: (builder) => ({
    getOveralTotal: builder.query({
      query: () => `/admin/overview`,
    }),
    getUsersAnalytics: builder.query({
      query: () => `/admin/analytics`,
    }),
    getUsers: builder.query({
      query: () => `/admin/users`,
    }),
  }),
});

export const {
  useGetOveralTotalQuery,
  useGetUsersAnalyticsQuery,
  useGetUsersQuery,
} = adminApi;
export default adminApi;
