import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, MapPin, Search as SearchIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLazyGetAirportsQuery } from "../../store/api/flightApi"; // Importing the hook for the destination API
import { resetData, setFilters } from "../../store/hotelReducer"; // Assuming this is for setting filters
import { persistor } from "../../store/store";

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

const HotelSearch = () => {
  const [params, setParamsState] = useState({
    location: "", // Holds the IATA code internally
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
  });

  const [debouncedLocation, setDebouncedLocation] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false); // State to control suggestions visibility
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lazy query for destinations based on the "keyword" parameter
  const [getAirports, { data: destinations, isLoading, isError }] =
    useLazyGetAirportsQuery();

  const locationInputRef = useRef(null); // Reference to the location input

  // Debounce the location input
  useEffect(() => {
    setDebouncedLocation(params.location);
  }, [params.location]);

  const debouncedOrigin = useDebounce(debouncedLocation, 500); // 500ms debounce

  // Trigger the API call for destinations when debouncedLocation changes
  useEffect(() => {
    if (debouncedOrigin) {
      getAirports({ keyword: debouncedOrigin }).then((response) => {});
    }
  }, [debouncedOrigin, getAirports]);

  useEffect(() => {
    // Clear all persisted Redux state and reset passenger data when navigating to Search page
    dispatch(resetData()); // This resets the Redux state for passengers

    persistor.purge(); // This clears the persisted Redux state (including localStorage)

    // You can add any other logic for the search page as required
  }, [dispatch]);

  // Handle location change
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Prevent numbers in origin and destination fields
    if (name === "location" && /\d/.test(value)) {
      return;
    }

    const updatedParams = { ...params, [name]: value };
    setParamsState(updatedParams);

    dispatch(setFilters(updatedParams)); // Dispatch filters to Redux store
    if (name === "location") {
      setShowSuggestions(true); // Show suggestions when user starts typing in location
    }
  };

  // Handle date changes with MUI DatePicker
  const handleDateChange = (name, date) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : "";
    const updatedParams = { ...params, [name]: formattedDate };
    setParamsState(updatedParams);
    dispatch(setFilters(updatedParams));
  };

  // Handle selection of destination from the list
  const handleSelectDestination = (destination) => {
    setParamsState({
      ...params,
      location: destination.iataCode, // Store IATA code in state
    });
    dispatch(
      setFilters({
        ...params,
        location: destination.iataCode, // Save IATA code to Redux
      })
    );
    setShowSuggestions(false); // Hide the list once a city is selected
  };

  // Handle search click
  const handleSearchClick = () => {
    if (!params.location) {
      toast.error("Destination is required");
      return;
    }
    if (!params.checkInDate) {
      toast.error("Check-in date is required");
      return;
    }
    if (!params.checkOutDate) {
      toast.error("Check-out date is required");
      return;
    }

    dispatch(setFilters({ ...params }));
    navigate("/hotels");
  };

  // Prevent showing suggestions when date inputs are focused
  const handleFocus = () => {
    setShowSuggestions(false); // Close suggestions when focusing on any date input field
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <motion.div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-6">
        <motion.div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <motion.div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Find Your Hotel
            </h2>
            <p className="text-gray-600 mt-2">
              Search for the best hotels in your destination
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Destination */}
            <motion.div className="relative">
              <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="location"
                  value={
                    destinations?.find(
                      (dest) => dest.iataCode === params.location
                    )?.cityName || params.location
                  } // Show city name if location is an IATA code
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Enter City "
                  ref={locationInputRef}
                />
                <AnimatePresence>
                  {debouncedOrigin &&
                    showSuggestions && ( // Show suggestions only if showSuggestions is true
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto z-10"
                      >
                        {isLoading ? (
                          <div className="p-4 text-gray-600">Loading...</div>
                        ) : destinations && destinations.length === 0 ? (
                          <div className="p-4 text-gray-600">
                            No Destinations found
                          </div>
                        ) : (
                          destinations?.map((destination) => (
                            <motion.div
                              key={destination.id}
                              className="p-4 cursor-pointer hover:bg-blue-50 transition-colors"
                              onClick={() =>
                                handleSelectDestination(destination)
                              } // Handle selection here
                              whileHover={{ scale: 1.01 }}
                            >
                              <div className="font-medium">
                                {destination.cityName} {/* Display city name */}
                              </div>
                            </motion.div>
                          ))
                        )}
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Dates and Passengers */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Check-in Date
                </label>
                <DatePicker
                  value={params.checkInDate ? dayjs(params.checkInDate) : null}
                  onChange={(date) => handleDateChange("checkInDate", date)}
                  onOpen={handleFocus}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      className:
                        "w-full rounded-xl shadow-sm focus:ring-2 focus:ring-blue-100 transition-all",
                    },
                  }}
                />
              </div>

              <div>
                <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Check-out Date
                </label>
                <DatePicker
                  value={
                    params.checkOutDate ? dayjs(params.checkOutDate) : null
                  }
                  onChange={(date) => handleDateChange("checkOutDate", date)}
                  onOpen={handleFocus}
                  disablePast
                  minDate={
                    params.checkInDate
                      ? dayjs(params.checkInDate).add(1, "day")
                      : dayjs().add(1, "day")
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      className:
                        "w-full rounded-xl shadow-sm focus:ring-2 focus:ring-blue-100 transition-all",
                    },
                  }}
                />
              </div>
            </motion.div>

            {/* Passengers */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
                  Adults
                </label>
                <input
                  type="number"
                  name="adults"
                  value={params.adults}
                  onChange={handleChange} // Will update the Redux store on input change
                  className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-100 transition-all"
                  min="1"
                />
              </div>

              <div>
                <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
                  Children{" "}
                  <span className="text-sm text-gray-500">(2-12 years)</span>
                </label>
                <input
                  type="number"
                  name="children"
                  value={params.children}
                  onChange={handleChange} // Will update the Redux store on input change
                  className="w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-100 transition-all"
                  min="0"
                />
              </div>
            </motion.div>

            {/* Search Button */}
            <motion.button
              onClick={handleSearchClick} // Dispatch filters on button click
              className="w-full bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-medium"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <SearchIcon className="w-5 h-5" />
              Search Hotels
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </LocalizationProvider>
  );
};

export default HotelSearch;
