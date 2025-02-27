import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Importing the toast library
import { v4 as uuidv4 } from "uuid"; // For unique UID generation
import { useRegisterMutation } from "../store/api/authApi"; // Adjust path as necessary
import { avatar } from "../utils/avatar"; // The list of avatars

const Register = () => {
  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();
  const [passwordError, setPasswordError] = useState("");

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    const displayName = e.target.displayName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Check password requirements: min 6 characters and 1 special character
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 6 characters long and contain at least one special character."
      );
      return;
    }

    setPasswordError(""); // Clear error message

    // Generate a random avatar from the list
    const randomAvatar =
      avatar[Math.floor(Math.random() * avatar.length)].avatar_logo;

    // Generate a unique UID for the user
    const uid = uuidv4();

    // Create the user in the backend
    try {
      const { data, error } = await register({
        uid,
        displayName,
        email,
        password,
        photoURL: randomAvatar,
      });
      if (error) {
        // Log the error details for debugging
        console.error("Sign-In Error:", error);

        // Check if the error message exists and show it via toast
        if (error.data && error.data.error) {
          toast.error(error.data.error); // Show the backend error message
        } else {
          toast.error("Sign-In failed. Please try again.");
        }
        return; // Exit early to prevent further code execution
      }

      if (data) {
        // Registration successful, show success toast
        toast.success("Registration successful! Redirecting to sign-in...");

        // Redirect to the sign-in page after a short delay to show the toast
        setTimeout(() => {
          navigate("/signin");
        }, 1500); // Delay to allow toast message to show
      }
    } catch (err) {
      console.error("Registration error:", err);

      // Show error toast
      toast.error("Registration failed: " + (err?.message || "Unknown error"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-4">Register</h2>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="displayName"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

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
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full p-3 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-4">{error.message}</p>}

        <div className="flex justify-center items-center text-sm text-gray-500 mt-4">
          <p>Already have an account?</p>
          <button
            onClick={() => navigate("/signin")} // Navigate to the Sign-In page
            className="text-blue-500 ml-1 font-medium"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
