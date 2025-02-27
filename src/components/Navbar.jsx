import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  ChevronDown,
  Info,
  LogOut,
  Menu,
  Plane,
  Settings,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logOut } from "../store/authReducer";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const userId = user?.uid;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu and dropdown when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    dispatch(logOut());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/signin");
  };

  const navItems = [
    {
      path: "/flightSearch",
      label: "Flights",
      icon: <Plane className="w-5 h-5" />,
    },
    {
      path: "/hotelSearch",
      label: "Hotels",
      icon: <Building2 className="w-5 h-5" />,
    },
    { path: "/about", label: "About Us", icon: <Info className="w-5 h-5" /> },
  ];

  const adminItems = [
    {
      path: "/admin",
      label: "Admin Dashboard",
      icon: <Building2 className="w-5 h-5" />,
    },
  ];

  const dropdownAnimation = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 hover:from-blue-200 hover:to-white transition-all duration-300"
            >
              Tourista
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 hover:text-blue-200 transition-colors duration-200"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Display Admin Links if the user is an admin */}
            {user?.isAdmin &&
              adminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 hover:text-blue-200 transition-colors duration-200"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

            {/* User Profile Section */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={user.photoURL || "https://via.placeholder.com/40"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownAnimation}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to={`/profile/${userId}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <User className="w-4 h-4 mr-3" />
                        My Profile
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/signin"
                className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-blue-700"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors duration-200"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Display Admin Links if the user is an admin */}
              {user?.isAdmin &&
                adminItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center space-x-2 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors duration-200"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}

              {user ? (
                <>
                  <div className="px-3 py-2 border-t border-blue-600">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.photoURL || "https://via.placeholder.com/40"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-white"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-blue-200 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/profile/${userId}`}
                    className="flex items-center space-x-2 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600"
                  >
                    <User className="w-5 h-5" />
                    <span>My Profile</span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-white block w-full px-3 py-2 rounded-md text-base font-medium hover:bg-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/signin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors duration-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
