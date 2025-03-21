import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CreditCard, Lock, Shield } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateHotelBookingMutation } from "../../store/api/hotelbookingApi";
import { setBooking } from "../../store/hotelBookingSlice";

const stripePromise = loadStripe(
  "pk_test_51PP05QDaG0pF684dTp3Ow6opjd8xrx0oDDo9F5HX4hkTPJc95Obwn4u7IwWU3oGMSlQKIRq4Ke0iUzGhFuahcAO5002I2Ga6et"
);

const CheckoutHotel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const { currencySymbol } = useSelector((state) => state.flight);
  const { user } = useSelector((state) => state.auth);
  const { selectedRoomWithHotel } = useSelector((state) => state.hotel);
  const { numberOfNights } = useSelector((state) => state.hotel.filters);
  const { adults, children, email } = useSelector((state) => state.guest);

  const [createHotelBooking] = useCreateHotelBookingMutation();
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const { clientSecret } = location.state;

  const handlePayment = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setPaymentError("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      setPaymentError(error.message);
    } else if (paymentIntent.status === "succeeded") {

      const bookingData = {
        selectedRoomWithHotel: selectedRoomWithHotel,
        guests: { adults, children, email },
        userId: user.uid,
      };

      try {
        const response = await createHotelBooking(bookingData).unwrap();
        toast.success("Payment successful! Your booking is confirmed.");
        dispatch(setBooking(response.bookingData));

        setIsProcessing(false);
        // Navigate to success page after successful payment and booking
        navigate("/successhotel");
      } catch (error) {
        console.error("Error creating booking:", error);
        toast.error("Payment Error. Please try again.");
        navigate(
          `/booking/${selectedRoomWithHotel.hotelId}/${selectedRoomWithHotel.room.roomType}`
        );
        setIsProcessing(false);
      }
    }
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

  return (
    <motion.section
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-white rounded-2xl border border-gray-100 p-8 shadow-xl backdrop-blur-sm backdrop-filter"
          variants={cardVariants}
        >
          {/* Header */}
          <div className="border-b border-gray-100 pb-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Secure Checkout
            </h2>
            <p className="text-gray-500 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Your payment information is encrypted
            </p>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePayment} className="space-y-8">
            <motion.div
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <CreditCard className="text-blue-500 w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Payment Details
                </h3>
              </div>

              <div className="space-y-4">
                <PaymentElement
                  id="payment-element"
                  className="p-4 rounded-xl border border-gray-100"
                />

                <AnimatePresence>
                  {paymentError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100"
                    >
                      <p>{paymentError}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Fare Summary */}
            <motion.div
              className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm"
              variants={cardVariants}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Shield className="text-blue-500 w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Fare Summary
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Fare</span>
                  <span className="font-semibold">
                    {currencySymbol}
                    {selectedRoomWithHotel.offer.price.discounted *
                      numberOfNights}
                    /night
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-semibold">
                    {currencySymbol}
                    {selectedRoomWithHotel.offer.price.taxesAndFees *
                      numberOfNights}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">
                      Total
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {currencySymbol}
                      {selectedRoomWithHotel.offer.price.total}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                type="button"
                onClick={() => window.history.back()}
                className="w-full sm:w-1/2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center justify-center gap-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </motion.button>

              <motion.button
                type="submit"
                disabled={isProcessing || !stripe || !elements || !clientSecret}
                className={`w-full sm:w-1/2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  isProcessing || !stripe || !elements || !clientSecret
                    ? "opacity-75 cursor-not-allowed"
                    : ""
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CreditCard className="w-4 h-4" />
                {isProcessing ? "Processing..." : "Confirm Payment"}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          className="mt-6 text-center text-gray-500 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Lock className="w-4 h-4" />
          <span>Secured by Stripe. We never store your card details.</span>
        </motion.div>
      </div>
    </motion.section>
  );
};

const CheckoutPageHotel = () => {
  const location = useLocation();
  const { clientSecret } = location.state;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutHotel />
    </Elements>
  );
};

export default CheckoutPageHotel;
