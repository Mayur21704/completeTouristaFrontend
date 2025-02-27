

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Mail,
  Plane,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreatePaymentMutation } from "../store/api/paymentApi";
import { resetPassengerSeats } from "../store/passengerReducer";

const BookingSummary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [createPayment] = useCreatePaymentMutation();

  const [passengerData, setPassengerData] = useState({
    adults: [],
    children: [],
    email: "",
    outboundSeats: {},
    returnSeats: {},
  });

  const [isOutboundOpen, setIsOutboundOpen] = useState(true);
  const [isReturnOpen, setIsReturnOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { currencySymbol } = useSelector((state) => state.flight);
  const persistedData =
    JSON.parse(localStorage.getItem("persist:flight")) || {};
  const selectedFlight = JSON.parse(persistedData.selectedFlight);

  useEffect(() => {
    const persistPassengerData = localStorage.getItem("persist:passenger");
    if (persistPassengerData) {
      try {
        const parsedData = JSON.parse(persistPassengerData);
        const adults = JSON.parse(parsedData.adults || "[]");
        const children = JSON.parse(parsedData.children || "[]");
        setPassengerData({
          adults,
          children,
          email: parsedData.email.replace(/"/g, ""),
          outboundSeats: JSON.parse(parsedData.outboundSeats),
          returnSeats: JSON.parse(parsedData.returnSeats),
        });
      } catch (error) {
        console.error("Error parsing data from localStorage:", error);
      }
    }
  }, []);

  const logSeatsForPassenger = (passengers, outboundSeats, returnSeats) => {
    if (!Array.isArray(passengers)) {
      console.error("Expected an array of passengers, but got:", passengers);
      return [];
    }

    return passengers.map((passenger) => {
      const outboundSeat = Object.keys(outboundSeats).find(
        (seat) => outboundSeats[seat] === passenger.travelerId
      );
      const returnSeat = Object.keys(returnSeats).find(
        (seat) => returnSeats[seat] === passenger.travelerId
      );

      return {
        name: `${passenger.firstName} ${passenger.lastName}`,
        outboundSeat: outboundSeat || "No outbound seat assigned",
        returnSeat: returnSeat || "No return seat assigned",
      };
    });
  };

  const { adults, children, outboundSeats, returnSeats, email } = passengerData;
  const adultsWithSeats = logSeatsForPassenger(
    adults,
    outboundSeats,
    returnSeats
  );
  const childrenWithSeats = logSeatsForPassenger(
    children,
    outboundSeats,
    returnSeats
  );

  const isRoundTrip =
    selectedFlight.itineraries && selectedFlight.itineraries.length > 1;
  const taxesFees = selectedFlight.price.total - selectedFlight.price.base;
  let roundedTaxesFees = taxesFees.toFixed(2);

  const toggleOutbound = () => setIsOutboundOpen(!isOutboundOpen);
  const toggleReturn = () => setIsReturnOpen(!isReturnOpen);

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    try {
      const response = await createPayment(selectedFlight.price).unwrap();
      navigate(`/Checkout`, {
        state: { clientSecret: response.clientSecret, id: selectedFlight.id },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Error creating booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const goBackBtn = () => {
    dispatch(resetPassengerSeats());
    navigate(`/seatBooking/${selectedFlight.id}/1`);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.section
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-gray-100 p-8 shadow-xl backdrop-blur-sm backdrop-filter">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side */}
          <div className="lg:w-2/3">
            {/* Flight Info Header */}
            <motion.div
              className="border-b border-gray-100 pb-6 mb-6"
              variants={fadeInVariants}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Flight Summary
              </h2>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <motion.div
                  className="w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={selectedFlight.airlineLogo}
                    alt="Airline"
                    className="w-10 h-10 object-contain"
                  />
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedFlight.airlineName}
                  </h3>
                  <p className="text-gray-500">Flight AI678</p>
                </div>
              </div>
            </motion.div>

            {/* Outbound Flight */}
            <motion.div
              className="border-b border-gray-100 pb-6 mb-6"
              variants={fadeInVariants}
            >
              <motion.div
                className="flex justify-between items-center cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={toggleOutbound}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-3">
                  <Plane className="text-blue-500" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Outbound Flight
                  </h3>
                </div>
                {isOutboundOpen ? <ChevronUp /> : <ChevronDown />}
              </motion.div>

              <AnimatePresence>
                {isOutboundOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {/* Passengers List */}
                    <PassengersList
                      title="Adults"
                      passengers={adultsWithSeats}
                      seatType="outbound"
                    />
                    {children.length > 0 && (
                      <PassengersList
                        title="Children"
                        passengers={childrenWithSeats}
                        seatType="outbound"
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Return Flight (if round trip) */}
            {isRoundTrip && (
              <motion.div
                className="border-b border-gray-100 pb-6 mb-6"
                variants={fadeInVariants}
              >
                <motion.div
                  className="flex justify-between items-center cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={toggleReturn}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <Plane className="text-blue-500 transform rotate-180" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      Return Flight
                    </h3>
                  </div>
                  {isReturnOpen ? <ChevronUp /> : <ChevronDown />}
                </motion.div>

                <AnimatePresence>
                  {isReturnOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <PassengersList
                        title="Adults"
                        passengers={adultsWithSeats}
                        seatType="return"
                      />
                      {children.length > 0 && (
                        <PassengersList
                          title="Children"
                          passengers={childrenWithSeats}
                          seatType="return"
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Contact Info */}
            <motion.div variants={fadeInVariants} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Contact Details
              </h3>
              <motion.div
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <Mail className="text-blue-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-800">{email}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side - Fare Summary */}
          <motion.div className="lg:w-1/3" variants={fadeInVariants}>
            <div className="sticky top-6">
              <motion.div
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Fare Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-semibold">
                      {currencySymbol}
                      {selectedFlight.price.base}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="font-semibold">
                      {currencySymbol}
                      {roundedTaxesFees}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-800">
                        Total
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {currencySymbol}
                        {selectedFlight.price.total}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <motion.button
                    onClick={goBackBtn}
                    className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center justify-center gap-2 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Seats
                  </motion.button>

                  <motion.button
                    onClick={handleConfirmBooking}
                    disabled={isLoading}
                    className={`w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors ${
                      isLoading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CreditCard className="w-4 h-4" />
                    {isLoading ? "Processing..." : "Proceed to Payment"}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

const PassengersList = ({ title, passengers, seatType }) => {
  return (
    <div className="mt-4 space-y-4">
      <h4 className="text-lg font-medium text-gray-700 ml-4">{title}</h4>
      {passengers.map((passenger, idx) => (
        <motion.div
          key={idx}
          className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { delay: idx * 0.1 },
            },
          }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <User className="text-blue-500 w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">{passenger.name}</h4>
              <p className="text-sm text-gray-500">
                {seatType === "outbound"
                  ? passenger.outboundSeat
                  : passenger.returnSeat}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BookingSummary;
