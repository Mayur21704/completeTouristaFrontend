import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import {
  AlertTriangle,
  Bath,
  BedDouble,
  Calendar,
  CheckCircle,
  Clock,
  Coffee,
  Download,
  Hotel,
  Info,
  Loader2,
  Mail,
  MapPin,
  Plane,
  Star,
  Ticket,
  Timer,
  Users,
  Weight,
  Wifi,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  useCancelBookingMutation,
  useGetUserBookingsQuery,
} from "../store/api/bookingApi";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { data, error, isLoading, refetch } = useGetUserBookingsQuery(
    user?.uid
  );
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [cancellingFlightId, setCancellingFlightId] = useState(null);
  const [recentlyCancelled, setRecentlyCancelled] = useState(null);

  const navigate = useNavigate();

  const [cancelBooking, { isLoading: isCancelling }] =
    useCancelBookingMutation();
  const bookings = data?.bookings || [];

  const handleCancelClick = (flightId) => {
    setSelectedFlightId(flightId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedFlightId) return;

    try {
      setCancellingFlightId(selectedFlightId);
      await cancelBooking(selectedFlightId).unwrap();
      setRecentlyCancelled(selectedFlightId);
      await refetch();

      toast.success(
        <div className="flex items-center space-x-2">
          <span>✈️</span>
          <div>
            <p className="font-medium">Flight Cancelled Successfully</p>
            <p className="text-sm text-gray-600">
              Your refund will be processed shortly
            </p>
          </div>
        </div>,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      setShowCancelModal(false);

      setTimeout(() => {
        setRecentlyCancelled(null);
      }, 2000);
    } catch (err) {
      toast.error(
        <div className="flex items-center space-x-2">
          <span>❌</span>
          <div>
            <p className="font-medium">Failed to Cancel Flight</p>
            <p className="text-sm text-gray-600">
              Please try again or contact support
            </p>
          </div>
        </div>
      );
      console.error("Error cancelling flight:", err);
    } finally {
      setCancellingFlightId(null);
      setSelectedFlightId(null);
    }
  };

  const renderFlightActions = (booking) => {
    const isCancelled = booking.status === "cancelled";
    const isRecentlyCancelled = recentlyCancelled === booking._id;

    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
        <p className="text-lg font-semibold">
          ₹{Number(booking.selectedFlights.price.total).toLocaleString()}
        </p>
        {!isCancelled && (
          <div className="flex flex-wrap gap-3">
            <motion.button
              onClick={() => handleCancelClick(booking._id)}
              whileHover={{ scale: 1.02, backgroundColor: "#FEE2E2" }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                cancellingFlightId === booking._id
                  ? "bg-red-100 text-red-600 opacity-50 cursor-not-allowed"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
              disabled={cancellingFlightId === booking._id}
            >
              {cancellingFlightId === booking._id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4" />
                  <span>Cancel Flight</span>
                </>
              )}
            </motion.button>
            {booking.ticketUrl && (
              <motion.a
                href={booking.ticketUrl}
                download
                className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all duration-200"
                whileHover={{ scale: 1.02, backgroundColor: "#DCFCE7" }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4" />
                <span className="font-medium">Download</span>
              </motion.a>
            )}
          </div>
        )}
        {isCancelled && (
          <motion.div
            initial={isRecentlyCancelled ? { opacity: 0, scale: 0.9 } : false}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg"
          >
            <X className="w-4 h-4" />
            <span className="font-medium">Flight Cancelled</span>
          </motion.div>
        )}
      </div>
    );
  };

  const CancelModal = () => (
    <AnimatePresence>
      {showCancelModal && (
        <div className="fixed inset-0 z-[9999]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full shadow-xl relative pointer-events-auto mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Cancel Flight
                  </h3>
                  <p className="text-gray-600">
                    Are you sure you want to cancel this flight? This action
                    cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={isCancelling}
                >
                  Keep Flight
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmCancel}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Cancelling...
                    </>
                  ) : (
                    "Yes, Cancel Flight"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );

  useEffect(() => {
    if (bookings.length > 0) {
      gsap.from(".booking-card", {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(".stat-card", {
        scale: 0.9,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "back.out(1.7)",
      });
    }
  }, [bookings]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your travel history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      >
        <div className="text-red-500 bg-red-50 p-6 rounded-xl shadow-sm max-w-md text-center">
          <div className="mb-4">😕</div>
          <h3 className="text-xl font-semibold mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-600">
            We could not load your bookings at the moment. Please try again
            later.
          </p>
        </div>
      </motion.div>
    );
  }

  const totalFlightBookings = bookings.filter((b) => b.selectedFlights).length;
  const totalHotelBookings = bookings.filter(
    (b) => b.selectedRoomWithHotel
  ).length;

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm sm:text-base font-semibold text-white flex text-center">
                    {user?.displayName}
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Welcome back!
                  </h1>
                  <div className="flex items-center space-x-3 mt-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-sm sm:text-base text-gray-600 break-all">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <motion.div
              className="stat-card bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
              whileHover={{ y: -5 }}
            >
              <Plane className="w-8 h-8 mb-4 opacity-90" />
              <h3 className="text-lg font-medium opacity-90">
                Flight Bookings
              </h3>
              <p className="text-3xl font-bold mt-2">{totalFlightBookings}</p>
            </motion.div>

            <motion.div
              className="stat-card bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white"
              whileHover={{ y: -5 }}
            >
              <Hotel className="w-8 h-8 mb-4 opacity-90" />
              <h3 className="text-lg font-medium opacity-90">Hotel Bookings</h3>
              <p className="text-3xl font-bold mt-2">{totalHotelBookings}</p>
            </motion.div>
          </div>

          {/* Bookings List */}
          <div className="space-y-6 sm:space-y-8">
            {bookings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-8 sm:p-12 text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plane className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No bookings yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start your journey by booking your first trip!
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Explore Destinations
                </button>
              </motion.div>
            ) : (
              bookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  initial={
                    recentlyCancelled === booking._id
                      ? { opacity: 1, height: "auto" }
                      : false
                  }
                  animate={
                    recentlyCancelled === booking._id
                      ? { opacity: 0, height: 0 }
                      : { opacity: 1, height: "auto" }
                  }
                  className="booking-card bg-white rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.01 }}
                >
                  {booking.selectedFlights && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Plane className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              Flight Booking
                            </h3>
                            <p className="text-gray-600">
                              {booking.selectedFlights.airlineName}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600">
                              {format(
                                new Date(booking.createdAt),
                                "MMM dd, yyyy"
                              )}
                            </span>
                          </div>
                          {booking.ticketUrl &&
                            !booking.status.includes("cancelled") && (
                              <motion.a
                                href={booking.ticketUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Ticket className="w-4 h-4" />
                                <span className="font-medium">View Ticket</span>
                              </motion.a>
                            )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <span className="text-sm sm:text-base">
                            {booking.selectedFlights.itineraries[0]?.segments[0]
                              ?.departure.iataCode || "N/A"}{" "}
                            →{" "}
                            {booking.selectedFlights.itineraries[0]?.segments[0]
                              ?.arrival.iataCode || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span className="text-sm sm:text-base">
                            {format(
                              new Date(
                                booking.selectedFlights.itineraries[0]
                                  ?.segments[0]?.departure.at || new Date()
                              ),
                              "MMM dd, yyyy HH:mm"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-gray-400" />
                          <span className="text-sm sm:text-base">
                            {booking.passengers.adults.length} Adults
                            {booking.passengers.children.length > 0 &&
                              `, ${booking.passengers.children.length} Children`}
                          </span>
                        </div>
                      </div>

                      {/* Flight Details Section */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <Timer className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600">Duration</p>
                              <p className="font-medium">
                                {booking.selectedFlights.itineraries[0]?.duration
                                  ?.replace("PT", "")
                                  .replace("H", "h ")
                                  .replace("M", "m") || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Weight className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600">Baggage</p>
                              <p className="font-medium">
                                {booking.selectedFlights.travelerPricings[0]
                                  ?.fareDetailsBySegment[0]?.includedCheckedBags
                                  ?.weight || 0}
                                {booking.selectedFlights.travelerPricings[0]
                                  ?.fareDetailsBySegment[0]?.includedCheckedBags
                                  ?.weightUnit || "kg"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Info className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-600">Seat</p>
                              <p className="font-medium">
                                {booking.passengers.adults[0]?.seatNumber ||
                                  "Not assigned"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {booking.selectedFlights.travelerPricings[0]?.fareDetailsBySegment[0]?.amenities?.map(
                          (amenity, index) => (
                            <div
                              key={index}
                              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                                amenity.isChargeable
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              <span>{amenity.description}</span>
                            </div>
                          )
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t gap-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-green-600 capitalize">
                            {booking.status}
                          </span>
                        </div>
                        {renderFlightActions(booking)}
                      </div>
                    </div>
                  )}

                  {booking.selectedRoomWithHotel && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Hotel className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              Hotel Booking
                            </h3>
                            <p className="text-gray-600">
                              {booking.selectedRoomWithHotel.hotel.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-600">
                            {format(
                              new Date(booking.createdAt),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                      </div>

                      {booking.selectedRoomWithHotel.hotel.hotelImages && (
                        <Swiper
                          modules={[Navigation, Pagination]}
                          navigation
                          pagination={{ clickable: true }}
                          className="rounded-xl overflow-hidden"
                          spaceBetween={0}
                          slidesPerView={1}
                        >
                          {booking.selectedRoomWithHotel.hotel.hotelImages.map(
                            (image, index) => (
                              <SwiperSlide key={index}>
                                <img
                                  src={image}
                                  alt={`Hotel view ${index + 1}`}
                                  className="w-full h-48 sm:h-72 object-cover"
                                />
                              </SwiperSlide>
                            )
                          )}
                        </Swiper>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center space-x-2">
                            <BedDouble className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">
                              {booking.selectedRoomWithHotel.room.roomType} Room
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {booking.selectedRoomWithHotel.room.roomSize}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">
                              {booking.guests?.adults.length || 0} Adults
                              {(booking.guests?.children.length || 0) > 0 &&
                                `, ${booking.guests?.children.length} Children`}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-gray-400" />
                            <span className="font-medium">
                              Rating:{" "}
                              {
                                booking.selectedRoomWithHotel.hotel.reviews
                                  .totalRatings
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                        {booking.selectedRoomWithHotel.room.highlights.map(
                          (highlight, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm"
                            >
                              {highlight === "Free Wi-Fi" && (
                                <Wifi className="w-4 h-4" />
                              )}
                              {highlight === "City view" && (
                                <MapPin className="w-4 h-4" />
                              )}
                              {highlight === "Private bathroom" && (
                                <Bath className="w-4 h-4" />
                              )}
                              {highlight === "Air conditioning" && (
                                <Coffee className="w-4 h-4" />
                              )}
                              <span>{highlight}</span>
                            </div>
                          )
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t gap-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-green-600 capitalize">
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-lg font-semibold">
                          ₹
                          {booking.selectedRoomWithHotel.offer.price.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
      <CancelModal />
    </>
  );
};

export default Profile;
