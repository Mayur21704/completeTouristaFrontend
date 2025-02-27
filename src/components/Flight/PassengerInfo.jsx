import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Calendar, Mail, Plane, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import {
  resetPassengerSeats,
  setPassengerDetails,
  updatePassenger,
} from "../../store/passengerReducer";

// Define Zod validation schemas with name pattern validation
const namePattern = /^[A-Za-z\s-']+$/;

const validateSequentially = (passenger, type) => {
  // First Name Validation
  if (!passenger.firstName) {
    return { field: "firstName", message: `${type} first name is required` };
  }
  if (!namePattern.test(passenger.firstName)) {
    return {
      field: "firstName",
      message: `${type} first name should only contain letters, spaces, hyphens, and apostrophes`,
    };
  }

  // Last Name Validation (only if first name is valid)
  if (!passenger.lastName) {
    return { field: "lastName", message: `${type} last name is required` };
  }
  if (!namePattern.test(passenger.lastName)) {
    return {
      field: "lastName",
      message: `${type} last name should only contain letters, spaces, hyphens, and apostrophes`,
    };
  }

  // Date of Birth Validation (only if first and last name are valid)
  if (!passenger.dateOfBirth) {
    return {
      field: "dateOfBirth",
      message: `${type} date of birth is required`,
    };
  }

  return null; // All validations passed
};

const PassengerInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { adults, children, email } = useSelector((state) => state.passenger);

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    adults: adults || [],
    children: children || [],
    email: email || "",
  });

  useEffect(() => {
    const persistedData =
      JSON.parse(localStorage.getItem("persist:flight")) || {};

    if (persistedData.selectedFlight) {
      const selectedFlight = JSON.parse(persistedData.selectedFlight);

      const adultsFromFlight =
        selectedFlight?.travelerPricings?.filter(
          (traveler) => traveler.travelerType === "ADULT"
        ) || [];
      const childrenFromFlight =
        selectedFlight?.travelerPricings?.filter(
          (traveler) => traveler.travelerType === "CHILD"
        ) || [];

      setFormData({
        adults: adultsFromFlight.map((adult) => ({
          travelerId: adult.travelerId,
          firstName: adult.firstName || "",
          lastName: adult.lastName || "",
          dateOfBirth: adult.dateOfBirth || "",
        })),
        children: childrenFromFlight.map((child) => ({
          travelerId: child.travelerId,
          firstName: child.firstName || "",
          lastName: child.lastName || "",
          dateOfBirth: child.dateOfBirth || "",
        })),
        email: persistedData.email ? JSON.parse(persistedData.email) : email,
      });
    }

    dispatch(setPassengerDetails(formData));
    setIsLoading(false);
  }, [dispatch, email]);

  const validateFields = () => {
    // Validate Adults sequentially
    for (let i = 0; i < formData.adults.length; i++) {
      const validationError = validateSequentially(
        formData.adults[i],
        `Adult ${i + 1}`
      );
      if (validationError) {
        toast.error(validationError.message);
        return false;
      }
    }

    // Validate Children sequentially
    for (let i = 0; i < formData.children.length; i++) {
      const validationError = validateSequentially(
        formData.children[i],
        `Child ${i + 1}`
      );
      if (validationError) {
        toast.error(validationError.message);
        return false;
      }
    }

    // Validate Email (only if all passenger details are valid)
    if (!formData.email) {
      toast.error("Email is required");
      return false;
    }
    if (!z.string().email().safeParse(formData.email).success) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const validateNameInput = (value) => {
    return namePattern.test(value) || value === "";
  };

  const handleInputChange = (type, index, field, value, travelerId) => {
    if (
      (field === "firstName" || field === "lastName") &&
      !validateNameInput(value)
    ) {
      return;
    }

    const updatedData = { ...formData };
    updatedData[type][index][field] = value;
    setFormData(updatedData);

    dispatch(updatePassenger({ type, travelerId, field, value }));

    localStorage.setItem(
      "persist:passenger",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("persist:passenger") || "{}"),
        adults: JSON.stringify(updatedData.adults),
        children: JSON.stringify(updatedData.children),
        email: JSON.stringify(updatedData.email),
      })
    );
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      return;
    }

    dispatch(
      setPassengerDetails({
        adults: formData.adults,
        children: formData.children,
        email: formData.email,
      })
    );
    dispatch(resetPassengerSeats());

    navigate(`/seatBooking/${id}/1`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          className="max-w-5xl mx-auto"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
          initial="hidden"
          animate="show"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]"></div>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Plane className="w-10 h-10 text-white/90" />
                  <Users className="w-10 h-10 text-white/90" />
                </div>
                <h2 className="text-4xl font-bold text-white text-center mb-3">
                  Passenger Information
                </h2>
                <p className="text-blue-100 text-center text-lg">
                  Please fill in the details for all passengers
                </p>
              </motion.div>
            </div>

            <div className="p-8 lg:p-10">
              <AnimatePresence>
                {/* Adults Section */}
                {formData.adults.map((adult, index) => (
                  <motion.div
                    key={adult.travelerId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="mb-8 bg-gradient-to-br from-blue-50 to-blue-100/30 p-8 rounded-2xl border border-blue-100 shadow-sm"
                  >
                    <h3 className="text-2xl font-semibold text-blue-900 mb-6 flex items-center gap-3">
                      <User className="w-6 h-6 text-blue-600" />
                      Adult {index + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-900">
                          First Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter first name"
                          value={adult.firstName}
                          onChange={(e) =>
                            handleInputChange(
                              "adults",
                              index,
                              "firstName",
                              e.target.value,
                              adult.travelerId
                            )
                          }
                          className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        />
                        <p className="text-xs text-blue-600">
                          Letters, spaces, hyphens, and apostrophes only
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-900">
                          Last Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter last name"
                          value={adult.lastName}
                          onChange={(e) =>
                            handleInputChange(
                              "adults",
                              index,
                              "lastName",
                              e.target.value,
                              adult.travelerId
                            )
                          }
                          className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        />
                        <p className="text-xs text-blue-600">
                          Letters, spaces, hyphens, and apostrophes only
                        </p>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-blue-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          Date of Birth
                        </label>
                        <DatePicker
                          value={
                            adult.dateOfBirth ? dayjs(adult.dateOfBirth) : null
                          }
                          onChange={(newValue) => {
                            if (newValue) {
                              const formattedDate =
                                newValue.format("YYYY-MM-DD");
                              handleInputChange(
                                "adults",
                                index,
                                "dateOfBirth",
                                formattedDate,
                                adult.travelerId
                              );
                            }
                          }}
                          maxDate={dayjs()}
                          className="w-full"
                          slotProps={{
                            textField: {
                              variant: "outlined",
                              className:
                                "w-full bg-white/50 backdrop-blur-sm rounded-xl",
                            },
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Children Section */}
                {formData.children.map((child, index) => (
                  <motion.div
                    key={child.travelerId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="mb-8 bg-gradient-to-br from-purple-50 to-purple-100/30 p-8 rounded-2xl border border-purple-100 shadow-sm"
                  >
                    <h3 className="text-2xl font-semibold text-purple-900 mb-6 flex items-center gap-3">
                      <User className="w-6 h-6 text-purple-600" />
                      Child {index + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-purple-900">
                          First Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter first name"
                          value={child.firstName}
                          onChange={(e) =>
                            handleInputChange(
                              "children",
                              index,
                              "firstName",
                              e.target.value,
                              child.travelerId
                            )
                          }
                          className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        />
                        <p className="text-xs text-purple-600">
                          Letters, spaces, hyphens, and apostrophes only
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-purple-900">
                          Last Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter last name"
                          value={child.lastName}
                          onChange={(e) =>
                            handleInputChange(
                              "children",
                              index,
                              "lastName",
                              e.target.value,
                              child.travelerId
                            )
                          }
                          className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        />
                        <p className="text-xs text-purple-600">
                          Letters, spaces, hyphens, and apostrophes only
                        </p>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-purple-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          Date of Birth
                        </label>
                        <DatePicker
                          value={
                            child.dateOfBirth ? dayjs(child.dateOfBirth) : null
                          }
                          onChange={(newValue) => {
                            if (newValue) {
                              const formattedDate =
                                newValue.format("YYYY-MM-DD");
                              handleInputChange(
                                "children",
                                index,
                                "dateOfBirth",
                                formattedDate,
                                child.travelerId
                              );
                            }
                          }}
                          maxDate={dayjs()}
                          className="w-full"
                          slotProps={{
                            textField: {
                              variant: "outlined",
                              className:
                                "w-full bg-white/50 backdrop-blur-sm rounded-xl",
                            },
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100/30 p-8 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                    <Mail className="w-6 h-6 text-gray-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        localStorage.setItem(
                          "persist:passenger",
                          JSON.stringify({
                            ...JSON.parse(
                              localStorage.getItem("persist:passenger") || "{}"
                            ),
                            email: e.target.value,
                          })
                        );
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={handleSubmit}
                    className="group bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-medium px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue to Seat Selection
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </LocalizationProvider>
  );
};

export default PassengerInfo;
