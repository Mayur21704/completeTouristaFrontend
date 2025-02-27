import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Home,
  Luggage,
  Plane,
  RefreshCw,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";

const PaymentSuccess = () => {
  // Simulated booking data (in real app, this would come from your API/DB)
  const bookingData = useSelector((state) => state.booking.bookingData);
  const ticketUrl = bookingData.ticketUrl;

  const downloadImage = async () => {
    // Fetch the image as a Blob
    const response = await fetch(ticketUrl);
    const blob = await response.blob();

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob); // Create an object URL for the blob
    link.download = `ticket-${Date.now()}.png`; // Name the file dynamically

    // Append the link to the document, trigger a click, and then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (duration) => {
    const matches = duration.match(/PT(\d+)H(\d+)M/);
    if (matches) {
      const [_, hours, minutes] = matches;
      return `${hours}h ${minutes}m`;
    }
    return duration;
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Your flight has been successfully booked. For ticket Click on
            View/Download Button.
          </p>
        </motion.div>

        {/* Booking Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
          variants={itemVariants}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-100 text-sm">Booking Reference</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Airline Info */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center p-2">
                <img
                  src={bookingData.selectedFlights.airlineLogo}
                  alt={bookingData.selectedFlights.airlineName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {bookingData.selectedFlights.airlineName}
                </h3>
                <div className="flex items-center gap-2 text-gray-500">
                  <Luggage className="w-4 h-4" />
                  <span>
                    {
                      bookingData.selectedFlights.travelerPricings[0]
                        .fareDetailsBySegment[0].includedCheckedBags.weight
                    }{" "}
                    {
                      bookingData.selectedFlights.travelerPricings[0]
                        .fareDetailsBySegment[0].includedCheckedBags.weightUnit
                    }{" "}
                    Baggage
                  </span>
                </div>
              </div>
            </div>

            {/* Flight Details */}
            {bookingData.selectedFlights.itineraries.map((itinerary, index) => (
              <div key={index} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  {index === 0 ? (
                    <Plane className="w-5 h-5 text-blue-500" />
                  ) : (
                    <RefreshCw className="w-5 h-5 text-green-500" />
                  )}
                  <h4 className="font-semibold text-gray-900">
                    {index === 0 ? "Outbound Flight" : "Return Flight"}
                  </h4>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {formatDate(itinerary.segments[0].departure.at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Duration: {formatDuration(itinerary.duration)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {itinerary.segments[0].departure.iataCode}
                      </p>
                      <p className="text-sm text-gray-500">
                        Terminal {itinerary.segments[0].departure.terminal}
                      </p>
                    </div>

                    <div className="flex-1 px-4">
                      <div className="relative">
                        <div className="absolute left-0 right-0 top-1/2 border-t-2 border-gray-300 border-dashed" />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {itinerary.segments[0].arrival.iataCode}
                      </p>
                      <p className="text-sm text-gray-500">
                        Terminal {itinerary.segments[0].arrival.terminal}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    Flight {itinerary.segments[0].number} • Seats:{" "}
                    {Object.keys(
                      index === 0
                        ? bookingData.passengers.outboundSeats
                        : bookingData.passengers.returnSeats
                    ).join(", ")}
                  </div>
                </div>
              </div>
            ))}

            {/* Passenger Details */}
            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                Passenger Details
              </h4>

              {bookingData.passengers.adults.map((passenger, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {passenger.firstName} {passenger.lastName}
                    </p>
                    <p className="text-sm text-gray-500">Adult</p>
                  </div>
                </div>
              ))}

              {bookingData.passengers.children.map((passenger, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {passenger.firstName} {passenger.lastName}
                    </p>
                    <p className="text-sm text-gray-500">Child</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="border-t border-gray-100 pt-6 mt-6">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Total Amount Paid</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹
                  {parseFloat(
                    bookingData.selectedFlights.price.total
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
          variants={itemVariants}
        >
          {/* View Ticket Button */}
          <a
            href={ticketUrl} // Cloudinary URL
            target="_blank" // This ensures the image is opened in a new tab
            rel="noopener noreferrer" // Security best practice when opening in a new tab
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <img src={ticketUrl} alt="Ticket Preview" className="w-5 h-5" />
            View Ticket
          </a>

          {/* Download Ticket Button */}
          <button
            onClick={downloadImage} // Cloudinary URL
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Ticket
          </button>
        </motion.div>

        {/* Return Home */}
        <motion.div className="text-center" variants={itemVariants}>
          <button className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Home className="w-5 h-5" />
            Return to Home
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;
