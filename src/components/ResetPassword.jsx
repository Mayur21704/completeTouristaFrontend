import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast for notifications
import { useResetPasswordMutation } from "../store/api/authApi"; // Import the reset password mutation

const ResetPassword = () => {
  const { token } = useParams(); // Retrieve the token from the URL
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetPassword] = useResetPasswordMutation(); // Get the reset password mutation hook
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/signin"); // If no token is found, redirect to sign-in page
    }
  }, [token, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the reset password mutation
      const response = await resetPassword({ token, newPassword }).unwrap(); // unwrap() gets the result directly
      toast.success(response.message || "Password reset successfully!");

      // Redirect to sign-in page after successful password reset
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reset password. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-4">Reset Password</h2>

        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
