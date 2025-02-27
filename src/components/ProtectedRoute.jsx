import { useSelector } from "react-redux"; // Use Redux to get the user data
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ element: Element, isAdminRoute, ...rest }) => {
  const location = useLocation();

  // Get authentication token and user data from Redux store
  const isAuthenticated = localStorage.getItem("token"); // Or use Redux to get auth token
  const user = useSelector((state) => state.auth.user); // Get user data from Redux
  const isAdmin = user?.isAdmin; // Check if the user has admin rights

  // If the route is an admin route and the user is an admin, allow access
  if (isAdminRoute && isAuthenticated && isAdmin) {
    return <Element {...rest} />;
  }

  // If the route is a non-admin route and the user is authenticated, allow access
  if (!isAdminRoute && isAuthenticated) {
    return <Element {...rest} />;
  }

  // If the user is authenticated but not an admin and trying to access admin route, redirect to home
  if (isAuthenticated && !isAdmin && isAdminRoute) {
    return <Navigate to="/" />;
  }

  // If the user is not authenticated, redirect to sign-in page
  return <Navigate to="/signin" state={{ from: location }} />;
};

export default ProtectedRoute;
