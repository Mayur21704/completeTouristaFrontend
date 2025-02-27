import flightApi from "./flightApi";

const authApi = flightApi.injectEndpoints({
  reducerPath: "authSlice",
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/register", // Endpoint for registration
        method: "POST",
        body: userData, // userData should include email, password, etc.
      }),
    }),
    signIn: builder.mutation({
      query: (credentials) => ({
        url: "/signin", // Endpoint for signing in (email/password)
        method: "POST",
        body: credentials, // credentials should include email & password
      }),
    }),
    signInWithGoogle: builder.mutation({
      query: (googleUserData) => ({
        url: "/signinwithGoogle", // Endpoint for Google sign-in
        method: "POST",
        body: googleUserData, // googleUserData should include uid, email, displayName, photoURL
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/forgotPassword", // Endpoint for forgot password
        method: "POST",
        body: { email }, // Send email for password reset
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: `/resetPassword/${token}`, // Endpoint for password reset
        method: "POST",
        body: { newPassword }, // Send the new password
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useSignInMutation,
  useSignInWithGoogleMutation,
  useForgotPasswordMutation, // Expose forgot password mutation
  useResetPasswordMutation, // Expose reset password mutation
} = authApi; // Expose all mutations for use

export default authApi;
