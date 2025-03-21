import { useCreatePaymentMutation } from "@/src/store/api/hotelPaymentApi";
import { setGuestDetails } from "@/src/store/GuestReducer";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Check,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Info,
  Mail,
  User,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BookingSummary from "./BookingSummary";

// MUI Date Picker imports
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

gsap.registerPlugin(ScrollTrigger);

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const GuestDetails = () => {
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const summaryRef = useRef(null);
  const [showSummary, setShowSummary] = useState(false);
  const [createPayment] = useCreatePaymentMutation();

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { adults, children } = useSelector((state) => state.hotel.filters);
  const selectedRoom = useSelector(
    (state) => state.hotel.selectedRoomWithHotel
  );

  // Calculate date constraints
  const maxAdultDate = new Date();
  maxAdultDate.setFullYear(maxAdultDate.getFullYear() - 18);
  const maxAdultDateString = maxAdultDate.toISOString().split("T")[0];

  const today = new Date().toISOString().split("T")[0];

  const minChildDate = new Date();
  minChildDate.setFullYear(minChildDate.getFullYear() - 17);
  const minChildDateString = minChildDate.toISOString().split("T")[0];

  // State for MUI date pickers
  const [adultDates, setAdultDates] = useState(Array(adults).fill(null));
  const [childDates, setChildDates] = useState(Array(children).fill(null));

  // Validation state
  const [nameErrors, setNameErrors] = useState({});

  useEffect(() => {
    const form = formRef.current;
    const summary = summaryRef.current;

    gsap.fromTo(
      form,
      { opacity: 0, x: -100 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
      }
    );

    gsap.fromTo(
      summary,
      { opacity: 0, x: 100 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      }
    );
  }, []);

  // Validate name (only alphabets allowed)
  const validateName = (name, fieldId) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const isValid = nameRegex.test(name);

    setNameErrors((prev) => ({
      ...prev,
      [fieldId]: isValid ? "" : "Only alphabetic characters are allowed",
    }));

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Reset all errors
    setNameErrors({});

    // Validate all names
    let hasErrors = false;

    // Validate adult names
    for (let i = 0; i < adults; i++) {
      const firstName = formData.get(`adult${i}FirstName`);
      const lastName = formData.get(`adult${i}LastName`);

      if (!validateName(firstName, `adult${i}FirstName`)) hasErrors = true;
      if (!validateName(lastName, `adult${i}LastName`)) hasErrors = true;
    }

    // Validate child names
    for (let i = 0; i < children; i++) {
      const firstName = formData.get(`child${i}FirstName`);
      const lastName = formData.get(`child${i}LastName`);

      if (!validateName(firstName, `child${i}FirstName`)) hasErrors = true;
      if (!validateName(lastName, `child${i}LastName`)) hasErrors = true;
    }

    if (hasErrors) {
      toast.error("Please correct the errors in the form");
      return;
    }

    // Process adult guests with MUI date values
    const adultGuests = Array.from({ length: adults }, (_, i) => ({
      firstName: formData.get(`adult${i}FirstName`),
      lastName: formData.get(`adult${i}LastName`),
      dob: adultDates[i] ? adultDates[i].format("YYYY-MM-DD") : null,
    }));

    // Process child guests with MUI date values
    const childGuests = Array.from({ length: children }, (_, i) => ({
      firstName: formData.get(`child${i}FirstName`),
      lastName: formData.get(`child${i}LastName`),
      dob: childDates[i] ? childDates[i].format("YYYY-MM-DD") : null,
    }));

    dispatch(
      setGuestDetails({
        adults: adultGuests,
        children: childGuests,
        email: formData.get("email"),
      })
    );
    try {
      const response = await createPayment(selectedRoom.offer.price).unwrap();
      navigate(`/checkouthotel`, {
        state: { clientSecret: response.clientSecret },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Error creating booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle name input validation on blur
  const handleNameBlur = (e) => {
    const { name, value } = e.target;
    validateName(value, name);
  };

  // Handle date changes for adults
  const handleAdultDateChange = (date, index) => {
    const newDates = [...adultDates];
    newDates[index] = date;
    setAdultDates(newDates);
  };

  // Handle date changes for children
  const handleChildDateChange = (date, index) => {
    const newDates = [...childDates];
    newDates[index] = date;
    setChildDates(newDates);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Complete Your Booking
            </h1>
            <p className="text-gray-600 text-lg">
              You are booking {selectedRoom?.room?.roomType} at{" "}
              {selectedRoom?.hotel?.name}
            </p>
          </motion.div>

          {/* Mobile Summary Toggle */}
          <motion.div
            className="lg:hidden mb-8 bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={false}
          >
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="w-full px-6 py-4 flex items-center justify-between bg-blue-50"
            >
              <div className="flex items-center space-x-3">
                <Info size={20} className="text-blue-600" />
                <span className="font-medium text-blue-900">
                  Booking Summary
                </span>
              </div>
              {showSummary ? (
                <ChevronUp size={20} className="text-blue-600" />
              ) : (
                <ChevronDown size={20} className="text-blue-600" />
              )}
            </button>
            <AnimatePresence>
              {showSummary && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 py-4"
                >
                  <BookingSummary />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Guest Details Form */}
            <motion.div ref={formRef} className="space-y-8">
              {/* Guest Forms */}
              <motion.div className="bg-white rounded-3xl p-8 shadow-xl">
                <h2 className="text-2xl font-semibold mb-8">
                  Guest Information
                </h2>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Adults */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-800 flex items-center">
                      <Users className="mr-2" size={20} />
                      Adult Guests
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      {Array.from({ length: adults }, (_, i) => (
                        <motion.div
                          key={i}
                          {...fadeInUp}
                          transition={{ delay: i * 0.1 }}
                          className="bg-gray-50 p-6 rounded-xl border border-gray-100"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="flex items-center text-lg font-medium text-gray-800">
                              <User className="mr-2" size={20} />
                              Adult {i + 1}
                            </h4>
                            {i === 0 && (
                              <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                Primary Guest
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                              </label>
                              <input
                                type="text"
                                name={`adult${i}FirstName`}
                                required
                                className={`w-full px-4 py-2.5 rounded-lg border ${
                                  nameErrors[`adult${i}FirstName`]
                                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                                } focus:border-transparent transition-all duration-200`}
                                placeholder="Enter first name"
                                onBlur={handleNameBlur}
                                pattern="[A-Za-z\s]+"
                                title="Only alphabetic characters are allowed"
                              />
                              {nameErrors[`adult${i}FirstName`] && (
                                <p className="mt-1 text-xs text-red-500">
                                  {nameErrors[`adult${i}FirstName`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                              </label>
                              <input
                                type="text"
                                name={`adult${i}LastName`}
                                required
                                className={`w-full px-4 py-2.5 rounded-lg border ${
                                  nameErrors[`adult${i}LastName`]
                                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                                } focus:border-transparent transition-all duration-200`}
                                placeholder="Enter last name"
                                onBlur={handleNameBlur}
                                pattern="[A-Za-z\s]+"
                                title="Only alphabetic characters are allowed"
                              />
                              {nameErrors[`adult${i}LastName`] && (
                                <p className="mt-1 text-xs text-red-500">
                                  {nameErrors[`adult${i}LastName`]}
                                </p>
                              )}
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth
                              </label>
                              {/* MUI Date Picker for Adults */}
                              <DatePicker
                                value={adultDates[i]}
                                onChange={(date) =>
                                  handleAdultDateChange(date, i)
                                }
                                maxDate={dayjs(maxAdultDateString)}
                                slotProps={{
                                  textField: {
                                    required: true,
                                    fullWidth: true,
                                    variant: "outlined",
                                    sx: {
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: "0.5rem",
                                        height: "45px",
                                      },
                                    },
                                  },
                                }}
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Must be 18 years or older
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Children */}
                  {children > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-800 flex items-center">
                        <Users className="mr-2" size={20} />
                        Child Guests
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
                        {Array.from({ length: children }, (_, i) => (
                          <motion.div
                            key={`child${i}`}
                            {...fadeInUp}
                            transition={{ delay: (adults + i) * 0.1 }}
                            className="bg-gray-50 p-6 rounded-xl border border-gray-100"
                          >
                            <h4 className="flex items-center text-lg font-medium text-gray-800 mb-4">
                              <User className="mr-2" size={20} />
                              Child {i + 1}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  name={`child${i}FirstName`}
                                  required
                                  className={`w-full px-4 py-2.5 rounded-lg border ${
                                    nameErrors[`child${i}FirstName`]
                                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                      : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                                  } focus:border-transparent transition-all duration-200`}
                                  placeholder="Enter first name"
                                  onBlur={handleNameBlur}
                                  pattern="[A-Za-z\s]+"
                                  title="Only alphabetic characters are allowed"
                                />
                                {nameErrors[`child${i}FirstName`] && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {nameErrors[`child${i}FirstName`]}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Last Name
                                </label>
                                <input
                                  type="text"
                                  name={`child${i}LastName`}
                                  required
                                  className={`w-full px-4 py-2.5 rounded-lg border ${
                                    nameErrors[`child${i}LastName`]
                                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                      : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                                  } focus:border-transparent transition-all duration-200`}
                                  placeholder="Enter last name"
                                  onBlur={handleNameBlur}
                                  pattern="[A-Za-z\s]+"
                                  title="Only alphabetic characters are allowed"
                                />
                                {nameErrors[`child${i}LastName`] && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {nameErrors[`child${i}LastName`]}
                                  </p>
                                )}
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Date of Birth
                                </label>
                                {/* MUI Date Picker for Children */}
                                <DatePicker
                                  value={childDates[i]}
                                  onChange={(date) =>
                                    handleChildDateChange(date, i)
                                  }
                                  minDate={dayjs(minChildDateString)}
                                  maxDate={dayjs(today)}
                                  slotProps={{
                                    textField: {
                                      required: true,
                                      fullWidth: true,
                                      variant: "outlined",
                                      sx: {
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: "0.5rem",
                                          height: "45px",
                                        },
                                      },
                                    },
                                  }}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                  Must be under 18 years old
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <motion.div
                    {...fadeInUp}
                    className="bg-gray-50 p-6 rounded-xl border border-gray-100"
                  >
                    <h3 className="flex items-center text-lg font-medium text-gray-800 mb-6">
                      <Mail className="mr-2" size={20} />
                      Contact Information
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter email address"
                      />
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                  >
                    Continue to Payment
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>

            {/* Desktop Booking Summary */}
            <motion.div ref={summaryRef} className="hidden lg:block">
              <div className="lg:sticky lg:top-8 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <h2 className="text-2xl font-semibold mb-8">
                    Booking Summary
                  </h2>
                  <BookingSummary />
                </div>

                {/* Package Inclusions */}
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <h3 className="text-xl font-semibold mb-6">
                    Package Inclusions
                  </h3>
                  <div className="space-y-4">
                    {selectedRoom?.offer?.inclusions.map((inclusion, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        whileHover={{ x: 5 }}
                      >
                        <Check
                          className="text-green-500 flex-shrink-0"
                          size={18}
                        />
                        <span className="text-gray-700">{inclusion.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Secure Payment Notice */}
                <div className="bg-blue-50 p-6 rounded-xl flex items-start space-x-4">
                  <CreditCard
                    className="text-blue-600 flex-shrink-0"
                    size={24}
                  />
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">
                      Secure Payment
                    </h3>
                    <p className="text-blue-700 text-sm">
                      Your payment information is encrypted and secure. We never
                      store your card details.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default GuestDetails;
