import { signInWithPopup } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useSignInMutation,
  useSignInWithGoogleMutation,
} from "../store/api/authApi";
import { setUser } from "../store/authReducer";
import { auth, provider } from "../utils/firebase";

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [signIn, { isLoading, error }] = useSignInMutation();
  const [signInWithGoogle] = useSignInWithGoogleMutation();

  // Get the "from" location (the page user wanted to visit)
  const redirectTo = location.state?.from?.pathname || "/"; // Default to homepage if no redirect
  console.log(redirectTo);

  // Handle email/password sign-in
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const { data, error } = await signIn({ email, password });
      if (error) {
        console.error("Sign-In Error:", error);
        toast.error(error?.data?.error || "Sign-In failed.");
        return;
      }
      if (data) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        dispatch(setUser({ user: data.user, token: data.token }));
        toast.success("Successfully signed in!");

        // After successful sign-in, navigate back to the previous page or home
        navigate(redirectTo);
      }
    } catch (err) {
      console.error("Sign-In Error:", err);
      toast.error(err?.message || "An error occurred during sign-in.");
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { uid, email, displayName, photoURL } = result.user;

      const { data, error } = await signInWithGoogle({
        uid,
        email,
        displayName,
        photoURL,
      });
      if (error) {
        console.error("Google Sign-In Error:", error);
        toast.error(error?.data?.error || "Google Sign-In failed.");
        return;
      }
      if (data) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        dispatch(setUser({ user: data.user, token: data.token }));
        toast.success("Successfully signed in with Google!");

        // Navigate back to the previous page or home after successful login
        navigate(redirectTo);
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      toast.error(err?.message || "An error occurred during Google sign-in.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-4">Sign In</h2>

        <form onSubmit={handleEmailSignIn}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-4 p-3 flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition duration-200"
        >
          <FaGoogle className="mr-2 text-xl text-red-500" />
          <span className="text-sm text-gray-700">Sign in with Google</span>
        </button>

        <div className="flex justify-center items-center text-sm text-gray-500 mt-4">
          <p>Don't have an account?</p>
          <button
            onClick={() => navigate("/register")}
            className="text-blue-500 ml-1 font-medium"
          >
            Register
          </button>
        </div>

        <div className="flex justify-center items-center text-sm text-gray-500 mt-4">
          <button
            onClick={() => navigate("/forgotPassword")}
            className="text-blue-500 ml-1 font-medium"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
