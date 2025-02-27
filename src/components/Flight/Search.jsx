
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Plane, Search as SearchIcon, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLazyGetAirportsQuery } from "../../store/api/flightApi";
import {
  resetFilters,
  resetFlightsData,
  setAirports,
  setError,
  setFilters,
} from "../../store/flightReducer";
import { resetPassengerData } from "../../store/passengerReducer";
import { persistor } from "../../store/store";
import CurrencySelector from "../CurrencySelector";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Search = () => {
  const [params, setParamsState] = useState({
    origin: "",
    destination: "",
    date: "",
    returnDate: "",
    adults: 1,
    tripType: "oneWay",
    children: 0,
  });

  const [originAirportData, setOriginAirportData] = useState([]);
  const [destinationAirportData, setDestinationAirportData] = useState([]);
  const [isOriginFocused, setIsOriginFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSearchedOrigin, setHasSearchedOrigin] = useState(false);
  const [hasSearchedDestination, setHasSearchedDestination] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [getAirports] = useLazyGetAirportsQuery();

  const debouncedOrigin = useDebounce(params.origin, 500);
  const debouncedDestination = useDebounce(params.destination, 500);

  const { filters } = useSelector((state) => state.flight);

  useEffect(() => {
    if (filters) {
      setParamsState(filters);
    }
  }, [filters]);

  useEffect(() => {
    if (debouncedOrigin) {
      setLoading(true);
      setHasSearchedOrigin(true);
      getAirports({ keyword: debouncedOrigin }).then((response) => {
        if (response.data) {
          setOriginAirportData(response.data);
        }
        setLoading(false);
      });
    } else {
      setOriginAirportData([]);
      setHasSearchedOrigin(false);
    }
  }, [debouncedOrigin, getAirports]);

  useEffect(() => {
    if (debouncedDestination) {
      setLoading(true);
      setHasSearchedDestination(true);
      getAirports({ keyword: debouncedDestination }).then((response) => {
        if (response.data) {
          setDestinationAirportData(response.data);
        }
        setLoading(false);
      });
    } else {
      setDestinationAirportData([]);
      setHasSearchedDestination(false);
    }
  }, [debouncedDestination, getAirports]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent numbers in origin and destination fields
    if ((name === "origin" || name === "destination") && /\d/.test(value)) {
      return;
    }

    const updatedParams = { ...params, [name]: value };

    if (name === "tripType" && value === "oneWay") {
      updatedParams.returnDate = "";
    }

    setParamsState(updatedParams);
    dispatch(setFilters(updatedParams));
  };

  const handleDateChange = (date, field) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : "";
    const updatedParams = { ...params, [field]: formattedDate };
    setParamsState(updatedParams);
    dispatch(setFilters(updatedParams));
  };

  const handleKeyDown = (e) => {
    if (
      (e.target.name === "origin" || e.target.name === "destination") &&
      e.key >= "0" &&
      e.key <= "9"
    ) {
      e.preventDefault();
    }
  };

  const handleSelectAirport = (airport, field) => {
    const updatedParams = { ...params, [field]: airport.iataCode };
    setParamsState(updatedParams);
    dispatch(setFilters(updatedParams));
    if (field === "origin") {
      setOriginAirportData([]);
      setIsOriginFocused(false);
      setHasSearchedOrigin(false);
    }
    if (field === "destination") {
      setDestinationAirportData([]);
      setIsDestinationFocused(false);
      setHasSearchedDestination(false);
    }

    dispatch(setAirports({ type: field, cityName: airport.cityName }));
  };

  useEffect(() => {
    if (params.tripType === "roundTrip") {
      if (!params.date) {
        toast.error("Departure date is required for round trip");
      } else if (!params.returnDate) {
        toast.error("Return date is required for round trip");
      }
    }
  }, [params.tripType, params.date, params.returnDate]);

  useEffect(() => {
    dispatch(resetPassengerData());
    dispatch(resetFilters());
    dispatch(resetFlightsData());
    persistor.purge();
  }, [dispatch]);

  const handleSearchClick = () => {
    let finalParams = cleanParams(params);
    if (!finalParams) return;

    if (!params.origin) {
      toast.error("Origin is required");
      return;
    }

    if (!params.destination) {
      toast.error("Destination is required");
      return;
    }

    if (params.origin === params.destination) {
      toast.error("Origin and Destination cannot be the same");
      return;
    }

    if (params.tripType === "oneWay") {
      if (!params.date) {
        toast.error("Departure date is required for one-way trips");
        return;
      }
      const today = dayjs().format("YYYY-MM-DD");
      if (dayjs(params.date).isBefore(today)) {
        toast.error("Departure date cannot be in the past");
        return;
      }
    } else if (params.tripType === "roundTrip") {
      if (!params.date) {
        toast.error("Departure date is required for round-trip");
        return;
      }
      const today = dayjs().format("YYYY-MM-DD");
      if (dayjs(params.date).isBefore(today)) {
        toast.error("Departure date cannot be in the past");
        return;
      }

      if (dayjs(params.returnDate).isBefore(dayjs(params.date))) {
        toast.error("Return date must be after departure date");
        return;
      }
    }

    if (!params.adults || params.adults < 1) {
      toast.error("At least 1 adult is required");
      return;
    }
    if (params.adults > 9) {
      toast.error("Maximum 9 adults are allowed");
      return;
    }

    if (params.children < 0 || params.children > 9) {
      toast.error("Children count should be between 0 and 9");
      return;
    }

    dispatch(setFilters(finalParams));
    navigate("/flights");
  };

  const cleanParams = (params) => {
    let finalParams = { ...params };

    if (params.tripType === "oneWay") {
      delete finalParams.returnDate;
    } else if (params.tripType === "roundTrip") {
      if (!params.returnDate) {
        dispatch(setError("Return date is required for round trips"));
        return null;
      }
    }
    if (params.children === 0) {
      delete finalParams.children;
    }
    return finalParams;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  const renderDropdownContent = (isLoading, data, hasSearched, placeholder) => {
    if (isLoading) {
      return <div className="p-4 text-gray-600">Loading...</div>;
    }

    if (!hasSearched) {
      return <div className="p-4 text-gray-600">{placeholder}</div>;
    }

    if (data.length === 0) {
      return <div className="p-4 text-gray-600">No airports found</div>;
    }

    return null;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4"
      >
        <CurrencySelector />
        <motion.div
          className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8 backdrop-blur-sm backdrop-filter"
          variants={itemVariants}
        >
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Find Your Flight
            </h2>
            <p className="text-gray-600">
              Search hundreds of airlines and destinations
            </p>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              variants={itemVariants}
            >
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Plane className="w-4 h-4" />
                  Origin
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="origin"
                    value={params.origin}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOriginFocused(true)}
                    className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-100 transition-all bg-white/80"
                    placeholder="Enter origin"
                  />
                  <AnimatePresence>
                    {isOriginFocused && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto z-10"
                      >
                        {renderDropdownContent(
                          loading,
                          originAirportData,
                          hasSearchedOrigin,
                          "Start typing to search airports..."
                        )}
                        {!loading &&
                          originAirportData.map((airport) => (
                            <motion.div
                              key={airport.iataCode}
                              className="p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                              onClick={() =>
                                handleSelectAirport(airport, "origin")
                              }
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="font-medium">
                                {airport.name} ({airport.iataCode})
                              </div>
                              <div className="text-sm text-gray-600">
                                {airport.cityName}, {airport.countryName}
                              </div>
                            </motion.div>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative">
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Plane className="w-4 h-4 transform rotate-90" />
                  Destination
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="destination"
                    value={params.destination}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsDestinationFocused(true)}
                    className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-100 transition-all bg-white/80"
                    placeholder="Enter destination"
                  />
                  <AnimatePresence>
                    {isDestinationFocused && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto z-10"
                      >
                        {renderDropdownContent(
                          loading,
                          destinationAirportData,
                          hasSearchedDestination,
                          "Start typing to search airports..."
                        )}
                        {!loading &&
                          destinationAirportData.map((airport) => (
                            <motion.div
                              key={airport.iataCode}
                              className="p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                              onClick={() =>
                                handleSelectAirport(airport, "destination")
                              }
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="font-medium">
                                {airport.name} ({airport.iataCode})
                              </div>
                              <div className="text-sm text-gray-600">
                                {airport.cityName}, {airport.countryName}
                              </div>
                            </motion.div>
                          ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex justify-center space-x-6"
              variants={itemVariants}
            >
              <motion.div
                className={`px-6 py-3 rounded-xl cursor-pointer transition-all ${
                  params.tripType === "oneWay"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  handleChange({
                    target: { name: "tripType", value: "oneWay" },
                  })
                }
              >
                One Way
              </motion.div>
              <motion.div
                className={`px-6 py-3 rounded-xl cursor-pointer transition-all ${
                  params.tripType === "roundTrip"
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  handleChange({
                    target: { name: "tripType", value: "roundTrip" },
                  })
                }
              >
                Round Trip
              </motion.div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              variants={itemVariants}
            >
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Departure Date
                </label>
                <DatePicker
                  value={params.date ? dayjs(params.date) : null}
                  onChange={(date) => handleDateChange(date, "date")}
                  className="w-full"
                  disablePast
                  maxDate={dayjs().add(6, "month")}
                  slotProps={{
                    textField: {
                      className: "w-full",
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0.75rem",
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                        },
                      },
                    },
                  }}
                />
              </div>

              {params.tripType === "roundTrip" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Return Date
                  </label>
                  <DatePicker
                    value={params.returnDate ? dayjs(params.returnDate) : null}
                    onChange={(date) => handleDateChange(date, "returnDate")}
                    className="w-full"
                    disablePast
                    minDate={params.date ? dayjs(params.date) : undefined}
                    maxDate={dayjs().add(6, "month")}
                    slotProps={{
                      textField: {
                        className: "w-full",
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "0.75rem",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                          },
                        },
                      },
                    }}
                  />
                </motion.div>
              )}
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              variants={itemVariants}
            >
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Adults
                </label>
                <input
                  type="number"
                  name="adults"
                  value={params.adults}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-100 transition-all bg-white/80"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Children{" "}
                  <span className="text-sm text-gray-500">(2-12 years)</span>
                </label>
                <input
                  type="number"
                  name="children"
                  value={params.children}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-100 transition-all bg-white/80"
                  min="0"
                />
              </div>
            </motion.div>

            <motion.button
              onClick={handleSearchClick}
              className="w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-medium shadow-lg"
              whileHover={{
                scale: 1.01,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <SearchIcon className="w-5 h-5" />
              Search Flights
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </LocalizationProvider>
  );
};

export default Search;
