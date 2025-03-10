import { motion } from "framer-motion";
import gsap from "gsap";
import {
  Baby,
  BedDouble,
  Calendar,
  Car,
  Clock,
  Coffee,
  Mail,
  MapPin,
  Star,
  Users,
  Utensils,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";
import axios from "axios";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const HotelPaymentSuccess = () => {
  const bookingData = useSelector(
    (state) => state.hotelbooking.hotelbookingData
  );
  const { numberOfNights } = useSelector((state) => state.hotel.filters);
  const successRef = useRef();

  // State to store the city and country
  const [location, setLocation] = useState({ city: "", country: "" });

  useEffect(() => {
    const fetchLocationInfo = async () => {
      const lat = bookingData.selectedRoomWithHotel.hotel.geoCode?.latitude;
      const lon = bookingData.selectedRoomWithHotel.hotel.geoCode?.longitude;

      try {
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=b1848a3076274113bdfc659c3e0731bb`
        );
        const locationData = response.data.results[0]; // Assuming the first result is the best one

        const city =
          locationData.components.state_district ||
          locationData.components.city ||
          locationData.components.town ||
          locationData.components.village;
        const country = locationData.components.country;

        // Update the state with the city and country
        setLocation({ city, country });
      } catch (error) {
        console.error("Error fetching location info", error);
      }
    };

    if (bookingData.selectedRoomWithHotel.hotel.geoCode) {
      fetchLocationInfo();
    }
  }, [bookingData]);

  useEffect(() => {
    // Show success toast

    if (successRef.current) {
      gsap.from(successRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
    }
  }, []);

  if (!bookingData) return null;

  const {
    selectedRoomWithHotel: { hotel, room, offer },
    guests,
    createdAt,
  } = bookingData;
  const bookingDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalGuests = guests.adults.length + (guests.children?.length || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        {/* Hotel Images Slider */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8 rounded-xl overflow-hidden shadow-lg"
        >
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 3000 }}
            loop={true}
            className="h-64 w-full"
          >
            {hotel.hotelImages.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`${hotel.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Booking Details */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Hotel Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {hotel.name}
                </h2>
                <div className="flex items-center mt-2">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  {/* Use city and country from API */}
                  <span className="text-gray-600">
                    {location.city}, {location.country}
                  </span>
                  <div className="ml-4 flex items-center">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="ml-1">{hotel.reviews.totalRatings}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Booking Date</p>
                <p className="font-semibold">{bookingDate}</p>
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={fadeInUp} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Room Details
                </h3>
                <div className="flex items-center">
                  <BedDouble className="w-5 h-5 text-blue-600 mr-2" />
                  <span>
                    {room.roomType} - {room.bedType}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                  <span>{totalGuests} Guests</span>
                </div>
                <div className="mt-2 space-y-1">
                  {room.highlights.map((highlight, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {highlight}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Package Inclusions
                </h3>
                {offer.inclusions.map((inclusion, index) => (
                  <div key={index} className="flex items-center">
                    {index === 0 && (
                      <Utensils className="w-5 h-5 text-blue-600 mr-2" />
                    )}
                    {index === 1 && (
                      <Coffee className="w-5 h-5 text-blue-600 mr-2" />
                    )}
                    {index === 2 && (
                      <Clock className="w-5 h-5 text-blue-600 mr-2" />
                    )}
                    {index === 3 && (
                      <Car className="w-5 h-5 text-blue-600 mr-2" />
                    )}
                    <span>{inclusion.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Guest Information */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Guest Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={fadeInUp} className="space-y-6">
                {/* Adults Section */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                    <Users className="w-5 h-5 text-gray-500 mr-2" />
                    Adults
                  </h4>
                  <div className="space-y-4">
                    {guests.adults.map((adult, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium">
                          {adult.firstName} {adult.lastName}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {new Date(adult.dob).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Children Section */}
                {guests.children && guests.children.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                      <Baby className="w-5 h-5 text-gray-500 mr-2" />
                      Children
                    </h4>
                    <div className="space-y-4">
                      {guests.children.map((child, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="font-medium">
                            {child.firstName} {child.lastName}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {new Date(child.dob).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center pt-2">
                  <Mail className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-gray-600">{guests.email}</span>
                </div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-green-50 p-4 rounded-lg"
              >
                <h4 className="font-semibold text-green-800 mb-2">
                  Payment Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-green-700">
                    <span>Room Charges({numberOfNights} Nights)</span>
                    <span>₹{offer.price.discounted * numberOfNights}</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>Taxes & Fees</span>
                    <span>₹{offer.price.taxesAndFees * numberOfNights}</span>
                    {/* selectedRoom?.offer?.price?.taxesAndFees * numberOfNights */}
                  </div>
                  <div className="flex justify-between font-bold text-green-800 pt-2 border-t border-green-200">
                    <span>Total Paid</span>
                    <span>₹{offer.price.total}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="bg-green-50 p-4 rounded-lg"
        >
          <h4 className="font-semibold text-green-800 mb-2">
            Booking Confirmation Sent!
          </h4>
          <p>
            We have sent a confirmation email to {guests.email}. Please check
            your inbox.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HotelPaymentSuccess;
