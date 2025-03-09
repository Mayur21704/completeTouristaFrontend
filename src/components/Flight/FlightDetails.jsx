// import { AnimatePresence, motion } from "framer-motion";
// import {
//   ArrowLeft,
//   Clock,
//   Luggage,
//   Package,
//   Plane,
//   RefreshCw,
// } from "lucide-react";
// import { FaRegSmileBeam, FaSuitcase } from "react-icons/fa";
// import { GiMoneyStack } from "react-icons/gi";
// import { IoIosArrowForward } from "react-icons/io";
// import { MdCancel, MdCheckCircle } from "react-icons/md";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// const FlightDetails = () => {
//   const { id } = useParams();
//   const { singleFlights, roundTripFlights, currencySymbol, filters } =
//     useSelector((state) => state.flight);

//   // Find the flight based on the ID from Redux store
//   const flight =
//     singleFlights.data.find((flight) => flight.id === id) ||
//     roundTripFlights.data.find((flight) => flight.id === id);

//   const navigate = useNavigate();

//   if (!flight) {
//     return <div>Flight not found!</div>;
//   }

//   const handleGoBack = () => {
//     navigate("/flights");
//   };

//   const handleContinueToSeatSelection = () => {
//     navigate(`/passenger/${id}`);
//   };

//   const amenityIcons = {
//     PRE_RESERVED_SEAT: <MdCheckCircle className="text-green-500" />,
//     MEAL: <FaRegSmileBeam className="text-yellow-500" />,
//     REFUNDABLE_TICKET: <MdCancel className="text-red-500" />,
//     FREE_CHECKED_BAGGAGE: <FaSuitcase className="text-blue-500" />,
//     CHANGEABLE_TICKET: <IoIosArrowForward className="text-blue-500" />,
//     BRANDED_FARES: <GiMoneyStack className="text-gray-500" />,
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     show: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//       },
//     },
//   };

//   return (
//     <motion.section
//       initial="hidden"
//       animate="show"
//       variants={containerVariants}
//       className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-12 sm:px-6 lg:px-8"
//     >
//       <motion.div variants={itemVariants} className="max-w-5xl mx-auto">
//         <motion.div
//           className="bg-white rounded-2xl border border-gray-200/50 p-8 shadow-xl backdrop-blur-sm"
//           variants={itemVariants}
//         >
//           <motion.div className="mb-8" whileHover={{ x: -5 }}>
//             <motion.button
//               onClick={handleGoBack}
//               className="group flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
//               <span>Back to Flight Search</span>
//             </motion.button>
//           </motion.div>

//           <motion.div
//             className="border-b border-gray-200 pb-8 mb-8"
//             variants={itemVariants}
//           >
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//               <motion.div
//                 className="flex items-center mb-6 md:mb-0"
//                 whileHover={{ x: 5 }}
//               >
//                 <motion.div
//                   className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mr-6 border-2 border-blue-100"
//                   whileHover={{ rotate: 360 }}
//                   transition={{ duration: 0.5 }}
//                 >
//                   {flight.airlineLogo ? (
//                     <img
//                       src={flight.airlineLogo}
//                       alt={flight.airlineName}
//                       className="h-12 w-12 rounded-full object-cover"
//                     />
//                   ) : (
//                     <Plane className="w-10 h-10 text-blue-500" />
//                   )}
//                 </motion.div>
//                 <div>
//                   <motion.h2
//                     className="text-2xl font-bold text-gray-800"
//                     whileHover={{ y: -2 }}
//                   >
//                     {flight.airlineName}
//                   </motion.h2>
//                   <motion.p
//                     className="text-gray-500 flex items-center space-x-2"
//                     whileHover={{ x: 2 }}
//                   >
//                     <Plane className="w-4 h-4" />
//                     <span>Flight {flight.flightNumber}</span>
//                   </motion.p>
//                 </div>
//               </motion.div>

//               <motion.div className="text-right" whileHover={{ y: -3 }}>
//                 <motion.p
//                   className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
//                   whileHover={{ scale: 1.05 }}
//                 >
//                   Total {currencySymbol}
//                   {flight.price?.total || "N/A"}
//                 </motion.p>
//                 <motion.p
//                   className="text-sm text-gray-500 mt-1"
//                   whileHover={{ x: -2 }}
//                 >
//                   {Number(filters.adults) +
//                     " Adult" +
//                     (Number(filters.children)
//                       ? ` + ${Number(filters.children)} Children`
//                       : "")}
//                 </motion.p>
//               </motion.div>
//             </div>
//           </motion.div>

//           <motion.div className="space-y-6" variants={containerVariants}>
//             <AnimatePresence>
//               {flight.itineraries?.map((itinerary, idx) => {
//                 const isRoundTrip = roundTripFlights.data.length > 0;
//                 return (
//                   <motion.div
//                     key={idx}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ delay: idx * 0.2 }}
//                   >
//                     {isRoundTrip && idx > 0 && (
//                       <motion.div
//                         className="my-6 text-xl font-semibold text-gray-700 flex items-center space-x-2"
//                         whileHover={{ x: 5 }}
//                       >
//                         <RefreshCw className="w-5 h-5 text-blue-500" />
//                         <span>Return Flight</span>
//                       </motion.div>
//                     )}

//                     {itinerary?.segments.map((segment, segIdx) => (
//                       <motion.div
//                         key={segIdx}
//                         className="bg-white rounded-xl border border-gray-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
//                         whileHover={{
//                           scale: 1.02,
//                           boxShadow:
//                             "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//                         }}
//                       >
//                         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
//                           <motion.div
//                             className="text-center mb-4 md:mb-0"
//                             whileHover={{ y: -3 }}
//                           >
//                             <motion.div
//                               className="flex items-center space-x-2"
//                               whileHover={{ scale: 1.05 }}
//                             >
//                               <Clock className="w-5 h-5 text-blue-500" />
//                               <p className="text-2xl font-bold text-gray-800">
//                                 {new Date(
//                                   segment.departure?.at
//                                 ).toLocaleTimeString()}
//                               </p>
//                             </motion.div>
//                             <p className="text-lg text-gray-400">
//                               {new Date(
//                                 segment.departure?.at
//                               ).toLocaleDateString()}
//                             </p>
//                             <p className="text-gray-500 font-medium">
//                               {segment.departure?.iataCode}
//                             </p>
//                           </motion.div>

//                           <motion.div
//                             className="flex-1 px-8 flex flex-col items-center"
//                             whileHover={{ scale: 1.05 }}
//                           >
//                             <div className="w-full flex items-center justify-center mb-2">
//                               <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>
//                               <motion.div
//                                 animate={{
//                                   x: [0, 100, 0],
//                                   y: [0, -10, 0],
//                                 }}
//                                 transition={{
//                                   duration: 3,
//                                   repeat: Infinity,
//                                   ease: "linear",
//                                 }}
//                                 className="absolute"
//                               >
//                                 <Plane className="w-6 h-6 text-blue-500 transform -rotate-90" />
//                               </motion.div>
//                             </div>
//                             <p className="text-gray-500 font-medium">
//                               {segment.duration || "N/A"} •{" "}
//                               {segment.stopovers?.length > 0
//                                 ? "1 stop"
//                                 : "Non-stop"}
//                             </p>
//                           </motion.div>

//                           <motion.div
//                             className="text-center"
//                             whileHover={{ y: -3 }}
//                           >
//                             <motion.div
//                               className="flex items-center space-x-2"
//                               whileHover={{ scale: 1.05 }}
//                             >
//                               <Clock className="w-5 h-5 text-blue-500" />
//                               <p className="text-2xl font-bold text-gray-800">
//                                 {new Date(
//                                   segment.arrival?.at
//                                 ).toLocaleTimeString()}
//                               </p>
//                             </motion.div>
//                             <p className="text-lg text-gray-400">
//                               {new Date(
//                                 segment.arrival?.at
//                               ).toLocaleDateString()}
//                             </p>
//                             <p className="text-gray-500 font-medium">
//                               {segment.arrival?.iataCode}
//                             </p>
//                           </motion.div>
//                         </div>

//                         <motion.div
//                           className="text-sm text-gray-500 bg-blue-50/50 p-3 rounded-lg"
//                           whileHover={{ x: 5 }}
//                         >
//                           <p className="flex items-center space-x-2">
//                             <Plane className="w-4 h-4 text-blue-500" />
//                             <span>Flight No: {segment.number || "32A"}</span>
//                           </p>
//                           <p className="flex items-center space-x-2 mt-1">
//                             <Package className="w-4 h-4 text-blue-500" />
//                             <span>
//                               Departure Terminal:{" "}
//                               {segment.departure?.terminal || 3} | Arrival
//                               Terminal: {segment.arrival?.terminal || 3}
//                             </span>
//                           </p>
//                         </motion.div>
//                       </motion.div>
//                     ))}
//                   </motion.div>
//                 );
//               })}
//             </AnimatePresence>
//           </motion.div>

//           <motion.div
//             className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100"
//             variants={itemVariants}
//           >
//             <motion.h3
//               className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2"
//               whileHover={{ x: 5 }}
//             >
//               <Package className="w-5 h-5 text-blue-500" />
//               <span>Included Amenities</span>
//             </motion.h3>
//             <motion.div
//               className="grid grid-cols-2 md:grid-cols-4 gap-6"
//               variants={containerVariants}
//             >
//               {flight.travelerPricings[0].fareDetailsBySegment[0].amenities?.map(
//                 (amenity, idx) => (
//                   <motion.div
//                     key={idx}
//                     className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
//                     whileHover={{ scale: 1.05, y: -5 }}
//                   >
//                     <div className="flex items-center space-x-2">
//                       {amenityIcons[amenity.amenityType]}
//                       <span className="text-gray-700 font-medium capitalize">
//                         {amenity.description || "No description"}
//                       </span>
//                     </div>
//                     {amenity.isChargeable && (
//                       <span className="text-xs text-red-500 mt-1 block">
//                         + Chargeable
//                       </span>
//                     )}
//                   </motion.div>
//                 )
//               )}
//               <motion.div
//                 className="bg-white p-4 rounded-lg shadow-md"
//                 whileHover={{ scale: 1.05, y: -5 }}
//               >
//                 <p className="flex items-center space-x-2 text-gray-700 font-medium">
//                   <Luggage className="w-5 h-5 text-blue-500" />
//                   <span>Checked Bags</span>
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {
//                     flight.travelerPricings[0].fareDetailsBySegment[0]
//                       .includedCheckedBags.weight
//                   }{" "}
//                   {
//                     flight.travelerPricings[0].fareDetailsBySegment[0]
//                       .includedCheckedBags.weightUnit
//                   }
//                 </p>
//               </motion.div>
//               <motion.div
//                 className="bg-white p-4 rounded-lg shadow-md"
//                 whileHover={{ scale: 1.05, y: -5 }}
//               >
//                 <p className="flex items-center space-x-2 text-gray-700 font-medium">
//                   <Package className="w-5 h-5 text-blue-500" />
//                   <span>Carry-On Bag</span>
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">Free</p>
//               </motion.div>
//             </motion.div>
//           </motion.div>

//           <motion.div className="mt-10 text-center" variants={itemVariants}>
//             <motion.button
//               onClick={handleContinueToSeatSelection}
//               className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//               whileHover={{
//                 scale: 1.05,
//                 boxShadow:
//                   "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//               }}
//               whileTap={{ scale: 0.98 }}
//             >
//               Continue to Seat Selection
//             </motion.button>
//           </motion.div>
//         </motion.div>
//       </motion.div>
//     </motion.section>
//   );
// };

// export default FlightDetails;

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Luggage,
  Package,
  Plane,
  RefreshCw,
} from "lucide-react";
import { FaRegSmileBeam, FaSuitcase } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { IoIosArrowForward } from "react-icons/io";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const FlightDetails = () => {
  const { id } = useParams();
  const { singleFlights, roundTripFlights, currencySymbol, filters } =
    useSelector((state) => state.flight);

  // Find the flight based on the ID from Redux store
  const flight =
    singleFlights.data.find((flight) => flight.id === id) ||
    roundTripFlights.data.find((flight) => flight.id === id);

  const navigate = useNavigate();

  if (!flight) {
    return <div>Flight not found!</div>;
  }

  const handleGoBack = () => {
    navigate("/flights");
  };

  const handleContinueToSeatSelection = () => {
    navigate(`/passenger/${id}`);
  };

  const amenityIcons = {
    PRE_RESERVED_SEAT: <MdCheckCircle className="text-green-500" />,
    MEAL: <FaRegSmileBeam className="text-yellow-500" />,
    REFUNDABLE_TICKET: <MdCancel className="text-red-500" />,
    FREE_CHECKED_BAGGAGE: <FaSuitcase className="text-blue-500" />,
    CHANGEABLE_TICKET: <IoIosArrowForward className="text-blue-500" />,
    BRANDED_FARES: <GiMoneyStack className="text-gray-500" />,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.section
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8 sm:px-6 lg:px-8"
    >
      <motion.div variants={itemVariants} className="max-w-5xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl border border-gray-200/50 p-4 sm:p-6 lg:p-8 shadow-xl backdrop-blur-sm"
          variants={itemVariants}
        >
          <motion.div className="mb-6 sm:mb-8" whileHover={{ x: -5 }}>
            <motion.button
              onClick={handleGoBack}
              className="group flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Flight Search</span>
            </motion.button>
          </motion.div>

          <motion.div
            className="border-b border-gray-200 pb-6 sm:pb-8 mb-6 sm:mb-8"
            variants={itemVariants}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <motion.div className="flex items-center" whileHover={{ x: 5 }}>
                <motion.div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-50 flex items-center justify-center mr-4 sm:mr-6 border-2 border-blue-100"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {flight.airlineLogo ? (
                    <img
                      src={flight.airlineLogo}
                      alt={flight.airlineName}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                    />
                  ) : (
                    <Plane className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                  )}
                </motion.div>
                <div>
                  <motion.h2
                    className="text-xl sm:text-2xl font-bold text-gray-800"
                    whileHover={{ y: -2 }}
                  >
                    {flight.airlineName}
                  </motion.h2>
                  <motion.p
                    className="text-gray-500 flex items-center space-x-2"
                    whileHover={{ x: 2 }}
                  >
                    <Plane className="w-4 h-4" />
                    <span>Flight {flight.flightNumber}</span>
                  </motion.p>
                </div>
              </motion.div>

              <motion.div
                className="text-left sm:text-right"
                whileHover={{ y: -3 }}
              >
                <motion.p
                  className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  Total {currencySymbol}
                  {flight.price?.total || "N/A"}
                </motion.p>
                <motion.p
                  className="text-sm text-gray-500 mt-1"
                  whileHover={{ x: -2 }}
                >
                  {Number(filters.adults) +
                    " Adult" +
                    (Number(filters.children)
                      ? ` + ${Number(filters.children)} Children`
                      : "")}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-4 sm:space-y-6"
            variants={containerVariants}
          >
            <AnimatePresence>
              {flight.itineraries?.map((itinerary, idx) => {
                const isRoundTrip = roundTripFlights.data.length > 0;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.2 }}
                  >
                    {isRoundTrip && idx > 0 && (
                      <motion.div
                        className="my-4 sm:my-6 text-lg sm:text-xl font-semibold text-gray-700 flex items-center space-x-2"
                        whileHover={{ x: 5 }}
                      >
                        <RefreshCw className="w-5 h-5 text-blue-500" />
                        <span>Return Flight</span>
                      </motion.div>
                    )}

                    {itinerary?.segments.map((segment, segIdx) => (
                      <motion.div
                        key={segIdx}
                        className="bg-white rounded-xl border border-gray-200/50 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{
                          scale: 1.02,
                          boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        }}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4">
                          <motion.div
                            className="text-center w-full sm:w-auto"
                            whileHover={{ y: -3 }}
                          >
                            <motion.div
                              className="flex items-center justify-center sm:justify-start space-x-2"
                              whileHover={{ scale: 1.05 }}
                            >
                              <Clock className="w-5 h-5 text-blue-500" />
                              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                                {new Date(
                                  segment.departure?.at
                                ).toLocaleTimeString()}
                              </p>
                            </motion.div>
                            <p className="text-base sm:text-lg text-gray-400">
                              {new Date(
                                segment.departure?.at
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500 font-medium">
                              {segment.departure?.iataCode}
                            </p>
                          </motion.div>

                          <motion.div
                            className="flex-1 px-4 sm:px-8 flex flex-col items-center"
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="w-full flex items-center justify-center mb-2">
                              <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200"></div>
                              <motion.div
                                animate={{
                                  x: [0, 100, 0],
                                  y: [0, -10, 0],
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="absolute"
                              >
                                <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 transform -rotate-90" />
                              </motion.div>
                            </div>
                            <p className="text-sm sm:text-base text-gray-500 font-medium text-center">
                              {segment.duration || "N/A"} •{" "}
                              {segment.stopovers?.length > 0
                                ? "1 stop"
                                : "Non-stop"}
                            </p>
                          </motion.div>

                          <motion.div
                            className="text-center w-full sm:w-auto"
                            whileHover={{ y: -3 }}
                          >
                            <motion.div
                              className="flex items-center justify-center sm:justify-start space-x-2"
                              whileHover={{ scale: 1.05 }}
                            >
                              <Clock className="w-5 h-5 text-blue-500" />
                              <p className="text-xl sm:text-2xl font-bold text-gray-800">
                                {new Date(
                                  segment.arrival?.at
                                ).toLocaleTimeString()}
                              </p>
                            </motion.div>
                            <p className="text-base sm:text-lg text-gray-400">
                              {new Date(
                                segment.arrival?.at
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-gray-500 font-medium">
                              {segment.arrival?.iataCode}
                            </p>
                          </motion.div>
                        </div>

                        <motion.div
                          className="text-xs sm:text-sm text-gray-500 bg-blue-50/50 p-3 rounded-lg"
                          whileHover={{ x: 5 }}
                        >
                          <p className="flex items-center space-x-2">
                            <Plane className="w-4 h-4 text-blue-500" />
                            <span>Flight No: {segment.number || "32A"}</span>
                          </p>
                          <p className="flex items-center space-x-2 mt-1">
                            <Package className="w-4 h-4 text-blue-500" />
                            <span>
                              Departure Terminal:{" "}
                              {segment.departure?.terminal || 3} | Arrival
                              Terminal: {segment.arrival?.terminal || 3}
                            </span>
                          </p>
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-8 rounded-xl border border-blue-100"
            variants={itemVariants}
          >
            <motion.h3
              className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center space-x-2"
              whileHover={{ x: 5 }}
            >
              <Package className="w-5 h-5 text-blue-500" />
              <span>Included Amenities</span>
            </motion.h3>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              variants={containerVariants}
            >
              {flight.travelerPricings[0].fareDetailsBySegment[0].amenities?.map(
                (amenity, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="flex items-center space-x-2">
                      {amenityIcons[amenity.amenityType]}
                      <span className="text-sm sm:text-base text-gray-700 font-medium capitalize">
                        {amenity.description || "No description"}
                      </span>
                    </div>
                    {amenity.isChargeable && (
                      <span className="text-xs text-red-500 mt-1 block">
                        + Chargeable
                      </span>
                    )}
                  </motion.div>
                )
              )}
              <motion.div
                className="bg-white p-4 rounded-lg shadow-md"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <p className="flex items-center space-x-2 text-sm sm:text-base text-gray-700 font-medium">
                  <Luggage className="w-5 h-5 text-blue-500" />
                  <span>Checked Bags</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {
                    flight.travelerPricings[0].fareDetailsBySegment[0]
                      .includedCheckedBags.weight
                  }{" "}
                  {
                    flight.travelerPricings[0].fareDetailsBySegment[0]
                      .includedCheckedBags.weightUnit
                  }
                </p>
              </motion.div>
              <motion.div
                className="bg-white p-4 rounded-lg shadow-md"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <p className="flex items-center space-x-2 text-sm sm:text-base text-gray-700 font-medium">
                  <Package className="w-5 h-5 text-blue-500" />
                  <span>Carry-On Bag</span>
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Free</p>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-8 sm:mt-10 text-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={handleContinueToSeatSelection}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium px-6 sm:px-10 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{
                scale: 1.05,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              Continue to Seat Selection
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default FlightDetails;
