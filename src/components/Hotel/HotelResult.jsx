import {
  setHotelData,
  setSelectedHotelFromRedux,
} from "@/src/store/hotelReducer";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import LocomotiveScroll from "locomotive-scroll";
import {
  ArrowRight,
  ArrowUpDown,
  Award,
  Moon,
  Plus,
  Star,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLazyGetHotelsQuery } from "../../store/api/hotelApi";

const HotelCard = ({ hotel, onBook, onShowAmenities, index }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  const { adults, children, numberOfNights } = useSelector(
    (state) => state.hotel.filters
  );

  const nightlyPrice = hotel.rooms[0].offers[0]?.price.discounted;
  const totalPrice = hotel.rooms[0].offers[0]?.price.total;
  const taxesAndFees =
    hotel.rooms[0].offers[0]?.price.taxesAndFees * numberOfNights;

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          x: -50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power3.out",
        }
      );
    }
  }, []);

  useEffect(() => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
      });
    }
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-500"
      whileHover={{ y: -4 }}
    >
      <div className="flex items-stretch">
        <div className="w-[280px] relative overflow-hidden">
          <motion.div
            ref={imageRef}
            initial={{ scale: 1.2 }}
            className="w-full h-full"
          >
            <img
              src={hotel.hotelImages[0]}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
          >
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-900">
              {hotel.reviews.totalRatings}
            </span>
          </motion.div>
        </div>

        <div className="flex-1 p-6 flex">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {hotel.name}
                </h2>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-2xl font-bold text-blue-600">
                  ₹{nightlyPrice.toLocaleString()}
                </div>
                <span className="text-sm text-gray-500">per night</span>
                <div className="text-sm text-gray-600 font-medium">
                  + ₹{taxesAndFees.toLocaleString()} taxes & fees
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 bg-blue-50 rounded-full flex items-center"
              >
                <Users className="w-4 h-4 text-blue-600 mr-1.5" />
                <span className="text-sm text-gray-700">
                  {adults} {adults === 1 ? "Adult" : "Adults"}
                  {children > 0 && (
                    <span>
                      , {children} {children === 1 ? "Child" : "Children"}
                    </span>
                  )}
                </span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="px-3 py-1.5 bg-blue-50 rounded-full flex items-center"
              >
                <Moon className="w-4 h-4 text-blue-600 mr-1.5" />
                <span className="text-sm text-gray-700">
                  {numberOfNights} {numberOfNights === 1 ? "Night" : "Nights"}
                </span>
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {hotel.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="text-sm text-gray-600 flex items-center"
                >
                  <Award className="w-3 h-3 text-blue-600 mr-1" />
                  {amenity}
                  {index < 2 && <span className="mx-2">•</span>}
                </span>
              ))}
              {hotel.amenities.length > 3 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onShowAmenities(hotel)}
                  className="text-sm text-blue-600 font-medium flex items-center hover:text-blue-700"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {hotel.amenities.length - 3} more
                </motion.button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Total:{" "}
                <span className="text-lg font-bold text-gray-900">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onBook(hotel)}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Book Now
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const HotelResult = () => {
  const scrollRef = useRef(null);
  const [locomotiveScroll, setLocomotiveScroll] = useState(null);

  useEffect(() => {
    // Ensure that the DOM element is available before initializing LocomotiveScroll
    if (scrollRef.current && !locomotiveScroll) {
      const scroll = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
        multiplier: 0.8,
      });

      setLocomotiveScroll(scroll);
    }

    return () => {
      // Clean up the scroll instance when the component unmounts
      if (locomotiveScroll) {
        locomotiveScroll.destroy();
      }
    };
  }, [locomotiveScroll]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { location } = useSelector((state) => state.hotel.filters);
  const [getHotels, { data: originalData, isLoading, isError }] =
    useLazyGetHotelsQuery();
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (location) {
      getHotels(location);
    }
  }, [location, getHotels]);

  useEffect(() => {
    if (originalData && Array.isArray(originalData)) {
      dispatch(setHotelData(originalData));
      setData(originalData);
    }
  }, [originalData, dispatch]);

  const handleSort = (order) => {
    setSortOrder(order);
    const sortedData = [...data].sort((a, b) => {
      const priceA = a.rooms[0].offers[0]?.price.total || 0;
      const priceB = b.rooms[0].offers[0]?.price.total || 0;
      return order === "lowToHigh" ? priceA - priceB : priceB - priceA;
    });
    setData(sortedData);
  };

  const handleBook = (hotel) => {
    dispatch(setSelectedHotelFromRedux(hotel));
    navigate(`/hotelDetail/${hotel.hotelId}`);
  };

  const handleShowAmenities = (hotel) => {
    setSelectedHotel(hotel);
    setShowAmenitiesModal(true);
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
        <p className="text-lg font-semibold text-gray-900">Loading hotels...</p>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            className="text-4xl mb-4"
          >
            ⚠️
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't load the hotels. Please try again.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => getHotels(location)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Try Again
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-4xl mb-4"
          >
            🏨
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Hotels Found
          </h2>
          <p className="text-gray-600">
            We couldn't find any hotels for the selected location.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div ref={scrollRef} className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Find Your Perfect Stay
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-4 mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSort("lowToHigh")}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
                sortOrder === "lowToHigh"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ArrowUpDown size={16} />
              Price: Low to High
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSort("highToLow")}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
                sortOrder === "highToLow"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ArrowUpDown size={16} />
              Price: High to Low
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="space-y-4"
        >
          {data.map((hotel, index) => (
            <HotelCard
              key={hotel.hotelId}
              hotel={hotel}
              onBook={handleBook}
              onShowAmenities={handleShowAmenities}
              index={index}
            />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {showAmenitiesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAmenitiesModal(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedHotel?.name} - All Amenities
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAmenitiesModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </motion.button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {selectedHotel?.amenities.map((amenity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center p-3 bg-gray-50 rounded-xl"
                  >
                    <Award className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-gray-700">{amenity}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HotelResult;
