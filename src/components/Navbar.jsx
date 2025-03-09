// import { AnimatePresence, motion } from "framer-motion";
// import {
//   Building2,
//   ChevronDown,
//   Info,
//   LogOut,
//   Menu,
//   Plane,
//   Settings,
//   User,
//   X,
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { logOut } from "../store/authReducer";

// const Navbar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dropdownRef = useRef();

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const user = useSelector((state) => state.auth.user);
//   const userId = user?.uid;

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Close mobile menu and dropdown when route changes
//   useEffect(() => {
//     setMobileMenuOpen(false);
//     setDropdownOpen(false);
//   }, [location.pathname]);

//   const handleSignOut = () => {
//     dispatch(logOut());
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     setDropdownOpen(false);
//     navigate("/signin");
//   };

//   const navItems = [
//     {
//       path: "/flightSearch",
//       label: "Flights",
//       icon: <Plane className="w-5 h-5" />,
//     },
//     {
//       path: "/hotelSearch",
//       label: "Hotels",
//       icon: <Building2 className="w-5 h-5" />,
//     },
//     { path: "/about", label: "About Us", icon: <Info className="w-5 h-5" /> },
//   ];

//   const adminItems = [
//     {
//       path: "/admin",
//       label: "Admin Dashboard",
//       icon: <Building2 className="w-5 h-5" />,
//     },
//   ];

//   const dropdownAnimation = {
//     hidden: { opacity: 0, y: -10, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         type: "spring",
//         stiffness: 300,
//         damping: 20,
//       },
//     },
//     exit: {
//       opacity: 0,
//       y: -10,
//       scale: 0.95,
//       transition: {
//         duration: 0.2,
//       },
//     },
//   };

//   return (
//     <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo and Brand */}
//           <div className="flex items-center">
//             <Link
//               to="/"
//               className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 hover:from-blue-200 hover:to-white transition-all duration-300"
//             >
//               Tourista
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navItems.map((item) => (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className="flex items-center space-x-2 hover:text-blue-200 transition-colors duration-200"
//               >
//                 {item.icon}
//                 <span>{item.label}</span>
//               </Link>
//             ))}

//             {/* Display Admin Links if the user is an admin */}
//             {user?.isAdmin &&
//               adminItems.map((item) => (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className="flex items-center space-x-2 hover:text-blue-200 transition-colors duration-200"
//                 >
//                   {item.icon}
//                   <span>{item.label}</span>
//                 </Link>
//               ))}

//             {/* User Profile Section */}
//             {user ? (
//               <div className="relative" ref={dropdownRef}>
//                 <motion.button
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                   className="flex items-center space-x-2 focus:outline-none"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <img
//                     src={user.photoURL || "https://via.placeholder.com/40"}
//                     alt="Profile"
//                     className="w-8 h-8 rounded-full border-2 border-white object-cover"
//                   />
//                   <ChevronDown
//                     className={`w-4 h-4 transition-transform duration-200 ${
//                       dropdownOpen ? "rotate-180" : ""
//                     }`}
//                   />
//                 </motion.button>

//                 <AnimatePresence>
//                   {dropdownOpen && (
//                     <motion.div
//                       initial="hidden"
//                       animate="visible"
//                       exit="exit"
//                       variants={dropdownAnimation}
//                       className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50"
//                     >
//                       <div className="px-4 py-3 border-b border-gray-100">
//                         <p className="text-sm font-medium text-gray-900">
//                           {user.displayName}
//                         </p>
//                         <p className="text-xs text-gray-500 truncate">
//                           {user.email}
//                         </p>
//                       </div>

//                       <Link
//                         to={`/profile/${userId}`}
//                         className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors duration-200"
//                       >
//                         <User className="w-4 h-4 mr-3" />
//                         My Profile
//                       </Link>

//                       <button
//                         onClick={handleSignOut}
//                         className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
//                       >
//                         <LogOut className="w-4 h-4 mr-3" />
//                         Sign Out
//                       </button>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ) : (
//               <Link
//                 to="/signin"
//                 className="bg-white text-blue-600 px-4 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors duration-200"
//               >
//                 Sign In
//               </Link>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="text-white focus:outline-none"
//             >
//               {mobileMenuOpen ? (
//                 <X className="w-6 h-6" />
//               ) : (
//                 <Menu className="w-6 h-6" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="md:hidden bg-blue-700"
//           >
//             <div className="px-4 pt-2 pb-3 space-y-1">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   className="flex items-center space-x-2 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors duration-200"
//                 >
//                   {item.icon}
//                   <span>{item.label}</span>
//                 </Link>
//               ))}

//               {/* Display Admin Links if the user is an admin */}
//               {user?.isAdmin &&
//                 adminItems.map((item) => (
//                   <Link
//                     key={item.path}
//                     to={item.path}
//                     className="flex items-center space-x-2 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors duration-200"
//                   >
//                     {item.icon}
//                     <span>{item.label}</span>
//                   </Link>
//                 ))}

//               {user ? (
//                 <>
//                   <div className="px-3 py-2 border-t border-blue-600">
//                     <div className="flex items-center space-x-3">
//                       <img
//                         src={user.photoURL || "https://via.placeholder.com/40"}
//                         alt="Profile"
//                         className="w-10 h-10 rounded-full border-2 border-white"
//                       />
//                       <div>
//                         <p className="text-sm font-medium text-white">
//                           {user.displayName}
//                         </p>
//                         <p className="text-xs text-blue-200 truncate">
//                           {user.email}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <Link
//                     to={`/profile/${userId}`}
//                     className="flex items-center space-x-2 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600"
//                   >
//                     <User className="w-5 h-5" />
//                     <span>My Profile</span>
//                   </Link>

//                   <button
//                     onClick={handleSignOut}
//                     className="flex items-center space-x-2 text-white block w-full px-3 py-2 rounded-md text-base font-medium hover:bg-red-600"
//                   >
//                     <LogOut className="w-5 h-5" />
//                     <span>Sign Out</span>
//                   </button>
//                 </>
//               ) : (
//                 <Link
//                   to="/signin"
//                   className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors duration-200"
//                 >
//                   Sign In
//                 </Link>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// };

// export default Navbar;


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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link
                to="/"
                className="group flex items-center space-x-2 text-2xl font-bold"
              >
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-800 group-hover:to-blue-600 transition-all duration-300">
                  Tourista
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Navigation Items */}
              <div className="flex items-center space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}

                {user?.isAdmin &&
                  adminItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        location.pathname === item.path
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
              </div>

              {/* User Profile Section */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-3 bg-gray-100 rounded-lg pl-3 pr-4 py-2.5 hover:bg-gray-200 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={user.photoURL || "https://via.placeholder.com/40"}
                      alt="Profile"
                      className="w-8 h-8 rounded-full ring-2 ring-white object-cover"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {user.displayName?.split(" ")[0]}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
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
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 border border-gray-100"
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
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <User className="w-4 h-4 mr-3 text-gray-500" />
                          My Profile
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
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
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
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
              className="md:hidden bg-white border-t border-gray-100"
            >
              <div className="px-4 py-3 space-y-2">
                {user && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl mb-4">
                    <img
                      src={user.photoURL || "https://via.placeholder.com/40"}
                      alt="Profile"
                      className="w-12 h-12 rounded-full ring-2 ring-white"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 ${
                      location.pathname === item.path
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}

                {user?.isAdmin &&
                  adminItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 ${
                        location.pathname === item.path
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}

                {user ? (
                  <>
                    <Link
                      to={`/profile/${userId}`}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <User className="w-5 h-5 text-gray-500" />
                      <span>My Profile</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/signin"
                    className="block w-full px-4 py-3 rounded-xl text-center text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-lg shadow-blue-600/20"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;