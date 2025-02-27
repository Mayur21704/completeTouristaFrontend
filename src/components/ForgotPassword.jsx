import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast for notifications
import { useForgotPasswordMutation } from "../store/api/authApi"; // Import the forgot password mutation

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation(); // Get the forgot password mutation hook
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the forgot password mutation
      const response = await forgotPassword({ email }).unwrap(); // unwrap() gets the result directly
      console.log(response);

      toast.success(response.message || "Password reset link sent!");

      // Redirect to sign-in page after successful request
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      console.log(err);

      toast.error(err?.data?.error || "Failed to send reset link. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-4">Forgot Password</h2>

        <form onSubmit={handleForgotPassword}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Redirect to Sign In page */}
        <div className="flex justify-center items-center text-sm text-gray-500 mt-4">
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-500 ml-1 font-medium"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
