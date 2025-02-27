import { useGetOveralTotalQuery } from "@/src/store/api/adminApi";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import {
  BarChart3,
  Calendar,
  CreditCard,
  Hotel,
  Menu,
  Plane,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Analytics from "./Analytics";
import UserManagement from "./UserManagement";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const statsRef = useRef(null);
  const contentRef = useRef(null);
  const { data, isLoading } = useGetOveralTotalQuery();

  // Handle animations when tab changes
  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  // Handle initial animations
  useEffect(() => {
    if (statsRef.current) {
      gsap.from(".stat-card", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all",
      });

      gsap.from(".content-card", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
        clearProps: "all",
      });
    }
  }, []);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "analytics":
        return <Analytics />;
      case "customers":
        return <UserManagement />;
      default:
        return (
          <div ref={contentRef}>
            {/* Stats Grid */}
            <div
              ref={statsRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8"
            >
              <motion.div
                className="stat-card bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 p-5 md:p-6 rounded-xl shadow-lg"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">
                      Total Revenue
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      ₹{data.totalRevenue.toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-2 md:p-3 bg-blue-400/30 rounded-lg">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center text-blue-100">
                  <span className="text-green-300 font-medium">
                    +{data.revenuePercentage}%
                  </span>
                  <span className="ml-2 text-sm">vs last 6 months</span>
                </div>
              </motion.div>

              <motion.div
                className="stat-card bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 p-5 md:p-6 rounded-xl shadow-lg"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">
                      Hotel Revenue
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      ₹{data.totalHotelRevenue.toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-2 md:p-3 bg-purple-400/30 rounded-lg">
                    <Hotel className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center text-purple-100">
                  <span className="text-green-300 font-medium">
                    +{data.hotelRevenuePercentage}%
                  </span>
                  <span className="ml-2 text-sm">vs last 6 months</span>
                </div>
                <div className="mt-2 text-purple-100 text-xs">
                  {data.totalHotelBookings} bookings (
                  {data.hotelBookingsPercentage}% growth)
                </div>
              </motion.div>

              <motion.div
                className="stat-card bg-gradient-to-br from-green-600 via-green-500 to-green-400 p-5 md:p-6 rounded-xl shadow-lg"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-green-100 text-sm font-medium">
                      Flight Revenue
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      ₹{data.totalFlightRevenue.toLocaleString()}
                    </h3>
                  </div>
                  <div className="p-2 md:p-3 bg-green-400/30 rounded-lg">
                    <Plane className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center text-green-100">
                  <span className="text-green-300 font-medium">
                    +{data.flightRevenuePercentage}%
                  </span>
                  <span className="ml-2 text-sm">vs last 6 months</span>
                </div>
                <div className="mt-2 text-green-100 text-xs">
                  {data.totalFlightBookings} bookings (
                  {data.flightBookingsPercentage}% growth)
                </div>
              </motion.div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Flights Section */}
              <motion.div
                className="content-card bg-gray-800 rounded-xl overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-5 md:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg md:text-xl font-bold text-white flex items-center">
                      <Plane className="w-5 h-5 mr-2 text-blue-400" />
                      Highest Booked Flight
                    </h2>
                    <span className="text-sm text-blue-400">
                      {data.HighestBookedFlight.bookingsCount} bookings
                    </span>
                  </div>
                  <div className="space-y-4">
                    <motion.div
                      className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                      whileHover={{
                        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Plane className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-white">
                                {
                                  flightDetails.itineraries[0].segments[0]
                                    .departure.iataCode
                                }
                              </span>
                              <Plane className="w-4 h-4 mx-2 text-gray-400 rotate-90" />
                              <span className="font-medium text-white">
                                {
                                  flightDetails.itineraries[0].segments[0]
                                    .arrival.iataCode
                                }
                              </span>
                            </div>
                            <div className="text-sm text-gray-400">
                              Flight{" "}
                              {
                                flightDetails.itineraries[0].segments[0]
                                  .carrierCode
                              }{" "}
                              {flightDetails.itineraries[0].segments[0].number}{" "}
                              •{" "}
                              {
                                flightDetails.itineraries[0].segments[0]
                                  .aircraft.code
                              }
                            </div>
                          </div>
                        </div>
                        <motion.span
                          className={`px-3 py-1 rounded-full text-sm ${
                            flightDetails.status === "scheduled"
                              ? "bg-green-500/20 text-green-300"
                              : flightDetails.status === "delayed"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-blue-500/20 text-blue-300"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {flightDetails.status}
                        </motion.span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Departure</p>
                          <p className="text-white">
                            {format(
                              new Date(
                                flightDetails.itineraries[0].segments[0].departure.at
                              ),
                              "HH:mm, MMM dd"
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Terminal</p>
                          <p className="text-white">
                            {
                              flightDetails.itineraries[0].segments[0].departure
                                .terminal
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Capacity</p>
                          <p className="text-white">
                            {flightDetails.numberOfBookableSeats} seats
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <motion.div
                          className="flex justify-center items-center"
                          whileHover={{ scale: 1.05 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          <img
                            src={flightDetails.airlineLogo}
                            alt="Airline Logo"
                            className="h-8 object-contain"
                          />
                          <p className="text-white ml-2 font-medium">
                            {flightDetails.airlineName}
                          </p>
                        </motion.div>
                        <div className="mt-3 flex justify-center items-center space-x-2">
                          <span className="text-gray-400">Price:</span>
                          <motion.span
                            className="text-white font-bold"
                            initial={{ opacity: 1 }}
                            whileHover={{
                              scale: 1.1,
                              color: "#3B82F6",
                              transition: { duration: 0.2 },
                            }}
                          >
                            {flightDetails.price.currency}{" "}
                            {flightDetails.price.total}
                          </motion.span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          <motion.div
                            className="bg-gray-700 rounded-lg p-2"
                            whileHover={{
                              backgroundColor: "rgba(55, 65, 81, 1)",
                            }}
                          >
                            <p className="text-gray-400 text-xs">Duration</p>
                            <p className="text-white">
                              {flightDetails.itineraries[0].duration
                                .replace("PT", "")
                                .replace("H", "h ")
                                .replace("M", "m")}
                            </p>
                          </motion.div>
                          <motion.div
                            className="bg-gray-700 rounded-lg p-2"
                            whileHover={{
                              backgroundColor: "rgba(55, 65, 81, 1)",
                            }}
                          >
                            <p className="text-gray-400 text-xs">Baggage</p>
                            <p className="text-white">
                              {
                                flightDetails.travelerPricings[0]
                                  .fareDetailsBySegment[0].includedCheckedBags
                                  .weight
                              }
                              {
                                flightDetails.travelerPricings[0]
                                  .fareDetailsBySegment[0].includedCheckedBags
                                  .weightUnit
                              }
                            </p>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Hotels Section */}
              <motion.div
                className="content-card bg-gray-800 rounded-xl overflow-hidden shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="p-5 md:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg md:text-xl font-bold text-white flex items-center">
                      <Hotel className="w-5 h-5 mr-2 text-purple-400" />
                      Highest Booked Hotel
                    </h2>
                    <span className="text-sm text-purple-400">
                      {data.HighestBookedHotel.bookingsCount} bookings
                    </span>
                  </div>
                  <div className="space-y-4">
                    <motion.div
                      className="bg-gray-700/50 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
                      whileHover={{
                        boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <div className="relative h-48">
                        <img
                          src={hotelDetails.hotelImages[0]}
                          alt={hotelDetails.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="font-bold text-white text-lg md:text-xl">
                            {hotelDetails.name}
                          </h3>
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1 text-white">
                              {hotelDetails.reviews.totalRatings}
                            </span>
                          </div>
                        </div>
                        <motion.div
                          className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm bg-black/50 backdrop-blur-sm text-white font-medium"
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: "rgba(0, 0, 0, 0.7)",
                          }}
                        >
                          ₹{hotelDetails.price}/night
                        </motion.div>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-wrap justify-between items-start mb-3 gap-2">
                          <div className="flex items-center space-x-2">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                              <Hotel className="w-4 h-4 text-purple-400" />
                            </div>
                            <div>
                              <p className="text-gray-400 text-sm">Location</p>
                              <p className="text-white text-sm">
                                New Delhi, India
                              </p>
                            </div>
                          </div>
                          <motion.span
                            className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Available
                          </motion.span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <motion.div
                            className="bg-gray-700 rounded-lg p-2"
                            whileHover={{
                              backgroundColor: "rgba(55, 65, 81, 1)",
                            }}
                          >
                            <p className="text-gray-400 text-xs">Rooms</p>
                            <p className="text-white">
                              {hotelDetails.availableRooms} of{" "}
                              {hotelDetails.totalRooms} available
                            </p>
                          </motion.div>
                          <motion.div
                            className="bg-gray-700 rounded-lg p-2"
                            whileHover={{
                              backgroundColor: "rgba(55, 65, 81, 1)",
                            }}
                          >
                            <p className="text-gray-400 text-xs">Coordinates</p>
                            <p className="text-white text-xs">
                              {hotelDetails.geoCode.latitude.toFixed(4)},{" "}
                              {hotelDetails.geoCode.longitude.toFixed(4)}
                            </p>
                          </motion.div>
                        </div>
                        <div className="mt-3">
                          <p className="text-gray-400 text-sm mb-2">
                            Top Amenities
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {hotelDetails.amenities
                              .slice(0, 5)
                              .map((amenity, index) => (
                                <motion.span
                                  key={index}
                                  className="px-2 py-1 text-xs rounded-full bg-gray-600 text-gray-300"
                                  whileHover={{
                                    backgroundColor: "rgba(75, 85, 99, 1)",
                                    color: "rgba(255, 255, 255, 1)",
                                    scale: 1.05,
                                  }}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                      delay: 0.1 * index,
                                      duration: 0.3,
                                    },
                                  }}
                                >
                                  {amenity}
                                </motion.span>
                              ))}
                            {hotelDetails.amenities.length > 5 && (
                              <motion.span
                                className="px-2 py-1 text-xs rounded-full bg-gray-600 text-gray-300"
                                whileHover={{
                                  backgroundColor: "rgba(75, 85, 99, 1)",
                                  color: "rgba(255, 255, 255, 1)",
                                  scale: 1.05,
                                }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                  transition: { delay: 0.1 * 5, duration: 0.3 },
                                }}
                              >
                                +{hotelDetails.amenities.length - 5} more
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Additional Metrics */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                className="content-card bg-gray-800 rounded-xl p-5 md:p-6 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                  Booking Distribution
                </h3>
                <div className="flex items-center justify-center h-40">
                  <div className="w-full max-w-[200px]">
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-blue-400">
                            Flights
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-white">
                            {data.totalFlightBookings} (
                            {Math.round(
                              (data.totalFlightBookings /
                                (data.totalFlightBookings +
                                  data.totalHotelBookings)) *
                                100
                            )}
                            %)
                          </span>
                        </div>
                      </div>
                      <motion.div
                        className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <motion.div
                          style={{
                            width: `${Math.round(
                              (data.totalFlightBookings /
                                (data.totalFlightBookings +
                                  data.totalHotelBookings)) *
                                100
                            )}%`,
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.round(
                              (data.totalFlightBookings /
                                (data.totalFlightBookings +
                                  data.totalHotelBookings)) *
                                100
                            )}%`,
                          }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                        ></motion.div>
                      </motion.div>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block text-purple-400">
                            Hotels
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-white">
                            {data.totalHotelBookings} (
                            {Math.round(
                              (data.totalHotelBookings /
                                (data.totalFlightBookings +
                                  data.totalHotelBookings)) *
                                100
                            )}
                            %)
                          </span>
                        </div>
                      </div>
                      <motion.div
                        className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <motion.div
                          style={{
                            width: `${Math.round(
                              (data.totalHotelBookings /
                                (data.totalFlightBookings +
                                  data.totalHotelBookings)) *
                                100
                            )}%`,
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.round(
                              (data.totalHotelBookings /
                                (data.totalFlightBookings +
                                  data.totalHotelBookings)) *
                                100
                            )}%`,
                          }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                        ></motion.div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="content-card bg-gray-800 rounded-xl p-5 md:p-6 shadow-xl col-span-1 lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-400" />
                  Revenue Breakdown
                </h3>
                <div className="flex items-center justify-center h-40">
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-green-400">
                              Flight Revenue
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-white">
                              ₹{data.totalFlightRevenue.toLocaleString()} (
                              {Math.round(
                                (data.totalFlightRevenue / data.totalRevenue) *
                                  100
                              )}
                              %)
                            </span>
                          </div>
                        </div>
                        <motion.div
                          className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                        >
                          <motion.div
                            style={{
                              width: `${Math.round(
                                (data.totalFlightRevenue / data.totalRevenue) *
                                  100
                              )}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.round(
                                (data.totalFlightRevenue / data.totalRevenue) *
                                  100
                              )}%`,
                            }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                          ></motion.div>
                        </motion.div>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-purple-400">
                              Hotel Revenue
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-white">
                              ₹{data.totalHotelRevenue.toLocaleString()} (
                              {Math.round(
                                (data.totalHotelRevenue / data.totalRevenue) *
                                  100
                              )}
                              %)
                            </span>
                          </div>
                        </div>
                        <motion.div
                          className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700"
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                        >
                          <motion.div
                            style={{
                              width: `${Math.round(
                                (data.totalHotelRevenue / data.totalRevenue) *
                                  100
                              )}%`,
                            }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.round(
                                (data.totalHotelRevenue / data.totalRevenue) *
                                  100
                              )}%`,
                            }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                          ></motion.div>
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <motion.div
                        className="text-center"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-2xl md:text-3xl font-bold text-white">
                          ₹{data.totalRevenue.toLocaleString()}
                        </div>
                        <div className="text-gray-400 mt-1">Total Revenue</div>
                        <div className="mt-2 text-sm text-green-400">
                          +{data.revenuePercentage}% growth
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 p-4"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            borderRadius: ["25%", "50%", "25%"],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent mb-4"
        />
        <p className="text-lg font-semibold text-gray-900">Loading.....</p>
      </motion.div>
    );
  }
  // Use data from data.js
  const flightDetails = data.HighestBookedFlight.flightDetails;
  const hotelDetails = data.HighestBookedHotel.hotelDetails;
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900 overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-800 p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">Tourista Admin</h1>
        </div>
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed lg:relative z-20 h-screen bg-gray-800 text-white shadow-xl
                        w-64 lg:w-64 overflow-y-auto
                        ${sidebarOpen ? "block" : "hidden"} lg:block`}
          >
            <div className="p-6">
              <motion.div
                className="hidden lg:flex items-center space-x-3 mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="p-2 bg-blue-500 rounded-lg"
                  whileHover={{
                    scale: 1.1,
                    rotate: 10,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Plane className="w-6 h-6 text-white" />
                </motion.div>
                <h1 className="text-xl font-bold">Tourista Admin</h1>
              </motion.div>

              <nav className="space-y-2">
                {[
                  { icon: BarChart3, label: "Overview", id: "overview" },
                  { icon: TrendingUp, label: "Analytics", id: "analytics" },
                  { icon: Users, label: "Customers", id: "customers" },
                ].map(({ icon: Icon, label, id }, index) => (
                  <motion.button
                    key={id}
                    onClick={() => {
                      setActiveTab(id);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                      activeTab === id
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:bg-gray-700"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{
                      x: 5,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        ></motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Dashboard Content */}
        <div className="p-4 md:p-6 lg:p-8 overflow-auto h-[calc(100vh-4rem)] lg:h-screen">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Dashboard
              </motion.h2>
              <motion.p
                className="text-gray-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Welcome back, Admin User
              </motion.p>
            </div>
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.div
                className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 flex items-center"
                whileHover={{
                  backgroundColor: "rgba(55, 65, 81, 1)",
                  scale: 1.05,
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span>{format(new Date(), "MMMM d, yyyy")}</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
